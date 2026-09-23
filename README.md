# Refova

> Find referrals. Share benefits.

---

## Overview

Refova is a web platform for discovering, organizing, and sharing referral codes and links. It gives people a clean, central place to find working referral benefits without searching through chat groups, forum threads, or outdated coupon websites.

## What it does

Most referral codes are shared in scattered places where they quickly expire, get lost, or clutter conversations. For people looking for a discount or signup perk, finding a code that actually works is frustrating. For people sharing their codes, filling out forms on deal websites takes too much effort.

Refova solves this by:
- Organizing referrals into clear, searchable cards with upfront details and terms.
- Simplifying posting so contributors can paste raw referral text and have it parsed automatically instead of filling out long forms.
- Allowing visitors to copy codes directly with a single click.

## How it works

1. **Browse or Search:** Visitors search by service, brand, or benefit (such as cashback, food delivery, or hosting), or filter by category and reward type.
2. **View & Copy:** Clicking an offer opens its detail page with conditions, expiry date, and trust indicators. Clicking "Copy Code" copies the code or link to the clipboard and records the copy count.
3. **Paste & Post:** Authenticated users paste raw text or links containing a referral offer. Refova parses the text to extract brand, category, benefit, and terms. The user reviews and edits the generated card before publishing it to the platform.
4. **Accounts & Profiles:** Users can sign up with email and password or Google Sign-In to track their submissions, view saved referrals, and manage their profile.

## Key features

- **Text Parser for Submissions:** Automatically identifies brands, benefit types, codes, links, conditions, and expiry dates from pasted messages.
- **Search & Multi-Filter Discovery:** Keyword search, category filtering, benefit type filtering (cashback, discount, credits, free months), and sorting by newest or popular.
- **Card & List Views:** Flexible display options for browsing referral listings.
- **One-Click Code Copying:** Copies codes or opens links while keeping track of claim counts.
- **Save & Bookmark:** Allows users to save offers for later reference.
- **User Authentication & Profiles:** Email/password and Google authentication, public user profiles, trust scores, and submission management.
- **Admin Moderation Tools:** Backend routes and controls to review, verify, feature, or remove submissions and manage reported links.

## Who it is for

- **Everyday users** looking for working referral codes, cashback, or signup bonuses when trying new products and services.
- **Community contributors** who have referral codes and want a simple way to share them with people who are actively looking for them.

## Tech stack

### Frontend
- **Framework:** React 19 with Vite
- **Routing & SSR:** TanStack Router and TanStack Start
- **Data Fetching:** TanStack Query
- **Styling:** Tailwind CSS v4
- **Components & Icons:** Radix UI primitives and Lucide React
- **Authentication Client:** Firebase Auth

### Backend
- **Runtime & Framework:** Node.js (>=18) and Express
- **Database & Storage:** Firebase Firestore (database) and Firebase Storage (media)
- **Auth Verification:** Firebase Admin SDK
- **Validation & Security:** Joi, Helmet, CORS, and Express Rate Limit
- **Testing:** Jest and Supertest

## Getting started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- A Firebase project with Authentication (Email/Password and Google providers), Cloud Firestore, and Cloud Storage enabled.

### 1. Clone the repository
```bash
git clone https://github.com/aditya-yadav1176/refova.git
cd refova
```

### 2. Install dependencies
Install dependencies for both frontend and backend:

```bash
# Frontend
cd frontend
npm install
cd ..

# Backend
cd backend
npm install
cd ..
```

### 3. Environment configuration

#### Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory by copying `backend/.env.example`:
```bash
cp backend/.env.example backend/.env
```
Provide your Firebase service account details and configuration:
- `PORT`: API server port (default: `10000`)
- `NODE_ENV`: `development` or `production`
- `FRONTEND_URL`: `http://localhost:8080` (or your client origin)
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_CLIENT_EMAIL`: Service account client email
- `FIREBASE_PRIVATE_KEY`: Service account private key
- `FIREBASE_STORAGE_BUCKET`: Firebase storage bucket name

#### Frontend (`frontend/.env.local`)
Create a `.env.local` file in the `frontend/` directory by copying `frontend/.env.example`:
```bash
cp frontend/.env.example frontend/.env.local
```
Provide your Firebase web client credentials:
- `VITE_API_URL`: Backend API URL (default: `http://localhost:10000`)
- `VITE_FIREBASE_API_KEY`: Firebase web API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID`: Firebase application ID

### 4. Database initialization (Backend)
Run the seed scripts to populate initial categories and counters in Firestore:
```bash
cd backend
npm run seed:categories
npm run seed:counters
cd ..
```

### 5. Running the application
You can run both parts from the repository root using the workspace scripts:

```bash
# Start backend API (runs on http://localhost:10000)
npm run dev:backend

# Start frontend application (runs on http://localhost:8080)
npm run dev:frontend
```

Alternatively, you can run them in separate terminals:
- **Frontend**: `cd frontend && npm run dev`
- **Backend**: `cd backend && npm run dev`

### 6. Running tests
```bash
npm run test:backend
```

## Project structure

```text
refova/
├── frontend/                     # React 19 + TanStack frontend
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # UI components (referral cards, explorer, header, footer)
│   │   ├── lib/                  # API client, auth context, parsing fallback, types
│   │   ├── routes/               # File-based routes (home, discover, post, referral, profile, auth)
│   │   ├── styles.css            # Tailwind CSS v4 setup and theme variables
│   │   └── server.ts             # SSR application entry
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Node.js + Express API
│   ├── scripts/                  # Seed and administrative scripts
│   ├── src/
│   │   ├── config/               # Environment and Firebase Admin setup
│   │   ├── controllers/          # Route controller handlers
│   │   ├── middleware/           # Auth, rate limiting, and error handling
│   │   ├── routes/               # API route definitions
│   │   ├── services/             # Database logic, parsing service, user service
│   │   └── utils/                # Response helpers, validators, logger
│   ├── tests/                    # Jest + Supertest API tests
│   ├── package.json
│   └── render.yaml               # Deployment specification
│
├── package.json                  # Root monorepo scripts
└── README.md                     # Project documentation
```

## Project status

Refova is an active full-stack project. The frontend application and backend API are functional and integrated:
- The discovery feed, filtering, search, and referral views consume live backend data.
- User authentication and session handling work with Firebase Auth and backend profile syncing.
- Referral posting, text parsing, and copy tracking are operational.
- Admin moderation endpoints and database seed scripts are implemented.

## Contributors

Refova is built and maintained collaboratively by:
- **Aditya Yadav** ([@aditya-yadav1176](https://github.com/aditya-yadav1176))
- **Harshit Tripathi** ([@htripathi9324](https://github.com/htripathi9324))
