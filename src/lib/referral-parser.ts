import type { BenefitType, CategorySlug } from "@/lib/referrals";

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
  tags: string[];
};

// ─── PUBLIC API ───────────────────────────────────────────────────────────────
//
// This is the ONLY function the backend developer needs to replace.
//
// Interface contract (preserve when swapping to a real backend):
//   • Receives: raw string — freeform user input (paste or typed)
//   • Returns:  Promise<ParsedReferral>
//   • Throws:   Error on failure (message is shown inline to the user)
//
// To connect a backend AI / parser service, replace the function body with:
//
//   const res = await fetch("/api/parse-referral", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ text: raw }),
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json() as ParsedReferral;
//
export async function parseReferralContent(raw: string): Promise<ParsedReferral> {
  if (!raw.trim()) throw new Error("Please paste a referral before continuing.");
  // Simulate AI / network processing latency
  await new Promise((r) => setTimeout(r, 700));
  return mockParse(raw.trim());
}

// ─── Mock rule-based parser ───────────────────────────────────────────────────
// Replace parseReferralContent above — do not need to touch anything below.
// ─────────────────────────────────────────────────────────────────────────────

type BrandEntry = { name: string; category: CategorySlug };

const BRANDS: BrandEntry[] = [
  // Shopping
  { name: "Myntra", category: "shopping" },
  { name: "Amazon", category: "shopping" },
  { name: "Flipkart", category: "shopping" },
  { name: "Meesho", category: "shopping" },
  { name: "AJIO", category: "shopping" },
  { name: "Nykaa", category: "shopping" },
  { name: "Snapdeal", category: "shopping" },
  { name: "Tata Cliq", category: "shopping" },
  { name: "Limeroad", category: "shopping" },
  // Food & Delivery
  { name: "Swiggy", category: "food" },
  { name: "Zomato", category: "food" },
  { name: "BigBasket", category: "food" },
  { name: "Blinkit", category: "food" },
  { name: "Zepto", category: "food" },
  { name: "Dunzo", category: "food" },
  { name: "Instamart", category: "food" },
  { name: "EatSure", category: "food" },
  { name: "Magicpin", category: "food" },
  // Finance
  { name: "PhonePe", category: "finance" },
  { name: "Google Pay", category: "finance" },
  { name: "GPay", category: "finance" },
  { name: "Paytm", category: "finance" },
  { name: "Navi", category: "finance" },
  { name: "CRED", category: "finance" },
  { name: "Groww", category: "finance" },
  { name: "Zerodha", category: "finance" },
  { name: "Upstox", category: "finance" },
  { name: "Fi Money", category: "finance" },
  { name: "Jupiter", category: "finance" },
  { name: "Slice", category: "finance" },
  { name: "Niyo", category: "finance" },
  { name: "PayWise", category: "finance" },
  { name: "IndMoney", category: "finance" },
  { name: "Smallcase", category: "finance" },
  { name: "INDmoney", category: "finance" },
  // Travel
  { name: "Ola", category: "travel" },
  { name: "Uber", category: "travel" },
  { name: "Rapido", category: "travel" },
  { name: "RedBus", category: "travel" },
  { name: "Ixigo", category: "travel" },
  { name: "MakeMyTrip", category: "travel" },
  { name: "GoIbibo", category: "travel" },
  { name: "Airbnb", category: "travel" },
  { name: "IRCTC", category: "travel" },
  { name: "EaseMyTrip", category: "travel" },
  // Education
  { name: "BYJU'S", category: "education" },
  { name: "Byjus", category: "education" },
  { name: "Unacademy", category: "education" },
  { name: "Coursera", category: "education" },
  { name: "Udemy", category: "education" },
  { name: "upGrad", category: "education" },
  { name: "Vedantu", category: "education" },
  { name: "Testbook", category: "education" },
  // Productivity
  { name: "Notion", category: "productivity" },
  { name: "Figma", category: "productivity" },
  { name: "Slack", category: "productivity" },
  { name: "Dropbox", category: "productivity" },
  { name: "Canva", category: "productivity" },
  { name: "Todoist", category: "productivity" },
  { name: "Grammarly", category: "productivity" },
  { name: "Loom", category: "productivity" },
  // Entertainment
  { name: "Netflix", category: "entertainment" },
  { name: "Spotify", category: "entertainment" },
  { name: "Hotstar", category: "entertainment" },
  { name: "JioCinema", category: "entertainment" },
  { name: "Prime Video", category: "entertainment" },
  { name: "Apple Music", category: "entertainment" },
  { name: "YouTube Premium", category: "entertainment" },
  { name: "SonyLIV", category: "entertainment" },
  // Developer
  { name: "GitHub", category: "developer" },
  { name: "Vercel", category: "developer" },
  { name: "Netlify", category: "developer" },
  { name: "DigitalOcean", category: "developer" },
  { name: "AWS", category: "developer" },
  { name: "Hostinger", category: "developer" },
  { name: "Render", category: "developer" },
  { name: "Railway", category: "developer" },
];

