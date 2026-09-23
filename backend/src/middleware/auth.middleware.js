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
    const isGoogleUser =
      decodedToken.firebase?.sign_in_provider === 'google.com' ||
      Boolean(decodedToken.firebase?.identities && decodedToken.firebase.identities['google.com']);

    let tokenDisplayName =
      typeof decodedToken.name === 'string' && decodedToken.name.trim()
        ? decodedToken.name.trim()
        : null;
    let tokenPhotoURL = decodedToken.picture || null;

    if (isGoogleUser && !tokenDisplayName) {
      try {
        const userRecord = await getAuth().getUser(uid);
        if (userRecord.displayName && userRecord.displayName.trim()) {
          tokenDisplayName = userRecord.displayName.trim();
        }
        if (userRecord.photoURL && !tokenPhotoURL) {
          tokenPhotoURL = userRecord.photoURL;
        }
      } catch (err) {
        logger.debug({ err: err.message }, 'Failed to fetch user record for Google user');
      }
    }

    const emailPrefix = email ? email.split('@')[0] : '';

    // Load user document from Firestore
    const db = getDb();
    const userDoc = await db.collection('users').doc(uid).get();

    let userData;
    if (!userDoc.exists) {
      // Priority for new users:
      // 1. Google / Firebase verified displayName
      // 2. Email username portion
      // 3. 'User'
      // Never store raw email as displayName
      const initialDisplayName = tokenDisplayName || emailPrefix || 'User';

      userData = {
        uid,
        email: email || '',
        displayName: initialDisplayName,
        photoURL: tokenPhotoURL,
        role: 'user',
        status: 'active',
        bio: '',
        trustScore: 0,
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
      if (userData.trustScore === undefined) {
        userData.trustScore = 0;
      }

      // Check if user is suspended
      if (userData.status === 'suspended') {
        return sendError(res, 'Your account has been suspended. Contact support for help.', 403);
      }

      const userEmail = email || userData.email || '';
      const prefix = userEmail ? userEmail.split('@')[0] : '';
      const currentName = (userData.displayName || '').trim();
      const isCustom = Boolean(userData.isCustomDisplayName);

      // Identify whether displayName was a legacy auto-populated default (email or email prefix)
      const isLegacyDefault =
        !isCustom &&
        (!currentName ||
          currentName.toLowerCase() === userEmail.toLowerCase() ||
          currentName.toLowerCase() === prefix.toLowerCase() ||
          currentName === 'User');

      const updates = { lastLoginAt: new Date().toISOString() };

      if (isGoogleUser && tokenDisplayName) {
        if (isLegacyDefault) {
          updates.displayName = tokenDisplayName;
          userData.displayName = tokenDisplayName;
        }
        if (tokenPhotoURL && (!userData.photoURL || userData.photoURL === '')) {
          updates.photoURL = tokenPhotoURL;
          userData.photoURL = tokenPhotoURL;
        }
      } else if (isLegacyDefault && currentName.toLowerCase() === userEmail.toLowerCase()) {
        const fallback = tokenDisplayName || prefix || 'User';
        updates.displayName = fallback;
        userData.displayName = fallback;
      }

      if (Object.keys(updates).length > 1) {
        updates.updatedAt = new Date().toISOString();
        userData.updatedAt = updates.updatedAt;
        await db.collection('users').doc(uid).update(updates);
      } else {
        // Update last login timestamp (non-blocking)
        db.collection('users').doc(uid).update(updates).catch(() => {});
      }
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
