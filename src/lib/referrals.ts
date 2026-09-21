export type CategorySlug =
  | "finance"
  | "shopping"
  | "food"
  | "travel"
  | "education"
  | "productivity"
  | "developer"
  | "entertainment";

export type BenefitType = "cashback" | "discount" | "free-month" | "credits" | "reward";

export type Trust = "verified" | "trusted" | "new" | "expiring";

export type Referral = {
  id: string;
  service: string;
  initials: string;
  category: CategorySlug;
  benefit: string;
  benefitType: BenefitType;
  summary: string;
  details: string;
  conditions: string[];
  code: string;
  isLink: boolean;
  tags: string[];
  submittedBy?: string;
  postedBy: { username: string; name: string; initials: string; trustScore: number };
  postedAgo: string;
  postedOn: string;
  copies: number;
  popularity: number;
  trust: Trust[];
  expires: string;
  status: "active" | "past";
};

export const categories: {
  slug: CategorySlug;
  name: string;
  blurb: string;
  count: number;
  accent: string;
  soft: string;
  emoji: string;
}[] = [
  {
    slug: "finance",
    name: "Finance & Payments",
    blurb: "Banks, UPI apps, brokers, cards",
    count: 128,
    accent: "text-leaf",
    soft: "bg-leaf-soft",
    emoji: "₹",
  },
  {
    slug: "shopping",
    name: "Shopping",
    blurb: "Marketplaces, fashion, electronics",
    count: 94,
    accent: "text-grape",
    soft: "bg-grape-soft",
    emoji: "🛍",
  },
  {
    slug: "food",
    name: "Food & Delivery",
    blurb: "Delivery apps, cloud kitchens, groceries",
    count: 76,
    accent: "text-rose",
    soft: "bg-rose-soft",
    emoji: "🍜",
  },
  {
    slug: "travel",
    name: "Travel",
    blurb: "Flights, stays, cabs and rentals",
    count: 61,
    accent: "text-sky",
    soft: "bg-sky-soft",
    emoji: "✈",
  },
  {
    slug: "education",
    name: "Education",
    blurb: "Courses, test prep, certifications",
    count: 48,
    accent: "text-amber",
    soft: "bg-amber-soft",
    emoji: "✎",
  },
  {
    slug: "productivity",
    name: "Productivity",
    blurb: "Notes, tasks, design and AI tools",
    count: 57,
    accent: "text-grape",
    soft: "bg-grape-soft",
    emoji: "◎",
  },
  {
    slug: "developer",
    name: "Developer Tools",
    blurb: "Hosting, databases, monitoring",
    count: 39,
    accent: "text-sky",
    soft: "bg-sky-soft",
    emoji: "⌘",
  },
  {
    slug: "entertainment",
    name: "Entertainment",
    blurb: "Streaming, music, gaming",
    count: 44,
    accent: "text-rose",
    soft: "bg-rose-soft",
    emoji: "▶",
  },
];

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<
  CategorySlug,
  (typeof categories)[number]
>;

export const benefitTypes: { value: BenefitType; label: string }[] = [
  { value: "cashback", label: "Cashback" },
  { value: "discount", label: "Discount" },
  { value: "free-month", label: "Free month" },
  { value: "credits", label: "Credits" },
  { value: "reward", label: "Reward" },
];

/** Live referrals array (only populated via live API in modern Refova) */
export const referrals: Referral[] = [];

export const getReferral = (id: string) => referrals.find((r) => r.id === id);

export const similarTo = (r: Referral, n = 3) =>
  referrals.filter((x) => x.id !== r.id && x.category === r.category).slice(0, n);

export const trustLabel: Record<Trust, string> = {
  verified: "Verified",
  trusted: "Community trusted",
  new: "New",
  expiring: "Expiring soon",
};

export const maskCode = (code: string) => {
  if (code.length <= 6) return "••••••";
  return code.slice(0, 4) + "•".repeat(Math.min(14, code.length - 6)) + code.slice(-2);
};

// ─── Backend API shape ────────────────────────────────────────────────────────

export type ApiReferral = {
  id: string;
  brandName: string;
  title: string;
  categoryId: CategorySlug;
  categoryName: string;
  benefitHeadline: string;
  description: string;
  referralCode: string;
  referralUrl: string;
  conditions: string[];
  expiryDate: string | null;
  imageUrl: string | null;
  imagePath: string | null;
  submittedBy: string;
  submittedByName: string;
  status: "draft" | "pending" | "published" | "rejected" | "suspended";
  verificationStatus: "unverified" | "verified" | "rejected";
  isFeatured: boolean;
  isTrending: boolean;
  copyCount: number;
  viewCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type PaginatedReferrals = {
  success: boolean;
  data: ApiReferral[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

/** Map a backend ApiReferral to the frontend Referral display shape. */
export function mapApiReferral(r: ApiReferral): Referral {
  const service = r.brandName || r.title || "Referral";
  const words = service.trim().split(/\s+/);
  const initials = words.map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 2) || "??";
  const isLink = !!r.referralUrl;
  const code = isLink ? r.referralUrl : r.referralCode;

  // Map verificationStatus + isFeatured to Trust[]
  const trust: Trust[] = [];
  if (r.verificationStatus === "verified") trust.push("verified");
  if (r.copyCount > 100) trust.push("trusted");
  if (r.expiryDate && new Date(r.expiryDate).getTime() < Date.now() + 7 * 24 * 60 * 60 * 1000) trust.push("expiring");
  if (trust.length === 0) trust.push("new");

  // Map benefitHeadline to BenefitType
  let benefitType: BenefitType = "reward";
  const h = (r.benefitHeadline || "").toLowerCase();
  if (h.includes("cashback")) benefitType = "cashback";
  else if (h.includes("% off") || h.includes("discount")) benefitType = "discount";
  else if (h.includes("free month") || h.includes("trial") || h.includes("1 month")) benefitType = "free-month";
  else if (h.includes("credit")) benefitType = "credits";

  // Relative time
  const postedAgo = r.publishedAt
    ? formatAgo(r.publishedAt)
    : r.createdAt
      ? formatAgo(r.createdAt)
      : "recently";

  const postedOn = r.publishedAt
    ? new Date(r.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

  // Active status: published, draft, or pending unless expired or suspended
  const isExpired = !!r.expiryDate && new Date(r.expiryDate).getTime() < Date.now();
  const isActive = (r.status === "published" || r.status === "draft" || r.status === "pending") && !isExpired;

  return {
    id: r.id,
    service,
    initials,
    category: r.categoryId,
    benefit: r.benefitHeadline || "REFERRAL OFFER",
    benefitType,
    summary: r.description || "",
    details: r.description || "",
    conditions: r.conditions || [],
    code,
    isLink,
    tags: [r.categoryId],
    submittedBy: r.submittedBy,
    postedBy: {
      username: r.submittedBy,
      name: r.submittedByName || "Member",
      initials: (r.submittedByName || "M").slice(0, 2).toUpperCase(),
      trustScore: 85,
    },
    postedAgo,
    postedOn,
    copies: r.copyCount || 0,
    popularity: r.copyCount || 0,
    trust,
    expires: r.expiryDate
      ? new Date(r.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : "",
    status: isActive ? "active" : "past",
  };
}

function formatAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
