'use strict';

const { Router } = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { uploadLimiter } = require('../middleware/rateLimit.middleware');
const { uploadReferralImage, uploadProfileImage } = require('../controllers/upload.controller');

const router = Router();

router.post('/referral', uploadLimiter, authenticate, uploadReferralImage);
router.post('/profile', uploadLimiter, authenticate, uploadProfileImage);

module.exports = router;
