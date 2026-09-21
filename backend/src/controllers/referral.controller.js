'use strict';

const {
  getReferralById, listReferrals, createReferral, updateReferral,
  submitReferral, softDeleteReferral, recordCopy, recordView,
} = require('../services/referral.service');
const { parseReferral } = require('../services/referralParser.service');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const { validate, referralCreate, referralUpdate, referralParse } = require('../utils/validators');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const logger = require('../utils/logger');

// GET /api/referrals
async function list(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const { search = '', category = '', sort = 'latest' } = req.query;
    const { referrals, total } = await listReferrals({ page, limit, search, category, sort, status: 'published' });
    return sendPaginated(res, referrals, buildPaginationMeta(page, limit, total));
  } catch (err) { next(err); }
}

// GET /api/referrals/featured
async function featured(req, res, next) {
  try {
    const { referrals } = await listReferrals({ status: 'published', isFeatured: true, limit: 10 });
    return sendSuccess(res, referrals);
  } catch (err) { next(err); }
}

// GET /api/referrals/trending
async function trending(req, res, next) {
  try {
    const { referrals } = await listReferrals({ status: 'published', isTrending: true, limit: 10, sort: 'popular' });
    return sendSuccess(res, referrals);
  } catch (err) { next(err); }
}

// GET /api/referrals/:id
async function getById(req, res, next) {
  try {
    // Non-blocking view count
    recordView(req.params.id).catch(() => {});
    const referral = await getReferralById(req.params.id);
    if (!referral) return sendError(res, 'Referral not found', 404);
    // Hide rejected/suspended from public (admins can see via admin routes)
    if (referral.status !== 'published' && referral.status !== 'draft' && referral.status !== 'pending' && (!req.user || req.user.role !== 'admin')) {
      if (!req.user || referral.submittedBy !== req.user.uid) {
        return sendError(res, 'Referral not found', 404);
      }
    }
    return sendSuccess(res, referral);
  } catch (err) { next(err); }
}

// POST /api/referrals
async function create(req, res, next) {
  try {
    const { errors, value } = validate(referralCreate, req.body);
    if (errors) return sendError(res, 'Validation failed', 400, errors);
    const referral = await createReferral(req.user.uid, req.user.displayName, value);
    return sendSuccess(res, referral, 'Referral created as draft', 201);
  } catch (err) {
    if (err.status === 409) return sendError(res, err.message, 409);
    next(err);
  }
}

// PUT /api/referrals/:id
async function update(req, res, next) {
  try {
    const { errors, value } = validate(referralUpdate, req.body);
    if (errors) return sendError(res, 'Validation failed', 400, errors);
    const referral = await updateReferral(req.params.id, req.user.uid, req.user.role, value);
    return sendSuccess(res, referral, 'Referral updated');
  } catch (err) {
    if (err.status === 403 || err.status === 404) return sendError(res, err.message, err.status);
    next(err);
  }
}

// DELETE /api/referrals/:id
async function remove(req, res, next) {
  try {
    await softDeleteReferral(req.params.id, req.user.uid, req.user.role);
    return sendSuccess(res, null, 'Referral removed');
  } catch (err) {
    if (err.status === 403 || err.status === 404) return sendError(res, err.message, err.status);
    next(err);
  }
}

// POST /api/referrals/:id/submit
async function submit(req, res, next) {
  try {
    const referral = await submitReferral(req.params.id, req.user.uid);
    return sendSuccess(res, referral, 'Referral submitted for review');
  } catch (err) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

// POST /api/referrals/:id/copy
async function copy(req, res, next) {
  try {
    const result = await recordCopy(req.params.id, req.user?.uid);
    return sendSuccess(res, result, 'Referral code retrieved');
  } catch (err) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

// POST /api/referrals/:id/view
async function view(req, res, next) {
  try {
    recordView(req.params.id).catch(() => {});
    return sendSuccess(res, null, 'View recorded');
  } catch (err) { next(err); }
}

// POST /api/referrals/parse
async function parse(req, res, next) {
  try {
    const { errors, value } = validate(require('../utils/validators').referralParse, req.body);
    if (errors) return sendError(res, 'Validation failed', 400, errors);
    const parsed = await parseReferral(value.text);
    return sendSuccess(res, parsed, 'Referral parsed');
  } catch (err) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

module.exports = { list, featured, trending, getById, create, update, remove, submit, copy, view, parse };
