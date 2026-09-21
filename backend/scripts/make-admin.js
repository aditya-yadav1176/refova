'use strict';

/**
 * make-admin.js
 * Run: node scripts/make-admin.js user@example.com
 *
 * Sets the specified user's role to 'admin' in Firestore.
 * The user must have already signed up (so their UID exists in Firebase Auth).
 *
 * SECURITY: This script should only be run by a trusted administrator
 * with access to the backend server or Firebase credentials.
 */

require('dotenv').config();
const { getDb, getAuth, initFirebase } = require('../src/config/firebase');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/make-admin.js user@example.com');
    process.exit(1);
  }

  initFirebase();
  const auth = getAuth();
  const db = getDb();

  // Look up the Firebase user by email
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
  } catch (err) {
    console.error(`❌ No Firebase Auth user found with email: ${email}`);
    console.error('The user must sign up first before being promoted to admin.');
    process.exit(1);
  }

  const { uid } = userRecord;
  await db.collection('users').doc(uid).set({
    uid,
    email,
    role: 'admin',
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  console.log(`✅ User ${email} (uid: ${uid}) has been promoted to admin.`);
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
