# Contracts de l'API - ConfianceBoost Formation

## API Endpoints à implémenter

### 1. **Modules API**
```
GET /api/modules
- Récupère tous les modules de formation
- Response: Array<Module>

GET /api/modules/{id}
- Récupère un module spécifique
- Response: Module

PUT /api/modules/{id}/progress
- Met à jour la progression d'un module
- Body: { progress: number, completed: boolean }
- Response: Module
```

### 2. **Utilisateurs API**
```
GET /api/user/profile
- Récupère le profil utilisateur
- Response: User

PUT /api/user/profile
- Met à jour le profil utilisateur
- Body: { name: string, email: string }
- Response: User

GET /api/user/progress
- Récupère la progression globale
- Response: { totalProgress: number, completedModules: number }
```

### 3. **Exercices API**
```
GET /api/modules/{id}/exercises
- Récupère les exercices d'un module
- Response: Array<Exercise>

POST /api/exercises/{id}/complete
- Marque un exercice comme terminé
- Body: { completed: boolean }
- Response: Exercise
```

### 4. **Certificats API**
```
GET /api/certificates
- Récupère les certificats de l'utilisateur
- Response: Array<Certificate>

POST /api/certificates/generate
- Génère un certificat de fin de formation
- Response: Certificate
```

## Modèles de données

### Module
```typescript
{
  id: number,
  title: string,
  description: string,
  duration: string,
  lessons: number,
  completed: boolean,
  progress: number,
  content: {
    introduction: string,
    video_url?: string,
    exercises: string[]
  }
}
```

### User
```typescript
{
  id: number,
  name: string,
  email: string,
  enrollmentDate: string,
  completedModules: number,
  totalProgress: number,
  certificates: number
}
```

### Exercise
```typescript
{
  id: number,
  moduleId: number,
  description: string,
  completed: boolean,
  completedAt?: string
}
```

### Certificate
```typescript
{
  id: number,
  userId: number,
  title: string,
  completedAt: string,
  downloadUrl: string
}
```

## Données mockées à remplacer

### Dans mock.js
- `mockModules` → API call to `/api/modules`
- `mockUser` → API call to `/api/user/profile`
- `mockTestimonials` → Garder en statique (pas besoin d'API)
- `mockStats` → API call to `/api/stats`

## Intégration Frontend/Backend

### HomePage.js
- Remplacer `mockModules, mockStats` par appels API
- Garder `mockTestimonials` en statique

### DashboardPage.js
- Remplacer `mockUser` par `/api/user/profile`
- Remplacer `mockModules` par `/api/modules`
- Ajouter gestion des states de loading

### ModulePage.js
- Récupérer le module via `/api/modules/{id}`
- Sauvegarder la progression via `/api/modules/{id}/progress`
- Gérer les exercices via `/api/exercises`

## Gestion des erreurs
- Loading states pendant les appels API
- Messages d'erreur utilisateur
- Fallback vers données mockées si API indisponible
- Toast notifications pour les actions

## Sécurité
- Validation des données côté backend
- Gestion des permissions utilisateur
- Sanitisation des inputs
- Rate limiting sur les endpoints

## Base de données MongoDB
- Collection `modules` pour les modules de formation
- Collection `users` pour les profils utilisateur
- Collection `exercises` pour les exercices
- Collection `certificates` pour les certificats
- Collection `user_progress` pour le suivi des progressions