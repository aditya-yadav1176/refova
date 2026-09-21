'use strict';

const { Router } = require('express');
const { homeStats } = require('../controllers/stats.controller');

const router = Router();

router.get('/home', homeStats);

module.exports = router;
