# Refova Backend

Production-ready REST API for the Refova referral discovery platform.

Built with **Node.js + Express**, backed by **Firebase Firestore** for storage, **Firebase Auth** for authentication, and **Firebase Storage** for media uploads. Deployed on **Render**.

---

## Quick Start

### Prerequisites
- Node.js >= 18
- A Firebase project with Firestore, Auth, and Storage enabled
- A `.env` file (copy from `.env.example`)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# 3. Seed initial data
npm run seed:categories
npm run seed:counters

# 4. Start development server
npm run dev
```

The server starts on http://localhost:10000

### Make yourself admin

After signing up in the frontend:

```bash
npm run make:admin -- your@email.com
```

---

## API Endpoints

### Public

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/referrals` | List referrals (search, filter, paginate) |
| GET | `/api/referrals/featured` | Featured referrals |
| GET | `/api/referrals/trending` | Trending referrals |
| GET | `/api/referrals/:id` | Referral detail |
| POST | `/api/referrals/:id/view` | Record view (unauthenticated) |
| POST | `/api/referrals/:id/copy` | Record copy + return code |
| GET | `/api/categories` | List categories |
| GET | `/api/stats/home` | Homepage stats |

### Authenticated (requires Bearer token)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create/upsert user after signup |
| POST | `/api/auth/me` | Sync user on login |
| GET | `/api/users/me` | Own profile |
| PUT | `/api/users/me` | Update profile |
| GET | `/api/users/me/referrals` | Own referrals |
| GET | `/api/users/me/stats` | Own stats |
| POST | `/api/referrals` | Create referral (draft) |
| POST | `/api/referrals/parse` | Parse referral text |
| POST | `/api/referrals/:id/submit` | Submit for review |
| PUT | `/api/referrals/:id` | Update own draft |
| DELETE | `/api/referrals/:id` | Remove own referral |
| POST | `/api/referrals/:id/report` | Report a referral |
| POST | `/api/uploads/referral` | Upload referral image |
| POST | `/api/uploads/profile` | Upload profile image |

### Admin only (requires `role: admin`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/dashboard` | Platform statistics |
| GET | `/api/admin/referrals` | All referrals with filters |
| PATCH | `/api/admin/referrals/:id/approve` | Approve → publish |
| PATCH | `/api/admin/referrals/:id/reject` | Reject with reason |
| PATCH | `/api/admin/referrals/:id/verify` | Mark as verified |
| PATCH | `/api/admin/referrals/:id/suspend` | Suspend |
| PATCH | `/api/admin/referrals/:id/feature` | Toggle featured |
| PATCH | `/api/admin/referrals/:id/trending` | Toggle trending |
| GET | `/api/admin/users` | List users |
| PATCH | `/api/admin/users/:uid/status` | Suspend/activate user |
| PATCH | `/api/admin/users/:uid/role` | Change user role |
| GET | `/api/admin/reports` | List reports |
| PATCH | `/api/admin/reports/:id/resolve` | Resolve report |
| PATCH | `/api/admin/reports/:id/reject` | Dismiss report |

---

## Deployment on Render

1. Push the repository to GitHub
2. Create a new **Web Service** on Render, connect your repo
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add all environment variables from `.env.example` in Render's **Environment** tab
7. After first deploy, run seed scripts via Render Shell:
   ```bash
   node scripts/seed-categories.js
   node scripts/seed-counters.js
   node scripts/make-admin.js your@email.com
   ```

Alternatively, use the `render.yaml` file in this directory for infrastructure-as-code deployment.

---

## Firebase Setup

### 1. Create a project
Go to [Firebase Console](https://console.firebase.google.com) → New Project

### 2. Enable services
- **Authentication**: Enable Email/Password and Google providers
- **Firestore**: Create database in production mode
- **Storage**: Enable with default rules

### 3. Get Admin SDK credentials
Project Settings → Service Accounts → Generate new private key → Download JSON

Use the fields from the JSON as your environment variables:
- `FIREBASE_PROJECT_ID` = `project_id`
- `FIREBASE_CLIENT_EMAIL` = `client_email`
- `FIREBASE_PRIVATE_KEY` = `private_key` (the full key including `-----BEGIN...-----`)

### 4. Deploy Firestore rules and indexes
```bash
npm install -g firebase-tools
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore,storage
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 10000) |
| `NODE_ENV` | No | `development` or `production` |
| `FRONTEND_URL` | Yes | Frontend URL for CORS (no trailing slash) |
| `FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Yes | Service account email |
| `FIREBASE_PRIVATE_KEY` | Yes | Service account private key |
| `FIREBASE_STORAGE_BUCKET` | Yes | Storage bucket name |
| `ADMIN_EMAIL` | No | Email to auto-promote to admin on first login |

---

## Running Tests

```bash
npm test
```

Tests use Jest + Supertest with a mocked Firebase. No real Firebase credentials needed for tests.
