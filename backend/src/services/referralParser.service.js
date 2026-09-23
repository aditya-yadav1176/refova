'use strict';

/**
 * referralParser.service.js
 *
 * Multi-stage, context-aware referral recognition engine.
 * Strictly adheres to the NO HALLUCINATION RULE:
 * Never invents monetary rewards, conditions, or expiry dates.
 */

const { BRAND_REGISTRY } = require('../config/brands');

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_KEYWORDS = {
  finance: [
    'upi', 'bank', 'wallet', 'cashback', 'pay', 'money', 'finance', 'invest',
    'stock', 'mutual fund', 'insurance', 'loan', 'credit', 'debit', 'kyc',
    'transaction', 'recharge', 'payment', 'payments', 'transfer', 'gpay',
  ],
  shopping: [
    'shop', 'fashion', 'clothes', 'order', 'cart', 'checkout', 'discount',
    'sale', 'purchase', 'buy', 'mall', 'apparel', 'store', 'coupon', 'code',
  ],
  food: [
    'food', 'eat', 'delivery', 'restaurant', 'meal', 'grocery', 'kitchen',
    'snack', 'lunch', 'dinner', 'cuisine', 'dish', 'groceries', 'supermarket',
  ],
  travel: [
    'travel', 'trip', 'flight', 'hotel', 'cab', 'bus', 'train', 'ride',
    'book', 'stay', 'vacation', 'tour', 'holiday', 'ticket', 'booking',
  ],
  education: [
    'course', 'learn', 'class', 'study', 'test', 'exam', 'certification',
    'tutor', 'skill', 'academy', 'edu', 'lecture', 'degree', 'lesson',
  ],
  productivity: [
    'productivity', 'tool', 'workspace', 'note', 'task', 'project', 'design',
    'ai', 'saas', 'collaborate', 'template', 'document', 'workflow',
  ],
  developer: [
    'hosting', 'server', 'cloud', 'deploy', 'api', 'database', 'code',
    'dev', 'github', 'vps', 'domain', 'ssl', 'compute', 'backend',
  ],
  entertainment: [
    'stream', 'watch', 'music', 'movie', 'show', 'game', 'play', 'series',
    'tv', 'audio', 'podcast', 'video', 'songs',
  ],
};

const SHORTENER_HOSTS = new Set([
  'app.link',
  'bit.ly',
  't.co',
  'tinyurl.com',
  'goo.gl',
  'ow.ly',
  'buff.ly',
  'is.gd',
  'cutt.ly',
  'rb.gy',
  'linktr.ee',
  'shorturl.at',
]);

// ─── Stage 1: Normalize Input ─────────────────────────────────────────────────

function normalizeInput(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/[\u2018\u2019]/g, "'") // smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Stage 2: Extract & Analyze URLs ──────────────────────────────────────────

