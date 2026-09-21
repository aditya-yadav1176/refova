'use strict';

const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { getStorage } = require('../config/firebase');
const logger = require('../utils/logger');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Upload a file buffer to Firebase Storage and return the public URL.
 */
async function uploadImage(buffer, mimeType, folder) {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    const err = new Error(`Invalid file type: ${mimeType}. Allowed: jpeg, png, webp`);
    err.status = 400;
    throw err;
  }

  if (buffer.length > MAX_SIZE_BYTES) {
    const err = new Error('File too large. Maximum size is 5 MB.');
    err.status = 400;
    throw err;
  }

  const ext = mimeType.split('/')[1];
  const filename = `${uuidv4()}.${ext}`;
  const filePath = `${folder}/${filename}`;

  const bucket = getStorage().bucket();
  const file = bucket.file(filePath);

  await file.save(buffer, {
    metadata: { contentType: mimeType },
    resumable: false,
  });

  // Make publicly readable
  await file.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
  logger.info({ filePath, mimeType }, 'File uploaded to Firebase Storage');

  return { url: publicUrl, path: filePath };
}

async function deleteImage(filePath) {
  try {
    const bucket = getStorage().bucket();
    await bucket.file(filePath).delete();
    logger.info({ filePath }, 'File deleted from Firebase Storage');
  } catch (err) {
    logger.warn({ filePath, err: err.message }, 'Failed to delete file from storage');
  }
}

module.exports = { uploadImage, deleteImage, ALLOWED_MIME_TYPES, MAX_SIZE_BYTES };