const CATEGORY_KEYWORDS: Record<CategorySlug, string[]> = {
  finance: [
    "upi",
    "bank",
    "wallet",
    "cashback",
    "pay",
    "money",
    "finance",
    "invest",
    "stock",
    "mutual fund",
    "insurance",
    "loan",
    "credit",
    "debit",
    "kyc",
    "transaction",
    "recharge",
  ],
  shopping: [
    "shop",
    "fashion",
    "clothes",
    "order",
    "cart",
    "checkout",
    "discount",
    "sale",
    "purchase",
    "buy",
    "mall",
    "apparel",
    "delivery",
  ],
  food: [
    "food",
    "eat",
    "delivery",
    "restaurant",
    "meal",
    "grocery",
    "kitchen",
    "snack",
    "lunch",
    "dinner",
    "order",
    "cuisine",
  ],
  travel: [
    "travel",
    "trip",
    "flight",
    "hotel",
    "cab",
    "bus",
    "train",
    "ride",
    "book",
    "stay",
    "vacation",
    "tour",
    "holiday",
  ],
  education: [
    "course",
    "learn",
    "class",
    "study",
    "test",
    "exam",
    "certification",
    "tutor",
    "skill",
    "academy",
    "edu",
    "lecture",
  ],
  productivity: [
    "productivity",
    "tool",
    "workspace",
    "note",
    "task",
    "project",
    "design",
    "ai",
    "saas",
    "collaborate",
    "template",
  ],
  developer: [
    "hosting",
    "server",
    "cloud",
    "deploy",
    "api",
    "database",
    "code",
    "dev",
    "github",
    "vps",
    "domain",
    "ssl",
  ],
  entertainment: [
    "stream",
    "watch",
    "music",
    "movie",
    "show",
    "game",
    "play",
    "series",
    "tv",
    "audio",
    "podcast",
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function detectBrand(text: string): BrandEntry | null {
  const lower = text.toLowerCase();
  const sorted = [...BRANDS].sort((a, b) => b.name.length - a.name.length);
  for (const brand of sorted) {
    if (lower.includes(brand.name.toLowerCase())) return brand;
  }
  return null;
}

function detectCategory(text: string): CategorySlug {
  const lower = text.toLowerCase();
  let best: CategorySlug = "shopping";
  let bestCount = 0;
  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS) as [CategorySlug, string[]][]) {
    const count = keywords.filter((k) => lower.includes(k)).length;
    if (count > bestCount) {
      bestCount = count;
      best = slug;
    }
  }
  return best;
}

function extractUrl(text: string): string | null {
  const m = text.match(/https?:\/\/[^\s,)>]+/i);
  return m ? m[0] : null;
}

function extractCode(text: string): string | null {
  // Explicit labeled code (highest priority)
  const explicit = text.match(
    /(?:code|promo(?:code)?|coupon|referral\s+(?:code|id)|use|enter)\s*[:=\-–]?\s*([A-Z0-9][A-Z0-9\-_]{2,19})/i,
  );
  if (explicit?.[1]) return explicit[1].toUpperCase();

  // Dash/colon separator: "code - 58201" or "code: ABC123"
  const dashToken = text.match(/[-–:]\s*([A-Z0-9][A-Z0-9\-_]{2,19})\b/i);
  if (dashToken?.[1]) return dashToken[1].toUpperCase();

  // Quoted code: "use 'ABC123'" or "use "ABC123""
  const quoted = text.match(/['""]([A-Z0-9][A-Z0-9\-_]{2,19})['""]'/i);
  if (quoted?.[1]) return quoted[1].toUpperCase();

  // Standalone all-caps token (4+ chars)
  const caps = text.match(/\b([A-Z][A-Z0-9\-_]{3,19})\b/);
  if (caps?.[1] && caps[1] !== caps[1].toLowerCase()) return caps[1];

  return null;
}

function extractAmount(text: string): { value: string; type: BenefitType } | null {
  // ₹ cashback / reward
  const rupee = text.match(/₹\s*(\d[\d,]*)/);
  if (rupee?.[1]) {
    const v = Number(rupee[1].replace(/,/g, ""));
    const label = /cashback/i.test(text)
      ? "CASHBACK"
      : /reward|earn/i.test(text)
        ? "REWARD"
        : "CASHBACK";
    return { value: `₹${v.toLocaleString("en-IN")} ${label}`, type: "cashback" };
  }
  // % discount
  const pct = text.match(/(\d+)\s*%\s*off/i);
  if (pct) return { value: `${pct[1]}% OFF`, type: "discount" };
  // Free month / trial
  if (/free\s+(?:month|trial|year|week)/i.test(text))
    return { value: "FREE TRIAL", type: "free-month" };
  // Free credits / reward
  if (/free\s+credits?/i.test(text)) return { value: "FREE CREDITS", type: "credits" };
  if (/\bfree\b/i.test(text)) return { value: "FREE REWARD", type: "reward" };
  // Credits mention
  if (/credits?/i.test(text)) return { value: "FREE CREDITS", type: "credits" };
  return null;
}

function extractExpiry(text: string): string {
  const datePattern =
    /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})/i;

  const keyword =
    /(?:valid\s+(?:till|until)|expires?\s*(?:on)?|expiry(?:\s+date)?|last\s+date)\s*[:\-–]?\s*/i;

  const combined = new RegExp(keyword.source + datePattern.source, "i");
  const m1 = text.match(combined);
  if (m1?.[1]) return m1[1];

  // Fallback: standalone date in text
  const m2 = text.match(datePattern);
  if (m2?.[1]) return m2[1];

  return "";
}

