from motor.motor_asyncio import AsyncIOMotorClient
from models import Module, User, Exercise, Certificate, UserProgress, ModuleContent
import os
from datetime import datetime

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
modules_collection = db.modules
users_collection = db.users  
exercises_collection = db.exercises
certificates_collection = db.certificates
user_progress_collection = db.user_progress

async def init_database():
    """Initialize database with default data"""
    
    # Check if modules already exist
    existing_modules = await modules_collection.count_documents({})
    if existing_modules == 0:
        # Insert default modules
        default_modules = [
            {
                "id": 1,
                "title": "Comprendre sa valeur personnelle",
                "description": "Découvrez votre vraie valeur et apprenez à la reconnaître au quotidien",
                "duration": "45 min",
                "lessons": 6,
                "completed": False,
                "progress": 0,
                "content": {
                    "introduction": "Dans ce module, vous allez explorer les fondements de votre valeur personnelle et apprendre à reconnaître vos qualités uniques.",
                    "video_url": None,
                    "exercises": [
                        "Listez 10 qualités que vous possédez",
                        "Identifiez 3 réussites passées",
                        "Créez votre affirmation personnelle",
                        "Pratiquez l'auto-reconnaissance quotidienne",
                        "Établissez vos valeurs fondamentales"
                    ]
                }
            },
            {
                "id": 2,
                "title": "Surmonter le syndrome de l'imposteur",
                "description": "Techniques concrètes pour vaincre la peur de ne pas être à la hauteur",
                "duration": "60 min",
                "lessons": 8,
                "completed": False,
                "progress": 0,
                "content": {
                    "introduction": "Le syndrome de l'imposteur touche 70% des personnes. Apprenez à le reconnaître et à le surmonter définitivement.",
                    "exercises": [
                        "Analysez vos pensées limitantes",
                        "Reconstituez votre parcours de réussites",
                        "Pratiquez l'auto-compassion",
                        "Développez votre dialogue intérieur positif",
                        "Créez votre portfolio de preuves",
                        "Techniques de recadrage cognitif"
                    ]
                }
            },
            {
                "id": 3,
                "title": "Développer son assertivité",
                "description": "Apprenez à vous affirmer avec respect et bienveillance",
                "duration": "50 min",
                "lessons": 7,
                "completed": False,
                "progress": 0,
                "content": {
                    "introduction": "L'assertivité est la capacité à exprimer ses opinions et besoins tout en respectant ceux des autres.",
                    "exercises": [
                        "Techniques de communication assertive",
                        "Dire non sans culpabiliser",
                        "Gérer les conflits constructivement",
                        "Exprimer ses besoins clairement",
                        "Pratiquer l'écoute active",
                        "Développer son langage corporel confiant"
                    ]
                }
            },
            {
                "id": 4,
                "title": "Gérer l'anxiété sociale",
                "description": "Stratégies pour vous sentir à l'aise en société",
                "duration": "55 min",
                "lessons": 6,
                "completed": False,
                "progress": 0,
                "content": {
                    "introduction": "L'anxiété sociale peut limiter nos interactions. Découvrez des techniques éprouvées pour la surmonter.",
                    "exercises": [
                        "Techniques de respiration pour l'anxiété",
                        "Exposition progressive aux situations sociales",
                        "Restructuration cognitive des pensées négatives",
                        "Préparation mentale avant les événements sociaux",
                        "Développement de sujets de conversation",
                        "Pratique de la pleine conscience sociale"
                    ]
                }
            },
            {
                "id": 5,
                "title": "Cultiver l'estime de soi",
                "description": "Construisez une image positive et durable de vous-même",
                "duration": "65 min",
                "lessons": 9,
                "completed": False,
                "progress": 0,
                "content": {
                    "introduction": "L'estime de soi est la fondation de la confiance. Apprenez à la cultiver durablement.",
                    "exercises": [
                        "Journal de gratitude personnel",
                        "Célébrez vos petites victoires",
                        "Créez votre vision idéale",
                        "Pratiquez l'autocompassion",
                        "Développez vos talents uniques",
                        "Établissez des objectifs personnels alignés",
                        "Créez votre routine de bien-être",
                        "Pratiquez l'affirmation positive quotidienne"
                    ]
                }
            },
            {
                "id": 6,
                "title": "Prendre des décisions avec confiance",
                "description": "Méthodes pour décider sereinement et assumer ses choix",
                "duration": "40 min",
                "lessons": 5,
                "completed": False,
                "progress": 0,
                "content": {
                    "introduction": "Prendre des décisions peut être source d'anxiété. Découvrez des méthodes pour décider avec confiance.",
                    "exercises": [
                        "Matrice de décision personnalisée",
                        "Technique du pour/contre évolué",
                        "Accepter l'imperfection et l'incertitude",
                        "Écouter son intuition",
                        "Prendre des décisions rapides pour les petits choix"
                    ]
                }
            }
        ]
        
        await modules_collection.insert_many(default_modules)
        print("✅ Modules par défaut créés")
    
    # Create default user if none exists
    existing_users = await users_collection.count_documents({})
    if existing_users == 0:
        default_user = {
            "id": "demo-user-1",
            "name": "Utilisateur Demo",
            "email": "demo@confianceboost.fr",
            "enrollmentDate": datetime.utcnow(),
            "completedModules": 0,
            "totalProgress": 0,
            "certificates": 0
        }
        await users_collection.insert_one(default_user)
        print("✅ Utilisateur demo créé")

