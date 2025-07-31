from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Module Models
class ModuleContent(BaseModel):
    introduction: str
    video_url: Optional[str] = None
    exercises: List[str]

class Module(BaseModel):
    id: int
    title: str
    description: str
    duration: str
    lessons: int
    completed: bool = False
    progress: int = 0
    content: ModuleContent

class ModuleCreate(BaseModel):
    title: str
    description: str
    duration: str
    lessons: int
    content: ModuleContent

class ModuleProgressUpdate(BaseModel):
    progress: int = Field(ge=0, le=100)
    completed: bool = False

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    enrollmentDate: datetime = Field(default_factory=datetime.utcnow)
    completedModules: int = 0
    totalProgress: int = 0
    certificates: int = 0

class UserCreate(BaseModel):
    name: str
    email: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

# Exercise Models
class Exercise(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    moduleId: int
    description: str
    completed: bool = False
    completedAt: Optional[datetime] = None

class ExerciseCreate(BaseModel):
    moduleId: int
    description: str

class ExerciseComplete(BaseModel):
    completed: bool

# Certificate Models
class Certificate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    title: str
    completedAt: datetime = Field(default_factory=datetime.utcnow)
    downloadUrl: str

class CertificateCreate(BaseModel):
    userId: str
    title: str = "Certificat de Formation - Confiance en Soi"

# Progress Models
class UserProgress(BaseModel):
    userId: str
    totalProgress: int
    completedModules: int
    currentStreak: int = 0
    lastActivity: datetime = Field(default_factory=datetime.utcnow)

# Stats Models
class Stats(BaseModel):
    totalStudents: int
    completionRate: int
    averageRating: float
    moduleCount: int