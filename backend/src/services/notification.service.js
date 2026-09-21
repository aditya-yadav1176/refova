'use strict';

/**
 * notification.service.js — Placeholder for future notification system.
 * Replace stubs with real email/push notification logic.
 */

async function notifyReferralApproved(uid, referralId) {
  // TODO: Send email via SendGrid/Resend when ready
  console.log(`[notification] Referral ${referralId} approved — notify user ${uid}`);
}

async function notifyReferralRejected(uid, referralId, reason) {
  console.log(`[notification] Referral ${referralId} rejected — notify user ${uid}: ${reason}`);
}

async function notifyReferralCopied(ownerUid, referralId) {
  // Could aggregate and send a daily digest instead of per-copy
  void ownerUid; void referralId;
}

module.exports = { notifyReferralApproved, notifyReferralRejected, notifyReferralCopied };
