'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const pinoHttp = require('pino-http');
const { FRONTEND_URL, IS_PROD, NODE_ENV } = require('./config/env');
const { globalLimiter } = require('./middleware/rateLimit.middleware');
const { errorMiddleware } = require('./middleware/error.middleware');
const logger = require('./utils/logger');

// ── Initialize Firebase (eager) ───────────────────────────────────────────────
const { initFirebase } = require('./config/firebase');
initFirebase();

// ── Create Express app ────────────────────────────────────────────────────────
const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  FRONTEND_URL ? FRONTEND_URL.replace(/\/$/, '') : null,
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some((o) => origin.startsWith(o))) {
      return callback(null, true);
    }
    logger.warn({ origin }, 'CORS rejected origin');
    return callback(new Error(`CORS policy: origin ${origin} is not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── Request logging ───────────────────────────────────────────────────────────
app.use(pinoHttp({ logger, quietReqLogger: IS_PROD }));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ── Global rate limit ─────────────────────────────────────────────────────────
app.use(globalLimiter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'refova-backend', environment: NODE_ENV });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'refova-backend', environment: NODE_ENV });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/referrals', require('./routes/referral.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/uploads', require('./routes/upload.routes'));
app.use('/api/stats', require('./routes/stats.routes'));

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ── Central error handler (must be last) ──────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
