from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import logging
from fastapi_socketio import SocketManager
from typing import Dict, Any

from routers import articles, conditions, symptoms
from models import ErrorResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="HealthInfo API",
    description="API for the HealthInfo medical information website",
    version="1.0.0",
)

socket_manager = SocketManager(app=app, cors_allowed_origins="*")

@socket_manager.on('message')
async def handle_message(sid: str, message: Dict[str, Any]):
    await socket_manager.emit('message', message)

# Add CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Socket.IO CORS
socket_manager = SocketManager(app=app, cors_allowed_origins="*")


# Include routers
app.include_router(articles.router, prefix="/api", tags=["Articles"])
app.include_router(conditions.router, prefix="/api", tags=["Conditions"])
app.include_router(symptoms.router, prefix="/api", tags=["Symptoms"])

# Exception handler for unhandled errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            message="An unexpected error occurred. Please try again later.",
            details=str(exc) if os.getenv("ENV", "production") != "production" else None
        ).dict(),
    )

@app.get("/api/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for the API
    """
    return {"status": "healthy"}

@app.get("/api/search", tags=["Search"])
async def search(q: str = ""):
    """
    Search articles, conditions, and drugs
    """
    if not q or len(q.strip()) < 2:
        return {
            "articles": [],
            "conditions": [],
            "drugs": []
        }
    
    # For now, call individual search endpoints
    articles_results = await articles.search_articles(q)
    conditions_results = await conditions.search_conditions(q)
    
    # Mock data for drugs until that endpoint is implemented
    drugs_results = []
    
    return {
        "articles": articles_results,
        "conditions": conditions_results,
        "drugs": drugs_results
    }

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=os.getenv("ENV", "production") != "production",
        log_level="info"
    )
