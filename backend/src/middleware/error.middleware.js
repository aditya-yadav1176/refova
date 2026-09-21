'use strict';

const { IS_PROD } = require('../config/env');
const logger = require('../utils/logger');

/**
 * Central Express error handler.
 * Must be the last middleware registered in app.js.
 */
// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = IS_PROD && status === 500 ? 'Internal server error' : (err.message || 'Internal server error');

  logger.error({
    err: {
      message: err.message,
      stack: IS_PROD ? undefined : err.stack,
      status,
    },
    req: { method: req.method, url: req.url, ip: req.ip },
  }, 'Unhandled error');

  res.status(status).json({
    success: false,
    message,
    ...(IS_PROD ? {} : { stack: err.stack }),
  });
}

module.exports = { errorMiddleware };
