globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/arrow-left-DZTpsE3o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a0-e7j8hqZZZQQbWj3xVfPRxK6bB/o\"",
		"mtime": "2026-09-21T14:14:55.003Z",
		"size": 160,
		"path": "../public/assets/arrow-left-DZTpsE3o.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-09-21T12:12:03.546Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/auth-j8Un0WTV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d46a-TpziRsVTLh87/i0y56RCdjkKyZI\"",
		"mtime": "2026-09-21T14:14:55.004Z",
		"size": 185450,
		"path": "../public/assets/auth-j8Un0WTV.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-09-21T12:12:03.554Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/badges-BKAfzspP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"133f-rkrzCXVqB358zZuhbZKTTo3Wz2w\"",
		"mtime": "2026-09-21T14:14:55.004Z",
		"size": 4927,
		"path": "../public/assets/badges-BKAfzspP.js"
	},
	"/assets/category._slug-CMj6GTmC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"506-z7gDgPXqupHJ58ksy0IUxQqdEqA\"",
		"mtime": "2026-09-21T14:14:55.004Z",
		"size": 1286,
		"path": "../public/assets/category._slug-CMj6GTmC.js"
	},
	"/assets/discover-B5Og07Hi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"458-XBPi8MA538yI9yDP2Usxls6fEtc\"",
		"mtime": "2026-09-21T14:14:55.008Z",
		"size": 1112,
		"path": "../public/assets/discover-B5Og07Hi.js"
	},
	"/assets/eye-off-DrCdGEcP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a9-1s/+it+5MFGnRdQqo72kVsJk6Ic\"",
		"mtime": "2026-09-21T14:14:55.008Z",
		"size": 425,
		"path": "../public/assets/eye-off-DrCdGEcP.js"
	},
	"/assets/eye-XV8QIvEe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-IV4kzlNc+D4KFjtu4XNfm20UCZU\"",
		"mtime": "2026-09-21T14:14:55.008Z",
		"size": 251,
		"path": "../public/assets/eye-XV8QIvEe.js"
	},
	"/assets/index-BmSW77s1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5dfef-Z8NzrzPA8RLoIOolLb1mwoT3Xrw\"",
		"mtime": "2026-09-21T14:14:55.003Z",
		"size": 385007,
		"path": "../public/assets/index-BmSW77s1.js"
	},
	"/assets/login-gwar1f_d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1995-wyQ4tgwPM3TrzxnkR8ZTf//DxS0\"",
		"mtime": "2026-09-21T14:14:55.009Z",
		"size": 6549,
		"path": "../public/assets/login-gwar1f_d.js"
	},
	"/assets/not-found-i5RsCZif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-Trmr7GZIBZuvfg4uM18tBiRtOXg\"",
		"mtime": "2026-09-21T14:14:55.009Z",
		"size": 118,
		"path": "../public/assets/not-found-i5RsCZif.js"
	},
	"/assets/post-QBFheaJ-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5c97-0M77Yr+I3mNAHJRYr7BQ3D3zZLc\"",
		"mtime": "2026-09-21T14:14:55.010Z",
		"size": 23703,
		"path": "../public/assets/post-QBFheaJ-.js"
	},
	"/assets/profile._username-BCtzUdQ3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c23-9A4/VkA2kvBo7n99N5yF33mZYNI\"",
		"mtime": "2026-09-21T14:14:55.010Z",
		"size": 7203,
		"path": "../public/assets/profile._username-BCtzUdQ3.js"
	},
	"/assets/referral-card-3EWHn377.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"497b-6aiI6+aax+mZOPzX7BArAdUrAs8\"",
		"mtime": "2026-09-21T14:14:55.011Z",
		"size": 18811,
		"path": "../public/assets/referral-card-3EWHn377.js"
	},
	"/assets/referral._id-CbQkIiks.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f02-gdvWLtPgGJCmJ+n5pDQf3KOhcM0\"",
		"mtime": "2026-09-21T14:14:55.012Z",
		"size": 7938,
		"path": "../public/assets/referral._id-CbQkIiks.js"
	},
	"/assets/results-explorer-YG64aSfz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2459-ApjagbX0uFWWUJRDMpxZJ6bwak4\"",
		"mtime": "2026-09-21T14:14:55.012Z",
		"size": 9305,
		"path": "../public/assets/results-explorer-YG64aSfz.js"
	},
	"/assets/routes-Cyty4kDD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d98-FSC43lp5zhxKrtvUeTeOJ5hwk94\"",
		"mtime": "2026-09-21T14:14:55.013Z",
		"size": 11672,
		"path": "../public/assets/routes-Cyty4kDD.js"
	},
	"/assets/share-2-DYkofhHz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"160-WMt7twr+hep3u1xPkMryvNAw+8o\"",
		"mtime": "2026-09-21T14:14:55.013Z",
		"size": 352,
		"path": "../public/assets/share-2-DYkofhHz.js"
	},
	"/assets/signup-DaCVZ5Wo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e0c-YgWrdZxgneOY3hTyKLQny16wQeM\"",
		"mtime": "2026-09-21T14:14:55.013Z",
		"size": 7692,
		"path": "../public/assets/signup-DaCVZ5Wo.js"
	},
	"/assets/site-header-Cjlp7bcU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1edf0-mD9m0W4FbZJdinqlX6uOcm9x9ak\"",
		"mtime": "2026-09-21T14:14:55.014Z",
		"size": 126448,
		"path": "../public/assets/site-header-Cjlp7bcU.js"
	},
	"/og/discover.jpg": {
		"type": "image/jpeg",
		"etag": "\"18ca6-khgpS1ttNsQ7GrVXru3AFy1iJgQ\"",
		"mtime": "2026-09-21T12:12:03.548Z",
		"size": 101542,
		"path": "../public/og/discover.jpg"
	},
	"/assets/styles-Cb5YwX9j.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"c938-BmvaKnSTIeDoKTOq5gWyR2p+Iwk\"",
		"mtime": "2026-09-21T14:14:55.017Z",
		"size": 51512,
		"path": "../public/assets/styles-Cb5YwX9j.css"
	},
	"/og/home.jpg": {
		"type": "image/jpeg",
		"etag": "\"205f6-d0f0UxdOrmf6w50LBhHQ6xOnmwk\"",
		"mtime": "2026-09-21T12:12:03.550Z",
		"size": 132598,
		"path": "../public/og/home.jpg"
	},
	"/og/post.jpg": {
		"type": "image/jpeg",
		"etag": "\"18c6e-yEbjxwH+0jJPrVWNiPA8zWIQrDg\"",
		"mtime": "2026-09-21T12:12:03.551Z",
		"size": 101486,
		"path": "../public/og/post.jpg"
	},
	"/og/referral.jpg": {
		"type": "image/jpeg",
		"etag": "\"17d19-bhsVNhGCd7+DYXmbu92zvqxCbT8\"",
		"mtime": "2026-09-21T12:12:03.553Z",
		"size": 97561,
		"path": "../public/og/referral.jpg"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_ZVcEKU = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_ZVcEKU
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
