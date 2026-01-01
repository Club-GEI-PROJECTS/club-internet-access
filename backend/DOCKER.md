# 🐳 Guide Docker - Club Internet Access

Guide complet pour utiliser Docker avec le projet.

## 📦 Services Docker

Le `docker-compose.yml` inclut :

- **PostgreSQL** - Base de données (port 5432)
- **Backend** - API NestJS (port 4000)
- **PgAdmin** - Interface web pour PostgreSQL (port 5050)
- **Adminer** - Alternative légère pour PostgreSQL (port 8080)

## 🚀 Démarrage Rapide

### 1. Prérequis

- Docker >= 20.10
- Docker Compose >= 2.0

### 2. Configuration

Créer un fichier `.env` à la racine du projet :

```env
# Database (utilisé par docker-compose)
DB_USERNAME=unikin_user
DB_PASSWORD=unikin_password
DB_DATABASE=internet_access

# MikroTik (à configurer selon votre routeur)
MIKROTIK_HOST=192.168.88.1
MIKROTIK_PORT=8728
MIKROTIK_USER=admin
MIKROTIK_PASSWORD=votre_mot_de_passe_mikrotik

# JWT
JWT_SECRET=votre-super-secret-jwt-key-changez-moi

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 3. Démarrer les services

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f backend

# Arrêter les services
docker-compose down
```

### 4. Créer l'utilisateur admin

```bash
# Exécuter le seed dans le container backend
docker-compose exec backend npm run seed:admin
```

### 5. Accéder aux services

- **Backend API**: http://localhost:4000/api
- **PgAdmin**: http://localhost:5050
  - Email: `admin@unikin.cd`
  - Password: `admin`
- **Adminer**: http://localhost:8080
  - Serveur: `postgres`
  - Utilisateur: `unikin_user`
  - Mot de passe: `unikin_password`
  - Base de données: `internet_access`

## 🔧 Commandes Utiles

### Gestion des containers

```bash
# Démarrer en arrière-plan
docker-compose up -d

# Démarrer et voir les logs
docker-compose up

# Arrêter
docker-compose stop

# Arrêter et supprimer les containers
docker-compose down

# Reconstruire les images
docker-compose build

# Reconstruire sans cache
docker-compose build --no-cache
```

### Logs

```bash
# Tous les services
docker-compose logs -f

# Backend uniquement
docker-compose logs -f backend

# Dernières 100 lignes
docker-compose logs --tail=100 backend
```

### Exécuter des commandes

```bash
# Shell dans le container backend
docker-compose exec backend sh

# Exécuter une commande npm
docker-compose exec backend npm run seed:admin

# Accéder à PostgreSQL
docker-compose exec postgres psql -U unikin_user -d internet_access
```

### Base de données

```bash
# Backup
docker-compose exec postgres pg_dump -U unikin_user internet_access > backup.sql

# Restore
docker-compose exec -T postgres psql -U unikin_user internet_access < backup.sql

# Voir les volumes
docker volume ls

# Supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

## 🏭 Production

### Utiliser docker-compose.prod.yml

```bash
# Build et démarrer en production
docker-compose -f docker-compose.prod.yml up -d --build

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Variables d'environnement production

Créer un fichier `.env.prod` :

```env
DB_USERNAME=prod_user
DB_PASSWORD=super_secure_password
DB_DATABASE=internet_access_prod
JWT_SECRET=super-secret-jwt-key-production
MIKROTIK_HOST=192.168.1.1
MIKROTIK_USER=admin
MIKROTIK_PASSWORD=secure_password
FRONTEND_URL=https://wifi.unikin.cd
```

Puis :

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## 🔍 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier que PostgreSQL est prêt
docker-compose exec postgres pg_isready -U unikin_user

# Reconstruire l'image
docker-compose build --no-cache backend
```

### Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps

# Vérifier les variables d'environnement
docker-compose exec backend env | grep DB_

# Tester la connexion depuis le backend
docker-compose exec backend sh
# Puis dans le shell: npm run start:dev
```

### Erreur de connexion MikroTik

⚠️ **Important**: Le container backend doit pouvoir accéder au routeur MikroTik.

- Si MikroTik est sur le même réseau : utiliser l'IP du routeur
- Si MikroTik est sur un autre réseau : configurer le réseau Docker ou utiliser `network_mode: host`

Pour utiliser le réseau host (Linux uniquement) :

```yaml
backend:
  network_mode: host
  # ... autres configs
```

### Port déjà utilisé

Si le port 4000 est déjà utilisé :

```bash
# Changer le port dans docker-compose.yml
ports:
  - "4001:4000"  # Utiliser 4001 au lieu de 4000
```

### Volumes et données

```bash
# Voir les volumes
docker volume ls

# Inspecter un volume
docker volume inspect club-internet-access_postgres_data

# Backup d'un volume
docker run --rm -v club-internet-access_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

## 🔐 Sécurité

### Production

1. **Changez tous les mots de passe par défaut**
2. **Utilisez des secrets Docker** pour les mots de passe
3. **Ne pas exposer PostgreSQL** en production
4. **Utiliser HTTPS** pour le frontend
5. **Configurer un firewall** approprié

### Secrets Docker

```bash
# Créer un secret
echo "super-secret-password" | docker secret create db_password -

# Utiliser dans docker-compose.yml
secrets:
  db_password:
    external: true
```

## 📊 Monitoring

### Health checks

Les services incluent des health checks :

```bash
# Vérifier l'état des services
docker-compose ps

# Health check PostgreSQL
docker-compose exec postgres pg_isready -U unikin_user
```

### Ressources

```bash
# Utilisation des ressources
docker stats

# Pour un container spécifique
docker stats internet-access-backend
```

## 🧹 Nettoyage

```bash
# Arrêter et supprimer tout
docker-compose down

# Supprimer aussi les volumes (⚠️ supprime les données)
docker-compose down -v

# Supprimer les images non utilisées
docker image prune

# Nettoyage complet (⚠️ attention)
docker system prune -a --volumes
```

## 📝 Notes Importantes

1. **MikroTik** : Le container backend doit pouvoir accéder au routeur. Vérifiez la connectivité réseau.

2. **Volumes** : Les données PostgreSQL sont persistantes dans le volume `postgres_data`.

3. **Hot-reload** : En développement, le code est monté en volume pour le hot-reload.

4. **Build** : En production, l'image est optimisée avec un build multi-stage.

5. **DNS** : Les containers utilisent Google DNS (8.8.8.8) pour la résolution DNS.

## 🎯 Prochaines Étapes

1. Configurer les variables d'environnement
2. Démarrer les services : `docker-compose up -d`
3. Créer l'admin : `docker-compose exec backend npm run seed:admin`
4. Tester l'API : `curl http://localhost:4000/api/health`

**Bon développement !** 🚀

