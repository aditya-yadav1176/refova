'use strict';

const { getDb, getAdmin } = require('../config/firebase');
const { sendSuccess, sendError } = require('../utils/response');
const { validate, categoryCreate } = require('../utils/validators');
const logger = require('../utils/logger');

const COLLECTION = 'categories';

async function list(req, res, next) {
  try {
    const db = getDb();
    const snap = await db.collection(COLLECTION).where('isActive', '==', true).orderBy('name').get();
    const categories = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return sendSuccess(res, categories);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const db = getDb();
    const doc = await db.collection(COLLECTION).doc(req.params.id).get();
    if (!doc.exists) return sendError(res, 'Category not found', 404);
    return sendSuccess(res, { id: doc.id, ...doc.data() });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { errors, value } = validate(categoryCreate, req.body);
    if (errors) return sendError(res, 'Validation failed', 400, errors);
    const db = getDb();
    const now = new Date().toISOString();
    const ref = await db.collection(COLLECTION).add({
      ...value,
      isActive: true,
      referralCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    const doc = await ref.get();
    return sendSuccess(res, { id: doc.id, ...doc.data() }, 'Category created', 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const db = getDb();
    const doc = await db.collection(COLLECTION).doc(req.params.id).get();
    if (!doc.exists) return sendError(res, 'Category not found', 404);
    await db.collection(COLLECTION).doc(req.params.id).update({ ...req.body, updatedAt: new Date().toISOString() });
    const updated = await db.collection(COLLECTION).doc(req.params.id).get();
    return sendSuccess(res, { id: updated.id, ...updated.data() }, 'Category updated');
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const db = getDb();
    await db.collection(COLLECTION).doc(req.params.id).update({ isActive: false, updatedAt: new Date().toISOString() });
    return sendSuccess(res, null, 'Category deactivated');
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove };
