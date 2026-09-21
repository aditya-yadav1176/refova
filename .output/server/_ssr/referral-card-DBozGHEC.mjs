import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useSaved, u as categoryBySlug } from "./router-BOn4884-.mjs";
import { A as Bookmark, N as ArrowUpRight, O as Check, T as Clock3, i as UsersRound, w as Copy } from "../_libs/lucide-react.mjs";
import { r as cn } from "./site-header-mE72LyKf.mjs";
import { a as TrustBadge, n as CategoryChip, r as ServiceMark, t as BenefitBadge } from "./badges-DZ2e6Vbs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/referral-card-DBozGHEC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CopyButton({ code, service, size = "md", className }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const onCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
		} catch {}
		setCopied(true);
		toast.success(`${service} referral copied`, { description: "Paste it at signup to claim the benefit." });
		window.setTimeout(() => setCopied(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: onCopy,
		className: cn("inline-flex items-center justify-center gap-2 rounded-lg border-2 border-foreground font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]", copied ? "bg-leaf-soft text-leaf" : "bg-foreground text-background hover:bg-foreground/90", size === "sm" && "px-3 py-1.5 text-xs", size === "md" && "px-4 py-2 text-sm", size === "lg" && "w-full px-5 py-3.5 text-base", className),
		children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 animate-pop" }), " Copied!"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Copy referral"] })
	});
}
function SaveButton({ id, service, className, withLabel = false }) {
	const { isSaved, toggle, canSave } = useSaved();
	const navigate = useNavigate();
	const active = isSaved(id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-label": active ? "Remove from saved" : "Save referral",
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (!canSave) {
				toast.error("Please log in to save referrals", {
					description: "Log in or sign up to bookmark referrals to your profile.",
					action: {
						label: "Log in",
						onClick: () => navigate({ to: "/login" })
					}
				});
				return;
			}
			const now = toggle(id);
			toast(now ? `Saved ${service}` : `Removed ${service}`, { description: now ? "Find it under Saved on your profile." : void 0 });
		},
		className: cn("inline-flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-secondary active:translate-y-0 active:scale-[0.97]", active && "border-primary/40 bg-primary/5 text-primary", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: cn("size-4", active && "fill-current animate-pop") }), withLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: active ? "Saved" : "Save"
		})]
	});
}
function Poster({ r, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-2 text-xs text-muted-foreground", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex size-6 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground",
				children: r.postedBy.initials
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium text-foreground",
				children: r.postedBy.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				children: "·"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.postedAgo })
		]
	});
}
function ReferralCard({ referral: r, variant = "standard", className }) {
	const to = "/referral/$id";
	const params = { id: r.id };
	if (variant === "featured") {
		const c = categoryBySlug[r.category];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: cn("group relative flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/15 bg-card p-6 shadow-card card-lift md:p-7", className),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 opacity-[0.05]",
					style: {
						backgroundImage: "radial-gradient(var(--ink) 1px, transparent 1px)",
						backgroundSize: "14px 14px"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceMark, {
							initials: r.initials,
							slug: r.category,
							size: "lg"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground",
								children: "Featured referral"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-0.5 font-display text-2xl font-extrabold leading-tight md:text-3xl",
								children: r.service
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryChip, { slug: r.category }), r.trust.slice(0, 2).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustBadge, { trust: t }, t))]
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveButton, {
						id: r.id,
						service: r.service
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("relative mt-6 rounded-xl border border-foreground/12 p-5", c.soft),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/55",
							children: "You get"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitBadge, {
								size: "lg",
								children: r.benefit
							})
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-lg border border-foreground/12 bg-card/70 px-3 py-2 text-xs font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-3.5" }),
								" Ends ",
								r.expires
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-[15px] leading-relaxed text-foreground/70",
						children: r.summary
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mt-4 grid gap-3 sm:grid-cols-3",
					children: [
						[r.copies.toLocaleString("en-IN"), "codes copied"],
						[`${r.postedBy.trustScore}%`, "poster trust score"],
						[String(r.conditions.length), "simple conditions"]
					].map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-background/60 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-bold leading-none",
							children: v
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: l
						})]
					}, l))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-4 flex flex-1 flex-col justify-between rounded-xl border border-dashed border-border p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground",
							children: "How to claim"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-3 space-y-2",
							children: r.conditions.slice(0, 3).map((cond, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-sm text-foreground/75",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-px inline-grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-bold text-foreground",
									children: i + 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "leading-snug",
									children: cond
								})]
							}, cond))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: r.tags.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground",
								children: ["#", t]
							}, t))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-border pt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Poster, { r }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to,
							params,
							className: "press inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary",
							children: [
								"Details",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4 transition-transform duration-200 group-hover:translate-x-0.5" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
							code: r.code,
							service: r.service
						})]
					})]
				})
			]
		});
	}
	if (variant === "compact") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		params,
		className: cn("group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card card-lift", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceMark, {
				initials: r.initials,
				slug: r.category,
				size: "sm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-semibold",
					children: r.service
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-muted-foreground",
					children: r.summary
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitBadge, {
				size: "sm",
				className: "shrink-0",
				children: r.benefit
			})
		]
	});
	if (variant === "list") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-lift sm:flex-row sm:items-center", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceMark, {
				initials: r.initials,
				slug: r.category
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to,
								params,
								className: "font-semibold decoration-2 underline-offset-4 transition-colors hover:text-primary hover:underline",
								children: r.service
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryChip, { slug: r.category }),
							r.trust.slice(0, 1).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustBadge, { trust: t }, t))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-1 text-sm text-muted-foreground",
						children: r.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Poster, {
						r,
						className: "mt-2"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitBadge, {
				size: "sm",
				children: r.benefit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveButton, {
					id: r.id,
					service: r.service
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
					code: r.code,
					service: r.service,
					size: "sm"
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card card-lift", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceMark, {
						initials: r.initials,
						slug: r.category
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to,
						params,
						className: "font-semibold decoration-2 underline-offset-4 transition-colors hover:text-primary hover:underline",
						children: r.service
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: r.tags.slice(0, 2).join(" · ")
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveButton, {
					id: r.id,
					service: r.service
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitBadge, { children: r.benefit })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground",
				children: r.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryChip, { slug: r.category }), r.trust.slice(0, 1).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustBadge, { trust: t }, t))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 flex items-center justify-between text-xs text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Poster, { r })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 border-t border-dashed border-border pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-3 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { className: "size-3.5" }),
								" ",
								r.copies.toLocaleString("en-IN"),
								" copies"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:inline-flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-3.5" }),
								" ends ",
								r.expires
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
						code: r.code,
						service: r.service,
						size: "sm"
					})]
				})]
			})
		]
	});
}
//#endregion
export { SaveButton as n, ReferralCard as t };
