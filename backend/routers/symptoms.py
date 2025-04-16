from fastapi import APIRouter, HTTPException, Body
import httpx
import os
import logging
import random
from typing import List

from models import SymptomRequest, SymptomResponse, PossibleCondition

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

# Mock symptom checker data
common_conditions = {
    "headache": [
        {"name": "Migraine", "prob": 0.7, "urgency": 2, "description": "A neurological condition characterized by severe headaches, often with nausea and sensitivity to light and sound."},
        {"name": "Tension Headache", "prob": 0.5, "urgency": 1, "description": "The most common type of headache, characterized by mild to moderate pain that feels like a tight band around the head."},
        {"name": "Sinusitis", "prob": 0.4, "urgency": 1, "description": "Inflammation of the sinuses, often caused by an infection. Can cause pain and pressure in the face, particularly around the nose, eyes, and forehead."},
    ],
    "fatigue": [
        {"name": "Anemia", "prob": 0.6, "urgency": 2, "description": "A condition where you don't have enough healthy red blood cells to carry adequate oxygen to your body's tissues."},
        {"name": "Depression", "prob": 0.5, "urgency": 3, "description": "A mood disorder causing a persistent feeling of sadness and loss of interest."},
        {"name": "Hypothyroidism", "prob": 0.4, "urgency": 2, "description": "A condition in which the thyroid gland doesn't produce enough thyroid hormone, resulting in fatigue and slowed metabolism."},
    ],
    "fever": [
        {"name": "Flu", "prob": 0.7, "urgency": 2, "description": "A contagious respiratory illness caused by influenza viruses."},
        {"name": "COVID-19", "prob": 0.6, "urgency": 3, "description": "A respiratory illness caused by the SARS-CoV-2 virus."},
        {"name": "Pneumonia", "prob": 0.5, "urgency": 4, "description": "An infection that inflames the air sacs in one or both lungs, which may fill with fluid."},
    ],
    "cough": [
        {"name": "Common Cold", "prob": 0.8, "urgency": 1, "description": "A viral infection of the upper respiratory tract."},
        {"name": "Bronchitis", "prob": 0.6, "urgency": 2, "description": "Inflammation of the lining of the bronchial tubes, which carry air to and from the lungs."},
        {"name": "COVID-19", "prob": 0.5, "urgency": 3, "description": "A respiratory illness caused by the SARS-CoV-2 virus."},
    ],
    "rash": [
        {"name": "Contact Dermatitis", "prob": 0.7, "urgency": 1, "description": "A red, itchy rash caused by direct contact with a substance or an allergic reaction."},
        {"name": "Eczema", "prob": 0.6, "urgency": 1, "description": "A condition that makes your skin red, itchy, and sometimes cracked and leaky."},
        {"name": "Psoriasis", "prob": 0.4, "urgency": 2, "description": "A condition that causes red, itchy, scaly patches on the skin."},
    ],
    "nausea": [
        {"name": "Gastroenteritis", "prob": 0.7, "urgency": 2, "description": "Inflammation of the lining of the stomach and intestines, typically resulting from a viral or bacterial infection."},
        {"name": "Food Poisoning", "prob": 0.6, "urgency": 3, "description": "Illness caused by eating contaminated food."},
        {"name": "Migraine", "prob": 0.4, "urgency": 2, "description": "A neurological condition characterized by severe headaches, often with nausea and sensitivity to light and sound."},
    ],
    "dizziness": [
        {"name": "Vertigo", "prob": 0.6, "urgency": 2, "description": "A sensation of feeling off balance or that you or your surroundings are spinning."},
        {"name": "Low Blood Pressure", "prob": 0.5, "urgency": 2, "description": "A condition where the blood pressure in your arteries is lower than normal."},
        {"name": "Dehydration", "prob": 0.4, "urgency": 2, "description": "A condition that occurs when your body loses more fluid than it takes in."},
    ],
    "chest pain": [
        {"name": "Angina", "prob": 0.6, "urgency": 4, "description": "Chest pain caused by reduced blood flow to the heart."},
        {"name": "Heartburn", "prob": 0.5, "urgency": 1, "description": "A burning pain in the chest, just behind the breastbone, often after eating."},
        {"name": "Heart Attack", "prob": 0.3, "urgency": 5, "description": "A serious medical emergency where the blood supply to the heart is suddenly blocked, usually by a blood clot. Seek immediate medical attention."},
    ],
    "shortness of breath": [
        {"name": "Asthma", "prob": 0.7, "urgency": 3, "description": "A condition in which your airways narrow and swell and may produce extra mucus."},
        {"name": "Anxiety", "prob": 0.6, "urgency": 2, "description": "A feeling of worry, nervousness, or unease about something with an uncertain outcome."},
        {"name": "COVID-19", "prob": 0.5, "urgency": 3, "description": "A respiratory illness caused by the SARS-CoV-2 virus."},
    ],
    "back pain": [
        {"name": "Muscle Strain", "prob": 0.8, "urgency": 1, "description": "Overstretching or tearing of muscles or tendons in the back."},
        {"name": "Herniated Disc", "prob": 0.5, "urgency": 3, "description": "A problem with one of the rubbery cushions (discs) between the individual bones (vertebrae) that stack up to make your spine."},
        {"name": "Sciatica", "prob": 0.4, "urgency": 2, "description": "Pain that radiates along the path of the sciatic nerve, which branches from your lower back through your hips and buttocks and down each leg."},
    ],
}

@router.post("/symptom-checker", response_model=SymptomResponse)
async def symptom_checker(request: SymptomRequest = Body(...)):
    """
    Check symptoms and return possible conditions
    """
    logger.info(f"Symptom check request: age={request.age}, gender={request.gender}, symptoms={request.symptoms}")
    
    # In a real implementation, this would call a medical API or use a trained model
    # For demo purposes, we'll use our mock data and add some randomness
    
    conditions = []
    
    # Generate possible conditions based on reported symptoms
    for symptom in request.symptoms:
        symptom_lower = symptom.lower()
        
        # Find matching conditions for this symptom
        matching_conditions = common_conditions.get(symptom_lower, [])
        
        # If no exact match, try to find partial matches
        if not matching_conditions:
            for key, value in common_conditions.items():
                if symptom_lower in key or key in symptom_lower:
                    matching_conditions = value
                    break
        
        # If still no matches, add a generic response
        if not matching_conditions:
            # Skip adding generic responses to keep results relevant
            continue
        
        # Add the conditions with slight randomization to probabilities
        for condition in matching_conditions:
            # Adjust probability based on age (simplified)
            age_factor = 1.0
            if request.age > 60:
                age_factor = 1.2  # Increase probability for older people
            elif request.age < 18:
                age_factor = 0.8  # Decrease for younger people
            
            # Calculate final probability
            probability = min(condition["prob"] * age_factor * random.uniform(0.9, 1.1), 0.95) * 100
            
            # Add to results if not already present or update if higher probability
            existing = next((c for c in conditions if c.name == condition["name"]), None)
            if existing:
                existing.probability = max(existing.probability, probability)
            else:
                conditions.append(
                    PossibleCondition(
                        name=condition["name"],
                        description=condition["description"],
                        probability=probability,
                        urgency=condition["urgency"]
                    )
                )
    
    # Sort by probability in descending order
    conditions.sort(key=lambda c: c.probability, reverse=True)
    
    # Limit to top results
    conditions = conditions[:5]
    
    # Create response
    response = SymptomResponse(conditions=conditions)
    
    return response