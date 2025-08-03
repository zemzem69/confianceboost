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

class PaymentRequest(BaseModel):
    user_email: str
    user_name: str

class PaymentVerification(BaseModel):
    checkout_id: str

class PremiumActivation(BaseModel):
    user_id: str
    order_id: str
    checkout_id: str

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
                "description": "Découvrez votre valeur intrinsèque et développez une confiance authentique basée sur vos qualités uniques. Apprenez à reconnaître votre worth dans toutes les situations de la vie.",
                "duration": 45,
                "lessons_count": 6,
                "order": 1,
                "icon": "👤",
                "color": "bg-gradient-to-r from-yellow-400 to-yellow-600",
                "lessons": [
                    {"id": str(uuid.uuid4()), "title": "Qu'est-ce que la valeur personnelle ?", "duration": 8, "content": "La valeur personnelle est la base de votre confiance en soi. C'est la reconnaissance profonde de votre worth intrinsèque en tant qu'être humain, indépendamment de vos réussites, échecs ou opinions des autres. Cette leçon vous aide à comprendre que votre valeur ne fluctue pas selon les circonstances externes. Vous apprendrez à distinguer entre l'estime conditionnelle (basée sur les performances) et la valeur inconditionnelle (votre essence même). Des exercices pratiques vous permettront d'identifier vos croyances limitantes sur votre propre valeur et de les transformer en convictions empowering.", "order": 1},
                    {"id": str(uuid.uuid4()), "title": "Identifier vos forces uniques", "duration": 10, "content": "Chaque personne possède un cocktail unique de talents, qualités et forces personnelles. Cette leçon vous guide dans une exploration approfondie de vos atouts naturels, souvent invisibles à vos propres yeux. Vous découvrirez comment vos expériences passées, même difficiles, ont forgé des compétences exceptionnelles. L'objectif est de créer votre 'portfolio de forces' - un inventaire complet de ce qui vous rend unique et précieux. Vous apprendrez aussi à recevoir les compliments et reconnaissances sans les minimiser, renforçant ainsi votre sentiment de compétence et votre confiance naturelle.", "order": 2},
                    {"id": str(uuid.uuid4()), "title": "Comprendre l'autocritique destructive", "duration": 7, "content": "L'autocritique excessive est l'ennemi numéro un de la confiance en soi. Cette leçon décortique les mécanismes de votre critique intérieur, cette voix qui sabote vos efforts et minimise vos succès. Vous apprendrez à identifier les patterns de pensées négatives automatiques, à comprendre leur origine (famille, école, société) et à développer des stratégies pour les neutraliser. La différence entre critique constructive (qui aide à grandir) et destructive (qui paralyse) sera clairement établie. Des techniques de recadrage cognitif vous permettront de transformer votre dialogue intérieur en allié bienveillant.", "order": 3},
                    {"id": str(uuid.uuid4()), "title": "Développer l'auto-compassion", "duration": 8, "content": "L'auto-compassion est un pilier fondamental de la confiance durable. Cette leçon vous enseigne à vous traiter avec la même bienveillance que vous accorderiez à votre meilleur ami en difficulté. Vous découvrirez les trois composantes de l'auto-compassion selon Kristin Neff : la bonté envers soi, la conscience de l'humanité commune (vous n'êtes pas seul dans vos difficultées), et la pleine conscience de vos émotions. Des exercices pratiques vous apprendront à remplacer l'auto-flagellation par l'auto-encouragement, créant un environnement intérieur propice à la croissance et à la confiance.", "order": 4},
                    {"id": str(uuid.uuid4()), "title": "Vos valeurs fondamentales", "duration": 6, "content": "Vos valeurs sont votre boussole intérieure, le fondement d'une confiance authentique et stable. Cette leçon vous guide dans l'identification de vos valeurs profondes - ces principes qui donnent du sens à votre existence. Quand vos actions sont alignées avec vos valeurs, votre confiance devient naturelle et inébranlable. Vous apprendrez à distinguer entre les valeurs imposées par l'extérieur et celles qui résonnent vraiment avec votre essence. Un processus structuré vous aidera à hiérarchiser vos valeurs et à les intégrer dans vos décisions quotidiennes, renforçant votre sentiment d'intégrité et d'authenticité.", "order": 5},
                    {"id": str(uuid.uuid4()), "title": "Célébrer ses victoires", "duration": 6, "content": "Savoir reconnaître et célébrer vos succès, même les plus petits, est crucial pour maintenir et développer votre confiance. Cette leçon vous apprend l'art de la reconnaissance personnelle et de la célébration constructive. Vous découvrirez pourquoi beaucoup de personnes minimisent leurs réussites et comment cette habitude sabote leur confiance. Des stratégies pratiques vous seront enseignées pour créer un rituel de célébration personnelle, tenir un journal de victoires, et partager vos succès de manière appropriée. L'objectif est de créer un cycle positif où chaque réussite nourrit votre confiance pour les défis suivants.", "order": 6}
                ],
                "exercises": [
                    {"id": str(uuid.uuid4()), "title": "Journal de gratitude personnelle", "description": "Développez une reconnaissance profonde de vos qualités uniques", "instructions": "Chaque soir pendant 21 jours, écrivez 3 qualités personnelles ou actions dont vous êtes fier(e) aujourd'hui. Incluez des détails sur pourquoi ces éléments reflètent votre valeur intrinsèque. Notez aussi comment ces qualités ont eu un impact positif sur vous ou les autres.", "type": "written"},
                    {"id": str(uuid.uuid4()), "title": "Inventaire des forces", "description": "Créez une cartographie complète de vos atouts", "instructions": "Listez vos 15 principales qualités en consultant 3 proches de confiance. Pour chaque force identifiée, trouvez 2 exemples concrets où elle s'est manifestée dans votre vie. Créez ensuite votre 'CV de qualités' - un document que vous pouvez consulter dans les moments de doute.", "type": "practical"}
                ],
                "resources": ["Guide PDF: Comprendre et cultiver sa valeur personnelle", "Méditation guidée de 15 min: Se connecter à sa valeur intrinsèque", "Checklist d'auto-évaluation: Mes forces cachées", "Audio bonus: Comment recevoir les compliments"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Surmonter le syndrome de l'imposteur",
                "description": "Libérez-vous définitivement de cette voix intérieure qui vous murmure que vous ne méritez pas votre succès. Transformez vos doutes en force motrice pour une confiance authentique et assumée.",
                "duration": 60,
                "lessons_count": 8,
                "order": 2,
                "icon": "🎭",
                "color": "bg-gradient-to-r from-purple-400 to-purple-600",
                "lessons": [
                    {"id": str(uuid.uuid4()), "title": "Décrypter le syndrome de l'imposteur", "duration": 8, "content": "Le syndrome de l'imposteur touche 70% des personnes à un moment de leur vie, particulièrement celles qui réussissent. Cette sensation persistante d'être un fraudeur, malgré des preuves objectives de compétence, peut paralyser votre confiance et limiter votre potentiel. Vous découvrirez les mécanismes psychologiques derrière ce phénomène, son impact sur votre estime de soi et votre performance. Cette leçon démystifie totalement ce syndrome pour vous aider à le reconnaître et le nommer quand il apparaît, première étape cruciale pour le surmonter.", "order": 1},
                    {"id": str(uuid.uuid4()), "title": "Les 5 visages du syndrome de l'imposteur", "duration": 10, "content": "Le Dr Valerie Young a identifié 5 profils distincts d'imposteurs, chacun avec ses propres triggers et stratégies de guérison. Le Perfectionniste ne tolère aucune erreur, l'Expert croit devoir tout savoir, le Soliste refuse l'aide, le Génie naturel pense que tout devrait être facile, et le Surhomme/Superfemme essaie d'exceller dans tous les domaines. Identifier votre profil dominant vous permettra d'appliquer des stratégies ciblées et efficaces. Vous apprendrez aussi comment ces profils peuvent se combiner et évoluer selon les contextes de votre vie.", "order": 2},
                    {"id": str(uuid.uuid4()), "title": "Identifier vos déclencheurs personnels", "duration": 7, "content": "Chaque personne a des situations spécifiques qui réveillent son syndrome de l'imposteur : une promotion, une nouvelle responsabilité, un compliment, une critique... Cette leçon vous aide à mapper vos déclencheurs personnels avec précision. Vous apprendrez à anticiper ces moments vulnérables et à préparer des stratégies de réponse adaptées. L'objectif est de passer de la réaction subie à l'action consciente, transformant vos triggers en opportunités de croissance personnelle et de renforcement de votre confiance.", "order": 3},
                    {"id": str(uuid.uuid4()), "title": "Restructurer vos pensées d'imposteur", "duration": 8, "content": "Vos pensées créent votre réalité émotionnelle. Cette leçon approfondie vous enseigne les techniques de restructuration cognitive spécifiquement adaptées au syndrome de l'imposteur. Vous apprendrez à identifier les distorsions cognitives typiques ('Je ne mérite pas ce poste', 'Ils vont découvrir que je ne sais rien'), à les challenger avec des questions puissantes, et à les remplacer par des pensées réalistes et bienveillantes. Des outils concrets comme la technique des 3 colonnes et le questionnement socratique vous donneront un contrôle total sur votre dialogue intérieur.", "order": 4},
                    {"id": str(uuid.uuid4()), "title": "Construire votre dossier de preuves", "duration": 7, "content": "L'imposteur se nourrit de l'oubli de vos réussites et de l'amplification de vos échecs. Cette leçon vous guide dans la création d'un 'dossier de fierté' - une collection tangible et régulièrement mise à jour de vos accomplissements, compétences, et preuves de votre valeur professionnelle. Vous apprendrez à documenter non seulement vos grands succès, mais aussi vos petites victoires quotidiennes, vos apprentissages, et les impacts positifs que vous avez sur les autres. Ce dossier devient votre antidote personnel contre les doutes et une source de confiance constamment renouvelée.", "order": 5},
                    {"id": str(uuid.uuid4()), "title": "Maîtriser l'art de recevoir les compliments", "duration": 6, "content": "Beaucoup de personnes souffrant du syndrome de l'imposteur ont une capacité limitée à recevoir et intégrer les compliments et reconnaissances. Cette leçon transforme votre relation aux feedbacks positifs. Vous découvrirez pourquoi vous minimisez, déviez ou rejetez automatiquement les compliments, et comment cette habitude renforce votre sentiment d'imposture. Des techniques spécifiques vous apprendront à recevoir, apprécier et intégrer pleinement les reconnaissances, les transformant en carburant pour votre confiance plutôt qu'en source d'inconfort.", "order": 6},
                    {"id": str(uuid.uuid4()), "title": "Oser partager vos vulnérabilités", "duration": 7, "content": "Paradoxalement, partager vos doutes et incertitudes peut considérablement renforcer votre confiance et désarmer le syndrome de l'imposteur. Cette leçon vous enseigne l'art de la vulnérabilité authentique - comment, quand et avec qui partager vos questionnements de manière constructive. Vous découvrirez que la vulnérabilité bien exprimée crée des connexions plus profondes, humanise votre image, et vous libère du poids du perfectionnisme. Des stratégies concrètes vous aideront à trouver votre zone de confort dans l'authenticité.", "order": 7},
                    {"id": str(uuid.uuid4()), "title": "Transformer l'échec en tremplin", "duration": 7, "content": "Pour l'imposteur, chaque erreur confirme sa 'supercherie'. Cette leçon révolutionnaire redéfinit complètement votre relation à l'échec et aux erreurs. Vous apprendrez à voir les revers comme des informations précieuses, des étapes naturelles de tout processus d'apprentissage et de croissance. Des techniques puissantes vous permettront d'extraire les leçons de chaque expérience difficile, de maintenir votre confiance face aux obstacles, et même d'utiliser vos 'échecs' comme preuves de votre courage et de votre capacité d'évolution. L'échec devient alors un allié dans votre développement personnel.", "order": 8}
                ],
                "exercises": [
                    {"id": str(uuid.uuid4()), "title": "Test d'identification du syndrome", "description": "Évaluez votre niveau et type de syndrome de l'imposteur", "instructions": "Répondez honnêtement aux 25 questions du questionnaire scientifiquement validé. Pour chaque réponse, ajoutez un exemple concret de votre vie. Analysez vos résultats pour identifier votre profil dominant et les domaines prioritaires à travailler.", "type": "reflection"},
                    {"id": str(uuid.uuid4()), "title": "Création de votre dossier de réussites", "description": "Compilez vos preuves tangibles de compétence", "instructions": "Rassemblez sur 30 jours tous vos éléments de réussite : emails de remerciements, évaluations positives, projets réussis, témoignages clients, diplômes, certifications. Organisez-les par catégories et créez un document digital facilement accessible. Ajoutez pour chaque élément le contexte et votre contribution spécifique.", "type": "practical"}
                ],
                "resources": ["Questionnaire scientifique d'auto-évaluation", "Template dossier de réussites personnalisé", "Audio: 20 affirmations anti-imposteur", "Guide PDF: Gérer le syndrome dans 7 situations courantes", "Vidéo bonus: Témoignages de personnes qui ont surmonté leur syndrome"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Développer son assertivité",
                "description": "Maîtrisez l'art de vous exprimer avec clarté, respect et fermeté. Apprenez à faire valoir vos besoins et opinions tout en préservant vos relations, pour une confiance relationnelle inébranlable.",
                "duration": 50,
                "lessons_count": 7,
                "order": 3,
                "icon": "💪",
                "color": "bg-gradient-to-r from-green-400 to-green-600",
                "lessons": [
                    {"id": str(uuid.uuid4()), "title": "Les fondements de l'assertivité", "duration": 8, "content": "L'assertivité est l'équilibre parfait entre passivité et agressivité - un mode de communication qui respecte à la fois vos droits et ceux des autres. Cette leçon fondamentale établit les bases de ce concept crucial pour votre confiance relationnelle. Vous découvrirez les 4 styles de communication (passif, agressif, passif-agressif, assertif) avec leurs impacts sur vos relations et votre estime de soi. L'assertivité n'est pas innée - c'est une compétence qui se développe et qui transforme radicalement votre capacité à naviguer les relations humaines avec confiance et authenticité.", "order": 1},
                    {"id": str(uuid.uuid4()), "title": "Diagnostic de votre style communicationnel", "duration": 7, "content": "Avant de développer votre assertivité, il est crucial de comprendre votre style actuel de communication et ses origines. Cette auto-évaluation approfondie vous révèle vos patterns automatiques dans différents contextes : travail, famille, amis, situations de conflit. Vous identifierez vos zones de force et vos points de vulnérabilité, comprenant comment votre histoire personnelle a façonné vos réflexes communicationnels. Cette prise de conscience est le premier pas vers un changement durable et choisi de votre façon d'interagir avec les autres.", "order": 2},
                    {"id": str(uuid.uuid4()), "title": "La technique du disque rayé et ses variantes", "duration": 6, "content": "Maintenir votre position face à la pression, manipulation ou insistance excessive demande une technique spécifique et rodée. Le 'disque rayé' et ses variantes sophistiquées vous permettent de rester ferme sur vos décisions tout en gardant votre calme et votre bienveillance. Vous apprendrez à répéter votre message de manière variée, à résister aux tentatives de détournement de conversation, et à maintenir votre position sans vous justifier excessivement. Cette technique devient particulièrement puissante quand elle est combinée avec une communication non-verbale cohérente.", "order": 3},
                    {"id": str(uuid.uuid4()), "title": "L'art de dire non avec élégance", "duration": 8, "content": "Dire non est un superpouvoir qui protège votre temps, votre énergie et vos priorités. Cette leçon transforme votre relation au refus, souvent source de culpabilité et d'anxiété. Vous découvrirez pourquoi dire non est un acte de respect - envers vous-même et envers l'autre. Des formules concrètes vous aideront à refuser avec tact selon différentes situations : demandes professionnelles, sollicitations personnelles, pressions sociales. Vous apprendrez aussi à proposer des alternatives quand c'est approprié, maintenant ainsi la qualité de vos relations tout en préservant vos limites.", "order": 4},
                    {"id": str(uuid.uuid4()), "title": "Formuler des demandes claires et persuasives", "duration": 7, "content": "Savoir demander ce dont vous avez besoin de manière précise et respectueuse est une compétence fondamentale de l'assertivité. Cette leçon vous enseigne la structure optimale d'une demande efficace : contexte, besoin spécifique, bénéfice mutuel, et appel à l'action. Vous apprendrez à distinguer entre demandes et exigences, à choisir le moment et le lieu appropriés, et à adapter votre approche selon votre interlocuteur. Des techniques de négociation bienveillante vous permettront d'augmenter significativement vos chances d'obtenir ce que vous demandez tout en renforçant vos relations.", "order": 5},
                    {"id": str(uuid.uuid4()), "title": "Recevoir et donner des feedbacks constructifs", "duration": 7, "content": "Les feedbacks sont des cadeaux précieux pour votre croissance, mais donner et recevoir des critiques constructives demande de l'assertivité et du tact. Cette leçon vous fournit des frameworks éprouvés pour ces échanges délicats. Vous apprendrez la méthode DISO (Décrire, Impact, Suggestion, Ouverture) pour donner des feedbacks efficaces, et des techniques de réceptivité pour accueillir les critiques sans vous braquer ni vous effondrer. L'objectif est de transformer ces moments potentiellement tendus en opportunités de connexion et d'amélioration mutuelle.", "order": 6},
                    {"id": str(uuid.uuid4()), "title": "Assertivité en situation de conflit", "duration": 7, "content": "Les conflits sont inévitables dans les relations humaines, mais votre réaction détermine leur issue. Cette leçon avancée vous prépare à maintenir votre assertivité même dans les situations les plus tendues. Vous découvrirez comment désamorcer l'agressivité par la technique du 'brouillard', comment utiliser l'écoute active pour calmer les tensions, et comment rechercher des solutions gagnant-gagnant même dans l'adversité. Des stratégies spécifiques vous aideront à gérer les personnalités difficiles tout en préservant votre intégrité et votre confiance en vous.", "order": 7}
                ],
                "exercises": [
                    {"id": str(uuid.uuid4()), "title": "Journal d'assertivité quotidienne", "description": "Développez votre conscience assertive au quotidien", "instructions": "Pendant 21 jours, documentez chaque soir 2 situations où vous avez été (ou pas) assertif. Analysez : Quel était l'enjeu ? Comment avez-vous réagi ? Qu'auriez-vous pu dire/faire différemment ? Quel impact sur votre confiance ? Notez vos progrès et ajustez vos stratégies.", "type": "written"},
                    {"id": str(uuid.uuid4()), "title": "Simulations d'assertivité", "description": "Pratiquez l'assertivité en situation réelle", "instructions": "Utilisez nos 15 scenarios de jeux de rôle progressifs : refuser une demande excessive, négocier une augmentation, résoudre un conflit familial, etc. Enregistrez-vous ou pratiquez avec un proche. Évaluez votre langage verbal et non-verbal. Répétez jusqu'à ce que les réponses assertives deviennent naturelles.", "type": "practical"}
                ],
                "resources": ["Scripts de phrases assertives pour 20 situations courantes", "Vidéo: Langage corporel assertif - les 7 clés", "Checklist avant conversation difficile", "Audio: Méditation pour renforcer sa présence assertive", "PDF: Comment gérer 10 types de personnalités difficiles"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Gérer l'anxiété sociale",
                "description": "Surmontez définitivement votre peur du jugement et transformez votre anxiété en aisance naturelle. Développez une confiance sociale authentique qui vous permettra de briller en toute situation.",
                "duration": 55,
                "lessons_count": 6,
                "order": 4,
                "icon": "🌟",
                "color": "bg-gradient-to-r from-blue-400 to-blue-600",
                "lessons": [
                    {"id": str(uuid.uuid4()), "title": "Comprendre l'anxiété sociale", "duration": 10, "content": "L'anxiété sociale touche 12% de la population et peut considérablement limiter votre épanouissement personnel et professionnel. Cette leçon détaillée explore les mécanismes neurologiques et psychologiques qui créent cette peur paralysante du jugement des autres. Vous découvrirez comment votre cerveau primitif confond situations sociales et menaces réelles, déclenchant des réactions de fuite ou de combat inappropriées. Comprendre ces processus automatiques est la première étape pour reprendre le contrôle de vos réactions et développer une confiance sociale authentique et durable.", "order": 1},
                    {"id": str(uuid.uuid4()), "title": "Cartographier vos triggers sociaux", "duration": 9, "content": "Chaque personne anxieuse socialement a ses propres déclencheurs spécifiques : prendre la parole en public, entrer dans une pièce remplie d'inconnus, passer un appel téléphonique, être le centre d'attention... Cette leçon vous guide dans la création de votre mapping personnel des situations anxiogènes. Vous apprendrez à graduer l'intensité de votre anxiété (échelle de 1 à 10) pour chaque situation, à identifier les pensées automatiques qui accompagnent chaque trigger, et à comprendre les évitements que vous avez développés. Cette cartographie précise devient votre plan de route pour un travail thérapeutique ciblé et efficace.", "order": 2},
                    {"id": str(uuid.uuid4()), "title": "Techniques de respiration anti-stress instantanées", "duration": 8, "content": "Votre respiration est votre outil le plus immédiat et puissant pour calmer votre système nerveux en situation sociale stressante. Cette leçon vous enseigne 5 techniques de respiration scientifiquement prouvées pour réduire instantanément votre anxiété : la respiration 4-7-8, la cohérence cardiaque, la respiration abdominale, la technique de la boîte, et la respiration alternée. Vous apprendrez à utiliser discrètement ces outils en situation réelle, à les adapter selon l'intensité de votre stress, et à les intégrer dans votre routine quotidienne pour maintenir un niveau d'anxiété de base plus bas.", "order": 3},
                    {"id": str(uuid.uuid4()), "title": "Restructuration cognitive des pensées sociales", "duration": 10, "content": "Vos pensées créent votre anxiété sociale. Cette leçon cruciale vous apprend à identifier et transformer les distorsions cognitives typiques de l'anxiété sociale : 'Tout le monde me regarde', 'Je vais dire quelque chose de stupide', 'Ils pensent que je suis bizarre'. Vous maîtriserez des techniques avancées de restructuration cognitive spécifiquement adaptées aux situations sociales. Le processus ABCDE (Adversité, Beliefs, Conséquences, Disputation, Energie) devient votre méthode systématique pour transformer l'anxiété anticipatoire en confiance réaliste. Des exercices concrets vous permettront d'automatiser ces nouveaux patterns de pensée.", "order": 4},
                    {"id": str(uuid.uuid4()), "title": "Programme d'exposition progressive", "duration": 9, "content": "L'évitement nourrit l'anxiété sociale. Cette leçon vous guide dans la création de votre programme personnalisé d'exposition graduelle aux situations sociales. Inspiré des thérapies comportementales les plus efficaces, ce processus vous fait progresser par étapes mesurées de vos situations les moins anxiogènes vers les plus intimidantes. Vous apprendrez à célébrer chaque petit pas, à gérer les rechutes temporaires, et à maintenir votre motivation sur le long terme. Chaque exposition réussie renforce votre confiance et élargit votre zone de confort social de manière durable.", "order": 5},
                    {"id": str(uuid.uuid4()), "title": "Développer vos compétences sociales authentiques", "duration": 9, "content": "Au-delà de la gestion de l'anxiété, cette leçon vous enseigne les compétences sociales concrètes qui nourrissent votre confiance relationnelle. Vous découvrirez l'art de la conversation naturelle : comment initier un échange, maintenir l'intérêt, poser des questions engageantes, et conclure élégamment. Les techniques d'écoute active, les signes non-verbaux d'engagement, et l'art du storytelling personnel sont autant d'outils qui transforment vos interactions de moments subis en plaisirs partagés. L'objectif est de développer votre style social authentique plutôt que de copier des techniques artificielles.", "order": 6}
                ],
                "exercises": [
                    {"id": str(uuid.uuid4()), "title": "Échelle d'exposition graduelle personnalisée", "description": "Créez votre programme sur mesure de désensibilisation", "instructions": "Listez 15 situations sociales par ordre croissant d'anxiété (1 = légère gêne, 10 = panique totale). Pour chaque situation, définissez 3 sous-étapes progressives. Exemple: Parler en réunion → 1.Poser une question, 2.Partager une opinion, 3.Présenter un projet. Pratiquez une sous-étape par semaine, documentez vos progrès et émotions.", "type": "practical"},
                    {"id": str(uuid.uuid4()), "title": "Journal des pensées sociales", "description": "Traquez et transformez vos pensées anxieuses", "instructions": "Pendant 3 semaines, notez avant/pendant/après chaque situation sociale: Situation → Pensée automatique → Émotion ressentie → Pensée alternative → Nouvelle émotion. Recherchez vos patterns récurrents. Créez votre 'banque de pensées aidantes' personnalisées pour les situations futures.", "type": "written"}
                ],
                "resources": ["Audio: Méditation anti-anxiété sociale (15 min)", "Guide des signaux sociaux: décoder le langage non-verbal", "Exercices de respiration en situation (guide pocket)", "PDF: 50 sujets de conversation universels", "Vidéo: Comment gérer les blancs dans la conversation"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Cultiver l'estime de soi",
                "description": "Construisez une estime de soi solide et inébranlable, indépendante du regard des autres et des circonstances extérieures. Développez un amour-propre authentique qui rayonne dans tous les aspects de votre vie.",
                "duration": 65,
                "lessons_count": 9,
                "order": 5,
                "icon": "❤️",
                "color": "bg-gradient-to-r from-pink-400 to-pink-600",
                "lessons": [
                    {"id": str(uuid.uuid4()), "title": "Estime de soi vs confiance en soi: comprendre la différence", "duration": 7, "content": "Beaucoup confondent estime de soi et confiance en soi, pourtant ces deux concepts sont distincts et complémentaires. L'estime de soi est votre évaluation globale de votre propre valeur - votre opinion sur qui vous êtes en tant que personne. La confiance en soi concerne votre perception de vos capacités dans des domaines spécifiques. Cette leçon fondamentale vous aide à comprendre cette distinction cruciale et explique pourquoi une estime de soi solide est la base d'une confiance durable. Vous découvrirez comment ces deux dimensions s'influencent mutuellement et s'alimentent dans un cercle vertueux de développement personnel.", "order": 1},
                    {"id": str(uuid.uuid4()), "title": "Les six piliers de l'estime de soi selon Nathaniel Branden", "duration": 8, "content": "Le psychologue Nathaniel Branden a identifié six pratiques fondamentales qui nourrissent une estime de soi authentique et durable. Cette leçon explore en profondeur chaque pilier : vivre consciemment (awareness), s'accepter soi-même, prendre ses responsabilités, s'affirmer, vivre intentionnellement, et maintenir son intégrité personnelle. Chaque pilier est illustré par des exemples concrets et accompagné d'exercices pratiques pour l'intégrer dans votre quotidien. Comprendre et appliquer ces six piliers transforme progressivement mais radicalement votre relation à vous-même et votre positionnement dans le monde.", "order": 2},
                    {"id": str(uuid.uuid4()), "title": "Développer l'acceptation inconditionnelle de soi", "duration": 7, "content": "L'acceptation de soi est souvent mal comprise - elle ne signifie pas résignation ou complaisance, mais reconnaissance bienveillante de votre réalité actuelle comme point de départ de votre croissance. Cette leçon vous guide vers une acceptation authentique de vos forces ET de vos faiblesses, de vos succès ET de vos échecs, de vos qualités ET de vos défauts. Vous apprendrez à distinguer entre acceptation (reconnaître ce qui est) et approbation (juger positivement), découvrant que l'acceptation est en fait le préalable indispensable à tout changement positif et durable de votre personnalité.", "order": 3},
                    {"id": str(uuid.uuid4()), "title": "Se libérer du piège de la comparaison", "duration": 8, "content": "La comparaison avec les autres est l'un des fléaux majeurs de l'estime de soi à l'ère des réseaux sociaux. Cette leçon vous révèle les mécanismes psychologiques qui vous poussent constamment à vous mesurer aux autres et vous enseigne des stratégies concrètes pour vous en libérer. Vous découvrirez la différence entre comparaison destructrice (qui diminue votre estime) et inspiration constructive (qui nourrit votre croissance). Des techniques de recadrage mental vous permettront de transformer votre regard sur les succès des autres, les voyant comme des preuves de possibilité plutôt que comme des menaces à votre valeur personnelle.", "order": 4},
                    {"id": str(uuid.uuid4()), "title": "Transformer votre critique intérieur en allié bienveillant", "duration": 7, "content": "Nous avons tous une voix intérieure qui commente nos actions, mais pour beaucoup cette voix est devenue un critique impitoyable qui sape l'estime de soi. Cette leçon révolutionnaire vous apprend à identifier les origines de cette voix critique (parents, enseignants, société), à comprendre son intention positive mal exprimée, et à la transformer progressivement en coach intérieur bienveillant. Vous découvrirez des techniques de dialogue intérieur constructif, l'art de l'auto-encouragement authentique, et comment maintenir des standards élevés tout en conservant une relation bienveillante avec vous-même lors des difficultés ou échecs.", "order": 5},
                    {"id": str(uuid.uuid4()), "title": "Établir des limites saines pour protéger votre estime", "duration": 8, "content": "Une estime de soi solide nécessite des boundaries claires avec les autres. Cette leçon vous enseigne l'art subtil mais crucial d'établir des limites qui protègent votre énergie, votre temps, et votre bien-être émotionnel. Vous apprendrez à identifier les situations et personnes qui drainent votre estime de soi, à communiquer vos limites de manière ferme mais respectueuse, et à maintenir ces boundaries même face à la résistance ou la manipulation. Établir des limites saines n'est pas de l'égoïsme - c'est un acte d'amour-propre qui bénéficie également à vos relations en les rendant plus authentiques et équilibrées.", "order": 6},
                    {"id": str(uuid.uuid4()), "title": "L'art de l'auto-soin et du self-care authentique", "duration": 7, "content": "Prendre soin de soi va bien au-delà des bains moussants et des soirées spa - c'est un système complet de pratiques qui nourrissent votre corps, votre esprit et votre âme. Cette leçon explore les dimensions multiples de l'auto-soin authentique : physique (sommeil, nutrition, exercice), émotionnel (gestion du stress, expression des émotions), mental (stimulation intellectuelle, repos cognitif), social (relations nourissantes, solitude choisie), et spirituel (sens, connexion à plus grand que soi). Vous créerez votre programme personnalisé d'auto-soin, adapté à votre style de vie, vos ressources, et vos besoins spécifiques.", "order": 7},
                    {"id": str(uuid.uuid4()), "title": "Capitaliser sur vos succès pour renforcer l'estime", "duration": 6, "content": "Beaucoup de personnes minimisent leurs réussites ou les attribuent à la chance, privant ainsi leur estime de soi du carburant naturel que constituent leurs accomplissements. Cette leçon vous apprend à reconnaître, célébrer, et capitaliser sur vos succès de manière à renforcer durablement votre estime personnelle. Vous découvrirez comment créer un 'portfolio de fierté' vivant, comment extraire les leçons d'estime de chaque réussite (même petite), et comment utiliser vos succès passés comme tremplin vers de nouveaux défis. L'objectif est de créer un cercle vertueux où chaque réussite nourrit votre estime, qui elle-même facilite de futures réussites.", "order": 8},
                    {"id": str(uuid.uuid4()), "title": "Maintenir et protéger votre estime au quotidien", "duration": 7, "content": "Construire l'estime de soi est un processus, la maintenir est un art quotidien. Cette leçon finale vous donne les outils et rituels pour protéger et nourrir votre estime de soi jour après jour, même face aux défis, critiques, et revers inévitables de la vie. Vous apprendrez à créer des micro-rituels d'estime (affirmations matinales personnalisées, pauses bienveillance, célébrations quotidiennes), à identifier et neutraliser rapidement les pensées et situations qui attaquent votre estime, et à maintenir une perspective équilibrée sur vous-même quelles que soient les circonstances externes. Cette pratique quotidienne fait de l'estime de soi non pas un état fragile mais un trait de caractère stable et résilient.", "order": 9}
                ],
                "exercises": [
                    {"id": str(uuid.uuid4()), "title": "Lettre d'amour à soi-même", "description": "Développez une relation bienveillante avec vous-même", "instructions": "Rédigez une lettre de 2 pages à vous-même avec la compassion et la bienveillance que vous accorderiez à votre meilleur ami traversant des difficultés. Incluez: vos qualités uniques, vos efforts reconnus, vos progrès célébrés, vos défis normalisés, et vos encouragements pour l'avenir. Relisez cette lettre lors des moments de doute.", "type": "written"},
                    {"id": str(uuid.uuid4()), "title": "Rituel quotidien d'estime de soi", "description": "Ancrez l'estime de soi dans vos habitudes", "instructions": "Créez et pratiquez pendant 30 jours un rituel matinal de 5 minutes combinant: 3 affirmations personnalisées basées sur vos valeurs, 1 minute de gratitude envers vous-même, et 1 intention positive pour la journée. Documentez l'évolution de votre état d'esprit et ajustez le rituel selon vos besoins.", "type": "practical"}
                ],
                "resources": ["Template lettre à soi personnalisé", "21 affirmations d'estime puissantes et scientifiquement validées", "Tracker d'estime quotidien (30 jours)", "Méditation guidée: Se connecter à sa valeur intrinsèque", "PDF: Comment répondre aux 15 critiques les plus courantes"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Prendre des décisions avec confiance",
                "description": "Développez votre capacité à prendre des décisions alignées, assumées et éclairées. Transformez l'indécision paralysante en pouvoir d'action, pour une vie dirigée par vos choix conscients plutôt que subis.",
                "duration": 40,
                "lessons_count": 5,
                "order": 6,
                "icon": "🎯",
                "color": "bg-gradient-to-r from-red-400 to-red-600",
                "lessons": [
                    {"id": str(uuid.uuid4()), "title": "Anatomie d'une décision: émotions et raison", "duration": 8, "content": "Chaque décision implique un dialogue complexe entre votre cerveau émotionnel (limbique) et votre cerveau rationnel (néocortex). Comprendre cette dynamique est crucial pour prendre des décisions équilibrées et assumées. Cette leçon explore les neurosciences de la prise de décision, révélant comment vos émotions ne sont pas des obstacles à la logique mais des sources d'information précieuses sur vos valeurs et besoins profonds. Vous apprendrez à identifier quand vos émotions vous guident sagement et quand elles vous égarent, développant ainsi une confiance naturelle dans votre processus décisionnel personnel.", "order": 1},
                    {"id": str(uuid.uuid4()), "title": "Surmonter la paralysie décisionnelle", "duration": 10, "content": "La paralysie décisionnelle touche particulièrement les perfectionnistes et les personnes anxieuses, créant un cercle vicieux où l'évitement de la décision devient plus problématique que n'importe quel mauvais choix. Cette leçon identifie les causes profondes de cette paralysie : peur de l'erreur, surcharge d'options (paradoxe du choix), perfectionnisme, peur du regret. Vous découvrirez des techniques concrètes pour débloquer ces situations : la règle des 40-70% d'information, la technique du pire scénario acceptable, et l'art de transformer les décisions réversibles en expérimentations. L'objectif est de passer de la recherche de la décision parfaite à la prise de décisions suffisamment bonnes et ajustables.", "order": 2},
                    {"id": str(uuid.uuid4()), "title": "Boîte à outils pour décider: méthodes et frameworks", "duration": 8, "content": "Cette leçon vous fournit une boîte à outils complète de méthodes de prise de décision adaptées à différents types de choix. Vous maîtriserez la matrice de décision pondérée pour les choix complexes, la technique des pros/cons évoluée, la règle 10-10-10 (impact dans 10 minutes, 10 mois, 10 ans), la méthode du coût d'opportunité, et le framework WRAP (Widen options, Reality-test assumptions, Attain distance, Prepare to be wrong). Chaque outil est accompagné d'exemples concrets et de templates pratiques que vous pourrez adapter à vos décisions personnelles et professionnelles.", "order": 3},
                    {"id": str(uuid.uuid4()), "title": "Cultiver et faire confiance à son intuition", "duration": 7, "content": "Votre intuition n'est pas magique - c'est votre intelligence inconsciente qui traite rapidement des milliers d'informations subtiles basées sur votre expérience et vos valeurs. Cette leçon vous apprend à distinguer entre vraie intuition (sagesse embodied) et impulsions émotionnelles, à cultiver votre capacité intuitive par la méditation et l'attention corporelle, et à intégrer harmonieusement intuition et analyse rationnelle. Vous découvrirez des techniques pour 'consulter' votre intuition (body scan, méditation décisionnelle, dialogue avec différentes parties de vous), créant ainsi un processus de décision holistique qui honore toute votre intelligence.", "order": 4},
                    {"id": str(uuid.uuid4()), "title": "Assumer et apprendre de ses choix", "duration": 7, "content": "La capacité à assumer pleinement vos décisions, même quand elles ne donnent pas les résultats espérés, est la marque d'une confiance décisionnelle mature. Cette leçon vous enseigne l'art de prendre la responsabilité de vos choix sans auto-flagellation, d'extraire les apprentissages de chaque décision (réussie ou non), et de maintenir votre confiance décisionnelle même face aux 'erreurs'. Vous apprendrez la différence entre regret toxique (qui paralyse) et regret constructif (qui enseigne), et comment développer la résilience décisionnelle qui vous permet de voir chaque choix comme une expérience d'apprentissage plutôt que comme un test de votre valeur personnelle.", "order": 5}
                ],
                "exercises": [
                    {"id": str(uuid.uuid4()), "title": "Journal de décisions et apprentissages", "description": "Développez votre intelligence décisionnelle", "instructions": "Pendant 6 semaines, documentez vos décisions importantes selon ce format: Contexte → Options considérées → Critères de choix → Décision prise → Méthode utilisée → Résultat → Apprentissage. Analysez vos patterns: Quelles méthodes vous conviennent le mieux? Quels types de décisions vous posent le plus de difficultés? Comment évolue votre confiance?", "type": "written"},
                    {"id": str(uuid.uuid4()), "title": "Challenge 30 jours de décisions rapides", "description": "Entraînez votre muscle décisionnel quotidien", "instructions": "Chaque jour, identifiez une petite décision que vous traînez (choix de restaurant, achat, organisation, etc.) et prenez-la en maximum 2 minutes avec nos frameworks. Commencez par des décisions à faible enjeu et augmentez progressivement la complexité. Objectif: réduire de 50% votre temps de décision habituel tout en maintenant la qualité.", "type": "practical"}
                ],
                "resources": ["Matrice de décision Excel personnalisable", "Quiz: Découvrez votre profil décisionnel", "Checklist avant grande décision (25 points)", "Audio: Méditation pour décisions difficiles", "Templates pour 10 types de décisions courantes"]
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

# Payment endpoints
@api_router.post("/payment/create-checkout")
async def create_checkout(payment_request: PaymentRequest):
    """Crée une URL de checkout Shopify pour la formation ConfianceBoost"""
    try:
        checkout_data = await shopify_integration.create_checkout_url(
            payment_request.user_email,
            payment_request.user_name
        )
        return checkout_data
    except Exception as e:
        logger.error(f"Erreur création checkout: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la création du checkout")

@api_router.post("/payment/verify")
async def verify_payment(verification: PaymentVerification):
    """Vérifie le statut d'un paiement"""
    try:
        payment_status = await shopify_integration.verify_payment(verification.checkout_id)
        return payment_status
    except Exception as e:
        logger.error(f"Erreur vérification paiement: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la vérification du paiement")

@api_router.post("/payment/activate-premium")
async def activate_premium(activation: PremiumActivation, current_user: User = Depends(get_current_user)):
    """Active le statut premium pour un utilisateur après paiement"""
    try:
        # Vérifier d'abord le paiement
        payment_status = await shopify_integration.verify_payment(activation.checkout_id)
        
        if not payment_status.get("is_paid", False):
            raise HTTPException(status_code=400, detail="Paiement non confirmé")
        
        # Activer le statut premium
        await db.users.update_one(
            {"id": current_user.id},
            {"$set": {"is_premium": True, "premium_activated_at": datetime.utcnow()}}
        )
        
        # Enregistrer la transaction
        transaction = {
            "id": str(uuid.uuid4()),
            "user_id": current_user.id,
            "order_id": activation.order_id,
            "checkout_id": activation.checkout_id,
            "amount": payment_status.get("total_price", "97.00"),
            "currency": payment_status.get("currency", "EUR"),
            "status": "completed",
            "created_at": datetime.utcnow()
        }
        await db.transactions.insert_one(transaction)
        
        return {"message": "Statut premium activé avec succès", "transaction_id": transaction["id"]}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur activation premium: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'activation premium")

@api_router.post("/webhook/shopify")
async def shopify_webhook(request: Request):
    """Endpoint pour recevoir les webhooks Shopify"""
    try:
        body = await request.body()
        signature = request.headers.get("X-Shopify-Hmac-Sha256", "")
        
        # Vérifier la signature (optionnel en mode démo)
        if not shopify_integration.verify_webhook(body, signature):
            logger.warning("Signature webhook invalide")
            # En mode démo, on continue quand même
        
        webhook_data = await request.json()
        result = await shopify_integration.handle_payment_webhook(webhook_data)
        
        if result.get("action") == "activate_premium":
            # Trouver l'utilisateur par email
            user = await db.users.find_one({"email": result["customer_email"]})
            if user:
                await db.users.update_one(
                    {"id": user["id"]},
                    {"$set": {"is_premium": True, "premium_activated_at": datetime.utcnow()}}
                )
                logger.info(f"Premium activé automatiquement pour {result['customer_email']}")
        
        return {"status": "ok", "processed": result}
        
    except Exception as e:
        logger.error(f"Erreur webhook Shopify: {e}")
        return {"status": "error", "message": str(e)}

# General stats endpoint
@api_router.get("/stats")
async def get_stats():
    total_users = await db.users.count_documents({})
    total_modules = await db.modules.count_documents({})
    total_certificates = await db.certificates.count_documents({})
    premium_users = await db.users.count_documents({"is_premium": True})
    
    # Calculate average completion rate
    if total_users > 0:
        completed_progresses = await db.user_progress.count_documents({"status": ModuleStatus.COMPLETED})
        total_progresses = await db.user_progress.count_documents({})
        average_completion_rate = (completed_progresses / total_progresses * 100) if total_progresses > 0 else 0
    else:
        average_completion_rate = 0
    
    return {
        "total_users": total_users,
        "premium_users": premium_users,
        "total_modules": total_modules,
        "total_certificates": total_certificates,
        "average_completion_rate": round(average_completion_rate, 1)
    }

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