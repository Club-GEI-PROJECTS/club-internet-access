# 🚀 Guide de Démarrage Rapide

## ✅ Système Complet - Backend + Frontend

Le système est maintenant **100% fonctionnel** avec backend NestJS et frontend React.

## 📦 Installation Complète

### 1. Installer toutes les dépendances

```bash
npm run install:all
```

### 2. Configurer le Backend

```bash
cd backend
cp env.example.txt .env
# Éditer .env avec vos paramètres :
# - PostgreSQL (DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE)
# - MikroTik (MIKROTIK_HOST, MIKROTIK_USER, MIKROTIK_PASSWORD)
# - JWT_SECRET (changez-le!)
```

### 3. Créer la base de données PostgreSQL

```sql
CREATE DATABASE internet_access;
```

### 4. Créer l'utilisateur admin

```bash
cd backend
npm run seed:admin
```

Cela créera :
- **Email**: `admin@unikin.cd`
- **Password**: `admin123`

⚠️ **Changez le mot de passe après la première connexion !**

### 5. Configurer le Frontend (optionnel)

```bash
cd frontend
# Créer .env si besoin
echo "VITE_API_URL=http://localhost:4000/api" > .env
```

## 🎯 Démarrer l'Application

### Option 1: Démarrer tout en même temps

```bash
# À la racine du projet
npm run dev
```

Cela démarre :
- Backend sur `http://localhost:4000`
- Frontend sur `http://localhost:3000`

### Option 2: Démarrer séparément

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🔐 Première Connexion

1. Ouvrir `http://localhost:3000`
2. Se connecter avec :
   - Email: `admin@unikin.cd`
   - Password: `admin123`

## ✅ Vérification

### Backend
```bash
curl http://localhost:4000/api/health
```

Devrait retourner :
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "Internet Access Management API"
}
```

### Frontend
- Ouvrir `http://localhost:3000`
- Voir la page de login
- Se connecter avec les identifiants admin

## 🎯 Fonctionnalités Disponibles

### Dashboard
- Statistiques en temps réel
- Graphiques (comptes/paiements)
- Vue d'ensemble complète

### Comptes Wi-Fi
- Créer des comptes (24h, 48h, 7j, 30j)
- Voir tous les comptes
- Copier username/password
- Supprimer des comptes

### Paiements
- Créer des paiements
- Compléter les paiements
- Génération automatique de compte après paiement
- Statistiques de revenus

### Sessions
- Voir les utilisateurs connectés
- Synchroniser avec MikroTik
- Déconnecter des utilisateurs
- Statistiques de trafic

### Utilisateurs (Admin)
- Créer des utilisateurs
- Gérer les rôles (Admin, Agent, Student)
- Voir tous les utilisateurs

## 🔧 Configuration MikroTik

### 1. Activer l'API

Dans Winbox ou WebFig :
1. IP → Services
2. Activer l'API (port 8728)
3. Configurer les permissions

### 2. Créer les profils Hotspot

```bash
/ip/hotspot/user/profile add name=1mbps rate-limit=1M/1M
/ip/hotspot/user/profile add name=2mbps rate-limit=2M/2M
/ip/hotspot/user/profile add name=5mbps rate-limit=5M/5M
```

### 3. Vérifier la connexion

L'application tentera de se connecter automatiquement au démarrage. Vérifiez les logs du backend.

## 📚 Documentation Complète

- **Docker**: [DOCKER.md](./DOCKER.md) - Guide complet Docker
- **Backend**: [backend/INSTALLATION.md](./backend/INSTALLATION.md)
- **API**: [backend/API.md](./backend/API.md)
- **Frontend**: [frontend/README.md](./frontend/README.md)

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est démarré
- Vérifiez les credentials dans `.env`
- Vérifiez que la base de données existe

### Erreur de connexion MikroTik
- Vérifiez que l'API est activée sur le routeur
- Vérifiez l'adresse IP et le port
- Vérifiez les credentials
- Vérifiez le firewall

### Frontend ne se connecte pas au backend
- Vérifiez que le backend est démarré
- Vérifiez `VITE_API_URL` dans `.env`
- Vérifiez CORS dans le backend

## 🎉 Prêt !

Le système est maintenant **opérationnel**. Vous pouvez :
- Créer des comptes Wi-Fi
- Gérer les paiements
- Monitorer les sessions
- Voir les statistiques

**Bon développement !** 🚀

