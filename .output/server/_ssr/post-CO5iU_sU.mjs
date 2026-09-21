import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useAuth, h as apiPostAuth, l as categories } from "./router-BOn4884-.mjs";
import { F as ArrowLeft, O as Check, c as Sparkles, m as PartyPopper, n as WandSparkles, p as Pencil } from "../_libs/lucide-react.mjs";
import { r as cn, t as SiteHeader } from "./site-header-mE72LyKf.mjs";
import { i as SiteFooter, n as CategoryChip, r as ServiceMark, t as BenefitBadge } from "./badges-DZ2e6Vbs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/post-CO5iU_sU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Map the backend response to the frontend ParsedReferral shape. */
function mapBackendResponse(b) {
	const service = b.brandName || "Referral";
	const initials = service.trim().split(/\s+/).map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 2) || "??";
	const isLink = !!b.referralUrl;
	const code = isLink ? b.referralUrl : b.referralCode || "";
	let benefitType = "reward";
	const h = b.benefitHeadline.toLowerCase();
	if (h.includes("cashback")) benefitType = "cashback";
	else if (h.includes("% off") || h.includes("discount")) benefitType = "discount";
	else if (h.includes("free month") || h.includes("trial")) benefitType = "free-month";
	else if (h.includes("credit")) benefitType = "credits";
	const tags = [];
	if (service !== "Referral") tags.push(service.toLowerCase().replace(/\s+/g, ""));
	if (b.category) tags.push(b.category);
	if (benefitType !== "reward") tags.push(benefitType);
	const summary = b.description || `Use this ${service} referral to get ${b.benefitHeadline.toLowerCase()}.`;
	return {
		service,
		initials,
		code,
		isLink,
		benefit: b.benefitHeadline,
		benefitType,
		category: b.category,
		summary,
		conditions: b.conditions || [],
		expires: b.expiryDate || "",
		tags: tags.slice(0, 4)
	};
}
async function parseReferralContent(raw) {
	if (!raw.trim()) throw new Error("Please paste a referral before continuing.");
	try {
		const resp = await apiPostAuth("/referrals/parse", { text: raw.trim() });
		if (resp.success && resp.data) return mapBackendResponse(resp.data);
	} catch {}
	await new Promise((r) => setTimeout(r, 400));
	return mockParse(raw.trim());
}
var BRANDS = [
	{
		name: "Myntra",
		category: "shopping"
	},
	{
		name: "Amazon",
		category: "shopping"
	},
	{
		name: "Flipkart",
		category: "shopping"
	},
	{
		name: "Meesho",
		category: "shopping"
	},
	{
		name: "AJIO",
		category: "shopping"
	},
	{
		name: "Nykaa",
		category: "shopping"
	},
	{
		name: "Snapdeal",
		category: "shopping"
	},
	{
		name: "Tata Cliq",
		category: "shopping"
	},
	{
		name: "Limeroad",
		category: "shopping"
	},
	{
		name: "Swiggy",
		category: "food"
	},
	{
		name: "Zomato",
		category: "food"
	},
	{
		name: "BigBasket",
		category: "food"
	},
	{
		name: "Blinkit",
		category: "food"
	},
	{
		name: "Zepto",
		category: "food"
	},
	{
		name: "Dunzo",
		category: "food"
	},
	{
		name: "Instamart",
		category: "food"
	},
	{
		name: "EatSure",
		category: "food"
	},
	{
		name: "Magicpin",
		category: "food"
	},
	{
		name: "PhonePe",
		category: "finance"
	},
	{
		name: "Google Pay",
		category: "finance"
	},
	{
		name: "GPay",
		category: "finance"
	},
	{
		name: "Paytm",
		category: "finance"
	},
	{
		name: "Navi",
		category: "finance"
	},
	{
		name: "CRED",
		category: "finance"
	},
	{
		name: "Groww",
		category: "finance"
	},
	{
		name: "Zerodha",
		category: "finance"
	},
	{
		name: "Upstox",
		category: "finance"
	},
	{
		name: "Fi Money",
		category: "finance"
	},
	{
		name: "Jupiter",
		category: "finance"
	},
	{
		name: "Slice",
		category: "finance"
	},
	{
		name: "Niyo",
		category: "finance"
	},
	{
		name: "PayWise",
		category: "finance"
	},
	{
		name: "IndMoney",
		category: "finance"
	},
	{
		name: "Smallcase",
		category: "finance"
	},
	{
		name: "INDmoney",
		category: "finance"
	},
	{
		name: "Ola",
		category: "travel"
	},
	{
		name: "Uber",
		category: "travel"
	},
	{
		name: "Rapido",
		category: "travel"
	},
	{
		name: "RedBus",
		category: "travel"
	},
	{
		name: "Ixigo",
		category: "travel"
	},
	{
		name: "MakeMyTrip",
		category: "travel"
	},
	{
		name: "GoIbibo",
		category: "travel"
	},
	{
		name: "Airbnb",
		category: "travel"
	},
	{
		name: "IRCTC",
		category: "travel"
	},
	{
		name: "EaseMyTrip",
		category: "travel"
	},
	{
		name: "BYJU'S",
		category: "education"
	},
	{
		name: "Byjus",
		category: "education"
	},
	{
		name: "Unacademy",
		category: "education"
	},
	{
		name: "Coursera",
		category: "education"
	},
	{
		name: "Udemy",
		category: "education"
	},
	{
		name: "upGrad",
		category: "education"
	},
	{
		name: "Vedantu",
		category: "education"
	},
	{
		name: "Testbook",
		category: "education"
	},
	{
		name: "Notion",
		category: "productivity"
	},
	{
		name: "Figma",
		category: "productivity"
	},
	{
		name: "Slack",
		category: "productivity"
	},
	{
		name: "Dropbox",
		category: "productivity"
	},
	{
		name: "Canva",
		category: "productivity"
	},
	{
		name: "Todoist",
		category: "productivity"
	},
	{
		name: "Grammarly",
		category: "productivity"
	},
	{
		name: "Loom",
		category: "productivity"
	},
	{
		name: "Netflix",
		category: "entertainment"
	},
	{
		name: "Spotify",
		category: "entertainment"
	},
	{
		name: "Hotstar",
		category: "entertainment"
	},
	{
		name: "JioCinema",
		category: "entertainment"
	},
	{
		name: "Prime Video",
		category: "entertainment"
	},
	{
		name: "Apple Music",
		category: "entertainment"
	},
	{
		name: "YouTube Premium",
		category: "entertainment"
	},
	{
		name: "SonyLIV",
		category: "entertainment"
	},
	{
		name: "GitHub",
		category: "developer"
	},
	{
		name: "Vercel",
		category: "developer"
	},
	{
		name: "Netlify",
		category: "developer"
	},
	{
		name: "DigitalOcean",
		category: "developer"
	},
	{
		name: "AWS",
		category: "developer"
	},
	{
		name: "Hostinger",
		category: "developer"
	},
	{
		name: "Render",
		category: "developer"
	},
	{
		name: "Railway",
		category: "developer"
	}
];
var CATEGORY_KEYWORDS = {
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
		"recharge"
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
		"delivery"
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
		"cuisine"
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
		"holiday"
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
		"lecture"
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
		"template"
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
		"ssl"
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
		"podcast"
	]
};
function detectBrand(text) {
	const lower = text.toLowerCase();
	const sorted = [...BRANDS].sort((a, b) => b.name.length - a.name.length);
	for (const brand of sorted) if (lower.includes(brand.name.toLowerCase())) return brand;
	return null;
}
function detectCategory(text) {
	const lower = text.toLowerCase();
	let best = "shopping";
	let bestCount = 0;
	for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
		const count = keywords.filter((k) => lower.includes(k)).length;
		if (count > bestCount) {
			bestCount = count;
			best = slug;
		}
	}
	return best;
}
function extractUrl(text) {
	const m = text.match(/https?:\/\/[^\s,)>]+/i);
	return m ? m[0] : null;
}
function extractCode(text) {
	const explicit = text.match(/(?:code|promo(?:code)?|coupon|referral\s+(?:code|id)|use|enter)\s*[:=\-–]?\s*([A-Z0-9][A-Z0-9\-_]{2,19})/i);
	if (explicit?.[1]) return explicit[1].toUpperCase();
	const dashToken = text.match(/[-–:]\s*([A-Z0-9][A-Z0-9\-_]{2,19})\b/i);
	if (dashToken?.[1]) return dashToken[1].toUpperCase();
	const quoted = text.match(/['""]([A-Z0-9][A-Z0-9\-_]{2,19})['""]'/i);
	if (quoted?.[1]) return quoted[1].toUpperCase();
	const caps = text.match(/\b([A-Z][A-Z0-9\-_]{3,19})\b/);
	if (caps?.[1] && caps[1] !== caps[1].toLowerCase()) return caps[1];
	return null;
}
function extractAmount(text) {
	const rupee = text.match(/₹\s*(\d[\d,]*)/);
	if (rupee?.[1]) {
		const v = Number(rupee[1].replace(/,/g, ""));
		const label = /cashback/i.test(text) ? "CASHBACK" : /reward|earn/i.test(text) ? "REWARD" : "CASHBACK";
		return {
			value: `₹${v.toLocaleString("en-IN")} ${label}`,
			type: "cashback"
		};
	}
	const pct = text.match(/(\d+)\s*%\s*off/i);
	if (pct) return {
		value: `${pct[1]}% OFF`,
		type: "discount"
	};
	if (/free\s+(?:month|trial|year|week)/i.test(text)) return {
		value: "FREE TRIAL",
		type: "free-month"
	};
	if (/free\s+credits?/i.test(text)) return {
		value: "FREE CREDITS",
		type: "credits"
	};
	if (/\bfree\b/i.test(text)) return {
		value: "FREE REWARD",
		type: "reward"
	};
	if (/credits?/i.test(text)) return {
		value: "FREE CREDITS",
		type: "credits"
	};
	return null;
}
function extractExpiry(text) {
	const datePattern = /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})/i;
	const combined = new RegExp(/(?:valid\s+(?:till|until)|expires?\s*(?:on)?|expiry(?:\s+date)?|last\s+date)\s*[:\-–]?\s*/i.source + datePattern.source, "i");
	const m1 = text.match(combined);
	if (m1?.[1]) return m1[1];
	const m2 = text.match(datePattern);
	if (m2?.[1]) return m2[1];
	return "";
}
function extractConditions(text) {
	const conds = [];
	if (/new\s+user/i.test(text)) conds.push("New users only");
	if (/first\s+(?:order|transaction|purchase|payment|recharge)/i.test(text)) conds.push("Valid on first transaction only");
	const minAmt = text.match(/(?:minimum|min\.?|above|over|greater\s+than|more\s+than)\s+(?:order\s+(?:of\s+)?|transaction\s+(?:of\s+)?)?₹\s*(\d[\d,]*)/i);
	if (minAmt?.[1]) {
		const v = Number(minAmt[1].replace(/,/g, ""));
		conds.push(`Minimum transaction of ₹${v.toLocaleString("en-IN")}`);
	}
	const maxCb = text.match(/(?:max|maximum|up\s+to|upto)\s+(?:cashback\s+(?:of\s+)?)?₹\s*(\d[\d,]*)/i);
	if (maxCb?.[1]) {
		const v = Number(maxCb[1].replace(/,/g, ""));
		conds.push(`Maximum cashback ₹${v.toLocaleString("en-IN")}`);
	}
	if (/kyc/i.test(text)) conds.push("KYC completion required");
	if (/once\s+per\s+user|per\s+(?:user|account|number)/i.test(text)) conds.push("Valid once per user");
	if (/t\s*&\s*c\s+apply|terms?\s+(?:and\s+)?conditions?/i.test(text)) conds.push("Terms and conditions apply");
	return conds;
}
function extractServiceName(text) {
	const near = text.match(/([A-Z][a-zA-Z]{2,})\s+(?:code|referral|link|offer|promo|app)/i);
	if (near?.[1]) return near[1];
	const first = text.match(/\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b/);
	if (first?.[1]) return first[1];
	return "Referral";
}
function buildSummary(service, benefit, code, category) {
	const labels = {
		finance: "finance app",
		shopping: "shopping platform",
		food: "food delivery app",
		travel: "travel platform",
		education: "learning platform",
		productivity: "productivity tool",
		developer: "developer platform",
		entertainment: "entertainment platform"
	};
	const action = benefit.toLowerCase().includes("cashback") ? "cashback" : benefit.toLowerCase().includes("% off") ? "discount" : benefit.toLowerCase().includes("free") ? "free access" : "reward";
	if (benefit && service && service !== "Referral") {
		const codeStr = code ? ` Use referral code ${code} to claim.` : "";
		return `Get ${benefit.toLowerCase()} ${action} on ${service}.${codeStr}`;
	}
	if (service && service !== "Referral") return `Share this ${service} referral and earn a reward on the ${labels[category]}.`;
	return `Use this referral to unlock a ${action} on this ${labels[category]}.`;
}
function buildTags(service, category, benefit) {
	const tags = [];
	if (service && service !== "Referral") tags.push(service.toLowerCase().replace(/\s+/g, ""));
	const categoryTag = {
		finance: "fintech",
		shopping: "shopping",
		food: "food",
		travel: "travel",
		education: "learning",
		productivity: "productivity",
		developer: "devtools",
		entertainment: "entertainment"
	}[category];
	if (categoryTag) tags.push(categoryTag);
	if (benefit.toLowerCase().includes("cashback")) tags.push("cashback");
	else if (benefit.toLowerCase().includes("off")) tags.push("discount");
	else if (benefit.toLowerCase().includes("free")) tags.push("free");
	return tags.slice(0, 4);
}
function mockParse(raw) {
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
	return {
		service,
		initials: service.trim().split(/\s+/).map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 2) || "??",
		code,
		isLink,
		benefit,
		benefitType,
		category,
		summary,
		conditions,
		expires,
		tags: buildTags(service, category, benefit)
	};
}
var EMPTY_FORM = {
	service: "",
	code: "",
	benefit: "",
	category: "finance",
	summary: "",
	conditionsText: "",
	expires: ""
};
function PostPage() {
	const [step, setStep] = (0, import_react.useState)("paste");
	const [rawText, setRawText] = (0, import_react.useState)("");
	const [isParsing, setIsParsing] = (0, import_react.useState)(false);
	const [parseError, setParseError] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(EMPTY_FORM);
	const setField = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	const { user } = useAuth();
	const [isPublishing, setIsPublishing] = (0, import_react.useState)(false);
	const handleCreate = async (e) => {
		e.preventDefault();
		if (!rawText.trim()) return;
		setParseError(null);
		setIsParsing(true);
		try {
			const p = await parseReferralContent(rawText);
			setForm({
				service: p.service,
				code: p.code,
				benefit: p.benefit,
				category: p.category,
				summary: p.summary,
				conditionsText: p.conditions.join("\n"),
				expires: p.expires
			});
			setStep("review");
		} catch (err) {
			setParseError(err instanceof Error ? err.message : "Failed to process. Please try again.");
		} finally {
			setIsParsing(false);
		}
	};
	const handlePublish = async (e) => {
		e.preventDefault();
		if (!user) {
			toast.error("Please sign in to publish your referral.");
			return;
		}
		if (!form.service.trim() || !form.code.trim() || !form.benefit.trim()) {
			toast.error("Please fill in the required fields (service, code, and benefit).");
			return;
		}
		setIsPublishing(true);
		try {
			const conditions = form.conditionsText.split("\n").map((s) => s.trim()).filter(Boolean);
			const isUrl = /^https?:\/\//i.test(form.code.trim());
			await apiPostAuth("/referrals", {
				brandName: form.service.trim(),
				categoryId: form.category,
				benefitHeadline: form.benefit.trim(),
				description: form.summary.trim() || `${form.service.trim()} referral: ${form.benefit.trim()}`,
				referralCode: isUrl ? "" : form.code.trim(),
				referralUrl: isUrl ? form.code.trim() : void 0,
				conditions: conditions.length > 0 ? conditions : void 0
			});
			setStep("published");
			toast.success("Referral published successfully!");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to publish referral";
			toast.error(msg);
		} finally {
			setIsPublishing(false);
		}
	};
	const handleReset = () => {
		setStep("paste");
		setRawText("");
		setForm(EMPTY_FORM);
		setParseError(null);
	};
	if (step === "published") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid max-w-2xl place-items-center px-4 py-24 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-20 place-items-center rounded-2xl border-2 border-foreground bg-leaf-soft text-leaf animate-pop",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartyPopper, { className: "size-9" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-8 text-4xl font-bold md:text-5xl",
						children: "Your referral is live"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 max-w-md text-base text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: form.service || "Your referral" }), " is now in the discover feed. You'll get a nudge each time someone copies it, and verification usually completes within a day."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/discover",
							className: "rounded-lg border-2 border-foreground bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground press",
							style: { boxShadow: "3px 3px 0 var(--ink)" },
							children: "See it in discover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleReset,
							className: "rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold press",
							children: "Post another"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
	if (step === "review") {
		const initials = form.service.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "??";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStep("paste"),
								className: "mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Edit paste"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
								children: "Review your referral"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 text-3xl font-bold leading-tight md:text-4xl",
								children: "Looks good? Edit anything, then publish."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground",
								children: "We've organized the details from your paste. Correct any field before going live."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 grid gap-10 lg:grid-cols-[1fr_380px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handlePublish,
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
									title: "The basics",
									step: "01",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Brand / service name",
										required: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											required: true,
											value: form.service,
											onChange: (e) => setField("service", e.target.value),
											placeholder: "e.g. Myntra",
											className: inputCls
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Category",
										required: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-2",
											children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setField("category", c.slug),
												className: cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors", form.category === c.slug ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:border-foreground/30"),
												children: [
													c.emoji,
													" ",
													c.name
												]
											}, c.slug))
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
									title: "The offer",
									step: "02",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Benefit badge",
										required: true,
										hint: "Short and loud — this becomes the badge on your card.",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											required: true,
											value: form.benefit,
											onChange: (e) => setField("benefit", e.target.value),
											placeholder: "e.g. ₹500 CASHBACK",
											className: inputCls
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Description",
										required: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											required: true,
											rows: 3,
											value: form.summary,
											onChange: (e) => setField("summary", e.target.value),
											placeholder: "What does the referee get, and how do they claim it?",
											className: `${inputCls} resize-none py-3`
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
									title: "How to claim",
									step: "03",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Referral code or link",
											required: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												required: true,
												value: form.code,
												onChange: (e) => setField("code", e.target.value),
												placeholder: "CODE123 or https://…",
												className: `${inputCls} font-mono`
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Conditions",
											hint: "One per line.",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												rows: 3,
												value: form.conditionsText,
												onChange: (e) => setField("conditionsText", e.target.value),
												placeholder: "New users only\nFirst transaction ₹100+",
												className: `${inputCls} resize-none py-3`
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Expiry date",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: form.expires,
												onChange: (e) => setField("expires", e.target.value),
												placeholder: "e.g. 31 Dec 2026",
												className: inputCls
											})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: isPublishing,
										className: "press rounded-xl border-2 border-foreground bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed",
										style: { boxShadow: isPublishing ? "none" : "4px 4px 0 var(--ink)" },
										children: isPublishing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" }), "Publishing…"]
										}) : "Publish Referral"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: isPublishing,
										onClick: () => setStep("paste"),
										className: "press rounded-xl border border-border bg-card px-5 py-3.5 text-base font-semibold hover:bg-secondary disabled:opacity-50",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Edit paste"]
										})
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "lg:sticky lg:top-24 lg:self-start",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Live preview"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "rounded-2xl border border-border bg-card p-5 shadow-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceMark, {
												initials,
												slug: form.category
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: form.service || "Your service"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "posted just now"
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitBadge, { children: form.benefit || "YOUR BENEFIT" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 line-clamp-3 text-sm text-muted-foreground",
											children: form.summary || "A short description of what the other person gets."
										}),
										form.conditionsText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-3 space-y-1",
											children: form.conditionsText.split("\n").filter(Boolean).slice(0, 3).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-start gap-2 text-xs text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-px inline-grid size-4 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-bold",
													children: "✓"
												}), c]
											}, c))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryChip, { slug: form.category })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-5 flex items-center justify-between border-t border-dashed border-border pt-3 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0 copies" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-1.5 font-semibold text-background",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }), " Copy referral"]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: "This is roughly how your card appears in the discover feed."
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "enter w-full max-w-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
								children: "Post a referral"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 text-4xl font-bold leading-tight md:text-5xl",
								children: "Share a referral"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 text-base text-muted-foreground",
								children: [
									"Paste your referral message, code, or offer.",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: "We'll organize the details for you."
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-foreground/15 bg-card p-6 shadow-card md:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleCreate,
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "referral-text",
											className: "text-sm font-semibold",
											children: "Your referral"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											id: "referral-text",
											rows: 7,
											value: rawText,
											onChange: (e) => {
												setRawText(e.target.value);
												if (parseError) setParseError(null);
											},
											placeholder: `Paste your referral here…\n\nExamples:\n• "I have a Myntra code - 58201"\n• "Get ₹150 cashback on Navi UPI. Use code NAVI150. New users only."\n• Paste a full promotional SMS or message`,
											className: "w-full resize-none rounded-xl border border-border bg-background px-4 py-4 text-sm leading-relaxed outline-none transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Any format works — code, URL, or a full message."
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground tabular-nums",
												children: rawText.length > 0 ? `${rawText.length} chars` : ""
											})]
										})
									]
								}),
								parseError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									role: "alert",
									className: "rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive",
									children: parseError
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isParsing || !rawText.trim(),
									style: { boxShadow: isParsing || !rawText.trim() ? "none" : "3px 3px 0 var(--ink)" },
									className: cn("press w-full rounded-xl border-2 border-foreground bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground", "disabled:cursor-not-allowed disabled:opacity-60"),
									children: isParsing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center justify-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" }), "Organizing your referral…"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center justify-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4" }), "Create Referral"]
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-5 text-center text-xs text-muted-foreground",
							children: [
								"Paste once.",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "We organize everything."
								})
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
var inputCls = "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/40";
function Section({ title, step, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-6 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-7 place-items-center rounded-md bg-secondary font-display text-xs font-bold",
				children: step
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold",
				children: title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-5",
			children
		})]
	});
}
function Field({ label, hint, required, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mb-1.5 block text-sm font-medium",
				children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary",
					children: " *"
				})]
			}),
			children,
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1.5 block text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { PostPage as component };
