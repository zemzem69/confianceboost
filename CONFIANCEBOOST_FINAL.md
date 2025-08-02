# 🚀 ConfianceBoost - Plateforme de Formation Premium

## 🎯 Description

ConfianceBoost est une plateforme de formation premium sur la confiance en soi, développée avec un design noir et doré professionnel. Elle propose 6 modules complets de formation avec système de paiement Shopify intégré.

## ✨ Fonctionnalités

### 🏠 Page d'accueil
- Design professionnel noir et doré mobile-first
- Présentation des 6 modules de formation
- Statistiques en temps réel
- Témoignages clients
- Call-to-action optimisés

### 🔐 Authentification
- Inscription et connexion sécurisée
- Gestion des sessions avec JWT
- Validation des données

### 📊 Dashboard utilisateur
- Vue d'ensemble personnalisée de la progression
- Cartes des modules avec statuts (non commencé/en cours/terminé)
- Statistiques personnelles (temps d'étude, certificats)
- Système freemium (1er module gratuit)

### 📚 6 Modules complets
1. **Comprendre sa valeur personnelle** (45 min, 6 leçons)
2. **Surmonter le syndrome de l'imposteur** (60 min, 8 leçons)
3. **Développer son assertivité** (50 min, 7 leçons)
4. **Gérer l'anxiété sociale** (55 min, 6 leçons)
5. **Cultiver l'estime de soi** (65 min, 9 leçons)
6. **Prendre des décisions avec confiance** (40 min, 5 leçons)

### 💳 Système de paiement
- Intégration Shopify pour 97€
- Mode démo pour les tests
- Activation automatique du statut premium
- Webhooks pour la synchronisation

### 📱 Pages de modules détaillées
- Contenu structuré par onglets
- Système de progression en temps réel
- Exercices pratiques interactifs
- Ressources téléchargeables

## 🏗️ Architecture technique

### Frontend (React 19)
- **Framework**: React 19 avec Create React App
- **Routing**: React Router DOM 7.5.1
- **UI**: Tailwind CSS avec design system personnalisé
- **State Management**: React Hooks + Context API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend (FastAPI)
- **Framework**: FastAPI 0.110.1
- **Base de données**: MongoDB avec Motor (async)
- **API**: RESTful avec préfixe `/api`
- **Authentification**: JWT avec sécurité Bearer
- **Validation**: Pydantic models
- **Intégrations**: Shopify API

### Base de données (MongoDB)
- **Collections**:
  - `modules`: Modules de formation
  - `users`: Profils utilisateur
  - `user_progress`: Suivi des progressions
  - `certificates`: Certificats de réussite
  - `transactions`: Historique des paiements

## 🚀 Utilisation

### Accès à l'application
L'application est accessible via l'URL fournie dans votre environnement.

### Comptes de test disponibles

#### Compte démo gratuit
- **Email**: `demo@confianceboost.fr`
- **Mot de passe**: `demo123`
- **Accès**: Premier module gratuit uniquement

#### Compte premium de test
- **Email**: `premium@confianceboost.fr`
- **Mot de passe**: `premium123`
- **Accès**: Tous les 6 modules débloqués

### Création de nouveau compte
Vous pouvez créer un nouveau compte via la page d'inscription. Les nouveaux comptes ont accès au premier module gratuitement.

### Test du paiement
- Le système Shopify fonctionne en mode démo
- Cliquez sur "Passer Premium - 97€" pour tester
- Le paiement sera simulé et le statut premium activé automatiquement

## 📊 Statistiques actuelles
- **Utilisateurs**: 3 inscrits
- **Membres premium**: 1
- **Modules**: 6 disponibles
- **Certificats**: 0 délivrés
- **Taux de réussite**: 0% (nouveau site)

## 🎨 Design
- **Couleurs principales**: Noir (#000000) et Or (#fbbf24)
- **Typography**: Inter, système par défaut
- **Responsive**: Mobile-first avec breakpoints optimisés
- **Animations**: Transitions fluides et animations CSS
- **Icons**: Lucide React pour la cohérence

## 🔧 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Modules
- `GET /api/modules` - Liste des modules
- `GET /api/modules/{id}` - Détail d'un module

### Progression
- `GET /api/progress` - Progression utilisateur
- `POST /api/progress/{module_id}/start` - Commencer un module
- `POST /api/progress/{module_id}/complete-lesson/{lesson_id}` - Terminer une leçon

### Dashboard
- `GET /api/dashboard` - Données du tableau de bord

### Paiement
- `POST /api/payment/create-checkout` - Créer un checkout
- `POST /api/payment/verify` - Vérifier un paiement
- `POST /api/payment/activate-premium` - Activer le premium

### Statistiques
- `GET /api/stats` - Statistiques globales

## 🎯 Points forts

1. **Design professionnel**: Interface moderne avec thème noir et doré cohérent
2. **UX optimisée**: Navigation intuitive et responsive
3. **Système freemium**: Modèle économique efficace
4. **Contenu riche**: 6 modules avec 41 leçons au total
5. **Intégration paiement**: Shopify pour une sécurité maximale
6. **Architecture scalable**: FastAPI + MongoDB pour la performance

## 🔒 Sécurité
- Authentification JWT
- Hashage des mots de passe
- Validation des données d'entrée
- CORS configuré
- Vérification des webhooks Shopify

## 📱 Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Touch-friendly sur mobile
- Optimisé pour tous les écrans

---

**ConfianceBoost est prêt pour le lancement ! 🎉**

*Plateforme de formation premium développée pour transformer la confiance en soi de vos utilisateurs.*