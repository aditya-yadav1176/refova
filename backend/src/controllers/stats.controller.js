'use strict';

const { getHomeStats } = require('../services/stats.service');
const { sendSuccess } = require('../utils/response');

// GET /api/stats/home
async function homeStats(req, res, next) {
  try {
    const stats = await getHomeStats();
    return sendSuccess(res, stats);
  } catch (err) { next(err); }
}

module.exports = { homeStats };
