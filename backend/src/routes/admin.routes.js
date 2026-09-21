'use strict';

const { Router } = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');
const admin = require('../controllers/admin.controller');

const router = Router();

// All admin routes require auth + admin role
router.use(authenticate, requireAdmin);

router.get('/dashboard', admin.dashboard);
router.get('/referrals', admin.adminListReferrals);
router.patch('/referrals/:id/approve', admin.approve);
router.patch('/referrals/:id/reject', admin.reject);
router.patch('/referrals/:id/verify', admin.verify);
router.patch('/referrals/:id/suspend', admin.suspend);
router.patch('/referrals/:id/feature', admin.featureToggle);
router.patch('/referrals/:id/trending', admin.trendingToggle);
router.get('/users', admin.adminListUsers);
router.patch('/users/:uid/status', admin.updateUserStatus);
router.patch('/users/:uid/role', admin.updateUserRole);
router.get('/reports', admin.adminListReports);
router.patch('/reports/:id/resolve', admin.resolveReport);
router.patch('/reports/:id/reject', admin.rejectReport);

module.exports = router;
