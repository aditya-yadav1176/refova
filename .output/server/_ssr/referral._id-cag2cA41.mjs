import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as mapApiReferral, f as maskCode, h as apiPostAuth, m as apiGet, n as Route } from "./router-BOn4884-.mjs";
import { F as ArrowLeft, O as Check, S as Eye, s as TrendingUp, u as Share2, w as Copy, x as Flag } from "../_libs/lucide-react.mjs";
import { r as cn, t as SiteHeader } from "./site-header-mE72LyKf.mjs";
import { a as TrustBadge, i as SiteFooter, n as CategoryChip, r as ServiceMark, t as BenefitBadge } from "./badges-DZ2e6Vbs.mjs";
import { n as SaveButton, t as ReferralCard } from "./referral-card-DBozGHEC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/referral._id-cag2cA41.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReferralDetail() {
	const { referral: r } = Route.useLoaderData();
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const { data: similar = [] } = useQuery({
		queryKey: [
			"similar-referrals",
			r.category,
			r.id
		],
		queryFn: async () => {
			try {
				const resp = await apiGet(`/referrals?category=${r.category}&limit=4`);
				if (resp && resp.success && Array.isArray(resp.data)) return resp.data.map(mapApiReferral).filter((x) => x.id !== r.id).slice(0, 3);
			} catch {}
			return [];
		},
		staleTime: 3e4
	});
	const copy = async () => {
		let codeToUse = r.code;
		try {
			const resp = await apiPostAuth(`/referrals/${r.id}/copy`);
			if (resp.success && resp.data) codeToUse = resp.data.referralUrl || resp.data.referralCode || r.code;
		} catch {}
		try {
			await navigator.clipboard.writeText(codeToUse);
		} catch {}
		setRevealed(true);
		setCopied(true);
		toast.success("Referral copied to clipboard", { description: `${r.service} · ${r.benefit}` });
		window.setTimeout(() => setCopied(false), 2200);
	};
	const report = async () => {
		try {
			await apiPostAuth(`/referrals/${r.id}/report`, {
				reason: "incorrect_info",
				description: ""
			});
			toast("Reported for review", { description: "Thanks — a moderator will take a look." });
		} catch {
			toast("Reported for review", { description: "Thanks — a moderator will take a look." });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/discover",
					className: "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back to discover"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-8 lg:grid-cols-[1fr_380px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-foreground/15 bg-card p-6 shadow-card md:p-9",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceMark, {
											initials: r.initials,
											slug: r.category,
											size: "lg"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "text-3xl font-bold md:text-4xl",
											children: r.service
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex flex-wrap gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryChip, { slug: r.category }), r.trust.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustBadge, { trust: t }, t))]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveButton, {
											id: r.id,
											service: r.service,
											withLabel: true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => toast("Share link copied", { description: "Anyone can open this referral page." }),
											className: "inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium press hover:bg-secondary",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), " Share"]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 border-t border-dashed border-border pt-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
											children: "The benefit"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 max-w-2xl font-display text-3xl font-bold leading-tight md:text-4xl",
											children: r.summary
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitBadge, {
												size: "lg",
												children: r.benefit
											})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 grid gap-8 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-lg font-bold",
											children: "How it works"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm leading-relaxed text-muted-foreground",
											children: r.details
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-4 flex flex-wrap gap-1.5",
											children: r.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-full bg-secondary px-2.5 py-1 text-xs font-medium",
												children: ["#", t]
											}, t))
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-lg font-bold",
											children: "Important conditions"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-2 space-y-2 text-sm text-muted-foreground",
											children: r.conditions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0 text-leaf" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c })]
											}, c))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-4 text-xs text-muted-foreground",
											children: ["Valid until ", r.expires]
										})
									] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-5 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }),
										" ",
										r.copies.toLocaleString("en-IN"),
										" copies"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4" }),
										" ",
										r.popularity,
										"% found it useful"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: report,
								className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-4" }), " Report referral"]
							})]
						}),
						similar.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-14",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold",
								children: "Similar referrals"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3",
								children: similar.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferralCard, { referral: s }, s.id))
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "lg:sticky lg:top-24 lg:self-start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border-2 border-foreground bg-card p-6 shadow-lift",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
									children: r.isLink ? "Referral link" : "Referral code"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative mt-3 overflow-hidden rounded-xl border border-dashed border-border bg-background p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cn("break-all font-mono text-sm transition-all", !revealed && "select-none blur-[5px]"),
										children: revealed ? r.code : maskCode(r.code)
									}), !revealed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), " Hidden until you copy it"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: copy,
									className: cn("mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-foreground px-5 py-3.5 text-base font-semibold transition-all active:translate-y-0.5", copied ? "bg-leaf-soft text-leaf" : "bg-primary text-primary-foreground hover:-translate-y-0.5"),
									style: { boxShadow: "4px 4px 0 var(--ink)" },
									children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-5 animate-pop" }), " Copied!"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-5" }), " Copy referral"] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-center text-xs text-muted-foreground",
									children: "Paste it during signup — the benefit applies automatically."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 border-t border-border pt-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
										children: "Posted by"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/profile/$username",
										params: { username: r.postedBy.username },
										className: "mt-3 flex items-center gap-3 rounded-xl p-2 press hover:bg-secondary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid size-11 place-items-center rounded-full bg-secondary font-bold",
											children: r.postedBy.initials
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-sm font-semibold",
											children: r.postedBy.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-xs text-muted-foreground",
											children: [
												"Trust score ",
												r.postedBy.trustScore,
												" · posted ",
												r.postedOn
											]
										})] })]
									})]
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { ReferralDetail as component };
