'use strict';

const { createUser, getUserById } = require('../services/user.service');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');
const env = require('../config/env');
const { getDb } = require('../config/firebase');

/**
 * POST /api/auth/register
 * Called by frontend after Firebase creates the user.
 * Creates/upserts the Firestore user document.
 */
async function register(req, res, next) {
  try {
    const { uid, email, displayName, photoURL } = req.user; // set by auth middleware
    const existing = await getUserById(uid);
    if (existing) {
      return sendSuccess(res, existing, 'User already exists');
    }
    const user = await createUser(uid, { email, displayName, photoURL });
    return sendSuccess(res, user, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/me
 * Sync user on each login — updates lastLoginAt, returns user data.
 */
async function syncMe(req, res, next) {
  try {
    const { uid } = req.user;
    const db = getDb();
    await db.collection('users').doc(uid).update({ lastLoginAt: new Date().toISOString() });
    const user = await getUserById(uid);
    return sendSuccess(res, user, 'Synced');
  } catch (err) {
    next(err);
  }
}

module.exports = { register, syncMe };
