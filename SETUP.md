# 🚀 Guide de Configuration et Démarrage

Ce guide vous aidera à configurer et démarrer le projet **Club Internet Access** correctement.

## 📋 Prérequis

1. **Docker Desktop** installé et en cours d'exécution
2. **Node.js 18+** (pour le développement local)
3. **Git** (pour cloner le projet)

## 🔧 Configuration Initiale

### 1. Vérifier Docker Desktop

Assurez-vous que Docker Desktop est **démarré** avant de continuer.

```bash
# Vérifier que Docker fonctionne
docker --version
docker-compose --version
```

### 2. Configuration des Variables d'Environnement

#### Pour Docker (Recommandé)

Le fichier `docker-compose.yml` contient déjà toutes les variables nécessaires. Vous pouvez les modifier directement dans le fichier ou créer un fichier `.env` à la racine :

```bash
# Créer un fichier .env à la racine (optionnel)
# Les valeurs par défaut dans docker-compose.yml fonctionnent pour le développement
```

#### Pour le développement local (sans Docker)

```bash
cd backend
cp env.example.txt .env
# Éditer .env avec vos paramètres
```

### 3. Variables Importantes

- **MIKROTIK_HOST**: Adresse IP de votre routeur MikroTik (défaut: 192.168.88.1)
- **MIKROTIK_USER**: Nom d'utilisateur API MikroTik (défaut: admin)
- **MIKROTIK_PASSWORD**: Mot de passe API MikroTik
- **JWT_SECRET**: Clé secrète pour les tokens JWT (changez en production!)
- **DB_PASSWORD**: Mot de passe PostgreSQL (défaut: unikin_password)

## 🐳 Démarrage avec Docker

### Étape 1: Arrêter les containers existants

```bash
docker-compose down
```

### Étape 2: Reconstruire les images (si nécessaire)

```bash
# Reconstruire uniquement le backend (si vous avez modifié le code)
docker-compose build backend

# Ou reconstruire tout
docker-compose build
```

### Étape 3: Démarrer tous les services

```bash
docker-compose up -d
```

### Étape 4: Vérifier les logs

```bash
# Voir les logs du backend
docker-compose logs -f backend

# Voir tous les logs
docker-compose logs -f
```

### Étape 5: Vérifier que tout fonctionne

Attendez quelques secondes que le backend démarre, puis vérifiez :

```bash
# Vérifier que le backend répond
curl http://localhost:4000/api

# Ou ouvrir dans le navigateur
# http://localhost:4000/api
```

## 📊 Accès aux Services

Une fois démarré, vous pouvez accéder à :

- **Backend API**: http://localhost:4000/api
- **PgAdmin** (Gestion BDD): http://localhost:5050
  - Email: `admin@unikin.cd`
  - Mot de passe: `admin`
- **Adminer** (Gestion BDD alternative): http://localhost:8080
  - Serveur: `postgres`
  - Utilisateur: `unikin_user`
  - Mot de passe: `unikin_password`
  - Base de données: `internet_access`
- **MailHog** (Emails de test): http://localhost:8025

## 🌱 Initialiser la Base de Données

### Option 1: Via Script SQL (Rapide)

```bash
# Depuis la racine du projet
docker exec -i internet-access-postgres psql -U unikin_user -d internet_access < backend/scripts/seed-data.sql
```

### Option 2: Via Script PowerShell (Windows)

```powershell
cd backend
.\scripts\seed-simple.ps1
```

### Option 3: Via Script Bash (Linux/Mac)

```bash
cd backend
bash scripts/seed.sh
```

Voir [backend/SEED_GUIDE.md](./backend/SEED_GUIDE.md) pour plus de détails.

## 🔍 Résolution de Problèmes

### Problème: "Cannot find module 'nodemailer'"

**Solution:**
1. Arrêter le container backend: `docker-compose stop backend`
2. Reconstruire l'image: `docker-compose build backend`
3. Redémarrer: `docker-compose up -d backend`

### Problème: "getaddrinfo ENOTFOUND postgres"

**Solution:**
1. Arrêter tous les containers: `docker-compose down`
2. Redémarrer: `docker-compose up -d`
3. Attendre que PostgreSQL soit prêt (healthcheck)

### Problème: Le backend ne démarre pas

**Solution:**
1. Vérifier les logs: `docker-compose logs backend`
2. Vérifier que PostgreSQL est démarré: `docker-compose ps`
3. Vérifier les variables d'environnement dans `docker-compose.yml`

### Problème: Port déjà utilisé

**Solution:**
1. Modifier les ports dans `docker-compose.yml`
2. Ou arrêter le service qui utilise le port

## 🛠️ Développement Local (sans Docker)

### Installation

```bash
# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install
```

### Démarrage

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Note:** Vous devrez configurer PostgreSQL localement et mettre à jour `backend/.env`.

## 📝 Commandes Utiles

```bash
# Voir les containers en cours d'exécution
docker-compose ps

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données!)
docker-compose down -v

# Reconstruire une image spécifique
docker-compose build backend

# Voir les logs en temps réel
docker-compose logs -f backend

# Exécuter une commande dans un container
docker-compose exec backend npm run build

# Accéder au shell du container backend
docker-compose exec backend sh

# Accéder à PostgreSQL
docker-compose exec postgres psql -U unikin_user -d internet_access
```

## ✅ Checklist de Vérification

Avant de commencer à développer, vérifiez que :

- [ ] Docker Desktop est démarré
- [ ] Tous les services démarrent sans erreur (`docker-compose ps`)
- [ ] Le backend répond sur http://localhost:4000/api
- [ ] La base de données est accessible via Adminer ou PgAdmin
- [ ] MailHog est accessible sur http://localhost:8025
- [ ] Les données initiales sont chargées (voir section "Initialiser la Base de Données")

## 🎯 Prochaines Étapes

1. **Configurer MikroTik**: Voir [backend/INSTALLATION.md](./backend/INSTALLATION.md)
2. **Tester l'API**: Voir [backend/API.md](./backend/API.md)
3. **Développer le Frontend**: Voir [frontend/README.md](./frontend/README.md)

## 📞 Support

En cas de problème, vérifiez :
1. Les logs Docker: `docker-compose logs`
2. La documentation dans les dossiers `backend/` et `frontend/`
3. Les fichiers de configuration

---

**Bon développement! 🚀**

