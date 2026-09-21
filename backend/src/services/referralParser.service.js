'use strict';

/**
 * referralParser.service.js
 *
 * Deterministic rule-based referral text parser.
 * Structured so an AI provider (OpenAI, Gemini, etc.) can be plugged in
 * by replacing the `parseWithAI` function below.
 *
 * PUBLIC API: parseReferral(text) => ParsedReferral
 */

// ─── Category detection ───────────────────────────────────────────────────────

const CATEGORY_KEYWORDS = {
  finance: ['upi', 'bank', 'wallet', 'cashback', 'pay', 'money', 'finance', 'invest', 'stock', 'mutual fund', 'insurance', 'loan', 'credit', 'debit', 'kyc', 'transaction', 'recharge'],
  shopping: ['shop', 'fashion', 'clothes', 'order', 'cart', 'checkout', 'discount', 'sale', 'purchase', 'buy', 'mall', 'apparel'],
  food: ['food', 'eat', 'delivery', 'restaurant', 'meal', 'grocery', 'kitchen', 'snack', 'lunch', 'dinner', 'cuisine'],
  travel: ['travel', 'trip', 'flight', 'hotel', 'cab', 'bus', 'train', 'ride', 'book', 'stay', 'vacation', 'tour', 'holiday'],
  education: ['course', 'learn', 'class', 'study', 'test', 'exam', 'certification', 'tutor', 'skill', 'academy', 'edu', 'lecture'],
  productivity: ['productivity', 'tool', 'workspace', 'note', 'task', 'project', 'design', 'ai', 'saas', 'collaborate', 'template'],
  developer: ['hosting', 'server', 'cloud', 'deploy', 'api', 'database', 'code', 'dev', 'github', 'vps', 'domain', 'ssl'],
  entertainment: ['stream', 'watch', 'music', 'movie', 'show', 'game', 'play', 'series', 'tv', 'audio', 'podcast'],
};

const KNOWN_BRANDS = [
  { name: 'Myntra', category: 'shopping' },
  { name: 'Amazon', category: 'shopping' },
  { name: 'Flipkart', category: 'shopping' },
  { name: 'Meesho', category: 'shopping' },
  { name: 'Nykaa', category: 'shopping' },
  { name: 'Swiggy', category: 'food' },
  { name: 'Zomato', category: 'food' },
  { name: 'BigBasket', category: 'food' },
  { name: 'Blinkit', category: 'food' },
  { name: 'Zepto', category: 'food' },
  { name: 'PhonePe', category: 'finance' },
  { name: 'Google Pay', category: 'finance' },
  { name: 'GPay', category: 'finance' },
  { name: 'Paytm', category: 'finance' },
  { name: 'CRED', category: 'finance' },
  { name: 'Groww', category: 'finance' },
  { name: 'Zerodha', category: 'finance' },
  { name: 'Upstox', category: 'finance' },
  { name: 'Jupiter', category: 'finance' },
  { name: 'Ola', category: 'travel' },
  { name: 'Uber', category: 'travel' },
  { name: 'Rapido', category: 'travel' },
  { name: 'MakeMyTrip', category: 'travel' },
  { name: 'Airbnb', category: 'travel' },
  { name: 'IRCTC', category: 'travel' },
  { name: 'BYJU', category: 'education' },
  { name: 'Unacademy', category: 'education' },
  { name: 'Coursera', category: 'education' },
  { name: 'Udemy', category: 'education' },
  { name: 'Notion', category: 'productivity' },
  { name: 'Figma', category: 'productivity' },
  { name: 'Slack', category: 'productivity' },
  { name: 'Canva', category: 'productivity' },
  { name: 'Netflix', category: 'entertainment' },
  { name: 'Spotify', category: 'entertainment' },
  { name: 'Hotstar', category: 'entertainment' },
  { name: 'GitHub', category: 'developer' },
  { name: 'Vercel', category: 'developer' },
  { name: 'Netlify', category: 'developer' },
  { name: 'DigitalOcean', category: 'developer' },
  { name: 'AWS', category: 'developer' },
  { name: 'Render', category: 'developer' },
  { name: 'Railway', category: 'developer' },
];

function detectBrand(text) {
  const lower = text.toLowerCase();
  const sorted = [...KNOWN_BRANDS].sort((a, b) => b.name.length - a.name.length);
  for (const brand of sorted) {
    if (lower.includes(brand.name.toLowerCase())) return brand;
  }
  return null;
}

function detectCategory(text) {
  const lower = text.toLowerCase();
  let best = 'shopping';
  let bestCount = 0;
  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const count = keywords.filter((k) => lower.includes(k)).length;
    if (count > bestCount) { bestCount = count; best = slug; }
  }
  return best;
}

function extractUrl(text) {
  const m = text.match(/https?:\/\/[^\s,)>]+/i);
  return m ? m[0] : null;
}

function extractCode(text) {
  const explicit = text.match(/(?:code|promo(?:code)?|coupon|referral\s+(?:code|id)|use|enter)\s*[:=\-]?\s*([A-Z0-9][A-Z0-9\-_]{2,19})/i);
  if (explicit?.[1]) return explicit[1].toUpperCase();
  const dashToken = text.match(/[-:]\\s*([A-Z0-9][A-Z0-9\-_]{2,19})\b/i);
  if (dashToken?.[1]) return dashToken[1].toUpperCase();
  const caps = text.match(/\b([A-Z][A-Z0-9\-_]{3,19})\b/);
  if (caps?.[1] && caps[1] !== caps[1].toLowerCase()) return caps[1];
  return null;
}

