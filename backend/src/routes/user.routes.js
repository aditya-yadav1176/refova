'use strict';

const { Router } = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { getMe, updateMe, getMyReferrals, getMyStats, getMyReports } = require('../controllers/user.controller');

const router = Router();

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);
router.get('/me/referrals', authenticate, getMyReferrals);
router.get('/me/stats', authenticate, getMyStats);
router.get('/me/reports', authenticate, getMyReports);

module.exports = router;
