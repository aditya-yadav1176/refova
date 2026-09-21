'use strict';

/**
 * Consistent API response helpers.
 */

function sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
}

function sendError(res, message = 'An error occurred', statusCode = 500, errors = null) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}

function sendPaginated(res, data, pagination, message = 'Success') {
  return res.status(200).json({ success: true, message, data, pagination });
}

module.exports = { sendSuccess, sendError, sendPaginated };