function extractConditions(text: string): string[] {
  const conds: string[] = [];

  if (/new\s+user/i.test(text)) conds.push("New users only");

  if (/first\s+(?:order|transaction|purchase|payment|recharge)/i.test(text))
    conds.push("Valid on first transaction only");

  const minAmt = text.match(
    /(?:minimum|min\.?|above|over|greater\s+than|more\s+than)\s+(?:order\s+(?:of\s+)?|transaction\s+(?:of\s+)?)?₹\s*(\d[\d,]*)/i,
  );
  if (minAmt?.[1]) {
    const v = Number(minAmt[1].replace(/,/g, ""));
    conds.push(`Minimum transaction of ₹${v.toLocaleString("en-IN")}`);
  }

  const maxCb = text.match(
    /(?:max|maximum|up\s+to|upto)\s+(?:cashback\s+(?:of\s+)?)?₹\s*(\d[\d,]*)/i,
  );
  if (maxCb?.[1]) {
    const v = Number(maxCb[1].replace(/,/g, ""));
    conds.push(`Maximum cashback ₹${v.toLocaleString("en-IN")}`);
  }

  if (/kyc/i.test(text)) conds.push("KYC completion required");

  if (/once\s+per\s+user|per\s+(?:user|account|number)/i.test(text))
    conds.push("Valid once per user");

  if (/t\s*&\s*c\s+apply|terms?\s+(?:and\s+)?conditions?/i.test(text))
    conds.push("Terms and conditions apply");

  return conds;
}

function extractServiceName(text: string): string {
  // Word near "code" or "referral"
  const near = text.match(/([A-Z][a-zA-Z]{2,})\s+(?:code|referral|link|offer|promo|app)/i);
  if (near?.[1]) return near[1];
  // First proper noun
  const first = text.match(/\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b/);
  if (first?.[1]) return first[1];
  return "Referral";
}

function buildSummary(
  service: string,
  benefit: string,
  code: string,
  category: CategorySlug,
): string {
  const labels: Record<CategorySlug, string> = {
    finance: "finance app",
    shopping: "shopping platform",
    food: "food delivery app",
    travel: "travel platform",
    education: "learning platform",
    productivity: "productivity tool",
    developer: "developer platform",
    entertainment: "entertainment platform",
  };
  const action = benefit.toLowerCase().includes("cashback")
    ? "cashback"
    : benefit.toLowerCase().includes("% off")
      ? "discount"
      : benefit.toLowerCase().includes("free")
        ? "free access"
        : "reward";

  if (benefit && service && service !== "Referral") {
    const codeStr = code ? ` Use referral code ${code} to claim.` : "";
    return `Get ${benefit.toLowerCase()} ${action} on ${service}.${codeStr}`;
  }
  if (service && service !== "Referral") {
    return `Share this ${service} referral and earn a reward on the ${labels[category]}.`;
  }
  return `Use this referral to unlock a ${action} on this ${labels[category]}.`;
}

function buildTags(service: string, category: CategorySlug, benefit: string): string[] {
  const tags: string[] = [];
  if (service && service !== "Referral") tags.push(service.toLowerCase().replace(/\s+/g, ""));
  const catTag: Record<CategorySlug, string> = {
    finance: "fintech",
    shopping: "shopping",
    food: "food",
    travel: "travel",
    education: "learning",
    productivity: "productivity",
    developer: "devtools",
    entertainment: "entertainment",
  };
  const categoryTag = catTag[category];
  if (categoryTag) tags.push(categoryTag);
  if (benefit.toLowerCase().includes("cashback")) tags.push("cashback");
  else if (benefit.toLowerCase().includes("off")) tags.push("discount");
  else if (benefit.toLowerCase().includes("free")) tags.push("free");
  return tags.slice(0, 4);
}

// ── Main mock parse function ──────────────────────────────────────────────────

function mockParse(raw: string): ParsedReferral {
  const brand = detectBrand(raw);
  const service = brand?.name ?? extractServiceName(raw);
  const category = brand?.category ?? detectCategory(raw);

  const url = extractUrl(raw);
  const code = url ?? extractCode(raw) ?? "";
  const isLink = !!url;

  const amount = extractAmount(raw);
  const benefit = amount?.value ?? (code ? "REFERRAL CODE" : "SPECIAL OFFER");
  const benefitType = amount?.type ?? "reward";

  const expires = extractExpiry(raw);
  const conditions = extractConditions(raw);
  const summary = buildSummary(service, benefit, code, category);

  const words = service.trim().split(/\s+/);
  const initials =
    words
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";
  const tags = buildTags(service, category, benefit);

  return {
    service,
    initials,
    code,
    isLink,
    benefit,
    benefitType,
    category,
    summary,
    conditions,
    expires,
    tags,
  };
}
