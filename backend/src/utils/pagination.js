'use strict';

/**
 * Firestore pagination helpers.
 * We use offset-based pagination for simplicity (cursor-based requires
 * storing the last document reference which is harder to serialize).
 * For production scale, upgrade to cursor-based pagination.
 */

function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit || '20', 10)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function buildPaginationMeta(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

module.exports = { parsePagination, buildPaginationMeta };
