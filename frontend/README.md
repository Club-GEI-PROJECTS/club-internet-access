# 🌐 Frontend - Club Internet Access UNIKIN

Interface web React pour la gestion d'accès Wi-Fi via MikroTik RouterOS.

## 🚀 Démarrage Rapide

```bash
# Installer les dépendances
npm install

# Démarrer en développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🎯 Fonctionnalités

- ✅ **Dashboard** - Vue d'ensemble avec statistiques en temps réel
- ✅ **Gestion Comptes Wi-Fi** - Création, visualisation, suppression
- ✅ **Gestion Paiements** - Enregistrement et suivi des paiements
- ✅ **Sessions Actives** - Monitoring des utilisateurs connectés
- ✅ **Gestion Utilisateurs** - Administration des comptes (Admin)
- ✅ **Authentification** - Login/Logout avec JWT
- ✅ **Interface Responsive** - Mobile et Desktop

## 🛠️ Technologies

- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool rapide
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Axios** - Client HTTP
- **Recharts** - Graphiques
- **React Hot Toast** - Notifications
- **Lucide React** - Icônes

## 📁 Structure

```
frontend/
├── src/
│   ├── components/      # Composants réutilisables
│   ├── contexts/        # Contextes React (Auth)
│   ├── pages/           # Pages de l'application
│   ├── services/        # Services API
│   └── App.tsx          # Composant principal
```

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env` :

```env
VITE_API_URL=http://localhost:4000/api
```

## 📱 Pages

- `/login` - Page de connexion
- `/` - Dashboard
- `/wifi-accounts` - Gestion comptes Wi-Fi
- `/payments` - Gestion paiements
- `/sessions` - Sessions actives
- `/users` - Gestion utilisateurs (Admin)

## 🎨 Design

Interface moderne avec :
- Design system cohérent
- Couleurs primaires personnalisables
- Composants réutilisables
- Responsive design
- Animations fluides

## 📦 Build Production

```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist/`.

## 🧪 Développement

```bash
# Mode développement avec hot-reload
npm run dev

# Preview de la build production
npm run preview
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification. Le token est stocké dans `localStorage` et automatiquement inclus dans les requêtes API.

## 📚 API Integration

Tous les appels API sont centralisés dans `src/services/api.ts`. Les services incluent :

- `authService` - Authentification
- `wifiAccountsService` - Comptes Wi-Fi
- `paymentsService` - Paiements
- `sessionsService` - Sessions
- `dashboardService` - Dashboard
- `mikrotikService` - MikroTik

## 🎯 Prochaines Étapes

- [ ] Tests unitaires
- [ ] Tests E2E
- [ ] PWA support
- [ ] Internationalisation (i18n)
- [ ] Mode sombre

