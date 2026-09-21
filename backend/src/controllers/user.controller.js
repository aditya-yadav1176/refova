'use strict';

const { getUserById, updateUser, getUserStats, listUsers, setUserStatus, setUserRole } = require('../services/user.service');
const { getUserReferrals } = require('../services/referral.service');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const { validate, userProfileUpdate } = require('../utils/validators');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const { getDb } = require('../config/firebase');
const logger = require('../utils/logger');

async function getMe(req, res, next) {
  try {
    const user = req.user || await getUserById(req.user?.uid);
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, user);
  } catch (err) { next(err); }
}

async function updateMe(req, res, next) {
  try {
    const { errors, value } = validate(userProfileUpdate, req.body);
    if (errors) return sendError(res, 'Validation failed', 400, errors);
    const user = await updateUser(req.user.uid, value);
    return sendSuccess(res, user, 'Profile updated');
  } catch (err) { next(err); }
}

async function getMyReferrals(req, res, next) {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { referrals, total } = await getUserReferrals(req.user.uid, { page, limit });
    return sendPaginated(res, referrals, buildPaginationMeta(page, limit, total));
  } catch (err) { next(err); }
}

async function getMyStats(req, res, next) {
  try {
    const stats = await getUserStats(req.user.uid);
    return sendSuccess(res, stats);
  } catch (err) { next(err); }
}

async function getMyReports(req, res, next) {
  try {
    const db = getDb();
    const snap = await db.collection('reports').where('reportedBy', '==', req.user.uid).orderBy('createdAt', 'desc').limit(50).get();
    const reports = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return sendSuccess(res, reports);
  } catch (err) { next(err); }
}

module.exports = { getMe, updateMe, getMyReferrals, getMyStats, getMyReports };
