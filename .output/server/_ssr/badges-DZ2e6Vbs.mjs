import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { l as categories, p as trustLabel, u as categoryBySlug } from "./router-BOn4884-.mjs";
import { T as Clock3, c as Sparkles, j as BadgeCheck, r as Users } from "../_libs/lucide-react.mjs";
import { n as Wordmark, r as cn } from "./site-header-mE72LyKf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badges-DZ2e6Vbs.js
var import_jsx_runtime = require_jsx_runtime();
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-24 border-t border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground",
						children: "A calmer place for referral links and codes — posted by people, checked by the community, easy to copy."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-sm font-semibold",
					children: "Browse"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2 text-sm text-muted-foreground",
					children: categories.slice(0, 5).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/category/$slug",
						params: { slug: c.slug },
						className: "transition-colors hover:text-foreground",
						children: c.name
					}) }, c.slug))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-sm font-semibold",
					children: "Platform"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/discover",
							className: "transition-colors hover:text-foreground",
							children: "Discover referrals"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/post",
							className: "transition-colors hover:text-foreground",
							children: "Post a referral"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/profile/$username",
							params: { username: "aditya" },
							className: "transition-colors hover:text-foreground",
							children: "Your profile"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/#how-it-works",
							className: "transition-colors hover:text-foreground",
							children: "How it works"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-sm font-semibold",
					children: "Good to know"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Community guidelines" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "How verification works" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Report a referral" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Privacy" })
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border px-4 py-6 text-center text-xs text-muted-foreground",
			children: "Refova · prototype concept · All companies, referrals and members shown here are fictional."
		})]
	});
}
function BenefitBadge({ children, size = "md", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-primary font-display font-extrabold uppercase tracking-tight text-primary-foreground", size === "sm" && "px-2 py-0.5 text-[11px]", size === "md" && "px-2.5 py-1 text-sm", size === "lg" && "px-4 py-2 text-xl md:text-2xl", className),
		style: { boxShadow: "3px 3px 0 var(--ink)" },
		children
	});
}
var trustIcon = {
	verified: BadgeCheck,
	trusted: Users,
	new: Sparkles,
	expiring: Clock3
};
function TrustBadge({ trust, className }) {
	const Icon = trustIcon[trust];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", trust === "verified" && "bg-leaf-soft text-leaf", trust === "trusted" && "bg-grape-soft text-grape", trust === "new" && "bg-sky-soft text-sky", trust === "expiring" && "bg-amber-soft text-amber", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" }), trustLabel[trust]]
	});
}
function CategoryChip({ slug, className }) {
	const c = categoryBySlug[slug];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-semibold", c.accent, className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs leading-none",
			children: c.emoji
		}), c.name]
	});
}
function ServiceMark({ initials, slug, size = "md" }) {
	const c = categoryBySlug[slug];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex shrink-0 items-center justify-center rounded-xl border border-border font-display font-bold", c.soft, c.accent, size === "sm" && "size-9 text-xs", size === "md" && "size-11 text-sm", size === "lg" && "size-16 text-xl"),
		children: initials
	});
}
//#endregion
export { TrustBadge as a, SiteFooter as i, CategoryChip as n, ServiceMark as r, BenefitBadge as t };
