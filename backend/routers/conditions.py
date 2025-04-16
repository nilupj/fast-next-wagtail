from fastapi import APIRouter, HTTPException, Query, Path
from typing import List, Optional
import httpx
import os
import logging

from models import ConditionPreview, Condition, ErrorResponse

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

# Mock data for development (will be replaced with actual CMS API calls)
mock_conditions = [
    ConditionPreview(id=1, name="Bloating", slug="bloating", subtitle="Gas buildup in the digestive tract causing abdominal discomfort"),
    ConditionPreview(id=2, name="Diabetes", slug="diabetes", subtitle="A chronic condition affecting how your body processes blood sugar"),
    ConditionPreview(id=3, name="Hypertension", slug="hypertension", subtitle="High blood pressure that can lead to serious health problems"),
    ConditionPreview(id=4, name="Migraine", slug="migraine", subtitle="Severe recurring headaches, often with additional symptoms"),
    ConditionPreview(id=5, name="Anxiety", slug="anxiety", subtitle="Feelings of worry, nervousness, or unease about something with an uncertain outcome"),
    ConditionPreview(id=6, name="Asthma", slug="asthma", subtitle="A condition in which airways narrow and swell and produce extra mucus"),
]

@router.get("/conditions/index", response_model=List[ConditionPreview])
async def get_conditions_index():
    """
    Retrieve a complete index of all health conditions
    """
    try:
        # Try to fetch from CMS API
        conditions = await fetch_from_cms("conditions/index")
        return conditions
    except HTTPException as exc:
        if exc.status_code == 503:
            # If CMS is unavailable, log warning and return empty list
            logger.warning("CMS unavailable, returning empty conditions index")
            return []
        raise
    except Exception as exc:
        # For development, return mock data
        if os.getenv("ENV", "development") == "development":
            logger.info("Using mock data for conditions index")
            return mock_conditions
        
        logger.error(f"Error fetching conditions index: {exc}")
        return []

@router.get("/conditions/paths", response_model=List[str])
async def get_condition_paths():
    """
    Get all condition slugs for static path generation
    """
    try:
        # Try to fetch from CMS API
        paths = await fetch_from_cms("conditions/paths")
        return paths
    except HTTPException as exc:
        if exc.status_code == 503:
            # If CMS is unavailable, log warning and return a few paths
            logger.warning("CMS unavailable, returning limited condition paths")
            return ["diabetes", "hypertension", "asthma"]
        raise
    except Exception as exc:
        # For development, return mock paths
        if os.getenv("ENV", "development") == "development":
            logger.info("Using mock data for condition paths")
            return [condition.slug for condition in mock_conditions]
        
        logger.error(f"Error fetching condition paths: {exc}")
        return []

@router.get("/conditions/{slug}", response_model=Condition)
async def get_condition(slug: str = Path(..., description="The slug of the condition to retrieve")):
    """
    Get a single condition by its slug
    """
    try:
        # Try to fetch from CMS API
        condition = await fetch_from_cms(f"conditions/{slug}")
        return condition
    except HTTPException as exc:
        if exc.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Condition with slug '{slug}' not found")
        raise
    except Exception as exc:
        # For development, return mock data
        if os.getenv("ENV", "development") == "development":
            logger.info(f"Using mock data for condition {slug}")
            for condition in mock_conditions:
                if condition.slug == slug:
                    # Convert to a full Condition with content
                    return Condition(
                        id=condition.id,
                        name=condition.name,
                        slug=condition.slug,
                        subtitle=condition.subtitle,
                        overview="<p>This is an overview of the condition.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>",
                        symptoms="<p>Common symptoms include:</p><ul><li>Symptom 1</li><li>Symptom 2</li><li>Symptom 3</li></ul>",
                        causes="<p>This condition can be caused by various factors including:</p><ul><li>Cause 1</li><li>Cause 2</li><li>Cause 3</li></ul>",
                        diagnosis="<p>Diagnosis typically involves:</p><ul><li>Diagnostic method 1</li><li>Diagnostic method 2</li></ul>",
                        treatments="<p>Treatment options include:</p><ul><li>Treatment 1</li><li>Treatment 2</li><li>Treatment 3</li></ul>",
                        prevention="<p>To reduce your risk:</p><ul><li>Prevention tip 1</li><li>Prevention tip 2</li></ul>",
                        complications="<p>Potential complications include:</p><ul><li>Complication 1</li><li>Complication 2</li></ul>",
                        image="https://example.com/images/condition.jpg",
                        related_conditions=[
                            {"name": "Related Condition 1", "slug": "related-1"},
                            {"name": "Related Condition 2", "slug": "related-2"}
                        ],
                        also_known_as="Alternative name",
                        specialties="Relevant medical specialties",
                        prevalence="How common the condition is",
                        risk_factors="Age, genetics, lifestyle factors"
                    )
            
            raise HTTPException(status_code=404, detail=f"Condition with slug '{slug}' not found")
        
        logger.error(f"Error fetching condition {slug}: {exc}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve condition: {str(exc)}")

async def search_conditions(query: str):
    """
    Search conditions by query string
    """
    try:
        # Try to fetch from CMS API
        conditions = await fetch_from_cms("conditions/search", {"q": query})
        return conditions
    except HTTPException as exc:
        if exc.status_code == 503:
            # If CMS is unavailable, log warning and return empty list
            logger.warning("CMS unavailable, returning empty search results")
            return []
        raise
    except Exception as exc:
        # For development, return filtered mock data
        if os.getenv("ENV", "development") == "development":
            logger.info(f"Using mock data for condition search: {query}")
            return [
                condition for condition in mock_conditions 
                if query.lower() in condition.name.lower() or 
                   (condition.subtitle and query.lower() in condition.subtitle.lower())
            ]
        
        logger.error(f"Error searching conditions: {exc}")
        return []