function extractUrls(text) {
  const urlRegex = /(https?:\/\/[^\s,)>"']+)/gi;
  const matches = text.match(urlRegex) || [];
  return matches.map((u) => {
    let hostname = '';
    let pathname = '';
    try {
      const parsed = new URL(u);
      hostname = parsed.hostname.toLowerCase();
      pathname = parsed.pathname;
    } catch {
      // keep empty strings if URL constructor fails
    }
    const isShortener = Array.from(SHORTENER_HOSTS).some(
      (sh) => hostname === sh || hostname.endsWith('.' + sh)
    );
    return {
      url: u,
      hostname,
      pathname,
      isShortener,
    };
  });
}

// ─── Stage 3: Multi-Signal Brand Recognition ──────────────────────────────────

function detectBrand(text, urls) {
  const lowerText = text.toLowerCase();

  // 1. Check exact alias matches in text using word boundaries.
  // Sort brands by length of aliases descending so "Google Pay" matches before "Google".
  const sortedBrands = [...BRAND_REGISTRY].sort((a, b) => {
    const maxA = Math.max(...a.aliases.map((al) => al.length));
    const maxB = Math.max(...b.aliases.map((al) => al.length));
    return maxB - maxA;
  });

  for (const brand of sortedBrands) {
    for (const alias of brand.aliases) {
      const regex = new RegExp(`\\b${escapeRegex(alias)}\\b`, 'i');
      if (regex.test(lowerText)) {
        return {
          brandName: brand.name,
          category: brand.category,
          confidence: 0.96,
        };
      }
    }
  }

  // 2. Correlate extracted URLs with known referral domains & official domains
  for (const item of urls) {
    if (!item.hostname) continue;
    for (const brand of sortedBrands) {
      const domainMatches = brand.domains.some(
        (d) => item.hostname === d || item.hostname.endsWith('.' + d)
      );
      const referralMatches = brand.referralDomains.some(
        (rd) =>
          item.hostname === rd ||
          item.hostname.endsWith('.' + rd) ||
          item.url.toLowerCase().includes(rd.toLowerCase())
      );
      if (domainMatches || referralMatches) {
        return {
          brandName: brand.name,
          category: brand.category,
          confidence: domainMatches ? 0.94 : 0.88,
        };
      }
    }
  }

  // 3. Contextual patterns: e.g. "switched to [Brand]", "joined [Brand]", "use my [Brand] link"
  const contextPatterns = [
    /(?:switched to|download|join|sign up on|opened|use my|invite you to)\s+([A-Z][a-zA-Z0-9]{2,})/i,
    /(?:welcome to|start using)\s+([A-Z][a-zA-Z0-9]{2,})/i,
  ];

  for (const cp of contextPatterns) {
    const match = text.match(cp);
    if (match && match[1]) {
      const candidate = match[1].trim();
      // Verify candidate is not a generic word like "this", "my", "our", "the", "a"
      const stopwords = new Set(['this', 'my', 'our', 'the', 'a', 'any', 'daily', 'new']);
      if (!stopwords.has(candidate.toLowerCase())) {
        return {
          brandName: candidate,
          category: null,
          confidence: 0.65,
        };
      }
    }
  }

  // Unknown brand — strictly return null rather than taking first word or guessing
  return {
    brandName: null,
    category: null,
    confidence: 0.1,
  };
}

// ─── Stage 4: Category Detection ──────────────────────────────────────────────

function detectCategory(text, defaultCategory = null) {
  if (defaultCategory) return defaultCategory;

  const lower = text.toLowerCase();
  let bestSlug = 'shopping';
  let bestCount = 0;

  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let count = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) count++;
    }
    if (count > bestCount) {
      bestCount = count;
      bestSlug = slug;
    }
  }

  return bestCount > 0 ? bestSlug : 'shopping';
}

// ─── Stage 5: Benefit Extraction (NO Hallucination Rule) ──────────────────────

function extractBenefit(text) {
  // Check for explicit currency reward (e.g. ₹500, ₹100, Rs. 50, Rs 100, 500 INR)
  const rupeeMatch =
    text.match(/(?:₹|rs\.?|inr)\s*(\d[\d,]*)/i) ||
    text.match(/(\d[\d,]*)\s*(?:₹|rs\.?|inr|rupees?)/i);

  // Check for explicit discount percentage (e.g. 20% off, 15% discount)
  const pctMatch = text.match(/(\d+)\s*%\s*(?:off|cashback|discount|savings?)/i);

  // Check for explicit reward points (e.g. 100 reward points, 500 points)
  const pointsMatch = text.match(/(\d[\d,]*)\s*(?:reward\s+)?points/i);

  // Check for explicit free duration (e.g. 1 free month, 3 months free trial)
  const freeDurationMatch =
    text.match(/(\d+)\s*(?:month|year|week)s?\s*(?:free|trial)/i) ||
    text.match(/free\s+(?:month|year|week|trial)/i);

  // 1. Explicit Rupee reward
  if (rupeeMatch) {
    const val = Number(rupeeMatch[1].replace(/,/g, ''));
    if (!isNaN(val) && val > 0) {
      const isCashback = /cashback/i.test(text);
      const isDiscount = /discount|\boff\b/i.test(text);
      const isReward = /reward/i.test(text);

      let label = 'Cashback';
      let type = 'cashback';
      if (isCashback) {
        label = 'Cashback';
        type = 'cashback';
      } else if (isDiscount) {
        label = 'OFF';
        type = 'discount';
      } else if (isReward) {
        label = 'Reward';
        type = 'reward';
      }

      return {
        headline: `₹${val.toLocaleString('en-IN')} ${label}`,
        type,
        confidence: 0.95,
        hasAmount: true,
      };
    }
  }

  // 2. Explicit percentage
  if (pctMatch) {
    return {
      headline: `${pctMatch[1]}% OFF`,
      type: 'discount',
      confidence: 0.95,
      hasAmount: true,
    };
  }

  // 3. Explicit points
  if (pointsMatch) {
    const val = Number(pointsMatch[1].replace(/,/g, ''));
    return {
      headline: `${val.toLocaleString('en-IN')} Reward Points`,
      type: 'reward',
      confidence: 0.92,
      hasAmount: true,
    };
  }

  // 4. Explicit free trial / duration
  if (freeDurationMatch) {
    return {
      headline: 'Free Trial',
      type: 'free-month',
      confidence: 0.9,
      hasAmount: false,
    };
  }

  // 5. Semantic keyword extraction without inventing numbers (NO HALLUCINATIONS)
  if (/cashback/i.test(text)) {
    return {
      headline: 'Cashback',
      type: 'cashback',
      confidence: 0.91,
      hasAmount: false,
    };
  }

  if (/discount/i.test(text)) {
    return {
      headline: 'Discount',
      type: 'discount',
      confidence: 0.88,
      hasAmount: false,
    };
  }

  if (/credits?/i.test(text)) {
    return {
      headline: 'Credits',
      type: 'credits',
      confidence: 0.88,
      hasAmount: false,
    };
  }

  if (/rewards?|reward\s+points?/i.test(text)) {
    return {
      headline: 'Rewards',
      type: 'reward',
      confidence: 0.88,
      hasAmount: false,
    };
  }

  // Safe fallback without numeric amount
  return {
    headline: 'Referral Offer',
    type: 'reward',
    confidence: 0.6,
    hasAmount: false,
  };
}

