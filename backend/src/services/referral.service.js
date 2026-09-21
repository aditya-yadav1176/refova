'use strict';

const { v4: uuidv4 } = require('uuid');
const { getDb, getAdmin } = require('../config/firebase');
const logger = require('../utils/logger');

/**
 * referral.service.js — All Firestore operations for referrals
 */

const COLLECTION = 'referrals';
const VALID_STATUSES = ['draft', 'pending', 'published', 'rejected', 'expired', 'suspended'];

function isExpired(referral) {
  if (!referral.expiryDate) return false;
  return new Date(referral.expiryDate) < new Date();
}

function sanitizeReferral(data) {
  if (isExpired(data) && data.status === 'published') {
    return { ...data, status: 'expired' };
  }
  return data;
}

async function getReferralById(id) {
  const db = getDb();
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return sanitizeReferral({ id: doc.id, ...doc.data() });
}

async function listReferrals({ page = 1, limit = 20, search = '', category = '', sort = 'latest', status = 'published', isFeatured = null, isTrending = null, submittedBy = null } = {}) {
  const db = getDb();
  let snap;

  try {
    let q = db.collection(COLLECTION);
    if (submittedBy) {
      q = q.where('submittedBy', '==', submittedBy);
    } else if (category && category !== 'all') {
      q = q.where('categoryId', '==', category);
    }
    snap = await q.get();
  } catch (err) {
    logger.warn({ err: err.message }, 'Single-field query failed; fetching base collection');
    snap = await db.collection(COLLECTION).get();
  }

  let results = snap.docs.map((d) => sanitizeReferral({ id: d.id, ...d.data() }));

  // In-memory filter: allow published or any draft/pending so newly created referrals are immediately live
  if (status && status !== 'all') {
    results = results.filter((r) => r.status === status || (status === 'published' && (r.status === 'draft' || r.status === 'pending')));
  }
  if (category && category !== 'all') {
    results = results.filter((r) => r.categoryId === category);
  }
  if (isFeatured !== null) {
    results = results.filter((r) => r.isFeatured === isFeatured);
  }
  if (isTrending !== null) {
    results = results.filter((r) => r.isTrending === isTrending);
  }
  if (submittedBy) {
    results = results.filter((r) => r.submittedBy === submittedBy);
  }

  // Sort
  if (sort === 'popular') {
    results.sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0));
  } else {
    results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  // Client-side search (Firestore doesn't support full-text search natively)
  if (search && search.trim()) {
    const q_lower = search.trim().toLowerCase();
    results = results.filter((r) =>
      (r.brandName || '').toLowerCase().includes(q_lower) ||
      (r.benefitHeadline || '').toLowerCase().includes(q_lower) ||
      (r.description || '').toLowerCase().includes(q_lower) ||
      (r.categoryName || '').toLowerCase().includes(q_lower) ||
      (r.title || '').toLowerCase().includes(q_lower)
    );
  }

  const total = results.length;
  const offset = (page - 1) * limit;
  const paginated = results.slice(offset, offset + limit);

  return { referrals: paginated, total };
}

async function createReferral(uid, displayName, data) {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  // Duplicate check: same brandName + referralCode
  if (data.referralCode && data.brandName) {
    const dupSnap = await db.collection(COLLECTION)
      .where('brandName', '==', data.brandName)
      .where('referralCode', '==', data.referralCode)
      .where('status', 'in', ['pending', 'published'])
      .limit(1)
      .get();
    if (!dupSnap.empty) {
      const err = new Error('A referral with this brand name and code already exists.');
      err.status = 409;
      throw err;
    }
  }

  const referral = {
    id,
    brandName: data.brandName || '',
    title: data.title || '',
    categoryId: data.categoryId || '',
    categoryName: data.categoryName || '',
    benefitHeadline: data.benefitHeadline || '',
    description: data.description || '',
    referralCode: data.referralCode || '',
    referralUrl: data.referralUrl || '',
    conditions: data.conditions || [],
    expiryDate: data.expiryDate || null,
    imageUrl: data.imageUrl || null,
    imagePath: data.imagePath || null,
    submittedBy: uid,
    submittedByName: displayName,
    status: 'published',
    verificationStatus: 'unverified',
    isFeatured: false,
    isTrending: false,
    copyCount: 0,
    viewCount: 0,
    reportCount: 0,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  };

  await db.collection(COLLECTION).doc(id).set(referral);
  logger.info({ id, uid, brandName: data.brandName }, 'Referral created');
  return referral;
}

async function updateReferral(id, uid, role, updates) {
  const db = getDb();
  const existing = await getReferralById(id);
  if (!existing) {
    const err = new Error('Referral not found'); err.status = 404; throw err;
  }

  // Ownership check
  if (role !== 'admin' && existing.submittedBy !== uid) {
    const err = new Error('You can only edit your own referrals'); err.status = 403; throw err;
  }

  // Non-admins cannot edit published referrals
  if (role !== 'admin' && existing.status === 'published') {
    const err = new Error('Published referrals cannot be edited. Contact support.'); err.status = 403; throw err;
  }

  // Strip server-controlled fields
  const safe = { ...updates };
  delete safe.submittedBy; delete safe.submittedByName; delete safe.status;
  delete safe.verificationStatus; delete safe.copyCount; delete safe.viewCount;
  delete safe.reportCount; delete safe.isFeatured; delete safe.isTrending;
  delete safe.createdAt; delete safe.publishedAt; delete safe.id;
  safe.updatedAt = new Date().toISOString();

  await db.collection(COLLECTION).doc(id).update(safe);
  return getReferralById(id);
}

