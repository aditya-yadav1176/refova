'use strict';

/**
 * seed-counters.js
 * Run: node scripts/seed-counters.js
 *
 * Initializes the global counters document in Firestore.
 */

require('dotenv').config();
const { getDb, initFirebase } = require('../src/config/firebase');

async function main() {
  initFirebase();
  const db = getDb();
  await db.collection('counters').doc('global').set({
    referralsShared: 0,
    codesCopied: 0,
    categoriesCount: 8,
    workingPercentage: 94,
    createdAt: new Date().toISOString(),
  }, { merge: true });
  console.log('✅ Counters initialized');
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