// ─── Stage 6: Condition Extraction ────────────────────────────────────────────

function extractConditions(text) {
  const conds = [];

  // "first payment" or "make any payment"
  if (/(?:on\s+your\s+|on\s+|for\s+)?first\s+payment/i.test(text)) {
    conds.push('First payment');
  } else if (/make (?:any|a|your) payment/i.test(text)) {
    conds.push('Make a payment to activate reward');
  } else if (/first\s+(?:order|transaction|purchase|recharge|ride)/i.test(text)) {
    conds.push('Valid on first transaction only');
  }

  if (/new\s+users?\s*(?:only)?/i.test(text) || /only\s+for\s+new/i.test(text)) {
    conds.push('New users only');
  }

  const minAmt = text.match(
    /(?:minimum|min\.?|above|over|greater\s+than|more\s+than)\s+(?:order\s+(?:of\s+)?|transaction\s+(?:of\s+)?|payment\s+(?:of\s+)?)?(?:₹|rs\.?|inr)\s*(\d[\d,]*)/i
  );
  if (minAmt?.[1]) {
    const v = Number(minAmt[1].replace(/,/g, ''));
    conds.push(`Minimum transaction of ₹${v.toLocaleString('en-IN')}`);
  }

  if (/complete\s+(?:your\s+)?kyc/i.test(text)) {
    conds.push('KYC completion required');
  }

  if (/selected\s+users/i.test(text)) {
    conds.push('Valid for selected users');
  }

  if (/terms?\s+(?:and\s+)?conditions?\s+apply|t\s*&\s*c/i.test(text)) {
    conds.push('Terms and conditions apply');
  }

  return Array.from(new Set(conds));
}

// ─── Stage 7: Expiry Detection ────────────────────────────────────────────────

function extractExpiry(text) {
  const dateIndicator =
    /(?:valid\s+(?:till|until)|expires?\s*(?:on)?|expiry(?:\s+date)?|offer\s+ends?|last\s+date)\s*[:\-]?\s*/i;
  const dateExpr =
    /(?:(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+(?:\s+\d{2,4})?)|(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{2,4})?))/i;

  const combined = new RegExp(dateIndicator.source + dateExpr.source, 'i');
  const m = text.match(combined);

  if (m) {
    const rawDateStr = (m[1] || m[2] || m[3] || '').replace(/(st|nd|rd|th)/gi, '').trim();
    const timestamp = Date.parse(rawDateStr);
    if (!isNaN(timestamp)) {
      const d = new Date(timestamp);
      if (!/\d{4}/.test(rawDateStr)) {
        const now = new Date();
        d.setFullYear(now.getFullYear());
        if (d < now) d.setFullYear(now.getFullYear() + 1);
      }
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const isoDate = `${year}-${month}-${day}`;
      // Set to end of day for past check
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);
      const isPast = endOfDay < new Date();
      return {
        expiryType: isPast ? 'expired' : 'fixed_date',
        expiryDate: isoDate,
        confidence: 0.95,
      };
    }
  }

  // If no explicit expiry expression was found
  return {
    expiryType: 'no_expiry_specified',
    expiryDate: null,
    confidence: 0.98,
  };
}

