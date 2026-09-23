import type { BenefitType, CategorySlug } from "@/lib/referrals";
import { BRAND_REGISTRY } from "./brands";
import { apiPostAuth } from "@/lib/api";

// ─── Output type ─────────────────────────────────────────────────────────────

export type ParsedReferral = {
  service: string;
  initials: string;
  code: string;
  isLink: boolean;
  benefit: string;
  benefitType: BenefitType;
  category: CategorySlug;
  summary: string;
  conditions: string[];
  expires: string;
  expiryType: "fixed_date" | "no_expiry_specified" | "unknown" | "expired";
  expiryDate: string | null;
  tags: string[];
  needsReview: boolean;
  warnings: string[];
  confidence?: {
    brand: number;
    benefit: number;
    category: number;
    expiry: number;
  };
};

/** Shape returned by backend /api/referrals/parse */
type BackendParsed = {
  brandName: string | null;
  title: string;
  benefitHeadline: string;
  benefitType?: BenefitType;
  description: string;
  category: CategorySlug;
  referralCode: string;
  referralUrl: string;
  conditions: string[];
  expiryType?: "fixed_date" | "no_expiry_specified" | "unknown" | "expired";
  expiryDate: string | null;
  confidence?: {
    brand: number;
    benefit: number;
    category: number;
    expiry: number;
  };
  needsReview?: boolean;
  warnings?: string[];
};

