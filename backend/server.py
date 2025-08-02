from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from enum import Enum
import jwt
import hashlib
from shopify_integration import shopify_integration

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="ConfianceBoost API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
JWT_SECRET = "confianceboost-secret-key-2025"

# Enums
class ModuleStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class UserRole(str, Enum):
    STUDENT = "student"
    ADMIN = "admin"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    first_name: str
    last_name: str
    role: UserRole = UserRole.STUDENT
    registration_date: datetime = Field(default_factory=datetime.utcnow)
    total_study_time: int = 0  # in minutes
    certificates_earned: int = 0
    is_premium: bool = False

class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Lesson(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    duration: int  # in minutes
    content: str
    video_url: Optional[str] = None
    order: int

class Exercise(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    instructions: str
    type: str  # "reflection", "practical", "written"

class Module(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    duration: int  # total duration in minutes
    lessons_count: int
    lessons: List[Lesson]
    exercises: List[Exercise]
    resources: List[str]
    order: int
    icon: str
    color: str

class UserProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    module_id: str
    status: ModuleStatus = ModuleStatus.NOT_STARTED
    completed_lessons: List[str] = []
    completed_exercises: List[str] = []
    start_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    progress_percentage: int = 0
    time_spent: int = 0  # in minutes

class Certificate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    module_id: str
    issued_date: datetime = Field(default_factory=datetime.utcnow)
    certificate_url: str

class Stats(BaseModel):
    total_users: int
    total_modules: int
    total_certificates: int
    average_completion_rate: float

# Helper functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_token(user_id: str) -> str:
    return jwt.encode({"user_id": user_id}, JWT_SECRET, algorithm="HS256")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id")
        user = await db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Initialize modules data
async def init_modules():
    modules_count = await db.modules.count_documents({})
    if modules_count == 0:
        modules_data = [
            {
                "id": str(uuid.uuid4()),
                "title": "Comprendre sa valeur personnelle",
                "description": "Découvrez votre valeur intrinsèque et apprenez à la reconnaître dans toutes les situations.",
                "duration": 45,
                "lessons_count": 6,
                "order": 1,
                "icon": "👤",
                "color": "bg-gradient-to-r from-yellow-400 to-yellow-600",
                "lessons": [
                    {"id": str(uuid.uuid4()), "title": "Qu'est-ce que la valeur personnelle ?", "duration": 8, "content": "La valeur personnelle est la reconnaissance de votre worth intrinsèque en tant qu'être humain, indépendamment de vos réussites ou échecs.", "order": 1},
                    {"id": str(uuid.uuid4()), "title": "Identifier vos forces uniques", "duration": 10, "content": "Chaque personne possède des qualités et talents uniques. Apprendre à les identifier est crucial pour construire une confiance solide.", "order": 2},
                    {"id": str(uuid.uuid4()), "title": "Comprendre l'autocritique destructive", "duration": 7, "content": "L'autocritique excessive peut détruire notre estime de soi. Apprenez à distinguer la critique constructive de la destructive.", "order": 3},
                    {"id": str(uuid.uuid4()), "title": "Développer l'auto-compassion", "duration": 8, "content": "L'auto-compassion consiste à se traiter avec la même bienveillance qu'on traiterait un bon ami en difficulté.", "order": 4},
                    {"id": str(uuid.uuid4()), "title": "Vos valeurs fondamentales", "duration": 6, "content": "Identifiez vos valeurs profondes pour aligner vos actions avec ce qui compte vraiment pour vous.", "order": 5},
                    {"id": str(uuid.uuid4()), "title": "Célébrer ses victoires", "duration": 6, "content": "Apprendre à reconnaître et célébrer vos succès, même les plus petits, renforce votre confiance.", "order": 6}
                ],
                "exercises": [
                    {"id": str(uuid.uuid4()), "title": "Journal de gratitude personnelle", "description": "Notez 3 choses que vous appréciez chez vous", "instructions": "Chaque soir, écrivez 3 qualités ou actions dont vous êtes fier(e) aujourd'hui", "type": "written"},
                    {"id": str(uuid.uuid4()), "title": "Inventaire des forces", "description": "Listez vos 10 principales qualités", "instructions": "Demandez à 3 proches de vous aider à identifier vos forces", "type": "practical"}
                ],
                "resources": ["Guide PDF: Comprendre sa valeur", "Méditation guidée de 10 min", "Checklist d'auto-évaluation"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Surmonter le syndrome de l'imposteur",
                "description": "Libérez-vous de cette voix intérieure qui vous dit que vous ne méritez pas votre succès.",
                "duration": 60,
                "lessons_count": 8,
                "order": 2,
                "icon": "🎭",
                "color": "bg-gradient-to-r from-purple-400 to-purple-600",
                "lessons": [
                    {"id": str(uuid.uuid4()), "title": "Qu'est-ce que le syndrome de l'imposteur ?", "duration": 8, "content": "Le syndrome de l'imposteur est cette sensation persistante d'être un fraudeur, malgré des preuves objectives de compétence.", "order": 1},
                    {"id": str(uuid.uuid4()), "title": "Les 5 types d'imposteurs", "duration": 10, "content": "Perfectionniste, Expert, Soliste, Génie naturel, Surhomme/Superfemme - identifiez votre profil.", "order": 2},
                    {"id": str(uuid.uuid4()), "title": "Les déclencheurs émotionnels", "duration": 7, "content": "Reconnaissez les situations qui activent votre syndrome de l'imposteur pour mieux les anticiper.", "order": 3},
                    {"id": str(uuid.uuid4()), "title": "Restructurer ses pensées", "duration": 8, "content": "Techniques pour challenger et remplacer les pensées d'imposteur par des pensées réalistes et bienveillantes.", "order": 4},
                    {"id": str(uuid.uuid4()), "title": "Documenter ses succès", "duration": 7, "content": "Créez un 'dossier de fierté' pour collecter preuves de vos réussites et compétences.", "order": 5},
                    {"id": str(uuid.uuid4()), "title": "Accepter les compliments", "duration": 6, "content": "Apprenez à recevoir les compliments sans les minimiser ou les rejeter automatiquement.", "order": 6},
                    {"id": str(uuid.uuid4()), "title": "Partager ses doutes", "duration": 7, "content": "Découvrez comment parler de vos doutes peut les désarmer et créer des connexions authentiques.", "order": 7},
                    {"id": str(uuid.uuid4()), "title": "Redéfinir l'échec", "duration": 7, "content": "Transformez votre relation à l'échec : d'ennemi à allié dans votre développement personnel.", "order": 8}
                ],
                "exercises": [
                    {"id": str(uuid.uuid4()), "title": "Test du syndrome de l'imposteur", "description": "Évaluez votre niveau de syndrome", "instructions": "Répondez honnêtement aux 20 questions du questionnaire", "type": "reflection"},
                    {"id": str(uuid.uuid4()), "title": "Dossier de réussites", "description": "Compilez vos preuves de compétence", "instructions": "Rassemblez emails de remerciements, évaluations positives, projets réussis", "type": "practical"}
                ],
                "resources": ["Questionnaire d'auto-évaluation", "Template dossier de réussites", "Audio: Affirmations anti-imposteur"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Développer son assertivité",
                "description": "Apprenez à exprimer vos besoins et opinions avec respect et fermeté.",
                "duration": 50,
                "lessons_count": 7,
                "order": 3,
                "icon": "💪",
                "color": "bg-gradient-to-r from-green-400 to-green-600",
                "lessons": [
                    {"id": str(uuid.uuid4()), "title": "Assertivité vs agressivité vs passivité", "duration": 8, "content": "Comprendre les différences fondamentales entre ces trois modes de communication.", "order": 1},
                    {"id": str(uuid.uuid4()), "title": "Identifier son style de communication", "duration": 7, "content": "Auto-évaluation pour reconnaître vos patterns de communication actuels.", "order": 2},
                    {"id": str(uuid.uuid4()), "title": "La technique du disque rayé", "duration": 6, "content": "Apprenez à maintenir votre position calmement face à la pression ou manipulation.", "order": 3},
                    {"id": str(uuid.uuid4()), "title": "Dire non avec bienveillance", "duration": 8, "content": "Techniques pratiques pour refuser des demandes sans culpabilité ni agressivité.", "order": 4},
                    {"id": str(uuid.uuid4()), "title": "Exprimer ses besoins clairement", "duration": 7, "content": "Formuler des demandes précises et réalisables pour obtenir ce dont vous avez besoin.", "order": 5},
                    {"id": str(uuid.uuid4()), "title": "Gérer les critiques constructivement", "duration": 7, "content": "Recevoir et donner des feedbacks de manière assertive et bienveillante.", "order": 6},
                    {"id": str(uuid.uuid4()), "title": "Assertivité en situation de conflit", "duration": 7, "content": "Maintenir son assertivité même dans les situations tendues ou conflictuelles.", "order": 7}
                ],
                "exercises": [
                    {"id": str(uuid.uuid4()), "title": "Journal d'assertivité", "description": "Notez vos situations d'assertivité quotidiennes", "instructions": "Chaque soir, analysez 2 situations où vous avez été (ou pas) assertif", "type": "written"},
                    {"id": str(uuid.uuid4()), "title": "Jeux de rôle", "description": "Pratiquez l'assertivité en situation", "instructions": "Utilisez nos 10 scénarios pour vous entraîner", "type": "practical"}
                ],
                "resources": ["Scripts de phrases assertives", "Vidéo: Langage corporel assertif", "Checklist avant conversation difficile"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Gérer l'anxiété sociale",
                "description": "Surmontez votre peur du jugement et développez votre aisance sociale.",
                "duration": 55,
                "lessons_count": 6,
                "order": 4,
                "icon": "🌟",
                "color": "bg-gradient-to-r from-blue-400 to-blue-600",
                "lessons": [
                    {"id": str(uuid.uuid4()), "title": "Comprendre l'anxiété sociale", "duration": 10, "content": "Les mécanismes psychologiques et physiologiques de l'anxiété en situation sociale.", "order": 1},
                    {"id": str(uuid.uuid4()), "title": "Identifier vos déclencheurs", "duration": 9, "content": "Mapping personnel de vos situations anxiogènes pour mieux les anticiper.", "order": 2},
                    {"id": str(uuid.uuid4()), "title": "Techniques de respiration anti-stress", "duration": 8, "content": "Méthodes de respiration pour calmer instantanément votre système nerveux.", "order": 3},
                    {"id": str(uuid.uuid4()), "title": "Restructuration cognitive", "duration": 10, "content": "Changer vos pensées automatiques négatives en pensées plus réalistes et apaisantes.", "order": 4},
                    {"id": str(uuid.uuid4()), "title": "Exposition progressive", "duration": 9, "content": "Approche graduelle pour vous exposer aux situations sociales avec succès.", "order": 5},
                    {"id": str(uuid.uuid4()), "title": "Développer ses compétences sociales", "duration": 9, "content": "Techniques concrètes pour améliorer vos interactions et conversations.", "order": 6}
                ],
                "exercises": [
                    {"id": str(uuid.uuid4()), "title": "Échelle d'exposition graduelle", "description": "Créez votre plan d'exposition personnalisé", "instructions": "Listez 10 situations de la moins à la plus anxiogène", "type": "practical"},
                    {"id": str(uuid.uuid4()), "title": "Journal des pensées", "description": "Tracez vos pensées anxieuses", "instructions": "Notez pensée automatique → émotion → pensée alternative", "type": "written"}
                ],
                "resources": ["Audio: Méditation anti-anxiété", "Guide des signaux sociaux", "Exercices de respiration"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Cultiver l'estime de soi",
                "description": "Construisez une estime de soi solide et durable, indépendante du regard des autres.",
                "duration": 65,
                "lessons_count": 9,
                "order": 5,
                "icon": "❤️",
                "color": "bg-gradient-to-r from-pink-400 to-pink-600",
                "lessons": [
                    {"id": str(uuid.uuid4()), "title": "Différence entre estime et confiance", "duration": 7, "content": "Comprendre la distinction cruciale entre estime de soi et confiance en soi.", "order": 1},
                    {"id": str(uuid.uuid4()), "title": "Les piliers de l'estime de soi", "duration": 8, "content": "Les 6 piliers fondamentaux selon Nathaniel Branden pour construire une estime solide.", "order": 2},
                    {"id": str(uuid.uuid4()), "title": "Auto-acceptation inconditionnelle", "duration": 7, "content": "Apprendre à s'accepter pleinement, avec ses qualités et ses défauts.", "order": 3},
                    {"id": str(uuid.uuid4()), "title": "Sortir de la comparaison", "duration": 8, "content": "Techniques pour arrêter de se comparer constamment aux autres.", "order": 4},
                    {"id": str(uuid.uuid4()), "title": "Dialogue intérieur bienveillant", "duration": 7, "content": "Transformer votre critique intérieur en allié bienveillant et encourageant.", "order": 5},
                    {"id": str(uuid.uuid4()), "title": "Fixer des limites saines", "duration": 8, "content": "Protéger votre estime en établissant des boundaries claires avec les autres.", "order": 6},
                    {"id": str(uuid.uuid4()), "title": "Prendre soin de soi", "duration": 7, "content": "L'importance de l'auto-soin dans le développement de l'estime de soi.", "order": 7},
                    {"id": str(uuid.uuid4()), "title": "Construire sur ses réussites", "duration": 6, "content": "Utiliser vos succès passés comme fondation pour votre estime future.", "order": 8},
                    {"id": str(uuid.uuid4()), "title": "Maintenir l'estime au quotidien", "duration": 7, "content": "Rituels et habitudes pour entretenir votre estime de soi jour après jour.", "order": 9}
                ],
                "exercises": [
                    {"id": str(uuid.uuid4()), "title": "Lettre à soi-même", "description": "Écrivez une lettre bienveillante à votre futur vous", "instructions": "Rédigez avec compassion comme à votre meilleur ami", "type": "written"},
                    {"id": str(uuid.uuid4()), "title": "Rituel matinal d'estime", "description": "Créez votre routine quotidienne", "instructions": "5 minutes chaque matin d'affirmations personnalisées", "type": "practical"}
                ],
                "resources": ["Template lettre à soi", "21 affirmations puissantes", "Tracker d'estime quotidien"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Prendre des décisions avec confiance",
                "description": "Développez votre capacité à prendre des décisions alignées et assumées.",
                "duration": 40,
                "lessons_count": 5,
                "order": 6,
                "icon": "🎯",
                "color": "bg-gradient-to-r from-red-400 to-red-600",
                "lessons": [
                    {"id": str(uuid.uuid4()), "title": "Anatomie d'une décision", "duration": 8, "content": "Comprendre les composants émotionnels et rationnels de la prise de décision.", "order": 1},
                    {"id": str(uuid.uuid4()), "title": "Surmonter la paralysie décisionnelle", "duration": 10, "content": "Techniques pour débloquer les situations où vous n'arrivez pas à choisir.", "order": 2},
                    {"id": str(uuid.uuid4()), "title": "Méthodes de prise de décision", "duration": 8, "content": "Outils pratiques : matrice de décision, pros/cons pondérés, règle 10-10-10.", "order": 3},
                    {"id": str(uuid.uuid4()), "title": "Écouter son intuition", "duration": 7, "content": "Apprendre à faire confiance à votre sagesse intérieure tout en restant rationnel.", "order": 4},
                    {"id": str(uuid.uuid4()), "title": "Assumer ses choix", "duration": 7, "content": "Comment vivre avec ses décisions et apprendre de celles qui ne donnent pas les résultats espérés.", "order": 5}
                ],
                "exercises": [
                    {"id": str(uuid.uuid4()), "title": "Journal de décisions", "description": "Tracez vos décisions et leurs résultats", "instructions": "Notez décision → critères → résultat → apprentissage", "type": "written"},
                    {"id": str(uuid.uuid4()), "title": "Challenge 30 jours", "description": "Prenez une petite décision rapide chaque jour", "instructions": "Réduisez progressivement votre temps de réflexion", "type": "practical"}
                ],
                "resources": ["Matrice de décision Excel", "Quiz: Quel décideur êtes-vous?", "Checklist avant grande décision"]
            }
        ]
        
        await db.modules.insert_many(modules_data)
        print("Modules initialized successfully")

# Authentication endpoints
@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = user_data.dict()
    user_dict["password_hash"] = hash_password(user_data.password)
    del user_dict["password"]
    user_obj = User(**user_dict)
    
    await db.users.insert_one(user_obj.dict())
    
    # Create initial progress for all modules
    modules = await db.modules.find().to_list(1000)
    progress_data = []
    for module in modules:
        progress = UserProgress(
            user_id=user_obj.id,
            module_id=module["id"],
            status=ModuleStatus.NOT_STARTED
        )
        progress_data.append(progress.dict())
    
    if progress_data:
        await db.user_progress.insert_many(progress_data)
    
    token = create_token(user_obj.id)
    return {"token": token, "user": user_obj}

@api_router.post("/auth/login")
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"])
    user_obj = User(**user)
    return {"token": token, "user": user_obj}

# Modules endpoints
@api_router.get("/modules", response_model=List[Module])
async def get_modules():
    modules = await db.modules.find().sort("order", 1).to_list(1000)
    return [Module(**module) for module in modules]

@api_router.get("/modules/{module_id}", response_model=Module)
async def get_module(module_id: str):
    module = await db.modules.find_one({"id": module_id})
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return Module(**module)

# User progress endpoints
@api_router.get("/progress")
async def get_user_progress(current_user: User = Depends(get_current_user)):
    progress = await db.user_progress.find({"user_id": current_user.id}).to_list(1000)
    return [UserProgress(**p) for p in progress]

@api_router.post("/progress/{module_id}/start")
async def start_module(module_id: str, current_user: User = Depends(get_current_user)):
    # Update progress
    update_data = {
        "status": ModuleStatus.IN_PROGRESS,
        "start_date": datetime.utcnow()
    }
    
    result = await db.user_progress.update_one(
        {"user_id": current_user.id, "module_id": module_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    return {"message": "Module started successfully"}

@api_router.post("/progress/{module_id}/complete-lesson/{lesson_id}")
async def complete_lesson(
    module_id: str, 
    lesson_id: str, 
    current_user: User = Depends(get_current_user)
):
    # Get current progress
    progress = await db.user_progress.find_one({
        "user_id": current_user.id, 
        "module_id": module_id
    })
    
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    # Add lesson to completed if not already there
    completed_lessons = progress.get("completed_lessons", [])
    if lesson_id not in completed_lessons:
        completed_lessons.append(lesson_id)
    
    # Get module to calculate progress
    module = await db.modules.find_one({"id": module_id})
    if module:
        total_lessons = len(module.get("lessons", []))
        progress_percentage = int((len(completed_lessons) / total_lessons) * 100) if total_lessons > 0 else 0
        
        # Check if module is completed
        status = ModuleStatus.COMPLETED if progress_percentage == 100 else ModuleStatus.IN_PROGRESS
        completion_date = datetime.utcnow() if status == ModuleStatus.COMPLETED else None
        
        update_data = {
            "completed_lessons": completed_lessons,
            "progress_percentage": progress_percentage,
            "status": status
        }
        
        if completion_date:
            update_data["completion_date"] = completion_date
        
        await db.user_progress.update_one(
            {"user_id": current_user.id, "module_id": module_id},
            {"$set": update_data}
        )
        
        # Create certificate if completed
        if status == ModuleStatus.COMPLETED:
            certificate = Certificate(
                user_id=current_user.id,
                module_id=module_id,
                certificate_url=f"/certificates/{current_user.id}/{module_id}"
            )
            await db.certificates.insert_one(certificate.dict())
    
    return {"message": "Lesson completed successfully"}

# Dashboard endpoints
@api_router.get("/dashboard")
async def get_dashboard(current_user: User = Depends(get_current_user)):
    # Get user progress
    progress = await db.user_progress.find({"user_id": current_user.id}).to_list(1000)
    
    # Get modules
    modules = await db.modules.find().sort("order", 1).to_list(1000)
    
    # Calculate stats
    total_modules = len(modules)
    completed_modules = len([p for p in progress if p.get("status") == ModuleStatus.COMPLETED])
    in_progress_modules = len([p for p in progress if p.get("status") == ModuleStatus.IN_PROGRESS])
    
    # Get certificates
    certificates = await db.certificates.find({"user_id": current_user.id}).to_list(1000)
    
    # Combine module info with progress
    modules_with_progress = []
    for module in modules:
        module_progress = next((p for p in progress if p.get("module_id") == module["id"]), None)
        module_data = Module(**module).dict()
        if module_progress:
            module_data["progress"] = UserProgress(**module_progress).dict()
        else:
            module_data["progress"] = UserProgress(
                user_id=current_user.id,
                module_id=module["id"]
            ).dict()
        modules_with_progress.append(module_data)
    
    return {
        "user": current_user,
        "modules": modules_with_progress,
        "stats": {
            "total_modules": total_modules,
            "completed_modules": completed_modules,
            "in_progress_modules": in_progress_modules,
            "certificates_count": len(certificates),
            "total_study_time": sum([p.get("time_spent", 0) for p in progress])
        }
    }

# Payment endpoints will be added here

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await init_modules()
    logger.info("ConfianceBoost API started successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()