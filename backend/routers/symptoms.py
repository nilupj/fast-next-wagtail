from fastapi import APIRouter, HTTPException, Body
import httpx
import os
import logging
import random

from models import SymptomRequest, SymptomResponse, PossibleCondition, ErrorResponse

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

# Mock symptom-to-condition mappings (would be replaced with a proper medical database)
mock_symptom_mappings = {
    "Headache": [
        ("Migraine", "A neurological condition characterized by severe headaches, often with nausea and sensitivity to light", 75),
        ("Tension Headache", "A common headache characterized by mild to moderate pain, tightness, or pressure around the forehead or back of the head", 65),
        ("Sinusitis", "Inflammation of the sinuses, often due to infection", 40),
    ],
    "Fever": [
        ("Common Cold", "A viral infection affecting the upper respiratory tract", 70),
        ("Influenza", "A viral infection that attacks your respiratory system", 65),
        ("COVID-19", "A respiratory illness caused by the SARS-CoV-2 virus", 60),
    ],
    "Cough": [
        ("Common Cold", "A viral infection affecting the upper respiratory tract", 75),
        ("Bronchitis", "Inflammation of the lining of your bronchial tubes", 60),
        ("Asthma", "A condition in which airways narrow and swell", 50),
        ("COVID-19", "A respiratory illness caused by the SARS-CoV-2 virus", 55),
    ],
    "Fatigue": [
        ("Anemia", "A condition where you lack enough healthy red blood cells to carry adequate oxygen to your body's tissues", 50),
        ("Depression", "A mental health disorder characterized by persistently depressed mood", 45),
        ("Chronic Fatigue Syndrome", "A complicated disorder characterized by extreme fatigue", 40),
        ("Hypothyroidism", "A condition in which your thyroid gland doesn't produce enough hormones", 35),
    ],
    "Shortness of breath": [
        ("Asthma", "A condition in which airways narrow and swell", 70),
        ("COPD", "A chronic inflammatory lung disease that causes obstructed airflow from the lungs", 65),
        ("Anxiety", "A feeling of worry, nervousness, or unease", 50),
        ("COVID-19", "A respiratory illness caused by the SARS-CoV-2 virus", 60),
    ],
    "Nausea": [
        ("Gastroenteritis", "Inflammation of the lining of the stomach and intestines", 70),
        ("Motion Sickness", "A feeling of wooziness triggered by movement", 65),
        ("Migraine", "A neurological condition characterized by severe headaches", 55),
        ("Food Poisoning", "Illness caused by eating contaminated food", 60),
    ],
    "Dizziness": [
        ("Vertigo", "A sensation of feeling off balance", 70),
        ("Low Blood Pressure", "Blood pressure that is lower than normal", 65),
        ("Anemia", "A condition where you lack enough healthy red blood cells", 55),
        ("Inner Ear Infection", "Infection of the inner ear", 50),
    ],
    "Abdominal pain": [
        ("Gastroenteritis", "Inflammation of the lining of the stomach and intestines", 75),
        ("Appendicitis", "Inflammation of the appendix", 40),
        ("Irritable Bowel Syndrome", "A common disorder that affects the large intestine", 60),
        ("Gastritis", "Inflammation of the lining of the stomach", 65),
    ],
    "Chest pain": [
        ("Angina", "A type of chest pain caused by reduced blood flow to the heart", 60),
        ("Gastroesophageal Reflux Disease", "A digestive disorder that affects the lower esophageal sphincter", 55),
        ("Costochondritis", "Inflammation of the cartilage that connects a rib to the breastbone", 50),
        ("Heart Attack", "When blood flow to a part of the heart is blocked", 30),
    ],
    "Sore throat": [
        ("Pharyngitis", "Inflammation of the pharynx", 80),
        ("Common Cold", "A viral infection affecting the upper respiratory tract", 75),
        ("Strep Throat", "A bacterial infection that can make your throat feel sore and scratchy", 65),
        ("Tonsillitis", "Inflammation of the tonsils", 60),
    ],
    "Muscle aches": [
        ("Influenza", "A viral infection that attacks your respiratory system", 70),
        ("Fibromyalgia", "A disorder characterized by widespread musculoskeletal pain", 55),
        ("Chronic Fatigue Syndrome", "A complicated disorder characterized by extreme fatigue", 45),
        ("COVID-19", "A respiratory illness caused by the SARS-CoV-2 virus", 50),
    ],
    "Joint pain": [
        ("Arthritis", "Inflammation of one or more joints", 75),
        ("Rheumatoid Arthritis", "An autoimmune and inflammatory disease", 65),
        ("Gout", "A form of inflammatory arthritis", 60),
        ("Lupus", "A systemic autoimmune disease", 40),
    ],
    "Rash": [
        ("Contact Dermatitis", "A red, itchy rash caused by direct contact with a substance", 75),
        ("Eczema", "A condition that makes your skin red and itchy", 70),
        ("Psoriasis", "A skin disease that causes red, itchy scaly patches", 60),
        ("Allergic Reaction", "An overreaction of the immune system to a substance", 65),
    ],
    "Diarrhea": [
        ("Gastroenteritis", "Inflammation of the lining of the stomach and intestines", 80),
        ("Food Poisoning", "Illness caused by eating contaminated food", 75),
        ("Irritable Bowel Syndrome", "A common disorder that affects the large intestine", 65),
        ("Crohn's Disease", "A type of inflammatory bowel disease", 45),
    ],
    "Vomiting": [
        ("Gastroenteritis", "Inflammation of the lining of the stomach and intestines", 80),
        ("Food Poisoning", "Illness caused by eating contaminated food", 75),
        ("Migraine", "A neurological condition characterized by severe headaches", 50),
        ("Morning Sickness", "Nausea and vomiting that occurs during pregnancy", 40),
    ],
    "Bloating": [
        ("Irritable Bowel Syndrome", "A common disorder that affects the large intestine", 70),
        ("Gastroenteritis", "Inflammation of the lining of the stomach and intestines", 65),
        ("Lactose Intolerance", "The inability to digest lactose", 60),
        ("Constipation", "Difficult or infrequent bowel movements", 55),
    ],
    "Back pain": [
        ("Muscle Strain", "Injury to a muscle or tendon", 75),
        ("Herniated Disc", "A problem with one of the rubbery cushions between the bones of your spine", 60),
        ("Sciatica", "Pain that radiates along the path of the sciatic nerve", 55),
        ("Osteoarthritis", "The most common form of arthritis", 50),
    ],
    "Anxiety": [
        ("Anxiety Disorder", "A mental health disorder characterized by feelings of worry or fear", 85),
        ("Panic Disorder", "A type of anxiety disorder", 75),
        ("Generalized Anxiety Disorder", "A mental health disorder characterized by excessive, persistent worry", 65),
        ("Social Anxiety Disorder", "A chronic mental health condition involving overwhelming worry and self-consciousness about social situations", 60),
    ],
    "Depression": [
        ("Major Depressive Disorder", "A mental health disorder characterized by persistently depressed mood", 85),
        ("Bipolar Disorder", "A mental health condition that causes extreme mood swings", 60),
        ("Seasonal Affective Disorder", "A type of depression related to changes in seasons", 55),
        ("Dysthymia", "A mild but long-term form of depression", 50),
    ],
    "Weight loss": [
        ("Hyperthyroidism", "A condition in which the thyroid gland produces too much thyroid hormone", 60),
        ("Depression", "A mental health disorder characterized by persistently depressed mood", 50),
        ("Diabetes", "A disease that occurs when your blood glucose is too high", 45),
        ("Cancer", "A disease in which abnormal cells divide uncontrollably and destroy body tissue", 35),
    ],
}

