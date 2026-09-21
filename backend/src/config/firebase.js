'use strict';

const admin = require('firebase-admin');
const env = require('./env');

let _db = null;
let _storage = null;
let _auth = null;

function initFirebase() {
  if (admin.apps.length > 0) return;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY,
    }),
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
  });
}

function getDb() {
  if (!_db) {
    initFirebase();
    _db = admin.firestore();
  }
  return _db;
}

function getStorage() {
  if (!_storage) {
    initFirebase();
    _storage = admin.storage();
  }
  return _storage;
}

function getAuth() {
  if (!_auth) {
    initFirebase();
    _auth = admin.auth();
  }
  return _auth;
}

function getAdmin() {
  initFirebase();
  return admin;
}

module.exports = { getDb, getStorage, getAuth, getAdmin, initFirebase };
