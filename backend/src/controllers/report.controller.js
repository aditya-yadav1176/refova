'use strict';

const { v4: uuidv4 } = require('uuid');
const { getDb, getAdmin } = require('../config/firebase');
const { sendSuccess, sendError } = require('../utils/response');
const { validate, reportCreate } = require('../utils/validators');
const logger = require('../utils/logger');

const COLLECTION = 'reports';

async function submitReport(req, res, next) {
  try {
    const { errors, value } = validate(reportCreate, req.body);
    if (errors) return sendError(res, 'Validation failed', 400, errors);

    const referralId = req.params.id;
    const reportedBy = req.user.uid;
    const db = getDb();

    // Check if referral exists
    const referralDoc = await db.collection('referrals').doc(referralId).get();
    if (!referralDoc.exists) return sendError(res, 'Referral not found', 404);

    // Dedup: prevent same user reporting same referral more than once per reason
    const existing = await db.collection(COLLECTION)
      .where('referralId', '==', referralId)
      .where('reportedBy', '==', reportedBy)
      .where('status', 'in', ['open', 'pending'])
      .limit(1)
      .get();

    if (!existing.empty) {
      return sendError(res, 'You have already reported this referral. Our team is reviewing it.', 409);
    }

    const now = new Date().toISOString();
    const id = uuidv4();
    const report = {
      id,
      referralId,
      reportedBy,
      reason: value.reason,
      description: value.description || '',
      status: 'open',
      createdAt: now,
      resolvedAt: null,
      resolvedBy: null,
    };

    await db.collection(COLLECTION).doc(id).set(report);

    // Increment reportCount on referral (non-blocking)
    db.collection('referrals').doc(referralId).update({
      reportCount: getAdmin().firestore.FieldValue.increment(1),
    }).catch(() => {});

    // Update user report count
    db.collection('users').doc(reportedBy).update({
      reportsSubmitted: getAdmin().firestore.FieldValue.increment(1),
    }).catch(() => {});

    logger.info({ id, referralId, reportedBy, reason: value.reason }, 'Report submitted');
    return sendSuccess(res, { id }, 'Report submitted. Thank you for helping keep Refova accurate.', 201);
  } catch (err) { next(err); }
}

module.exports = { submitReport };
