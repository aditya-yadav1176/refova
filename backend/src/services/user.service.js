'use strict';

const { getDb } = require('../config/firebase');
const logger = require('../utils/logger');

/**
 * user.service.js — All Firestore operations for users
 */

async function getUserById(uid) {
  const db = getDb();
  const doc = await db.collection('users').doc(uid).get();
  if (!doc.exists) return null;
  return doc.data();
}

async function createUser(uid, data) {
  const db = getDb();
  const now = new Date().toISOString();
  const userData = {
    uid,
    email: data.email || '',
    displayName: data.displayName || data.email?.split('@')[0] || 'User',
    photoURL: data.photoURL || null,
    role: 'user',
    status: 'active',
    bio: '',
    referralsPosted: 0,
    referralsCopied: 0,
    reportsSubmitted: 0,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  };
  await db.collection('users').doc(uid).set(userData, { merge: true });
  logger.info({ uid }, 'User created in Firestore');
  return userData;
}

async function updateUser(uid, updates) {
  const db = getDb();
  // Strip fields users cannot self-modify
  const safe = { ...updates };
  delete safe.role;
  delete safe.status;
  delete safe.uid;
  delete safe.email;
  delete safe.referralsPosted;
  delete safe.referralsCopied;
  delete safe.reportsSubmitted;
  delete safe.createdAt;
  safe.updatedAt = new Date().toISOString();

  await db.collection('users').doc(uid).update(safe);
  return getUserById(uid);
}

async function getUserStats(uid) {
  const db = getDb();
  const [referralsSnap] = await Promise.all([
    db.collection('referrals').where('submittedBy', '==', uid).get(),
  ]);

  const referrals = referralsSnap.docs.map((d) => d.data());
  const published = referrals.filter((r) => r.status === 'published');
  const pending = referrals.filter((r) => r.status === 'pending');
  const rejected = referrals.filter((r) => r.status === 'rejected');
  const totalCopies = referrals.reduce((n, r) => n + (r.copyCount || 0), 0);

  return {
    totalReferrals: referrals.length,
    published: published.length,
    pending: pending.length,
    rejected: rejected.length,
    totalCopies,
  };
}

async function listUsers({ limit = 20, offset = 0, status = null } = {}) {
  const db = getDb();
  let q = db.collection('users').orderBy('createdAt', 'desc');
  if (status) q = q.where('status', '==', status);

  const snap = await q.get();
  const all = snap.docs.map((d) => d.data());
  const total = all.length;
  return { users: all.slice(offset, offset + limit), total };
}

async function setUserStatus(uid, status) {
  const db = getDb();
  await db.collection('users').doc(uid).update({ status, updatedAt: new Date().toISOString() });
  logger.info({ uid, status }, 'User status updated');
}

async function setUserRole(uid, role) {
  const db = getDb();
  await db.collection('users').doc(uid).update({ role, updatedAt: new Date().toISOString() });
  logger.info({ uid, role }, 'User role updated');
}

module.exports = { getUserById, createUser, updateUser, getUserStats, listUsers, setUserStatus, setUserRole };
