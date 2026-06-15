# 💰 MyKalpé — Coffre-Fort Numérique

MyKalpé est une application web de gestion financière personnelle que j'ai construite pour aider à suivre ses dépenses, gérer son épargne et visualiser sa santé financière en temps réel. Le nom vient d'une fusion entre "My" et "Kalpé", un mot qui évoque l'idée de capital et d'économie.

> Projet personnel — conçu, développé et déployé par Marieme Kamara

🌐 **Live** : [mykalpé.vercel.app](https://finance-dtd0npmff-mariemekmrs-projects.vercel.app)
📁 **Repo** : [github.com/MariemeKmr/finance-app](https://github.com/MariemeKmr/finance-app)

---

## Aperçu

L'idée m'est venue d'un besoin personnel — avoir un endroit centralisé pour suivre mes finances mensuelles sans dépendre d'une feuille Excel. J'ai voulu créer quelque chose de fonctionnel mais aussi visuellement soigné, avec une identité forte autour du concept de "coffre-fort numérique".

---

## Fonctionnalités

- **Authentification sécurisée** — Inscription, connexion avec JWT et animation coffre-fort à l'ouverture de session
- **Dashboard interactif** — Vue d'ensemble avec graphiques (répartition des dépenses en camembert, revenus vs dépenses en barres)
- **Gestion des transactions** — Ajout, modification et suppression de revenus et dépenses par catégorie
- **Charges fixes récurrentes** — Enregistrement des charges mensuelles (loyer, internet, abonnements...) avec application en un clic
- **Objectifs d'épargne** — Création d'objectifs avec suivi de progression, ajout et retrait de montants
- **Design "Coffre-Fort Numérique"** — Interface sombre élégante avec palette de couleurs personnalisée

---

## Stack technique

| Technologie | Usage |
|---|---|
| Next.js 14 (App Router) | Framework fullstack |
| TypeScript | Typage statique |
| MongoDB Atlas + Mongoose | Base de données |
| NextAuth.js | Authentification JWT |
| Recharts | Graphiques interactifs |
| Tailwind CSS | Styles utilitaires |
| Vercel | Déploiement |

---

## Palette de couleurs

| Couleur | Hex | Usage |
|---|---|---|
| Vert Canard | `#069494` | Couleur principale, boutons, graphiques |
| Vieux Rose | `#C48A9F` | Couleur secondaire, épargne, objectifs |
| Or Luxueux | `#D4AF37` | Accents, charges fixes |
| Fond Sombre | `#0A1110` | Background principal |
| Crème | `#FDFBF7` | Textes sur fond sombre |

---

## Architecture
finance-app/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Page de connexion avec animation coffre-fort
│   │   └── register/       # Page d'inscription
│   ├── (dashboard)/
│   │   ├── dashboard/      # Vue d'ensemble + graphiques
│   │   ├── transactions/   # Gestion des transactions + charges fixes
│   │   └── savings/        # Objectifs d'épargne
│   └── api/
│       ├── auth/           # NextAuth + register
│       ├── transactions/   # CRUD transactions
│       ├── savings/        # CRUD objectifs
│       └── recurring/      # CRUD charges fixes
├── models/                 # Schémas Mongoose (User, Transaction, Saving, RecurringCharge)
├── lib/                    # Connexion MongoDB, rate limiter
├── types/                  # Extensions TypeScript NextAuth
└── middleware.ts           # Protection des routes

---

## Sécurité

- Mots de passe hashés avec bcrypt (12 rounds)
- Sessions JWT via NextAuth
- Validation des données côté serveur sur toutes les routes
- Rate limiting sur les routes d'authentification
- Headers de sécurité HTTP (CSP, X-Frame-Options, HSTS...)
- Variables d'environnement protégées

---

## Installation locale

### Prérequis
- Node.js 18+
- Compte MongoDB Atlas (gratuit)

### Étapes

```bash
# Cloner le repo
git clone https://github.com/MariemeKmr/finance-app.git
cd finance-app

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir .env.local avec vos valeurs
```

Créer un fichier `.env.local` :

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/finance-app
NEXTAUTH_SECRET=votre_secret_random
NEXTAUTH_URL=http://localhost:3000
```

```bash
# Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Modèles de données

**User**
```typescript
{
  name: string
  email: string (unique)
  password: string (hashé)
}
```

**Transaction**
```typescript
{
  userId: ObjectId
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: Date
}
```

**Saving**
```typescript
{
  userId: ObjectId
  title: string
  targetAmount: number
  currentAmount: number
  deadline?: Date
  color: string
}
```

**RecurringCharge**
```typescript
{
  userId: ObjectId
  title: string
  amount: number
  category: string
  description: string
  dayOfMonth: number
}
```

---

## Ce que j'ai appris

- Mise en place d'une authentification complète avec NextAuth.js en TypeScript
- Gestion des routes dynamiques et du middleware dans Next.js 14 App Router
- Connexion et modélisation de données avec MongoDB Atlas et Mongoose
- Création de graphiques interactifs avec Recharts
- Bonnes pratiques de sécurité pour une app fullstack (validation, rate limiting, headers HTTP)
- Déploiement sur Vercel avec configuration des variables d'environnement

---

## Auteure

**Marieme Kamara** - Développeuse Web & Logicielle

- GitHub : [@MariemeKmr](https://github.com/MariemeKmr)
- Email : mariemekamara@esp.sn

---

*MyKalpé fait partie d'une série de mini-projets que je développe pour enrichir mon portfolio et pratiquer différentes stacks techniques.*