/** Map the backend response to the frontend ParsedReferral shape. */
function mapBackendResponse(b: BackendParsed): ParsedReferral {
  const service = b.brandName || "";
  const words = (service || "Referral").trim().split(/\s+/);
  const initials = words.map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 2) || "??";
  const isLink = !!b.referralUrl;
  const code = isLink ? b.referralUrl : (b.referralCode || "");

  // Map benefitHeadline to BenefitType
  let benefitType: BenefitType = b.benefitType || "reward";
  const h = (b.benefitHeadline || "").toLowerCase();
  if (h.includes("cashback")) benefitType = "cashback";
  else if (h.includes("% off") || h.includes("discount")) benefitType = "discount";
  else if (h.includes("free month") || h.includes("trial")) benefitType = "free-month";
  else if (h.includes("credit")) benefitType = "credits";

  // Tags
  const tags: string[] = [];
  if (service) tags.push(service.toLowerCase().replace(/\s+/g, ""));
  if (b.category) tags.push(b.category);
  if (benefitType !== "reward") tags.push(benefitType);

  const summary = b.description || `Use this referral to get ${b.benefitHeadline.toLowerCase()}.`;

  const expiryType = b.expiryType || (b.expiryDate ? "fixed_date" : "no_expiry_specified");
  const expiresDisplay =
    expiryType === "fixed_date" && b.expiryDate
      ? new Date(b.expiryDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

  return {
    service,
    initials,
    code,
    isLink,
    benefit: b.benefitHeadline,
    benefitType,
    category: b.category || "finance",
    summary,
    conditions: b.conditions || [],
    expires: expiresDisplay,
    expiryType,
    expiryDate: b.expiryDate || null,
    tags: tags.slice(0, 4),
    needsReview: Boolean(b.needsReview),
    warnings: b.warnings || [],
    confidence: b.confidence,
  };
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────
export async function parseReferralContent(raw: string): Promise<ParsedReferral> {
  if (!raw.trim()) throw new Error("Please paste a referral before continuing.");

  try {
    const resp = await apiPostAuth<{ success: boolean; data: BackendParsed }>(
      "/referrals/parse",
      { text: raw.trim() },
    );
    if (resp.success && resp.data) {
      return mapBackendResponse(resp.data);
    }
  } catch {
    // Backend unavailable — fall back to local parser
  }

  // Fallback: local rule-based mock parser
  return mockParse(raw.trim());
}

// ─── Local Fallback Parser (Matches Backend Logic) ────────────────────────────

const SHORTENER_HOSTS = new Set([
  "app.link",
  "bit.ly",
  "t.co",
  "tinyurl.com",
  "goo.gl",
  "ow.ly",
  "buff.ly",
  "is.gd",
  "cutt.ly",
  "rb.gy",
  "linktr.ee",
  "shorturl.at",
]);

function normalizeInput(raw: string): string {
  return raw
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractUrls(text: string) {
  const urlRegex = /(https?:\/\/[^\s,)>"']+)/gi;
  const matches = text.match(urlRegex) || [];
  return matches.map((u) => {
    let hostname = "";
    try {
      hostname = new URL(u).hostname.toLowerCase();
    } catch {
      // ignore
    }
    const isShortener = Array.from(SHORTENER_HOSTS).some(
      (sh) => hostname === sh || hostname.endsWith("." + sh),
    );
    return { url: u, hostname, isShortener };
  });
}

function detectBrand(text: string, urls: { url: string; hostname: string }[]) {
  const lowerText = text.toLowerCase();

  const sortedBrands = [...BRAND_REGISTRY].sort((a, b) => {
    const maxA = Math.max(...a.aliases.map((al) => al.length));
    const maxB = Math.max(...b.aliases.map((al) => al.length));
    return maxB - maxA;
  });

  for (const brand of sortedBrands) {
    for (const alias of brand.aliases) {
      const regex = new RegExp(`\\b${escapeRegex(alias)}\\b`, "i");
      if (regex.test(lowerText)) {
        return { brandName: brand.name, category: brand.category, confidence: 0.96 };
      }
    }
  }

  for (const item of urls) {
    if (!item.hostname) continue;
    for (const brand of sortedBrands) {
      const domainMatches = brand.domains.some(
        (d) => item.hostname === d || item.hostname.endsWith("." + d),
      );
      const referralMatches = brand.referralDomains.some(
        (rd) =>
          item.hostname === rd ||
          item.hostname.endsWith("." + rd) ||
          item.url.toLowerCase().includes(rd.toLowerCase()),
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

  const contextPatterns = [
    /(?:switched to|download|join|sign up on|opened|use my|invite you to)\s+([A-Z][a-zA-Z0-9]{2,})/i,
    /(?:welcome to|start using)\s+([A-Z][a-zA-Z0-9]{2,})/i,
  ];

  for (const cp of contextPatterns) {
    const match = text.match(cp);
    if (match && match[1]) {
      const candidate = match[1].trim();
      const stopwords = new Set(["this", "my", "our", "the", "a", "any", "daily", "new"]);
      if (!stopwords.has(candidate.toLowerCase())) {
        return { brandName: candidate, category: null, confidence: 0.65 };
      }
    }
  }

  return { brandName: null, category: null, confidence: 0.1 };
}

function extractBenefit(text: string): {
  headline: string;
  type: BenefitType;
  confidence: number;
  hasAmount: boolean;
} {
  const rupeeMatch =
    text.match(/(?:₹|rs\.?|inr)\s*(\d[\d,]*)/i) ||
    text.match(/(\d[\d,]*)\s*(?:₹|rs\.?|inr|rupees?)/i);

  const pctMatch = text.match(/(\d+)\s*%\s*(?:off|cashback|discount|savings?)/i);
  const pointsMatch = text.match(/(\d[\d,]*)\s*(?:reward\s+)?points/i);
  const freeDurationMatch =
    text.match(/(\d+)\s*(?:month|year|week)s?\s*(?:free|trial)/i) ||
    text.match(/free\s+(?:month|year|week|trial)/i);

  if (rupeeMatch) {
    const val = Number(rupeeMatch[1].replace(/,/g, ""));
    if (!isNaN(val) && val > 0) {
      const isCashback = /cashback/i.test(text);
      const isDiscount = /discount|\boff\b/i.test(text);
      const isReward = /reward/i.test(text);

      let label = "Cashback";
      let type: BenefitType = "cashback";
      if (isCashback) {
        label = "Cashback";
        type = "cashback";
      } else if (isDiscount) {
        label = "OFF";
        type = "discount";
      } else if (isReward) {
        label = "Reward";
        type = "reward";
      }

      return {
        headline: `₹${val.toLocaleString("en-IN")} ${label}`,
        type,
        confidence: 0.95,
        hasAmount: true,
      };
    }
  }

  if (pctMatch) {
    return {
      headline: `${pctMatch[1]}% OFF`,
      type: "discount",
      confidence: 0.95,
      hasAmount: true,
    };
  }

  if (pointsMatch) {
    const val = Number(pointsMatch[1].replace(/,/g, ""));
    return {
      headline: `${val.toLocaleString("en-IN")} Reward Points`,
      type: "reward",
      confidence: 0.92,
      hasAmount: true,
    };
  }

  if (freeDurationMatch) {
    return {
      headline: "Free Trial",
      type: "free-month",
      confidence: 0.9,
      hasAmount: false,
    };
  }

  if (/cashback/i.test(text)) {
    return {
      headline: "Cashback",
      type: "cashback",
      confidence: 0.91,
      hasAmount: false,
    };
  }

  if (/discount/i.test(text)) {
    return {
      headline: "Discount",
      type: "discount",
      confidence: 0.88,
      hasAmount: false,
    };
  }

  if (/credits?/i.test(text)) {
    return {
      headline: "Credits",
      type: "credits",
      confidence: 0.88,
      hasAmount: false,
    };
  }

  if (/rewards?|reward\s+points?/i.test(text)) {
    return {
      headline: "Rewards",
      type: "reward",
      confidence: 0.88,
      hasAmount: false,
    };
  }

  return {
    headline: "Referral Offer",
    type: "reward",
    confidence: 0.6,
    hasAmount: false,
  };
}

function extractConditions(text: string): string[] {
  const conds: string[] = [];

  if (/(?:on\s+your\s+|on\s+|for\s+)?first\s+payment/i.test(text)) {
    conds.push("First payment");
  } else if (/make (?:any|a|your) payment/i.test(text)) {
    conds.push("Make a payment to activate reward");
  } else if (/first\s+(?:order|transaction|purchase|recharge|ride)/i.test(text)) {
    conds.push("Valid on first transaction only");
  }

  if (/new\s+users?\s*(?:only)?/i.test(text) || /only\s+for\s+new/i.test(text)) {
    conds.push("New users only");
  }

  const minAmt = text.match(
    /(?:minimum|min\.?|above|over|greater\s+than|more\s+than)\s+(?:order\s+(?:of\s+)?|transaction\s+(?:of\s+)?)?(?:₹|rs\.?|inr)\s*(\d[\d,]*)/i,
  );
  if (minAmt?.[1]) {
    const v = Number(minAmt[1].replace(/,/g, ""));
    conds.push(`Minimum transaction of ₹${v.toLocaleString("en-IN")}`);
  }

  if (/complete\s+(?:your\s+)?kyc/i.test(text)) {
    conds.push("KYC completion required");
  }

  if (/selected\s+users/i.test(text)) {
    conds.push("Valid for selected users");
  }

  if (/terms?\s+(?:and\s+)?conditions?\s+apply|t\s*&\s*c/i.test(text)) {
    conds.push("Terms and conditions apply");
  }

  return Array.from(new Set(conds));
}

function extractExpiry(text: string): {
  expiryType: "fixed_date" | "no_expiry_specified" | "unknown" | "expired";
  expiryDate: string | null;
  expiresDisplay: string;
} {
  const dateIndicator =
    /(?:valid\s+(?:till|until)|expires?\s*(?:on)?|expiry(?:\s+date)?|offer\s+ends?|last\s+date)\s*[:\-]?\s*/i;
  const dateExpr =
    /(?:(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+(?:\s+\d{2,4})?)|(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{2,4})?))/i;

  const combined = new RegExp(dateIndicator.source + dateExpr.source, "i");
  const m = text.match(combined);

  if (m) {
    const rawDateStr = (m[1] || m[2] || m[3] || "").replace(/(st|nd|rd|th)/gi, "").trim();
    const timestamp = Date.parse(rawDateStr);
    if (!isNaN(timestamp)) {
      const d = new Date(timestamp);
      if (!/\d{4}/.test(rawDateStr)) {
        const now = new Date();
        d.setFullYear(now.getFullYear());
        if (d < now) d.setFullYear(now.getFullYear() + 1);
      }
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const isoDate = `${year}-${month}-${day}`;
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);
      const isPast = endOfDay < new Date();
      return {
        expiryType: isPast ? "expired" : "fixed_date",
        expiryDate: isoDate,
        expiresDisplay: d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };
    }
  }

  return {
    expiryType: "no_expiry_specified",
    expiryDate: null,
    expiresDisplay: "",
  };
}

function mockParse(raw: string): ParsedReferral {
  const text = normalizeInput(raw);
  const urls = extractUrls(text);
  const primaryUrl = urls[0]?.url || "";

  const brandResult = detectBrand(text, urls);
  const service = brandResult.brandName || "";
  const category: CategorySlug = brandResult.category || "finance";

  const benefit = extractBenefit(text);
  const conditions = extractConditions(text);
  const expiry = extractExpiry(text);

  const words = (service || "Referral").trim().split(/\s+/);
  const initials = words.map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 2) || "??";

  const tags: string[] = [];
  if (service) tags.push(service.toLowerCase().replace(/\s+/g, ""));
  tags.push(category);
  if (benefit.type !== "reward") tags.push(benefit.type);

  const warnings: string[] = [];
  let needsReview = false;
  if (!service) {
    needsReview = true;
    warnings.push("Brand could not be confidently identified. Please review and confirm.");
  }

  const condText = conditions.length > 0 ? ` ${conditions.join(". ")}.` : "";
  const summary = benefit.hasAmount
    ? `Use this referral to get ${benefit.headline.toLowerCase()} on ${service || "this service"}.${condText}`
    : `Join ${service || "this service"} using this referral link to start earning cashback on your payments.${condText}`;

  return {
    service,
    initials,
    code: primaryUrl,
    isLink: Boolean(primaryUrl),
    benefit: benefit.headline,
    benefitType: benefit.type,
    category,
    summary,
    conditions,
    expires: expiry.expiresDisplay,
    expiryType: expiry.expiryType,
    expiryDate: expiry.expiryDate,
    tags: tags.slice(0, 4),
    needsReview,
    warnings,
    confidence: {
      brand: brandResult.confidence,
      benefit: benefit.confidence,
      category: brandResult.category ? 0.95 : 0.75,
      expiry: 0.95,
    },
  };
}