async function submitReferral(id, uid) {
  const db = getDb();
  const existing = await getReferralById(id);
  if (!existing) { const err = new Error('Referral not found'); err.status = 404; throw err; }
  if (existing.submittedBy !== uid) { const err = new Error('Not your referral'); err.status = 403; throw err; }
  if (existing.status !== 'draft') { const err = new Error('Only draft referrals can be submitted'); err.status = 400; throw err; }

  const now = new Date().toISOString();
  await db.collection(COLLECTION).doc(id).update({ status: 'pending', updatedAt: now });
  logger.info({ id, uid }, 'Referral submitted for review');
  return getReferralById(id);
}

async function softDeleteReferral(id, uid, role) {
  const db = getDb();
  const existing = await getReferralById(id);
  if (!existing) { const err = new Error('Referral not found'); err.status = 404; throw err; }
  if (role !== 'admin' && existing.submittedBy !== uid) { const err = new Error('Forbidden'); err.status = 403; throw err; }

  await db.collection(COLLECTION).doc(id).update({ status: 'suspended', updatedAt: new Date().toISOString() });
  logger.info({ id, uid, role }, 'Referral soft-deleted (suspended)');
}

async function recordCopy(id, uid) {
  const db = getDb();
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) { const err = new Error('Referral not found'); err.status = 404; throw err; }

  const data = doc.data();
  const referral = sanitizeReferral({ id, ...data });
  if (referral.status !== 'published') {
    const err = new Error('This referral is not available'); err.status = 404; throw err;
  }

  // Increment copyCount atomically
  await ref.update({ copyCount: getAdmin().firestore.FieldValue.increment(1) });

  // Update user stats (non-blocking)
  if (uid) {
    db.collection('users').doc(uid).update({
      referralsCopied: getAdmin().firestore.FieldValue.increment(1),
    }).catch(() => {});
  }

  // Update global counters (non-blocking)
  db.collection('counters').doc('global').update({
    codesCopied: getAdmin().firestore.FieldValue.increment(1),
  }).catch(() => {});

  return { referralCode: data.referralCode, referralUrl: data.referralUrl };
}

async function recordView(id) {
  const db = getDb();
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return;
  // Non-blocking
  ref.update({ viewCount: getAdmin().firestore.FieldValue.increment(1) }).catch(() => {});
}

// ─── Admin operations ─────────────────────────────────────────────────────────

async function approveReferral(id, adminUid) {
  const db = getDb();
  const now = new Date().toISOString();
  await db.collection(COLLECTION).doc(id).update({
    status: 'published',
    publishedAt: now,
    updatedAt: now,
  });
  await db.collection('counters').doc('global').update({
    referralsShared: getAdmin().firestore.FieldValue.increment(1),
  }).catch(() => {});
  logger.info({ id, adminUid }, 'Referral approved');
  await writeAuditLog('REFERRAL_APPROVED', adminUid, 'referral', id);
}

async function rejectReferral(id, adminUid, reason) {
  const db = getDb();
  await db.collection(COLLECTION).doc(id).update({
    status: 'rejected',
    rejectionReason: reason || '',
    updatedAt: new Date().toISOString(),
  });
  logger.info({ id, adminUid, reason }, 'Referral rejected');
  await writeAuditLog('REFERRAL_REJECTED', adminUid, 'referral', id, { reason });
}

async function verifyReferral(id, adminUid) {
  const db = getDb();
  await db.collection(COLLECTION).doc(id).update({
    verificationStatus: 'verified',
    updatedAt: new Date().toISOString(),
  });
  await writeAuditLog('REFERRAL_VERIFIED', adminUid, 'referral', id);
}

async function suspendReferral(id, adminUid) {
  const db = getDb();
  await db.collection(COLLECTION).doc(id).update({
    status: 'suspended',
    updatedAt: new Date().toISOString(),
  });
  await writeAuditLog('REFERRAL_SUSPENDED', adminUid, 'referral', id);
}

async function toggleFeatured(id, adminUid) {
  const db = getDb();
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) { const err = new Error('Referral not found'); err.status = 404; throw err; }
  const current = doc.data().isFeatured || false;
  await db.collection(COLLECTION).doc(id).update({ isFeatured: !current, updatedAt: new Date().toISOString() });
  return { isFeatured: !current };
}

async function toggleTrending(id, adminUid) {
  const db = getDb();
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) { const err = new Error('Referral not found'); err.status = 404; throw err; }
  const current = doc.data().isTrending || false;
  await db.collection(COLLECTION).doc(id).update({ isTrending: !current, updatedAt: new Date().toISOString() });
  return { isTrending: !current };
}

async function writeAuditLog(action, adminUid, targetType, targetId, metadata = {}) {
  try {
    const db = getDb();
    await db.collection('auditLogs').add({
      action,
      adminUid,
      targetType,
      targetId,
      metadata,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    logger.error({ err }, 'Failed to write audit log');
  }
}

async function getUserReferrals(uid, { page = 1, limit = 20 } = {}) {
  return listReferrals({ submittedBy: uid, status: null, page, limit });
}

module.exports = {
  getReferralById, listReferrals, createReferral, updateReferral,
  submitReferral, softDeleteReferral, recordCopy, recordView,
  approveReferral, rejectReferral, verifyReferral, suspendReferral,
  toggleFeatured, toggleTrending, getUserReferrals, writeAuditLog,
};
