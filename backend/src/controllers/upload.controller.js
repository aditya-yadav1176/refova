'use strict';

const multer = require('multer');
const { uploadImage } = require('../services/storage.service');
const { sendSuccess, sendError } = require('../utils/response');
const { getDb } = require('../config/firebase');
const logger = require('../utils/logger');

// Store files in memory (buffer) — we upload directly to Firebase Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

const uploadMiddleware = upload.single('image');

// POST /api/uploads/referral
async function uploadReferralImage(req, res, next) {
  uploadMiddleware(req, res, async (err) => {
    if (err) return sendError(res, err.message, 400);
    if (!req.file) return sendError(res, 'No file uploaded', 400);

    try {
      const { buffer, mimetype } = req.file;
      const folder = `referrals/${req.user.uid}`;
      const { url, path } = await uploadImage(buffer, mimetype, folder);
      return sendSuccess(res, { url, path }, 'Image uploaded', 201);
    } catch (uploadErr) {
      if (uploadErr.status) return sendError(res, uploadErr.message, uploadErr.status);
      next(uploadErr);
    }
  });
}

// POST /api/uploads/profile
async function uploadProfileImage(req, res, next) {
  uploadMiddleware(req, res, async (err) => {
    if (err) return sendError(res, err.message, 400);
    if (!req.file) return sendError(res, 'No file uploaded', 400);

    try {
      const { buffer, mimetype } = req.file;
      const folder = `users/${req.user.uid}/profile`;
      const { url, path } = await uploadImage(buffer, mimetype, folder);

      // Update user photoURL in Firestore
      const db = getDb();
      await db.collection('users').doc(req.user.uid).update({
        photoURL: url,
        updatedAt: new Date().toISOString(),
      });

      return sendSuccess(res, { url, path }, 'Profile image uploaded', 201);
    } catch (uploadErr) {
      if (uploadErr.status) return sendError(res, uploadErr.message, uploadErr.status);
      next(uploadErr);
    }
  });
}

module.exports = { uploadReferralImage, uploadProfileImage };
