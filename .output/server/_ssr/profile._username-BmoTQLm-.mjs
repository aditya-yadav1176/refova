import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useAuth, d as mapApiReferral, m as apiGet, r as Route$1, s as useSaved } from "./router-BOn4884-.mjs";
import { M as Award, k as CalendarDays, u as Share2, v as Lock, w as Copy } from "../_libs/lucide-react.mjs";
import { r as cn, t as SiteHeader } from "./site-header-mE72LyKf.mjs";
import { i as SiteFooter } from "./badges-DZ2e6Vbs.mjs";
import { t as ReferralCard } from "./referral-card-DBozGHEC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile._username-BmoTQLm-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var bios = {
	aditya: {
		bio: "Collects fintech referrals, tests every one before posting.",
		since: "March 2024"
	},
	mira: {
		bio: "Product designer. Mostly SaaS and design tool invites.",
		since: "July 2024"
	},
	kabir: {
		bio: "Backend dev. Hosting credits, databases, dev tooling.",
		since: "January 2024"
	},
	neha: {
		bio: "Food-first. Delivery, groceries and the odd snack box.",
		since: "October 2024"
	},
	ravi: {
		bio: "Books too many trips. Travel and cab referrals.",
		since: "May 2024"
	},
	isha: {
		bio: "Learning something new every quarter. Courses and test prep.",
		since: "February 2025"
	},
	tara: {
		bio: "Shopping deals, sale hunting, honest reviews.",
		since: "August 2025"
	},
	arun: {
		bio: "Streaming, music and games — invites that actually work.",
		since: "June 2024"
	},
	sana: {
		bio: "Freelancer. Banking and invoicing tools I actually use.",
		since: "November 2023"
	},
	dev: {
		bio: "New here. Sharing whatever I find useful.",
		since: "June 2026"
	}
};
var tabs = [
	"active",
	"past",
	"saved"
];
function ProfilePage() {
	const { username, person } = Route$1.useLoaderData();
	const { user: currentUser } = useAuth();
	const { saved, canSave } = useSaved();
	const [tab, setTab] = (0, import_react.useState)("active");
	const isSelf = !!currentUser && (currentUser.username.toLowerCase() === username.toLowerCase() || currentUser.uid.toLowerCase() === username.toLowerCase());
	const { data: allReferrals = [] } = useQuery({
		queryKey: ["profile-referrals"],
		queryFn: async () => {
			try {
				const resp = await apiGet("/referrals?limit=100&status=all");
				if (resp && resp.success && Array.isArray(resp.data)) return resp.data.map(mapApiReferral);
			} catch {}
			return [];
		},
		staleTime: 1e4
	});
	const posted = allReferrals.filter((r) => {
		if (isSelf && currentUser) {
			if (r.submittedBy === currentUser.uid || r.postedBy.username === currentUser.uid) return true;
		}
		if (r.submittedBy && r.submittedBy.toLowerCase() === username.toLowerCase()) return true;
		if (r.postedBy.username.toLowerCase() === username.toLowerCase()) return true;
		const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, "");
		const cleanName = r.postedBy.name.toLowerCase().replace(/[^a-z0-9]/g, "");
		if (cleanName && cleanUsername && (cleanName.includes(cleanUsername) || cleanUsername.includes(cleanName))) return true;
		return false;
	});
	const displayName = isSelf && currentUser?.name ? currentUser.name : posted[0]?.postedBy.name || person.name;
	const displayInitials = isSelf && currentUser?.initials ? currentUser.initials : posted[0]?.postedBy.initials || person.initials;
	const meta = bios[username] ?? {
		bio: "Sharing referrals with the community.",
		since: "2026"
	};
	const totalCopies = posted.reduce((n, r) => n + r.copies, 0);
	const list = tab === "active" ? posted.filter((r) => r.status === "active") : tab === "past" ? posted.filter((r) => r.status === "past") : allReferrals.filter((r) => saved.includes(r.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-8 rounded-2xl border border-foreground/15 bg-card p-7 shadow-card md:grid-cols-[auto_1fr_auto] md:items-center md:p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-24 place-items-center rounded-2xl border-2 border-foreground bg-amber-soft font-display text-3xl font-extrabold",
								children: displayInitials
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-3xl font-bold md:text-4xl",
										children: displayName
									}), posted.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-leaf-soft px-3 py-1 text-xs font-semibold text-leaf",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-3.5" }), " Helpful contributor"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: ["@", username]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-lg text-base",
									children: meta.bio
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-3.5" }),
										" Member since ",
										meta.since
									]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-3 md:grid-cols-1 md:text-right",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										value: posted.length,
										label: "Referrals shared"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										value: totalCopies.toLocaleString("en-IN"),
										label: "Copies",
										icon: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										value: person.trustScore,
										label: "Trust score"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex flex-wrap items-center gap-2",
						children: [tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTab(t),
							className: cn("rounded-lg border px-4 py-2 text-sm font-semibold capitalize transition-colors", tab === t ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:text-foreground"),
							children: [t, " referrals"]
						}, t)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(window.location.href);
								toast("Profile link copied", { description: "Anyone can view this contributor profile." });
							},
							className: "press ml-auto inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), " Share profile"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: tab === "saved" && !canSave ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-dashed border-border bg-card p-12 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-2xl text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-4 text-xl font-bold",
									children: "Saved referrals are restricted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-2 max-w-sm text-sm text-muted-foreground",
									children: "You must be logged in to save referrals and view your bookmarks."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "press mt-5 inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
									children: "Log in to view saved"
								})
							]
						}) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-dashed border-border bg-card p-12 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold",
								children: tab === "saved" ? "No saved referrals yet" : `No ${tab} referrals`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-2 max-w-sm text-sm text-muted-foreground",
								children: tab === "saved" ? "Tap the bookmark icon on any referral to keep it here for later." : `Nothing in ${tab} referrals right now.`
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-3",
							children: list.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferralCard, { referral: r }, r.id))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Stat({ value, label, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "inline-flex items-center gap-1.5 font-display text-2xl font-bold",
		children: [icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4 text-muted-foreground" }), value]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-muted-foreground",
		children: label
	})] });
}
//#endregion
export { ProfilePage as component };
