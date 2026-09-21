'use strict';

/**
 * seed-categories.js
 * Run: node scripts/seed-categories.js
 *
 * Seeds the 8 initial categories into Firestore.
 * Safe to run multiple times — uses merge so existing data is preserved.
 */

require('dotenv').config();
const { getDb, initFirebase } = require('../src/config/firebase');

const CATEGORIES = [
  { id: 'finance', name: 'Finance & Payments', slug: 'finance', description: 'Banks, UPI apps, brokers, cards', icon: '₹', color: '#22c55e', isActive: true, referralCount: 0 },
  { id: 'shopping', name: 'Shopping', slug: 'shopping', description: 'Marketplaces, fashion, electronics', icon: '🛍', color: '#a855f7', isActive: true, referralCount: 0 },
  { id: 'food', name: 'Food & Delivery', slug: 'food', description: 'Delivery apps, cloud kitchens, groceries', icon: '🍜', color: '#ef4444', isActive: true, referralCount: 0 },
  { id: 'travel', name: 'Travel', slug: 'travel', description: 'Flights, stays, cabs and rentals', icon: '✈', color: '#3b82f6', isActive: true, referralCount: 0 },
  { id: 'education', name: 'Education', slug: 'education', description: 'Courses, test prep, certifications', icon: '✎', color: '#f59e0b', isActive: true, referralCount: 0 },
  { id: 'productivity', name: 'Productivity', slug: 'productivity', description: 'Notes, tasks, design and AI tools', icon: '◎', color: '#a855f7', isActive: true, referralCount: 0 },
  { id: 'developer', name: 'Developer Tools', slug: 'developer', description: 'Hosting, databases, monitoring', icon: '⌘', color: '#3b82f6', isActive: true, referralCount: 0 },
  { id: 'entertainment', name: 'Entertainment', slug: 'entertainment', description: 'Streaming, music, gaming', icon: '▶', color: '#ef4444', isActive: true, referralCount: 0 },
];

async function main() {
  initFirebase();
  const db = getDb();
  const now = new Date().toISOString();
  const batch = db.batch();

  for (const cat of CATEGORIES) {
    const ref = db.collection('categories').doc(cat.id);
    batch.set(ref, { ...cat, createdAt: now, updatedAt: now }, { merge: true });
  }

  await batch.commit();
  console.log(`✅ Seeded ${CATEGORIES.length} categories`);
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
