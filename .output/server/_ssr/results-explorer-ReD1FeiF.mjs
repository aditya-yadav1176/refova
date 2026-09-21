import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as benefitTypes, d as mapApiReferral, l as categories, m as apiGet } from "./router-BOn4884-.mjs";
import { d as Search, f as Rows3, l as SlidersHorizontal, t as X, y as LayoutGrid } from "../_libs/lucide-react.mjs";
import { r as cn } from "./site-header-mE72LyKf.mjs";
import { t as ReferralCard } from "./referral-card-DBozGHEC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/results-explorer-ReD1FeiF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var suggestions = [
	"₹500 cashback",
	"free month",
	"food delivery",
	"developer tools",
	"travel credit",
	"verified"
];
function ResultsExplorer({ initialQuery = "", lockedCategory, showSearch = true }) {
	const [query, setQuery] = (0, import_react.useState)(initialQuery);
	const [debouncedQuery, setDebouncedQuery] = (0, import_react.useState)(initialQuery);
	const [category, setCategory] = (0, import_react.useState)(lockedCategory ?? "all");
	const [benefit, setBenefit] = (0, import_react.useState)("all");
	const [verifiedOnly, setVerifiedOnly] = (0, import_react.useState)(false);
	const [sort, setSort] = (0, import_react.useState)("newest");
	const [view, setView] = (0, import_react.useState)("grid");
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setDebouncedQuery(query), 300);
		return () => clearTimeout(t);
	}, [query]);
	const apiPath = (0, import_react.useMemo)(() => {
		const params = new URLSearchParams();
		if (debouncedQuery) params.set("search", debouncedQuery);
		if (lockedCategory) params.set("category", lockedCategory);
		else if (category !== "all") params.set("category", category);
		if (sort) params.set("sort", sort === "newest" ? "latest" : "popular");
		params.set("limit", "100");
		return `/referrals?${params.toString()}`;
	}, [
		debouncedQuery,
		category,
		sort,
		lockedCategory
	]);
	const { data: apiData = [], isLoading } = useQuery({
		queryKey: ["referrals", apiPath],
		queryFn: async () => {
			try {
				const resp = await apiGet(apiPath);
				if (resp && resp.success && Array.isArray(resp.data)) return resp.data.map(mapApiReferral);
			} catch (err) {
				console.error("Failed to load referrals from backend:", err);
			}
			return [];
		},
		placeholderData: (prev) => prev,
		staleTime: 5e3,
		refetchOnWindowFocus: true
	});
	const results = (0, import_react.useMemo)(() => {
		let list = apiData;
		if (benefit !== "all") list = list.filter((r) => r.benefitType === benefit);
		if (verifiedOnly) list = list.filter((r) => r.trust.includes("verified"));
		return list;
	}, [
		apiData,
		benefit,
		verifiedOnly
	]);
	const [shown, setShown] = (0, import_react.useState)(results);
	const [phase, setPhase] = (0, import_react.useState)("in");
	(0, import_react.useEffect)(() => {
		if (shown.length === 0 && results.length > 0) {
			setShown(results);
			setPhase("in");
			return;
		}
		setPhase("out");
		const t = setTimeout(() => {
			setShown(results);
			setPhase("in");
		}, 120);
		return () => clearTimeout(t);
	}, [results]);
	const reset = () => {
		setQuery("");
		setBenefit("all");
		setVerifiedOnly(false);
		if (!lockedCategory) setCategory("all");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [showSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-foreground/15 bg-card p-5 shadow-card md:p-7",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "relative block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: "Search companies, services or benefits...",
				className: "h-14 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-base outline-none transition-[box-shadow,border-color] duration-300 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30 md:h-16 md:text-lg"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
				children: "Try"
			}), suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setQuery(s),
				className: "rounded-full border border-border bg-background px-3 py-1 text-xs font-medium press hover:border-foreground/40 hover:bg-secondary",
				children: s
			}, s))]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 grid gap-8 lg:grid-cols-[240px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "lg:sticky lg:top-24 lg:self-start",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 pb-3 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" }), " Filters"]
				}),
				!lockedCategory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilterGroup, {
					title: "Category",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterPill, {
						active: category === "all",
						onClick: () => setCategory("all"),
						children: "All categories"
					}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilterPill, {
						active: category === c.slug,
						onClick: () => setCategory(c.slug),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-1",
							children: c.emoji
						}), c.name]
					}, c.slug))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilterGroup, {
					title: "Benefit type",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterPill, {
						active: benefit === "all",
						onClick: () => setBenefit("all"),
						children: "Any benefit"
					}), benefitTypes.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterPill, {
						active: benefit === b.value,
						onClick: () => setBenefit(b.value),
						children: b.label
					}, b.value))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
					title: "Trust",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterPill, {
						active: verifiedOnly,
						onClick: () => setVerifiedOnly((v) => !v),
						children: "Verified only"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: reset,
					className: "mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" }), " Clear filters"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-3.5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" }), "Loading referrals…"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: results.length
					}),
					" referrals",
					query && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						" ",
						"for ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-foreground",
							children: [
								"\"",
								query,
								"\""
							]
						})
					] })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex rounded-lg border border-border bg-card p-0.5",
					children: ["newest", "popular"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSort(s),
						className: cn("rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors", sort === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"),
						children: s === "newest" ? "Newest" : "Most popular"
					}, s))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex rounded-lg border border-border bg-card p-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Grid view",
						onClick: () => setView("grid"),
						className: cn("rounded-md p-1.5 transition-colors duration-200", view === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "List view",
						onClick: () => setView("list"),
						className: cn("rounded-md p-1.5 transition-colors duration-200", view === "list" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rows3, { className: "size-4" })
					})]
				})]
			})]
		}), isLoading && shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3",
			children: [
				1,
				2,
				3
			].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "h-56 rounded-2xl border border-foreground/10 bg-card p-6 animate-pulse",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-12 rounded-2xl bg-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-1/3 rounded bg-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-1/2 rounded bg-secondary" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-3/4 rounded bg-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-full rounded bg-secondary" })]
				})]
			}, n))
		}) : shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "results-swap",
			"data-phase": phase,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "result-item rounded-2xl border border-dashed border-border bg-card p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-2xl",
						children: "🔍"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-xl font-bold",
						children: "Nothing matches that yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-sm text-sm text-muted-foreground",
						children: "Try a broader search, or drop the filters. You can also post the referral you were hoping to find."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: reset,
						className: "press mt-5 rounded-lg border-2 border-foreground bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
						children: "Reset search"
					})
				]
			})
		}) : view === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "results-swap grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3",
			"data-phase": phase,
			children: shown.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "result-item flex",
				style: { ["--item-delay"]: `${Math.min(i, 8) * 25}ms` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferralCard, {
					referral: r,
					className: "w-full"
				})
			}, r.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "results-swap flex flex-col gap-4",
			"data-phase": phase,
			children: shown.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "result-item",
				style: { ["--item-delay"]: `${Math.min(i, 8) * 25}ms` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferralCard, {
					referral: r,
					variant: "list"
				})
			}, r.id))
		})] })]
	})] });
}
function FilterGroup({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-5 border-t border-border pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-1.5 lg:flex-col lg:items-start",
			children
		})]
	});
}
function FilterPill({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("rounded-lg border px-2.5 py-1.5 text-left text-xs font-medium transition-all duration-200 active:scale-[0.98] lg:w-full", active ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"),
		children
	});
}
//#endregion
export { ResultsExplorer as t };
