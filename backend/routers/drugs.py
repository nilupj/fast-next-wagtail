
from fastapi import APIRouter, HTTPException, Query, Path
from typing import List, Optional
import httpx
import os
import logging
from datetime import datetime

from models import DrugPreview, Drug, ErrorResponse

router = APIRouter()
logger = logging.getLogger(__name__)

# Set the CMS API URL from environment variable with a fallback
CMS_API_URL = os.getenv("CMS_API_URL", "http://localhost:8001/api")

# Utility function to make requests to the CMS API
async def fetch_from_cms(endpoint: str, params=None):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{CMS_API_URL}/{endpoint}", params=params, timeout=10.0)
            response.raise_for_status()
            return response.json()
        except httpx.RequestError as exc:
            logger.error(f"Error fetching {endpoint}: {exc}")
            raise HTTPException(
                status_code=503,
                detail=f"Service unavailable: Unable to connect to CMS API."
            )
        except httpx.HTTPStatusError as exc:
            logger.error(f"Error response {exc.response.status_code} from CMS: {exc}")
            status_code = exc.response.status_code
            try:
                detail = exc.response.json()
            except:
                detail = str(exc)
            raise HTTPException(status_code=status_code, detail=detail)
        except Exception as exc:
            logger.error(f"Unexpected error fetching {endpoint}: {exc}")
            raise HTTPException(status_code=500, detail=str(exc))

@router.get("/drugs/index", response_model=List[DrugPreview])
async def get_drugs_index():
    """
    Retrieve a complete index of all drugs and supplements
    """
    try:
        drugs = await fetch_from_cms("drugs/index/")
        return drugs
    except Exception as exc:
        logger.error(f"Error fetching drugs index: {exc}")
        return []

@router.get("/drugs/{slug}", response_model=Drug)
async def get_drug(slug: str = Path(..., description="The slug of the drug to retrieve")):
    """
    Get a single drug by its slug
    """
    try:
        drug = await fetch_from_cms(f"drugs/{slug}")
        return drug
    except HTTPException as exc:
        if exc.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Drug with slug '{slug}' not found")
        raise
    except Exception as exc:
        logger.error(f"Error fetching drug {slug}: {exc}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve drug: {str(exc)}")

@router.get("/drugs/search", response_model=List[DrugPreview])
async def search_drugs(query: str = Query(..., description="Search query string")):
    """
    Search drugs by query string
    """
    try:
        drugs = await fetch_from_cms("drugs/search", {"q": query})
        return drugs
    except Exception as exc:
        logger.error(f"Error searching drugs: {exc}")
        return []
