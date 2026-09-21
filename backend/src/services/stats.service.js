'use strict';

const { getDb, getAdmin } = require('../config/firebase');
const logger = require('../utils/logger');

const COUNTERS_DOC = 'counters/global';

async function getHomeStats() {
  const db = getDb();
  try {
    const doc = await db.doc(COUNTERS_DOC).get();
    if (doc.exists) {
      const data = doc.data();
      return {
        referralsShared: data.referralsShared || 0,
        codesCopied: data.codesCopied || 0,
        categoriesCount: data.categoriesCount || 8,
        workingPercentage: data.workingPercentage || 94,
      };
    }
  } catch (err) {
    logger.error({ err }, 'Failed to read stats counters');
  }

  // Fallback: compute from data
  const db2 = getDb();
  const [referralsSnap, copiesSnap] = await Promise.all([
    db2.collection('referrals').where('status', '==', 'published').get(),
    db2.collection('referrals').get(),
  ]);
  const totalCopies = copiesSnap.docs.reduce((n, d) => n + (d.data().copyCount || 0), 0);
  const totalReports = copiesSnap.docs.reduce((n, d) => n + (d.data().reportCount || 0), 0);
  const total = copiesSnap.size;
  const workingPercentage = total > 0 ? Math.round(((total - totalReports) / total) * 100) : 94;

  return {
    referralsShared: referralsSnap.size,
    codesCopied: totalCopies,
    categoriesCount: 8,
    workingPercentage: Math.max(80, Math.min(99, workingPercentage)),
  };
}

async function initCounters() {
  const db = getDb();
  await db.doc(COUNTERS_DOC).set({
    referralsShared: 0,
    codesCopied: 0,
    categoriesCount: 8,
    workingPercentage: 94,
    createdAt: new Date().toISOString(),
  }, { merge: true });
  logger.info('Counters initialized');
}

module.exports = { getHomeStats, initCounters };
