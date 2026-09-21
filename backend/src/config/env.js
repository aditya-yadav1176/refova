'use strict';

/**
 * env.js — Validates and exports required environment variables.
 * Fails fast on startup if any critical variable is missing.
 */

require('dotenv').config();

const required = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_STORAGE_BUCKET'];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`[env] Missing required environment variables: ${missing.join(', ')}`);
  console.error('[env] Copy backend/.env.example to backend/.env and fill in your credentials.');
  process.exit(1);
}

module.exports = {
  PORT: parseInt(process.env.PORT || '10000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PROD: process.env.NODE_ENV === 'production',

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  // Handle escaped \n that some hosting providers inject
  FIREBASE_PRIVATE_KEY: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  FIREBASE_STORAGE_BUCKET: (process.env.FIREBASE_STORAGE_BUCKET || '').replace(/\s+/g, ''),

  ADMIN_EMAIL: process.env.ADMIN_EMAIL || null,

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '200', 10),
};
