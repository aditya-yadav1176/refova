'use strict';

const { sendError } = require('../utils/response');

/**
 * Require authenticated user to have role === 'admin'.
 * Must be used AFTER the authenticate middleware.
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return sendError(res, 'Authentication required', 401);
  }
  if (req.user.role !== 'admin') {
    return sendError(res, 'Administrator access required', 403);
  }
  next();
}

module.exports = { requireAdmin };
