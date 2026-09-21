'use strict';

const { Router } = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const { register, syncMe } = require('../controllers/auth.controller');

const router = Router();

router.post('/register', authLimiter, authenticate, register);
router.post('/me', authLimiter, authenticate, syncMe);

module.exports = router;
