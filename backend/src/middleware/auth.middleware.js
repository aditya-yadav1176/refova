'use strict';

const { getAuth, getDb } = require('../config/firebase');
const { sendError } = require('../utils/response');
const logger = require('../utils/logger');
const env = require('../config/env');

/**
 * Verify Firebase ID token and load user from Firestore.
 * Attaches req.user = { uid, email, displayName, role, status, ... }
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Missing or invalid Authorization header', 401);
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
      return sendError(res, 'Missing token', 401);
    }

    // Verify token with Firebase Admin
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(idToken);
    } catch (err) {
      logger.warn({ err: err.message }, 'Token verification failed');
      return sendError(res, 'Invalid or expired authentication token', 401);
    }

    const { uid, email } = decodedToken;

    // Load user document from Firestore
    const db = getDb();
    const userDoc = await db.collection('users').doc(uid).get();

    let userData;
    if (!userDoc.exists) {
      // Auto-create user doc if not exists (handles race conditions on first login)
      userData = {
        uid,
        email: email || '',
        displayName: decodedToken.name || email?.split('@')[0] || 'User',
        photoURL: decodedToken.picture || null,
        role: 'user',
        status: 'active',
        bio: '',
        referralsPosted: 0,
        referralsCopied: 0,
        reportsSubmitted: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      // Auto-promote ADMIN_EMAIL if configured
      if (env.ADMIN_EMAIL && email === env.ADMIN_EMAIL) {
        userData.role = 'admin';
        logger.info({ uid, email }, 'Auto-promoted user to admin via ADMIN_EMAIL');
      }

      await db.collection('users').doc(uid).set(userData);
    } else {
      userData = userDoc.data();

      // Check if user is suspended
      if (userData.status === 'suspended') {
        return sendError(res, 'Your account has been suspended. Contact support for help.', 403);
      }

      // Update last login timestamp (non-blocking)
      db.collection('users').doc(uid).update({ lastLoginAt: new Date().toISOString() }).catch(() => {});
    }

    req.user = userData;
    next();
  } catch (err) {
    logger.error({ err }, 'Authentication middleware error');
    return sendError(res, 'Authentication error', 500);
  }
}

/**
 * Optional authentication — attaches req.user if token present, else continues without.
 */
async function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  return authenticate(req, res, next);
}

module.exports = { authenticate, optionalAuthenticate };
