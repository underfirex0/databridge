# DataBridge — AtlantaSanad × Telecontact

Plateforme intelligente d'enrichissement et de gouvernance des données entreprises.

## Stack

- **Framework** : Next.js 15 (App Router)
- **Database** : Supabase (PostgreSQL)
- **ORM** : Prisma
- **Auth** : Supabase Auth
- **UI** : Tailwind CSS + shadcn/ui
- **Tables** : TanStack Table
- **Hosting** : Vercel

## Setup

### 1. Clone & install

```bash
git clone https://github.com/your-org/databridge.git
cd databridge
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Remplissez les variables dans `.env.local` :
- `NEXT_PUBLIC_SUPABASE_URL` — URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Clé anonyme Supabase
- `DATABASE_URL` — URL de connexion PostgreSQL (pooler)
- `DIRECT_URL` — URL de connexion directe PostgreSQL

### 3. Base de données

```bash
npm run db:generate   # Génère le client Prisma
npm run db:push       # Pousse le schéma vers Supabase
```

### 4. Développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

### 5. Déploiement Vercel

```bash
vercel deploy
```

Ajoutez les variables d'environnement dans le dashboard Vercel.

## Structure du projet

```
src/
├── app/
│   ├── (auth)/login/          # Page de connexion
│   └── (dashboard)/
│       ├── dashboard/         # Vue d'ensemble
│       ├── companies/         # Liste + détail entreprises
│       ├── alerts/            # Alertes veille entreprise
│       ├── merges/            # Fusions IA (Smart Matching)
│       └── import/            # Import CSV/Excel
├── components/
│   ├── layout/                # Sidebar + Header
│   └── companies/             # Table + carte entreprise
└── lib/
    ├── supabase.ts            # Client Supabase
    ├── prisma.ts              # Client Prisma
    └── utils.ts               # Utilitaires
```

## Modules

### Module 1 — Enrichissement
Données Telecontact (130+ champs) automatiquement mappées sur la Fiche Client Entreprise AtlantaSanad.

### Module 2 — Intelligence
- Détection automatique des doublons
- Score qualité DATA (0-100)
- Alertes veille entreprise (changement dirigeant, adresse, statut juridique)

### Module 3 — Intégration
- API REST `/api/companies`
- Export CSV/Excel
- Webhooks vers CRM AtlantaSanad

## Rôles utilisateurs

| Rôle | Accès |
|------|-------|
| `TELECONTACT` | Tous les champs, import, admin |
| `ATLANTASANAD` | Lecture données enrichies + saisie champs assurance |