@router.post("/symptom-checker", response_model=SymptomResponse)
async def symptom_checker(request: SymptomRequest = Body(...)):
    """
    Check symptoms and return possible conditions
    """
    try:
        # Try to call the CMS or specialized symptom API
        # Here we would normally make a request to a medically validated symptom checker API
        
        # For development, use our mock data
        possible_conditions = []
        
        # Process each symptom and collect possible conditions
        all_matches = []
        for symptom in request.symptoms:
            if symptom in mock_symptom_mappings:
                all_matches.extend(mock_symptom_mappings[symptom])
        
        # Count occurrences and calculate probabilities
        condition_counts = {}
        for condition_name, description, probability in all_matches:
            if condition_name not in condition_counts:
                condition_counts[condition_name] = {
                    "name": condition_name,
                    "description": description,
                    "count": 0,
                    "total_probability": 0
                }
            condition_counts[condition_name]["count"] += 1
            condition_counts[condition_name]["total_probability"] += probability
        
        # Calculate final probability and create response
        for condition_data in condition_counts.values():
            # Adjust probability based on number of matching symptoms and their individual probabilities
            symptom_count_factor = min(condition_data["count"] / len(request.symptoms) * 1.5, 1.0)
            avg_probability = condition_data["total_probability"] / condition_data["count"]
            final_probability = int(avg_probability * symptom_count_factor)
            
            # Adjust based on age and gender (simplified)
            if request.age > 60:
                # Some conditions are more common in older individuals
                if "Arthritis" in condition_data["name"] or "Heart" in condition_data["name"]:
                    final_probability = min(final_probability + 10, 100)
            
            if request.gender == "female" and "Morning Sickness" in condition_data["name"]:
                final_probability = min(final_probability + 20, 100)
            
            # Calculate urgency (1-5) based on probability and condition
            urgency = 1
            if final_probability > 80:
                urgency = 4
            elif final_probability > 60:
                urgency = 3
            elif final_probability > 40:
                urgency = 2
            
            # Increase urgency for serious conditions
            if "Heart Attack" in condition_data["name"] or "Appendicitis" in condition_data["name"]:
                urgency = 5
            
            possible_conditions.append(
                PossibleCondition(
                    name=condition_data["name"],
                    description=condition_data["description"],
                    probability=final_probability,
                    urgency=urgency
                )
            )
        
        # Sort by probability (descending)
        possible_conditions.sort(key=lambda x: x.probability, reverse=True)
        
        # Take top conditions
        top_conditions = possible_conditions[:5]
        
        return SymptomResponse(conditions=top_conditions)
    
    except Exception as exc:
        logger.error(f"Error checking symptoms: {exc}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your symptoms. Please try again."
        )
