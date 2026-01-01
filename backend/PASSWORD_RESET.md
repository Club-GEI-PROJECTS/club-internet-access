# 🔐 Système de Réinitialisation de Mot de Passe

Ce document explique le système de réinitialisation de mot de passe avec MailHog pour le développement.

## 📋 Vue d'ensemble

Le système permet aux utilisateurs de :
1. Demander une réinitialisation de mot de passe via leur email
2. Recevoir un lien de réinitialisation par email (via MailHog en développement)
3. Réinitialiser leur mot de passe avec le token reçu

## 🚀 Configuration

### 1. MailHog (Développement)

MailHog est déjà configuré dans `docker-compose.yml` :
- **SMTP Server** : `mailhog:1025` (dans Docker) ou `localhost:1025` (local)
- **Web UI** : http://localhost:8025

### 2. Variables d'environnement

Les variables suivantes sont configurées dans `docker-compose.yml` :

```env
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_FROM=noreply@unikin.cd
APP_NAME=Club Internet Access UNIKIN
FRONTEND_URL=http://localhost:3000
```

Pour la production, configurez un vrai serveur SMTP :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe
SMTP_FROM=noreply@unikin.cd
```

## 📡 API Endpoints

### 1. Demander une réinitialisation

**POST** `/api/auth/forgot-password`

```json
{
  "email": "user@example.com"
}
```

**Réponse** :
```json
{
  "message": "Si cet email existe, un lien de réinitialisation a été envoyé"
}
```

⚠️ **Note de sécurité** : Le message est toujours le même, même si l'email n'existe pas, pour éviter l'énumération d'emails.

### 2. Réinitialiser le mot de passe

**POST** `/api/auth/reset-password`

```json
{
  "token": "token-recu-dans-l-email",
  "newPassword": "nouveau-mot-de-passe"
}
```

**Réponse** :
```json
{
  "message": "Mot de passe réinitialisé avec succès"
}
```

**Erreurs possibles** :
- `400 Bad Request` : Token invalide, expiré ou déjà utilisé
- `400 Bad Request` : Le nouveau mot de passe doit contenir au moins 6 caractères

## 🔄 Flux de réinitialisation

1. **Utilisateur** demande une réinitialisation via `/api/auth/forgot-password`
2. **Backend** :
   - Vérifie si l'email existe (sans révéler le résultat)
   - Invalide tous les tokens précédents pour cet utilisateur
   - Génère un nouveau token sécurisé (32 bytes hex)
   - Crée un enregistrement `PasswordResetToken` avec expiration (1 heure)
   - Envoie un email avec le lien de réinitialisation
3. **Utilisateur** clique sur le lien dans l'email
4. **Frontend** redirige vers `/reset-password?token=...`
5. **Utilisateur** entre son nouveau mot de passe
6. **Frontend** envoie la requête à `/api/auth/reset-password`
7. **Backend** :
   - Vérifie le token (existe, non utilisé, non expiré)
   - Met à jour le mot de passe (hashé avec bcrypt)
   - Marque le token comme utilisé

## 📧 Email de réinitialisation

L'email contient :
- Un lien de réinitialisation : `${FRONTEND_URL}/reset-password?token=${token}`
- Un message indiquant que le lien est valide 1 heure
- Un avertissement si l'utilisateur n'a pas demandé la réinitialisation

### Voir les emails dans MailHog

1. Démarrer les services : `docker-compose up -d`
2. Ouvrir http://localhost:8025
3. Tous les emails envoyés s'affichent dans l'interface MailHog

## 🗄️ Base de données

### Table `password_reset_tokens`

```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  token VARCHAR UNIQUE NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

**Index recommandé** :
- `token` (unique)
- `userId`
- `expiresAt` (pour nettoyer les tokens expirés)

## 🔒 Sécurité

### Mesures de sécurité implémentées

1. **Tokens sécurisés** : Générés avec `crypto.randomBytes(32)` (256 bits)
2. **Expiration** : Tokens valides 1 heure seulement
3. **Usage unique** : Chaque token ne peut être utilisé qu'une fois
4. **Invalidation** : Tous les tokens précédents sont invalidés lors d'une nouvelle demande
5. **Pas d'énumération** : Le message de réponse est identique même si l'email n'existe pas
6. **Hashage** : Les mots de passe sont hashés avec bcrypt (10 rounds)

### Bonnes pratiques

- ✅ Ne jamais révéler si un email existe ou non
- ✅ Limiter le nombre de demandes par email/IP
- ✅ Nettoyer les tokens expirés régulièrement
- ✅ Utiliser HTTPS en production
- ✅ Valider la force du mot de passe côté serveur

## 🧪 Tests

### Test avec curl

```bash
# 1. Demander une réinitialisation
curl -X POST http://localhost:4000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@unikin.cd"}'

# 2. Vérifier l'email dans MailHog : http://localhost:8025
# 3. Copier le token depuis l'email

# 4. Réinitialiser le mot de passe
curl -X POST http://localhost:4000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "token-copie-depuis-email",
    "newPassword": "nouveau-mot-de-passe"
  }'
```

### Test avec Postman

1. Créer une requête POST vers `http://localhost:4000/api/auth/forgot-password`
2. Body (JSON) : `{"email": "admin@unikin.cd"}`
3. Vérifier l'email dans MailHog
4. Créer une requête POST vers `http://localhost:4000/api/auth/reset-password`
5. Body (JSON) : `{"token": "...", "newPassword": "..."}`

## 🐛 Dépannage

### L'email n'arrive pas

1. Vérifier que MailHog est démarré : `docker-compose ps`
2. Vérifier l'interface MailHog : http://localhost:8025
3. Vérifier les logs du backend : `docker-compose logs backend`
4. Vérifier les variables d'environnement SMTP

### Le token est invalide

- Le token a peut-être expiré (1 heure)
- Le token a peut-être déjà été utilisé
- Vérifier que le token est bien copié depuis l'email

### Erreur de connexion SMTP

- Vérifier que `SMTP_HOST` et `SMTP_PORT` sont corrects
- En Docker, utiliser `mailhog` comme hostname
- Localement, utiliser `localhost`

## 📝 Notes

- Les tokens expirés ne sont pas automatiquement supprimés (à implémenter si nécessaire)
- En production, configurez un vrai serveur SMTP (Gmail, SendGrid, etc.)
- Le frontend doit gérer la page `/reset-password` avec le paramètre `token`

