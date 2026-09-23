'use strict';

const Joi = require('joi');

// ─── Referral ─────────────────────────────────────────────────────────────────

const referralCreate = Joi.object({
  brandName: Joi.string().trim().min(1).max(100).required(),
  title: Joi.string().trim().min(1).max(200).optional(),
  categoryId: Joi.string().trim().required(),
  categoryName: Joi.string().trim().max(100).optional(),
  benefitHeadline: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().min(10).max(2000).required(),
  referralCode: Joi.string().trim().max(500).allow('').optional(),
  referralUrl: Joi.string().uri().max(2000).allow('').optional(),
  conditions: Joi.array().items(Joi.string().max(500)).max(10).optional(),
  expiryType: Joi.string().valid('fixed_date', 'no_expiry_specified', 'unknown', 'expired').optional(),
  expiryDate: Joi.string().isoDate().allow('', null).optional(),
  imageUrl: Joi.string().uri().allow('', null).optional(),
  imagePath: Joi.string().allow('', null).optional(),
}).or('referralCode', 'referralUrl');

const referralUpdate = Joi.object({
  brandName: Joi.string().trim().min(1).max(100).optional(),
  title: Joi.string().trim().min(1).max(200).optional(),
  categoryId: Joi.string().trim().optional(),
  categoryName: Joi.string().trim().max(100).optional(),
  benefitHeadline: Joi.string().trim().min(1).max(200).optional(),
  description: Joi.string().trim().min(10).max(2000).optional(),
  referralCode: Joi.string().trim().max(500).allow('').optional(),
  referralUrl: Joi.string().uri().max(2000).allow('', null).optional(),
  conditions: Joi.array().items(Joi.string().max(500)).max(10).optional(),
  expiryType: Joi.string().valid('fixed_date', 'no_expiry_specified', 'unknown', 'expired').optional(),
  expiryDate: Joi.string().isoDate().allow('', null).optional(),
  imageUrl: Joi.string().uri().allow('', null).optional(),
  imagePath: Joi.string().allow('', null).optional(),
});

const referralParse = Joi.object({
  text: Joi.string().trim().min(5).max(5000).required(),
});

// ─── Report ───────────────────────────────────────────────────────────────────

const REPORT_REASONS = [
  'expired',
  'invalid_code',
  'broken_link',
  'incorrect_info',
  'spam',
  'misleading',
  'other',
];

const reportCreate = Joi.object({
  reason: Joi.string().valid(...REPORT_REASONS).required(),
  description: Joi.string().trim().max(1000).allow('').optional(),
});

// ─── User ─────────────────────────────────────────────────────────────────────

const userProfileUpdate = Joi.object({
  displayName: Joi.string().trim().min(2).max(100).optional(),
  bio: Joi.string().trim().max(500).allow('').optional(),
  photoURL: Joi.string().uri().allow('', null).optional(),
});

// ─── Admin ────────────────────────────────────────────────────────────────────

const adminReject = Joi.object({
  reason: Joi.string().trim().max(500).allow('').optional(),
});

const adminUserStatus = Joi.object({
  status: Joi.string().valid('active', 'suspended').required(),
});

const adminUserRole = Joi.object({
  role: Joi.string().valid('user', 'admin').required(),
});

// ─── Category ─────────────────────────────────────────────────────────────────

const categoryCreate = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  slug: Joi.string().trim().lowercase().alphanum().min(1).max(50).required(),
  description: Joi.string().trim().max(500).allow('').optional(),
  icon: Joi.string().max(10).optional(),
  color: Joi.string().max(20).optional(),
});

// ─── Pagination ───────────────────────────────────────────────────────────────

const pagination = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
}).unknown(true);

// ─── Validate helper ──────────────────────────────────────────────────────────

function validate(schema, data) {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errors = error.details.map((d) => ({ field: d.path.join('.'), message: d.message }));
    return { errors, value: null };
  }
  return { errors: null, value };
}

module.exports = {
  referralCreate,
  referralUpdate,
  referralParse,
  reportCreate,
  userProfileUpdate,
  adminReject,
  adminUserStatus,
  adminUserRole,
  categoryCreate,
  pagination,
  REPORT_REASONS,
  validate,
};
