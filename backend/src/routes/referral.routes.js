'use strict';

const { Router } = require('express');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { createLimiter, copyLimiter, reportLimiter } = require('../middleware/rateLimit.middleware');
const ctrl = require('../controllers/referral.controller');
const { submitReport } = require('../controllers/report.controller');

const router = Router();

// Public routes (optional auth for personalization)
router.get('/', optionalAuthenticate, ctrl.list);
router.get('/featured', ctrl.featured);
router.get('/trending', ctrl.trending);

// IMPORTANT: /parse and /:id must be ordered so /parse isn't captured by /:id
router.post('/parse', authenticate, ctrl.parse);

router.get('/:id', optionalAuthenticate, ctrl.getById);
router.post('/:id/view', ctrl.view);
router.post('/:id/copy', copyLimiter, optionalAuthenticate, ctrl.copy);
router.post('/:id/report', reportLimiter, authenticate, submitReport);

// Authenticated referral CRUD
router.post('/', createLimiter, authenticate, ctrl.create);
router.put('/:id', authenticate, ctrl.update);
router.delete('/:id', authenticate, ctrl.remove);
router.post('/:id/submit', authenticate, ctrl.submit);

module.exports = router;
