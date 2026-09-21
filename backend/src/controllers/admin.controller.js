'use strict';

const { getDb } = require('../config/firebase');
const {
  approveReferral, rejectReferral, verifyReferral, suspendReferral,
  toggleFeatured, toggleTrending, listReferrals, getReferralById, writeAuditLog,
} = require('../services/referral.service');
const { listUsers, setUserStatus, setUserRole } = require('../services/user.service');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const { validate, adminReject, adminUserStatus, adminUserRole } = require('../utils/validators');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const logger = require('../utils/logger');

// GET /api/admin/dashboard
async function dashboard(req, res, next) {
  try {
    const db = getDb();
    const [
      totalUsersSnap, allReferralsSnap, pendingSnap, publishedSnap,
      rejectedSnap, reportsSnap, categoriesSnap
    ] = await Promise.all([
      db.collection('users').get(),
      db.collection('referrals').get(),
      db.collection('referrals').where('status', '==', 'pending').get(),
      db.collection('referrals').where('status', '==', 'published').get(),
      db.collection('referrals').where('status', '==', 'rejected').get(),
      db.collection('reports').where('status', '==', 'open').get(),
      db.collection('categories').where('isActive', '==', true).get(),
    ]);

    const allDocs = allReferralsSnap.docs.map((d) => d.data());
    const totalCopies = allDocs.reduce((n, r) => n + (r.copyCount || 0), 0);
    const totalViews = allDocs.reduce((n, r) => n + (r.viewCount || 0), 0);

    return sendSuccess(res, {
      totalUsers: totalUsersSnap.size,
      totalReferrals: allReferralsSnap.size,
      publishedReferrals: publishedSnap.size,
      pendingReferrals: pendingSnap.size,
      rejectedReferrals: rejectedSnap.size,
      reportedReferrals: reportsSnap.size,
      activeCategories: categoriesSnap.size,
      totalCopies,
      totalViews,
    });
  } catch (err) { next(err); }
}

// GET /api/admin/referrals
async function adminListReferrals(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const { status, category, search, sort } = req.query;
    const { referrals, total } = await listReferrals({ page, limit, status, category, search, sort });
    return sendPaginated(res, referrals, buildPaginationMeta(page, limit, total));
  } catch (err) { next(err); }
}

// PATCH /api/admin/referrals/:id/approve
async function approve(req, res, next) {
  try {
    await approveReferral(req.params.id, req.user.uid);
    return sendSuccess(res, null, 'Referral approved and published');
  } catch (err) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

// PATCH /api/admin/referrals/:id/reject
async function reject(req, res, next) {
  try {
    const { errors, value } = validate(adminReject, req.body);
    if (errors) return sendError(res, 'Validation failed', 400, errors);
    await rejectReferral(req.params.id, req.user.uid, value.reason);
    return sendSuccess(res, null, 'Referral rejected');
  } catch (err) { next(err); }
}

// PATCH /api/admin/referrals/:id/verify
async function verify(req, res, next) {
  try {
    await verifyReferral(req.params.id, req.user.uid);
    return sendSuccess(res, null, 'Referral verified');
  } catch (err) { next(err); }
}

// PATCH /api/admin/referrals/:id/suspend
async function suspend(req, res, next) {
  try {
    await suspendReferral(req.params.id, req.user.uid);
    return sendSuccess(res, null, 'Referral suspended');
  } catch (err) { next(err); }
}

// PATCH /api/admin/referrals/:id/feature
async function featureToggle(req, res, next) {
  try {
    const result = await toggleFeatured(req.params.id, req.user.uid);
    return sendSuccess(res, result, `Referral ${result.isFeatured ? 'featured' : 'unfeatured'}`);
  } catch (err) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

// PATCH /api/admin/referrals/:id/trending
async function trendingToggle(req, res, next) {
  try {
    const result = await toggleTrending(req.params.id, req.user.uid);
    return sendSuccess(res, result, `Referral ${result.isTrending ? 'marked trending' : 'removed from trending'}`);
  } catch (err) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

// GET /api/admin/users
async function adminListUsers(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const offset = (page - 1) * limit;
    const { status } = req.query;
    const { users, total } = await listUsers({ limit, offset, status: status || null });
    return sendPaginated(res, users, buildPaginationMeta(page, limit, total));
  } catch (err) { next(err); }
}

// PATCH /api/admin/users/:uid/status
async function updateUserStatus(req, res, next) {
  try {
    const { errors, value } = validate(adminUserStatus, req.body);
    if (errors) return sendError(res, 'Validation failed', 400, errors);
    await setUserStatus(req.params.uid, value.status);
    await writeAuditLog('USER_SUSPENDED', req.user.uid, 'user', req.params.uid, { status: value.status });
    return sendSuccess(res, null, `User status set to ${value.status}`);
  } catch (err) { next(err); }
}

// PATCH /api/admin/users/:uid/role
async function updateUserRole(req, res, next) {
  try {
    const { errors, value } = validate(adminUserRole, req.body);
    if (errors) return sendError(res, 'Validation failed', 400, errors);
    if (req.params.uid === req.user.uid) {
      return sendError(res, 'You cannot change your own role', 400);
    }
    await setUserRole(req.params.uid, value.role);
    await writeAuditLog('ROLE_CHANGED', req.user.uid, 'user', req.params.uid, { role: value.role });
    return sendSuccess(res, null, `User role set to ${value.role}`);
  } catch (err) { next(err); }
}

// GET /api/admin/reports
async function adminListReports(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const offset = (page - 1) * limit;
    const { status = 'open' } = req.query;
    const db = getDb();
    let q = db.collection('reports').orderBy('createdAt', 'desc');
    if (status) q = q.where('status', '==', status);
    const snap = await q.get();
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const total = all.length;
    return sendPaginated(res, all.slice(offset, offset + limit), buildPaginationMeta(page, limit, total));
  } catch (err) { next(err); }
}

// PATCH /api/admin/reports/:id/resolve
async function resolveReport(req, res, next) {
  try {
    const db = getDb();
    const now = new Date().toISOString();
    await db.collection('reports').doc(req.params.id).update({
      status: 'resolved',
      resolvedAt: now,
      resolvedBy: req.user.uid,
    });
    return sendSuccess(res, null, 'Report resolved');
  } catch (err) { next(err); }
}

// PATCH /api/admin/reports/:id/reject
async function rejectReport(req, res, next) {
  try {
    const db = getDb();
    const now = new Date().toISOString();
    await db.collection('reports').doc(req.params.id).update({
      status: 'dismissed',
      resolvedAt: now,
      resolvedBy: req.user.uid,
    });
    return sendSuccess(res, null, 'Report dismissed');
  } catch (err) { next(err); }
}

module.exports = {
  dashboard, adminListReferrals, approve, reject, verify, suspend,
  featureToggle, trendingToggle, adminListUsers, updateUserStatus,
  updateUserRole, adminListReports, resolveReport, rejectReport,
};