function extractBenefit(text) {
  const rupee = text.match(/₹\s*(\d[\d,]*)/);
  if (rupee?.[1]) {
    const v = Number(rupee[1].replace(/,/g, ''));
    const label = /cashback/i.test(text) ? 'CASHBACK' : /reward|earn/i.test(text) ? 'REWARD' : 'CASHBACK';
    return { headline: `₹${v.toLocaleString('en-IN')} ${label}`, type: 'cashback' };
  }
  const pct = text.match(/(\d+)\s*%\s*off/i);
  if (pct) return { headline: `${pct[1]}% OFF`, type: 'discount' };
  if (/free\s+(?:month|trial|year|week)/i.test(text)) return { headline: 'FREE TRIAL', type: 'free-month' };
  if (/free\s+credits?/i.test(text)) return { headline: 'FREE CREDITS', type: 'credits' };
  if (/\bfree\b/i.test(text)) return { headline: 'FREE REWARD', type: 'reward' };
  if (/credits?/i.test(text)) return { headline: 'FREE CREDITS', type: 'credits' };
  return { headline: 'REFERRAL OFFER', type: 'reward' };
}

function extractExpiry(text) {
  const datePattern = /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})/i;
  const keyword = /(?:valid\s+(?:till|until)|expires?\s*(?:on)?|expiry(?:\s+date)?|last\s+date)\s*[:\-]?\s*/i;
  const combined = new RegExp(keyword.source + datePattern.source, 'i');
  const m1 = text.match(combined);
  if (m1?.[1]) {
    try { return new Date(m1[1]).toISOString().split('T')[0]; } catch { return m1[1]; }
  }
  const m2 = text.match(datePattern);
  if (m2?.[1]) {
    try { return new Date(m2[1]).toISOString().split('T')[0]; } catch { return m2[1]; }
  }
  return null;
}

function extractConditions(text) {
  const conds = [];
  if (/new\s+user/i.test(text)) conds.push('New users only');
  if (/first\s+(?:order|transaction|purchase|payment|recharge)/i.test(text)) conds.push('Valid on first transaction only');
  const minAmt = text.match(/(?:minimum|min\.?|above|over|greater\s+than|more\s+than)\s+(?:order\s+(?:of\s+)?|transaction\s+(?:of\s+)?)?₹\s*(\d[\d,]*)/i);
  if (minAmt?.[1]) { const v = Number(minAmt[1].replace(/,/g, '')); conds.push(`Minimum transaction of ₹${v.toLocaleString('en-IN')}`); }
  const maxCb = text.match(/(?:max|maximum|up\s+to|upto)\s+(?:cashback\s+(?:of\s+)?)?₹\s*(\d[\d,]*)/i);
  if (maxCb?.[1]) { const v = Number(maxCb[1].replace(/,/g, '')); conds.push(`Maximum cashback ₹${v.toLocaleString('en-IN')}`); }
  if (/kyc/i.test(text)) conds.push('KYC completion required');
  if (/once\s+per\s+user|per\s+(?:user|account|number)/i.test(text)) conds.push('Valid once per user');
  if (/t\s*&\s*c\s+apply|terms?\s+(?:and\s+)?conditions?/i.test(text)) conds.push('Terms and conditions apply');
  return conds;
}

function extractServiceName(text) {
  const near = text.match(/([A-Z][a-zA-Z]{2,})\s+(?:code|referral|link|offer|promo|app)/i);
  if (near?.[1]) return near[1];
  const first = text.match(/\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b/);
  if (first?.[1]) return first[1];
  return 'Referral';
}

/**
 * Main parser function — deterministic, no external API calls.
 * Replace this with an AI call when ready by modifying parseReferral below.
 */
function parseWithRules(text) {
  const brand = detectBrand(text);
  const brandName = brand?.name ?? extractServiceName(text);
  const categorySlug = brand?.category ?? detectCategory(text);

  const url = extractUrl(text);
  const code = url ?? extractCode(text) ?? '';
  const benefit = extractBenefit(text);
  const expiryDate = extractExpiry(text);
  const conditions = extractConditions(text);

  const description = `Use this referral to get ${benefit.headline.toLowerCase()} on ${brandName}. ${conditions.length > 0 ? conditions[0] + '.' : ''}`.trim();

  return {
    brandName,
    benefitHeadline: benefit.headline,
    description,
    category: categorySlug,
    referralCode: url ? '' : code,
    referralUrl: url || '',
    conditions,
    expiryDate,
  };
}

/**
 * PUBLIC API — swap this body to integrate an AI provider.
 * @param {string} text - Raw referral text
 * @returns {Promise<ParsedReferral>}
 */
async function parseReferral(text) {
  if (!text || !text.trim()) {
    throw new Error('Please provide referral text to parse.');
  }

  // Future AI integration point:
  // if (process.env.OPENAI_API_KEY) {
  //   return parseWithAI(text);
  // }

  return parseWithRules(text.trim());
}

module.exports = { parseReferral };
