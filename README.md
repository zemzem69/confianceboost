# ConfianceBoost - Formation Premium sur la Confiance en Soi

## 🎯 Description
ConfianceBoost est une plateforme de formation premium conçue pour aider les utilisateurs à développer leur confiance en soi à travers 6 modules progressifs et interactifs.

## ✨ Fonctionnalités

### 🏠 Page d'accueil
- Design professionnel noir et doré mobile-first
- Hero section avec CTA clair
- Présentation des 6 modules de formation
- Témoignages clients authentiques
- Statistiques de la plateforme
- Section pricing attractive (97€)

### 📊 Dashboard utilisateur
- Vue d'ensemble de la progression personnalisée
- Cartes des modules avec statuts (terminé/en cours/à commencer)
- Statistiques personnelles (temps total, certificats)
- Système de progression visuel
- Interface responsive optimisée mobile

### 📚 Pages de modules détaillées
- Contenu structuré par onglets (contenu, exercices, ressources)
- Système de progression en temps réel
- Exercices pratiques interactifs
- Vidéos d'introduction
- Ressources complémentaires

### 🎓 6 Modules de formation complets
1. **Comprendre sa valeur personnelle** (45 min, 6 leçons)
2. **Surmonter le syndrome de l'imposteur** (60 min, 8 leçons)
3. **Développer son assertivité** (50 min, 7 leçons)
4. **Gérer l'anxiété sociale** (55 min, 6 leçons)
5. **Cultiver l'estime de soi** (65 min, 9 leçons)
6. **Prendre des décisions avec confiance** (40 min, 5 leçons)

## 🏗️ Architecture technique

### Frontend (React)
- **Framework**: React 19 avec Create React App
- **Routing**: React Router DOM 7.5.1
- **UI Components**: Shadcn/ui avec Radix UI
- **Styling**: Tailwind CSS avec design system personnalisé
- **State Management**: React Hooks + Custom hooks pour API
- **Responsive Design**: Mobile-first avec breakpoints optimisés

### Backend (FastAPI)
- **Framework**: FastAPI 0.110.1
- **Base de données**: MongoDB avec Motor (async)
- **API**: RESTful avec préfixe `/api`
- **Validation**: Pydantic models
- **CORS**: Configuré pour le frontend

### Base de données (MongoDB)
- **Collections**:
  - `modules`: Modules de formation
  - `users`: Profils utilisateur
  - `exercises`: Exercices pratiques
  - `certificates`: Certificats de réussite
  - `user_progress`: Suivi des progressions

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 16+ 
- Python 3.11+
- MongoDB
- Yarn (recommandé)

### Installation
```bash
# Clone le repository
git clone <repository-url>
cd confianceboost

# Installation frontend
cd frontend
yarn install

# Installation backend
cd ../backend
pip install -r requirements.txt
```

### Configuration
1. **Frontend** (`/frontend/.env`):
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

2. **Backend** (`/backend/.env`):
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=confianceboost_db
```

### Démarrage en développement
```bash
# Terminal 1 - Backend
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 2 - Frontend  
cd frontend
yarn start
```

L'application sera accessible sur `http://localhost:3000`

## 📡 API Endpoints

### Modules
- `GET /api/modules` - Récupérer tous les modules
- `GET /api/modules/{id}` - Récupérer un module spécifique
- `PUT /api/modules/{id}/progress` - Mettre à jour la progression

### Utilisateur
- `GET /api/user/profile` - Profil utilisateur
- `PUT /api/user/profile` - Mettre à jour le profil
- `GET /api/user/progress` - Progression globale

### Exercices & Certificats
- `GET /api/modules/{id}/exercises` - Exercices d'un module
- `POST /api/exercises/{id}/complete` - Marquer un exercice terminé
- `GET /api/certificates` - Certificats utilisateur
- `POST /api/certificates/generate` - Générer un certificat

### Statistiques
- `GET /api/stats` - Statistiques de la plateforme

## 🎨 Design System

### Couleurs
- **Primary**: Noir profond (#000000, #1a1a1a)
- **Secondary**: Or/Jaune (#FFD700, #FFA500, #FF8C00)
- **Success**: Vert (#10B981, #059669)
- **Background**: Gradients noir avec accents dorés subtils

### Typographie
- **Primary**: Inter (corps de texte)
- **Display**: Poppins (titres et éléments importants)
- **Weights**: 400-900 avec variations

### Composants
- Cards avec glass morphism
- Boutons avec effets 3D subtils
- Progress bars animées
- Badges premium
- Animations fluides

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px-1024px  
- **Desktop**: > 1024px

### Optimisations mobile
- Navigation simplifiée
- Touch-friendly interactions
- Typography responsive avec clamp()
- Grid layouts adaptatifs
- Performance optimisée

## 🔧 Scripts disponibles

### Frontend
```bash
yarn start      # Développement
yarn build      # Production
yarn test       # Tests
```

### Backend
```bash
python server.py              # Démarrage serveur
python backend_test.py         # Tests API
```

## 📝 Structure des fichiers

```
/
├── frontend/
│   ├── src/
│   │   ├── components/ui/     # Composants Shadcn
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Pages de l'app
│   │   ├── services/         # API services
│   │   └── components/mock.js # Données mock
│   ├── public/
│   └── package.json
├── backend/
│   ├── server.py            # Serveur FastAPI
│   ├── models.py            # Modèles Pydantic
│   ├── database.py          # Connexion MongoDB
│   └── requirements.txt
├── contracts.md             # Contrats API
└── README.md
```

## 🧪 Tests

### Backend
Suite de tests complète avec `backend_test.py`:
- Tests de tous les endpoints
- Validation des modèles
- Tests de base de données
- Gestion d'erreurs

### Frontend
- Tests des hooks personnalisés
- Tests d'intégration API
- Tests de composants

## 🚀 Déploiement

### Options de déploiement

1. **Emergent Platform** (Recommandé)
   - Déploiement en 1 clic
   - Domaine personnalisé possible
   - 50 crédits/mois

2. **Serveurs personnels**
   - Frontend: Vercel, Netlify
   - Backend: Railway, Render, AWS
   - Base de données: MongoDB Atlas

3. **Docker** (Configuration incluse)
   ```bash
   docker-compose up -d
   ```

## 📄 Licence

Propriété privée - Tous droits réservés

## 👥 Support

Pour toute question ou assistance:
- Documentation API: `/api/docs` (FastAPI auto-docs)
- Issues GitHub: Créer une issue
- Email: support@confianceboost.fr

---

## 🎉 Fonctionnalités Premium

✅ **Site complet et fonctionnel**
✅ **Design professionnel mobile-first**  
✅ **6 modules de formation détaillés**
✅ **API REST complète**
✅ **Base de données MongoDB**
✅ **Système de progression en temps réel**
✅ **Interface responsive optimisée**
✅ **Tests backend complets**
✅ **Documentation complète**

**ConfianceBoost est prêt pour la production ! 🚀**