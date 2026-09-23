'use strict';

/**
 * notification.service.js — Placeholder for future notification system.
 * Replace stubs with real email/push notification logic.
 */

const logger = require('../utils/logger');

async function notifyReferralApproved(uid, referralId) {
  // TODO: Send email via SendGrid/Resend when ready
  logger.info({ uid, referralId }, 'Referral approved notification');
}

async function notifyReferralRejected(uid, referralId, reason) {
  logger.info({ uid, referralId, reason }, 'Referral rejected notification');
}

async function notifyReferralCopied(ownerUid, referralId) {
  // Could aggregate and send a daily digest instead of per-copy
  void ownerUid; void referralId;
}

module.exports = { notifyReferralApproved, notifyReferralRejected, notifyReferralCopied };
