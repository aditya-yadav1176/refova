import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { d as mapApiReferral, l as categories, m as apiGet } from "./router-BOn4884-.mjs";
import { P as ArrowRight, b as Gift, c as Sparkles, d as Search, j as BadgeCheck, w as Copy } from "../_libs/lucide-react.mjs";
import { r as cn, t as SiteHeader } from "./site-header-mE72LyKf.mjs";
import { i as SiteFooter, t as BenefitBadge } from "./badges-DZ2e6Vbs.mjs";
import { t as ReferralCard } from "./referral-card-DBozGHEC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D4Lg0ZVV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Fades + slides children into view once, when they enter the viewport.
* Respects prefers-reduced-motion via CSS.
*/
function Reveal({ children, className, delay = 0, as: Tag = "div" }) {
	const ref = (0, import_react.useRef)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		if (typeof IntersectionObserver === "undefined") {
			setVisible(true);
			return;
		}
		const io = new IntersectionObserver((entries) => {
			for (const e of entries) if (e.isIntersecting) {
				setVisible(true);
				io.disconnect();
			}
		}, {
			rootMargin: "0px 0px -10% 0px",
			threshold: .1
		});
		io.observe(el);
		return () => io.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		className: cn("reveal", visible && "is-visible", className),
		style: { ["--reveal-delay"]: `${delay}ms` },
		children
	});
}
var heroCards = [
	{
		label: "₹500 off",
		sub: "PayWise · finance",
		cls: "bg-leaf-soft text-leaf",
		pos: "left-0 top-6",
		tilt: "-5deg",
		anim: "animate-float-slow"
	},
	{
		label: "1 month free",
		sub: "LoomNote · productivity",
		cls: "bg-grape-soft text-grape",
		pos: "right-2 top-0",
		tilt: "4deg",
		anim: "animate-float-med"
	},
	{
		label: "₹1,000 reward",
		sub: "SkyHop · travel",
		cls: "bg-sky-soft text-sky",
		pos: "left-10 bottom-4",
		tilt: "3deg",
		anim: "animate-float-med"
	},
	{
		label: "20% discount",
		sub: "BiteCart · food",
		cls: "bg-rose-soft text-rose",
		pos: "right-0 bottom-16",
		tilt: "-3deg",
		anim: "animate-float-slow"
	}
];
function Home() {
	const { data: realReferrals = [] } = useQuery({
		queryKey: ["home-all-referrals"],
		queryFn: async () => {
			try {
				const res = await apiGet("/referrals?limit=20");
				if (res?.data && Array.isArray(res.data)) return res.data.map(mapApiReferral);
			} catch {}
			return [];
		},
		staleTime: 5e3,
		refetchOnWindowFocus: true
	});
	const featured = realReferrals.slice(0, 1);
	const medium = realReferrals.slice(1, 3);
	const compact = realReferrals.slice(3, 7);
	const displayTrending = realReferrals.slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "relative overflow-hidden dotted-paper",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24 lg:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "enter inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold",
								style: { ["--reveal-delay"]: "60ms" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-primary" }), " 547 referrals posted this month"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "enter mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-tight md:text-7xl",
								style: { ["--reveal-delay"]: "140ms" },
								children: [
									"Find referrals.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "relative inline-block",
										children: ["Share benefits.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-1 left-0 h-3 w-full -rotate-1 rounded bg-primary/25" })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "enter mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground",
								style: { ["--reveal-delay"]: "220ms" },
								children: "Referral links and codes people actually posted — organised by category, checked by the community, and one click from your clipboard. No more digging through group chats."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "enter mt-8 flex flex-wrap gap-3",
								style: { ["--reveal-delay"]: "300ms" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/discover",
									className: "inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground press",
									style: { boxShadow: "4px 4px 0 var(--ink)" },
									children: ["Explore referrals ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/post",
									className: "inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-card px-6 py-3.5 text-base font-semibold press",
									children: "Share a referral"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "enter mt-5 text-sm text-muted-foreground",
								style: { ["--reveal-delay"]: "360ms" },
								children: "Free to browse · no signup needed to copy a code"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "enter relative w-full md:h-[460px]",
							style: { ["--reveal-delay"]: "260ms" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-3 md:hidden",
								children: heroCards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-foreground/15 bg-card p-4 shadow-card card-lift",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `inline-grid size-9 place-items-center rounded-lg ${c.cls} font-bold`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 font-display text-lg font-bold leading-tight",
											children: c.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-xs text-muted-foreground",
											children: c.sub
										})
									]
								}, c.label))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative hidden h-full md:block",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-6 rounded-[2rem] bg-primary/8" }),
									heroCards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `absolute ${c.pos} ${c.anim} w-56 rounded-2xl border border-foreground/15 bg-card p-4 shadow-lift transition-shadow duration-300 hover:shadow-card`,
										style: {
											["--tilt"]: c.tilt,
											transform: `rotate(${c.tilt})`
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-grid size-9 place-items-center rounded-lg ${c.cls} font-bold`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-3 font-display text-xl font-bold",
												children: c.label
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: c.sub
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mt-3 inline-flex items-center gap-1 text-xs font-semibold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), " Copy referral"]
											})
										]
									}, c.label)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-2deg]",
										"aria-hidden": true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitBadge, {
											size: "lg",
											children: "Invite benefit"
										})
									})
								]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "border-y border-border bg-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8",
						children: [
							["12,400+", "referrals shared"],
							["68,900", "codes copied"],
							["8", "curated categories"],
							["94%", "reported as working"]
						].map(([v, l], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
							delay: i * 70,
							className: "flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl font-bold",
								children: v
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: l
							})]
						}, l))
					})
				}),
				featured.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
							eyebrow: "Featured right now",
							title: "Hand-picked referrals worth your click",
							action: {
								to: "/discover",
								label: "See all"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 grid auto-rows-fr items-stretch gap-5 lg:grid-cols-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
								className: "flex lg:col-span-2 lg:row-span-2",
								children: featured.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferralCard, {
									referral: r,
									variant: "featured",
									className: "h-full w-full"
								}, r.id))
							}), medium.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
								delay: 80 + i * 80,
								className: "flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferralCard, {
									referral: r,
									className: "w-full"
								})
							}, r.id))]
						}),
						compact.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-4",
							children: compact.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
								delay: i * 70,
								className: "flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferralCard, {
									referral: r,
									variant: "compact",
									className: "w-full"
								})
							}, r.id))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "categories",
					className: "border-y border-border bg-card py-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
							eyebrow: "Browse by category",
							title: "Start where you were already looking"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4",
							children: categories.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
								delay: i % 4 * 70,
								className: "flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/category/$slug",
									params: { slug: c.slug },
									className: `group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-foreground/12 p-6 card-lift ${c.soft}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-3xl",
										children: c.emoji
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-8",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-lg font-bold",
												children: c.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-sm text-foreground/60",
												children: c.blurb
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: `mt-4 inline-flex items-center gap-1 text-sm font-semibold ${c.accent}`,
												children: [
													c.count,
													" referrals",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform group-hover:translate-x-1" })
												]
											})
										]
									})]
								})
							}, c.slug))
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "how-it-works",
					className: "mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
						eyebrow: "How it works",
						title: "Three steps, no account required to start"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid auto-rows-fr gap-5 md:grid-cols-3",
						children: [
							{
								icon: Search,
								title: "Discover",
								body: "Search or browse by category and see what people are actually offering right now."
							},
							{
								icon: Copy,
								title: "Copy",
								body: "Check the conditions, then copy the code or link. It stays hidden until you do."
							},
							{
								icon: BadgeCheck,
								title: "Benefit",
								body: "Claim the reward at signup. Both you and the person who posted it win."
							}
						].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
							delay: i * 90,
							className: "relative flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card card-lift",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "absolute right-6 top-5 font-display text-5xl font-extrabold text-foreground/6",
									children: ["0", i + 1]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-grid size-12 place-items-center rounded-xl border-2 border-foreground bg-primary text-primary-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-5 text-xl font-bold",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground",
									children: s.body
								})
							]
						}, s.title))
					})]
				}),
				displayTrending.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
						eyebrow: "Trending this week",
						title: "What everyone is copying",
						action: {
							to: "/discover",
							label: "Browse all"
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 flex flex-col gap-4",
						children: displayTrending.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: Math.min(i, 4) * 60,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferralCard, {
								referral: r,
								variant: "list"
							})
						}, r.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						className: "relative overflow-hidden rounded-3xl border-2 border-foreground bg-foreground px-8 py-16 text-center text-background",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -left-10 top-8 size-40 rounded-full bg-primary/30 blur-3xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "relative font-display text-4xl font-extrabold md:text-5xl",
								children: "Sitting on a referral nobody knows about?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "relative mx-auto mt-4 max-w-xl text-base text-background/70",
								children: "Post it once and let people find it. Most referrals here get their first copy within a day."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/post",
								className: "relative mt-8 inline-flex items-center gap-2 rounded-xl border-2 border-background bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5",
								children: ["Post a referral ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})
						]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function SectionHead({ eyebrow, title, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
			children: eyebrow
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-2 max-w-xl text-3xl font-bold leading-tight md:text-4xl",
			children: title
		})] }), action && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: action.to,
			className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold press hover:bg-secondary",
			children: [
				action.label,
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
			]
		})]
	});
}
//#endregion
export { Home as component };
