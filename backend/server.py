from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from typing import List
import uuid

# Import models and database
from models import (
    Module, ModuleProgressUpdate, User, UserCreate, UserUpdate,
    Exercise, ExerciseComplete, Certificate, CertificateCreate, Stats
)
from database import (
    init_database, get_modules, get_module_by_id, update_module_progress,
    get_user_by_id, update_user_profile, get_user_progress,
    get_exercises_by_module, complete_exercise, get_certificates,
    create_certificate, get_stats
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="ConfianceBoost API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default user ID for demo (in production, use authentication)
DEFAULT_USER_ID = "demo-user-1"

# Health check
@api_router.get("/")
async def root():
    return {"message": "ConfianceBoost API is running", "version": "1.0.0"}

# Modules endpoints
@api_router.get("/modules", response_model=List[Module])
async def get_all_modules():
    """Récupère tous les modules de formation"""
    try:
        modules = await get_modules()
        return modules
    except Exception as e:
        logging.error(f"Error fetching modules: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des modules")

@api_router.get("/modules/{module_id}", response_model=Module)
async def get_module(module_id: int):
    """Récupère un module spécifique par son ID"""
    try:
        module = await get_module_by_id(module_id)
        if not module:
            raise HTTPException(status_code=404, detail="Module non trouvé")
        return module
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching module {module_id}: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération du module")

@api_router.put("/modules/{module_id}/progress", response_model=Module)
async def update_module_progress_endpoint(module_id: int, progress_data: ModuleProgressUpdate):
    """Met à jour la progression d'un module"""
    try:
        module = await update_module_progress(
            module_id, 
            progress_data.progress, 
            progress_data.completed
        )
        if not module:
            raise HTTPException(status_code=404, detail="Module non trouvé")
        
        # Update user's overall progress
        await update_user_overall_progress(DEFAULT_USER_ID)
        
        return module
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating module progress: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour")

# User endpoints
@api_router.get("/user/profile", response_model=User)
async def get_user_profile():
    """Récupère le profil de l'utilisateur actuel"""
    try:
        user = await get_user_by_id(DEFAULT_USER_ID)
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        return user
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching user profile: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération du profil")

@api_router.put("/user/profile", response_model=User)
async def update_user_profile_endpoint(user_data: UserUpdate):
    """Met à jour le profil utilisateur"""
    try:
        update_data = {k: v for k, v in user_data.dict().items() if v is not None}
        user = await update_user_profile(DEFAULT_USER_ID, update_data)
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        return user
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating user profile: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour du profil")

@api_router.get("/user/progress")
async def get_user_progress_endpoint():
    """Récupère la progression globale de l'utilisateur"""
    try:
        progress = await get_user_progress(DEFAULT_USER_ID)
        return progress
    except Exception as e:
        logging.error(f"Error fetching user progress: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération de la progression")

# Exercise endpoints
@api_router.get("/modules/{module_id}/exercises")
async def get_module_exercises(module_id: int):
    """Récupère les exercices d'un module"""
    try:
        exercises = await get_exercises_by_module(module_id)
        return exercises
    except Exception as e:
        logging.error(f"Error fetching exercises for module {module_id}: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des exercices")

@api_router.post("/exercises/{exercise_id}/complete")
async def complete_exercise_endpoint(exercise_id: str, completion_data: ExerciseComplete):
    """Marque un exercice comme terminé ou non"""
    try:
        success = await complete_exercise(exercise_id, completion_data.completed)
        if not success:
            raise HTTPException(status_code=404, detail="Exercice non trouvé")
        return {"message": "Exercice mis à jour avec succès", "completed": completion_data.completed}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error completing exercise {exercise_id}: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour de l'exercice")

# Certificate endpoints
@api_router.get("/certificates", response_model=List[Certificate])
async def get_user_certificates():
    """Récupère les certificats de l'utilisateur"""
    try:
        certificates = await get_certificates(DEFAULT_USER_ID)
        return certificates
    except Exception as e:
        logging.error(f"Error fetching certificates: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des certificats")

@api_router.post("/certificates/generate", response_model=Certificate)
async def generate_certificate():
    """Génère un certificat de fin de formation"""
    try:
        # Vérifier si l'utilisateur a terminé tous les modules
        progress = await get_user_progress(DEFAULT_USER_ID)
        if progress["totalProgress"] < 100:
            raise HTTPException(
                status_code=400, 
                detail="Vous devez terminer tous les modules pour obtenir le certificat"
            )
        
        certificate = await create_certificate(
            DEFAULT_USER_ID, 
            "Certificat de Formation - Confiance en Soi"
        )
        return certificate
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error generating certificate: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la génération du certificat")

# Stats endpoint
@api_router.get("/stats", response_model=Stats)
async def get_platform_stats():
    """Récupère les statistiques de la plateforme"""
    try:
        stats = await get_stats()
        return stats
    except Exception as e:
        logging.error(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des statistiques")

# Helper function to update user's overall progress
async def update_user_overall_progress(user_id: str):
    """Met à jour la progression globale de l'utilisateur"""
    try:
        progress_data = await get_user_progress(user_id)
        update_data = {
            "completedModules": progress_data["completedModules"],
            "totalProgress": progress_data["totalProgress"]
        }
        await update_user_profile(user_id, update_data)
    except Exception as e:
        logging.error(f"Error updating user overall progress: {e}")

# Include the router
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    await init_database()
    logger.info("✅ ConfianceBoost API initialized successfully")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("ConfianceBoost API shutting down...")