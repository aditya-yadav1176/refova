import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as Route$6 } from "./router-BOn4884-.mjs";
import { t as SiteHeader } from "./site-header-mE72LyKf.mjs";
import { i as SiteFooter } from "./badges-DZ2e6Vbs.mjs";
import { t as ResultsExplorer } from "./results-explorer-ReD1FeiF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-Dm-_IZUa.js
var import_jsx_runtime = require_jsx_runtime();
function DiscoverPage() {
	const { q } = Route$6.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "enter max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
							children: "Discover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 text-4xl font-bold leading-[1.05] md:text-5xl",
							children: "Every referral worth using, in one searchable place."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base text-muted-foreground",
							children: "No more scrolling WhatsApp groups or dead Reddit threads. Filter by category, benefit and trust — then copy what you need."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "enter mt-10",
					style: { ["--reveal-delay"]: "120ms" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsExplorer, { initialQuery: q ?? "" }, q ?? "")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { DiscoverPage as component };
