import { a as TSS_SERVER_FUNCTION, i as createServerFn, s as getRequest } from "./server-DzUERnS0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/origin.functions-CaJhkdXT.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Absolute origin of the current request, used to build absolute og:image URLs. */
var getRequestOrigin_createServerFn_handler = createServerRpc({
	id: "5654329e34be191256640c8957e4eaed33fcb574dfccb4b513f44c828b16863f",
	name: "getRequestOrigin",
	filename: "src/lib/origin.functions.ts"
}, (opts) => getRequestOrigin.__executeServer(opts));
var getRequestOrigin = createServerFn({ method: "GET" }).handler(getRequestOrigin_createServerFn_handler, () => {
	const req = getRequest();
	const url = new URL(req.url);
	const sandboxHost = url.hostname === "localhost" ? req.headers.get("x-forwarded-host") : null;
	return sandboxHost ? `https://${sandboxHost}` : url.origin;
});
//#endregion
export { getRequestOrigin_createServerFn_handler };