// ─── Stage 8: Referral Code Extraction ────────────────────────────────────────

function extractCode(text, mainUrl) {
  // If there's an explicit code label, extract it
  const explicit = text.match(
    /(?:code|promo(?:code)?|coupon|referral\s+(?:code|id)|use|enter)\s*[:=\-]?\s*([A-Z0-9][A-Z0-9\-_]{2,19})\b/i
  );
  if (explicit?.[1]) {
    const val = explicit[1].toUpperCase();
    const stopwords = new Set(['MY', 'THE', 'AND', 'LINK', 'APP', 'CODE', 'JOIN']);
    if (!stopwords.has(val)) return val;
  }

  // If a URL is present, that URL is the primary referral vehicle
  if (mainUrl) return '';

  // Standalone uppercase referral code token
  const token = text.match(/\b([A-Z0-9]{4,15})\b/);
  if (token?.[1]) {
    const val = token[1];
    const stopwords = new Set(['HTTP', 'HTTPS', 'JOIN', 'EARN', 'FREE', 'CASHBACK', 'PAYMENT']);
    if (!stopwords.has(val) && /\d/.test(val)) return val;
  }

  return '';
}

// ─── Stage 9: Generate Contextual Description ─────────────────────────────────

function generateDescription(brandName, benefit, conditions) {
  const brand = brandName || 'this service';
  const condText = conditions.length > 0 ? ` ${conditions.join('. ')}.` : '';

  if (benefit.hasAmount) {
    return `Use this referral to get ${benefit.headline.toLowerCase()} on ${brand}.${condText}`.trim();
  }

  if (benefit.type === 'cashback') {
    return `Join ${brand} using this referral link to start earning cashback on your payments.${condText}`.trim();
  }

  if (benefit.type === 'discount') {
    return `Use this referral to claim your discount on ${brand}.${condText}`.trim();
  }

  return `Join ${brand} using this referral to claim the available referral reward.${condText}`.trim();
}

// ─── Multi-Stage Pipeline Execution ───────────────────────────────────────────

function parseWithRules(rawText) {
  // 1. Normalize
  const text = normalizeInput(rawText);

  // 2. Extract URLs
  const urls = extractUrls(text);
  const primaryUrl = urls[0]?.url || '';

  // 3. Detect Brand
  const brandResult = detectBrand(text, urls);
  const brandName = brandResult.brandName;

  // 4. Detect Category
  const category = detectCategory(text, brandResult.category);

  // 5. Extract Benefit (No Hallucination)
  const benefit = extractBenefit(text);

  // 6. Extract Conditions
  const conditions = extractConditions(text);

  // 7. Extract Expiry
  const expiry = extractExpiry(text);

  // 8. Extract Code
  const referralCode = extractCode(text, primaryUrl);

  // 9. Generate Description
  const description = generateDescription(brandName, benefit, conditions);

  // 10. Confidence & Warnings
  const warnings = [];
  let needsReview = false;

  if (!brandName) {
    needsReview = true;
    warnings.push('Brand could not be confidently identified. Please review and confirm the service name.');
  }

  if (!benefit.hasAmount && benefit.type === 'reward' && benefit.headline === 'Referral Offer') {
    warnings.push('Specific benefit could not be identified from text.');
  }

  const confidence = {
    brand: brandResult.confidence,
    benefit: benefit.confidence,
    category: brandResult.category ? 0.95 : 0.75,
    expiry: expiry.confidence,
  };

  return {
    brandName,
    title: brandName ? `${brandName}: ${benefit.headline}` : benefit.headline,
    benefitHeadline: benefit.headline,
    benefitType: benefit.type,
    description,
    category,
    referralCode,
    referralUrl: primaryUrl,
    conditions,
    expiryType: expiry.expiryType,
    expiryDate: expiry.expiryDate,
    confidence,
    needsReview,
    warnings,
  };
}

/**
 * PUBLIC API
 * @param {string} text - Raw referral text
 * @returns {Promise<Object>}
 */
async function parseReferral(text) {
  if (!text || !text.trim()) {
    throw new Error('Please provide referral text to parse.');
  }

  return parseWithRules(text);
}

module.exports = { parseReferral, parseWithRules };
