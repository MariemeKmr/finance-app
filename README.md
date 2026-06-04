# Finance App

Application de gestion financière personnelle pour suivre 
vos dépenses, revenus et objectifs d'épargne.

## Stack
- Next.js 14 (App Router)
- MongoDB + Mongoose
- NextAuth.js
- Recharts
- Tailwind CSS

## Fonctionnalités
- Authentification (Register / Login)
- Dashboard avec graphiques
- Gestion des transactions
- Objectifs d'épargne

## Installation
```bash
npm install
npm run dev
```

## Variables d'environnement
Crée un fichier `.env.local` :
```env
MONGODB_URI=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```