# CRUD Operations
async def get_modules():
    """Récupère tous les modules"""
    modules = await modules_collection.find().to_list(100)
    return modules

async def get_module_by_id(module_id: int):
    """Récupère un module par son ID"""
    module = await modules_collection.find_one({"id": module_id})
    return module

async def update_module_progress(module_id: int, progress: int, completed: bool):
    """Met à jour la progression d'un module"""
    update_data = {
        "progress": progress,
        "completed": completed
    }
    result = await modules_collection.update_one(
        {"id": module_id}, 
        {"$set": update_data}
    )
    if result.modified_count:
        return await get_module_by_id(module_id)
    return None

async def get_user_by_id(user_id: str):
    """Récupère un utilisateur par son ID"""
    user = await users_collection.find_one({"id": user_id})
    return user

async def update_user_profile(user_id: str, update_data: dict):
    """Met à jour le profil utilisateur"""
    result = await users_collection.update_one(
        {"id": user_id},
        {"$set": update_data}
    )
    if result.modified_count:
        return await get_user_by_id(user_id)
    return None

async def get_user_progress(user_id: str):
    """Récupère la progression globale de l'utilisateur"""
    modules = await get_modules()
    completed_modules = len([m for m in modules if m.get('completed', False)])
    total_modules = len(modules)
    total_progress = int((completed_modules / total_modules) * 100) if total_modules > 0 else 0
    
    return {
        "totalProgress": total_progress,
        "completedModules": completed_modules,
        "totalModules": total_modules
    }

async def get_exercises_by_module(module_id: int):
    """Récupère les exercices d'un module"""
    exercises = await exercises_collection.find({"moduleId": module_id}).to_list(100)
    return exercises

async def complete_exercise(exercise_id: str, completed: bool):
    """Marque un exercice comme terminé ou non"""
    update_data = {
        "completed": completed,
        "completedAt": datetime.utcnow() if completed else None
    }
    result = await exercises_collection.update_one(
        {"id": exercise_id},
        {"$set": update_data}
    )
    return result.modified_count > 0

async def get_certificates(user_id: str):
    """Récupère les certificats d'un utilisateur"""
    certificates = await certificates_collection.find({"userId": user_id}).to_list(100)
    return certificates

async def create_certificate(user_id: str, title: str):
    """Crée un nouveau certificat"""
    certificate = {
        "id": str(uuid.uuid4()),
        "userId": user_id,
        "title": title,
        "completedAt": datetime.utcnow(),
        "downloadUrl": f"/api/certificates/{user_id}/download"
    }
    await certificates_collection.insert_one(certificate)
    return certificate

async def get_stats():
    """Récupère les statistiques globales"""
    total_students = await users_collection.count_documents({})
    total_modules = await modules_collection.count_documents({})
    
    return {
        "totalStudents": max(total_students, 2847),  # Minimum pour l'effet
        "completionRate": 94,
        "averageRating": 4.9,
        "moduleCount": total_modules
    }