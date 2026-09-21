import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as notFound, _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as TSS_SERVER_FUNCTION, c as __exportAll, i as createServerFn, o as getServerFnById } from "./server-DzUERnS0.mjs";
import { a as sendPasswordResetEmail, c as signOut, i as onAuthStateChanged, l as updateProfile, n as createUserWithEmailAndPassword, o as signInWithEmailAndPassword, r as getAuth, s as signInWithPopup, t as GoogleAuthProvider } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CmWe2uk4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* firebase.ts -- Firebase client SDK initialization
*
* Only Firebase Auth is initialized here.
* Firestore and Storage are accessed via the backend REST API.
* The VITE_FIREBASE_* vars are the safe public client config.
*/
var apiKey = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_URL": "http://localhost:10000",
	"VITE_FIREBASE_API_KEY": "AIzaSyBI5WepXvv97B4_HtTJT-zu3-C6pF7m5Jw",
	"VITE_FIREBASE_APP_ID": "1:523561711367 : web : 2bd16a4c346a32243737a2",
	"VITE_FIREBASE_AUTH_DOMAIN": "refova-f44cb.firebaseapp.com",
	"VITE_FIREBASE_MESSAGING_SENDER_ID": "523561711367",
	"VITE_FIREBASE_PROJECT_ID": "refova-f44cb",
	"VITE_FIREBASE_STORAGE_BUCKET": "refova-f44cb.firebasestorage.app"
}["VITE_FIREBASE_API_KEY"]?.trim();
var projectId = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_URL": "http://localhost:10000",
	"VITE_FIREBASE_API_KEY": "AIzaSyBI5WepXvv97B4_HtTJT-zu3-C6pF7m5Jw",
	"VITE_FIREBASE_APP_ID": "1:523561711367 : web : 2bd16a4c346a32243737a2",
	"VITE_FIREBASE_AUTH_DOMAIN": "refova-f44cb.firebaseapp.com",
	"VITE_FIREBASE_MESSAGING_SENDER_ID": "523561711367",
	"VITE_FIREBASE_PROJECT_ID": "refova-f44cb",
	"VITE_FIREBASE_STORAGE_BUCKET": "refova-f44cb.firebasestorage.app"
}["VITE_FIREBASE_PROJECT_ID"]?.trim() || "refova-f44cb";
var isFirebaseConfigured = Boolean(apiKey && apiKey.length > 5);
var firebaseConfig = {
	apiKey: isFirebaseConfigured ? apiKey : "AIzaSyDummyKeyForSSRRendering1234567890",
	authDomain: {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_API_URL": "http://localhost:10000",
		"VITE_FIREBASE_API_KEY": "AIzaSyBI5WepXvv97B4_HtTJT-zu3-C6pF7m5Jw",
		"VITE_FIREBASE_APP_ID": "1:523561711367 : web : 2bd16a4c346a32243737a2",
		"VITE_FIREBASE_AUTH_DOMAIN": "refova-f44cb.firebaseapp.com",
		"VITE_FIREBASE_MESSAGING_SENDER_ID": "523561711367",
		"VITE_FIREBASE_PROJECT_ID": "refova-f44cb",
		"VITE_FIREBASE_STORAGE_BUCKET": "refova-f44cb.firebasestorage.app"
	}["VITE_FIREBASE_AUTH_DOMAIN"] || `${projectId}.firebaseapp.com`,
	projectId,
	storageBucket: {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_API_URL": "http://localhost:10000",
		"VITE_FIREBASE_API_KEY": "AIzaSyBI5WepXvv97B4_HtTJT-zu3-C6pF7m5Jw",
		"VITE_FIREBASE_APP_ID": "1:523561711367 : web : 2bd16a4c346a32243737a2",
		"VITE_FIREBASE_AUTH_DOMAIN": "refova-f44cb.firebaseapp.com",
		"VITE_FIREBASE_MESSAGING_SENDER_ID": "523561711367",
		"VITE_FIREBASE_PROJECT_ID": "refova-f44cb",
		"VITE_FIREBASE_STORAGE_BUCKET": "refova-f44cb.firebasestorage.app"
	}["VITE_FIREBASE_STORAGE_BUCKET"] || `${projectId}.firebasestorage.app`,
	messagingSenderId: {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_API_URL": "http://localhost:10000",
		"VITE_FIREBASE_API_KEY": "AIzaSyBI5WepXvv97B4_HtTJT-zu3-C6pF7m5Jw",
		"VITE_FIREBASE_APP_ID": "1:523561711367 : web : 2bd16a4c346a32243737a2",
		"VITE_FIREBASE_AUTH_DOMAIN": "refova-f44cb.firebaseapp.com",
		"VITE_FIREBASE_MESSAGING_SENDER_ID": "523561711367",
		"VITE_FIREBASE_PROJECT_ID": "refova-f44cb",
		"VITE_FIREBASE_STORAGE_BUCKET": "refova-f44cb.firebasestorage.app"
	}["VITE_FIREBASE_MESSAGING_SENDER_ID"] || "123456789012",
	appId: {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_API_URL": "http://localhost:10000",
		"VITE_FIREBASE_API_KEY": "AIzaSyBI5WepXvv97B4_HtTJT-zu3-C6pF7m5Jw",
		"VITE_FIREBASE_APP_ID": "1:523561711367 : web : 2bd16a4c346a32243737a2",
		"VITE_FIREBASE_AUTH_DOMAIN": "refova-f44cb.firebaseapp.com",
		"VITE_FIREBASE_MESSAGING_SENDER_ID": "523561711367",
		"VITE_FIREBASE_PROJECT_ID": "refova-f44cb",
		"VITE_FIREBASE_STORAGE_BUCKET": "refova-f44cb.firebasestorage.app"
	}["VITE_FIREBASE_APP_ID"] || "1:123456789012:web:dummy"
};
var app;
if (getApps().length === 0) app = initializeApp(firebaseConfig);
else app = getApps()[0];
var auth = getAuth(app);
/**
* api.ts -- Centralized API service for all backend REST calls.
*
* All fetch calls in the frontend must go through this module.
* Never scatter fetch() calls directly in components or routes.
*
* Usage:
*   import { apiGet, apiPost } from "@/lib/api";
*   const data = await apiGet("/referrals?page=1", token);
*/
var API_BASE = ({
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_URL": "http://localhost:10000",
	"VITE_FIREBASE_API_KEY": "AIzaSyBI5WepXvv97B4_HtTJT-zu3-C6pF7m5Jw",
	"VITE_FIREBASE_APP_ID": "1:523561711367 : web : 2bd16a4c346a32243737a2",
	"VITE_FIREBASE_AUTH_DOMAIN": "refova-f44cb.firebaseapp.com",
	"VITE_FIREBASE_MESSAGING_SENDER_ID": "523561711367",
	"VITE_FIREBASE_PROJECT_ID": "refova-f44cb",
	"VITE_FIREBASE_STORAGE_BUCKET": "refova-f44cb.firebasestorage.app"
}["VITE_API_URL"] || "http://localhost:10000").replace(/\/$/, "");
/** Gets the current user's Firebase ID token, or null if not signed in. */
async function getIdToken() {
	try {
		const user = auth.currentUser;
		if (!user) return null;
		return await user.getIdToken();
	} catch {
		return null;
	}
}
async function request(path, options = {}) {
	const { token, body, method = "GET" } = options;
	const headers = { "Content-Type": "application/json" };
	if (token) headers["Authorization"] = `Bearer ${token}`;
	const init = {
		method,
		headers
	};
	if (body !== void 0) init.body = JSON.stringify(body);
	const res = await fetch(`${API_BASE}/api${path}`, init);
	let data;
	try {
		data = await res.json();
	} catch {
		throw new Error(`Server error: ${res.status} ${res.statusText}`);
	}
	if (!res.ok) {
		const msg = data?.message || `Request failed with status ${res.status}`;
		const err = new Error(msg);
		err.status = res.status;
		err.data = data;
		throw err;
	}
	return data;
}
async function apiGet(path, token) {
	const opts = { method: "GET" };
	if (token !== void 0) opts.token = token;
	return request(path, opts);
}
async function apiPost(path, body, token) {
	const opts = { method: "POST" };
	if (body !== void 0) opts.body = body;
	if (token !== void 0) opts.token = token;
	return request(path, opts);
}
async function apiPostAuth(path, body) {
	return apiPost(path, body, await getIdToken());
}
function deriveUsername(email) {
	return email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") || "user";
}
function deriveInitials(name) {
	return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "??";
}
/** Convert a backend user object or Firebase user into our AuthUser shape. */
function mapToAuthUser(fbUser, backendUser) {
	const name = backendUser?.displayName || fbUser.displayName || deriveUsername(fbUser.email ?? "");
	const initials = deriveInitials(name);
	return {
		uid: fbUser.uid,
		name,
		username: backendUser?.username || deriveUsername(fbUser.email ?? ""),
		initials,
		email: fbUser.email ?? "",
		photoURL: backendUser?.photoURL || fbUser.photoURL || null,
		role: backendUser?.role || "user",
		trustScore: backendUser?.trustScore || 0
	};
}
/** Map Firebase Auth error codes to human-readable messages. */
function mapFirebaseError(code) {
	return {
		"auth/invalid-email": "Please enter a valid email address.",
		"auth/user-not-found": "No account found with this email.",
		"auth/wrong-password": "Incorrect password. Please try again.",
		"auth/invalid-credential": "Incorrect email or password.",
		"auth/email-already-in-use": "An account with this email already exists.",
		"auth/weak-password": "Password must be at least 8 characters.",
		"auth/too-many-requests": "Too many attempts. Please wait a few minutes before trying again.",
		"auth/network-request-failed": "Network error. Check your connection and try again.",
		"auth/popup-closed-by-user": "Sign-in window was closed. Please try again.",
		"auth/cancelled-popup-request": "Sign-in cancelled.",
		"auth/popup-blocked": "Sign-in popup was blocked. Please allow popups for this site.",
		"auth/user-disabled": "This account has been disabled. Contact support for help."
	}[code] || "Authentication failed. Please try again.";
}
var SESSION_KEY = "refova-auth-user";
var Ctx$1 = (0, import_react.createContext)(null);
var googleProvider = new GoogleAuthProvider();
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const unsubscribeRef = (0, import_react.useRef)(null);
	/** Persist authed user to state + sessionStorage. */
	const persist = (0, import_react.useCallback)((authedUser) => {
		setUser(authedUser);
		try {
			sessionStorage.setItem(SESSION_KEY, JSON.stringify(authedUser));
		} catch {}
	}, []);
	const clearUser = (0, import_react.useCallback)(() => {
		setUser(null);
		try {
			sessionStorage.removeItem(SESSION_KEY);
		} catch {}
	}, []);
	/** Call the backend to register or sync user, get back enriched profile. */
	const syncWithBackend = (0, import_react.useCallback)(async (fbUser, isNew = false) => {
		try {
			const token = await fbUser.getIdToken();
			const resp = await apiPost(isNew ? "/auth/register" : "/auth/me", {}, token);
			if (resp.success && resp.data) return mapToAuthUser(fbUser, resp.data);
		} catch {}
		return mapToAuthUser(fbUser);
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const raw = sessionStorage.getItem(SESSION_KEY);
			if (raw) {
				const cached = JSON.parse(raw);
				setUser(cached);
			}
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") {
			setIsLoading(false);
			return;
		}
		const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
			if (fbUser) try {
				const enriched = await syncWithBackend(fbUser, false);
				persist(enriched);
			} catch {
				const fallback = mapToAuthUser(fbUser);
				persist(fallback);
			}
			else clearUser();
			setIsLoading(false);
		});
		unsubscribeRef.current = unsubscribe;
		return () => unsubscribe();
	}, [
		persist,
		clearUser,
		syncWithBackend
	]);
	const login = (0, import_react.useCallback)(async (email, password) => {
		if (!isFirebaseConfigured) return {
			success: false,
			error: "Firebase Web API key is not configured. Please add VITE_FIREBASE_API_KEY in .env.local"
		};
		if (!email.trim() || !password.trim()) return {
			success: false,
			error: "Please enter your email and password."
		};
		setIsLoading(true);
		try {
			const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
			const enriched = await syncWithBackend(cred.user, false);
			persist(enriched);
			return { success: true };
		} catch (err) {
			return {
				success: false,
				error: mapFirebaseError(err.code ?? "")
			};
		} finally {
			setIsLoading(false);
		}
	}, [persist, syncWithBackend]);
	const signup = (0, import_react.useCallback)(async (data) => {
		if (!isFirebaseConfigured) return {
			success: false,
			error: "Firebase Web API key is not configured. Please add VITE_FIREBASE_API_KEY in .env.local"
		};
		setIsLoading(true);
		try {
			const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
			await updateProfile(cred.user, { displayName: data.name.trim() });
			const enriched = await syncWithBackend(cred.user, true);
			persist(enriched);
			return { success: true };
		} catch (err) {
			return {
				success: false,
				error: mapFirebaseError(err.code ?? "")
			};
		} finally {
			setIsLoading(false);
		}
	}, [persist, syncWithBackend]);
	const loginWithGoogle = (0, import_react.useCallback)(async () => {
		if (!isFirebaseConfigured) return {
			success: false,
			error: "Firebase Web API key is not configured. Please add VITE_FIREBASE_API_KEY in .env.local"
		};
		setIsLoading(true);
		try {
			const cred = await signInWithPopup(auth, googleProvider);
			const enriched = await syncWithBackend(cred.user, false);
			persist(enriched);
			return { success: true };
		} catch (err) {
			const code = err.code ?? "";
			if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return {
				success: false,
				error: ""
			};
			return {
				success: false,
				error: mapFirebaseError(code)
			};
		} finally {
			setIsLoading(false);
		}
	}, [persist, syncWithBackend]);
	const logout = (0, import_react.useCallback)(() => {
		signOut(auth).catch(() => {});
		clearUser();
	}, [clearUser]);
	const resetPassword = (0, import_react.useCallback)(async (email) => {
		await sendPasswordResetEmail(auth, email.trim());
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		user,
		isLoading,
		login,
		signup,
		loginWithGoogle,
		logout,
		resetPassword
	}), [
		user,
		isLoading,
		login,
		signup,
		loginWithGoogle,
		logout,
		resetPassword
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx$1.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(Ctx$1);
	if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>.");
	return ctx;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/origin.functions-DcLWevQr.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Absolute origin of the current request, used to build absolute og:image URLs. */
var getRequestOrigin = createServerFn({ method: "GET" }).handler(createSsrRpc("5654329e34be191256640c8957e4eaed33fcb574dfccb4b513f44c828b16863f"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/referrals-CouU_ODv.js
var categories = [
	{
		slug: "finance",
		name: "Finance & Payments",
		blurb: "Banks, UPI apps, brokers, cards",
		count: 128,
		accent: "text-leaf",
		soft: "bg-leaf-soft",
		emoji: "₹"
	},
	{
		slug: "shopping",
		name: "Shopping",
		blurb: "Marketplaces, fashion, electronics",
		count: 94,
		accent: "text-grape",
		soft: "bg-grape-soft",
		emoji: "🛍"
	},
	{
		slug: "food",
		name: "Food & Delivery",
		blurb: "Delivery apps, cloud kitchens, groceries",
		count: 76,
		accent: "text-rose",
		soft: "bg-rose-soft",
		emoji: "🍜"
	},
	{
		slug: "travel",
		name: "Travel",
		blurb: "Flights, stays, cabs and rentals",
		count: 61,
		accent: "text-sky",
		soft: "bg-sky-soft",
		emoji: "✈"
	},
	{
		slug: "education",
		name: "Education",
		blurb: "Courses, test prep, certifications",
		count: 48,
		accent: "text-amber",
		soft: "bg-amber-soft",
		emoji: "✎"
	},
	{
		slug: "productivity",
		name: "Productivity",
		blurb: "Notes, tasks, design and AI tools",
		count: 57,
		accent: "text-grape",
		soft: "bg-grape-soft",
		emoji: "◎"
	},
	{
		slug: "developer",
		name: "Developer Tools",
		blurb: "Hosting, databases, monitoring",
		count: 39,
		accent: "text-sky",
		soft: "bg-sky-soft",
		emoji: "⌘"
	},
	{
		slug: "entertainment",
		name: "Entertainment",
		blurb: "Streaming, music, gaming",
		count: 44,
		accent: "text-rose",
		soft: "bg-rose-soft",
		emoji: "▶"
	}
];
var categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
var benefitTypes = [
	{
		value: "cashback",
		label: "Cashback"
	},
	{
		value: "discount",
		label: "Discount"
	},
	{
		value: "free-month",
		label: "Free month"
	},
	{
		value: "credits",
		label: "Credits"
	},
	{
		value: "reward",
		label: "Reward"
	}
];
var trustLabel = {
	verified: "Verified",
	trusted: "Community trusted",
	new: "New",
	expiring: "Expiring soon"
};
var maskCode = (code) => {
	if (code.length <= 6) return "••••••";
	return code.slice(0, 4) + "•".repeat(Math.min(14, code.length - 6)) + code.slice(-2);
};
/** Map a backend ApiReferral to the frontend Referral display shape. */
function mapApiReferral(r) {
	const service = r.brandName || r.title || "Referral";
	const initials = service.trim().split(/\s+/).map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 2) || "??";
	const isLink = !!r.referralUrl;
	const code = isLink ? r.referralUrl : r.referralCode;
	const trust = [];
	if (r.verificationStatus === "verified") trust.push("verified");
	if (r.copyCount > 100) trust.push("trusted");
	if (r.expiryDate && new Date(r.expiryDate).getTime() < Date.now() + 6048e5) trust.push("expiring");
	if (trust.length === 0) trust.push("new");
	let benefitType = "reward";
	const h = (r.benefitHeadline || "").toLowerCase();
	if (h.includes("cashback")) benefitType = "cashback";
	else if (h.includes("% off") || h.includes("discount")) benefitType = "discount";
	else if (h.includes("free month") || h.includes("trial") || h.includes("1 month")) benefitType = "free-month";
	else if (h.includes("credit")) benefitType = "credits";
	const postedAgo = r.publishedAt ? formatAgo(r.publishedAt) : r.createdAt ? formatAgo(r.createdAt) : "recently";
	const postedOn = r.publishedAt ? new Date(r.publishedAt).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	}) : "";
	const isExpired = !!r.expiryDate && new Date(r.expiryDate).getTime() < Date.now();
	const isActive = (r.status === "published" || r.status === "draft" || r.status === "pending") && !isExpired;
	return {
		id: r.id,
		service,
		initials,
		category: r.categoryId,
		benefit: r.benefitHeadline || "REFERRAL OFFER",
		benefitType,
		summary: r.description || "",
		details: r.description || "",
		conditions: r.conditions || [],
		code,
		isLink,
		tags: [r.categoryId],
		submittedBy: r.submittedBy,
		postedBy: {
			username: r.submittedBy,
			name: r.submittedByName || "Member",
			initials: (r.submittedByName || "M").slice(0, 2).toUpperCase(),
			trustScore: 85
		},
		postedAgo,
		postedOn,
		copies: r.copyCount || 0,
		popularity: r.copyCount || 0,
		trust,
		expires: r.expiryDate ? new Date(r.expiryDate).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric"
		}) : "",
		status: isActive ? "active" : "past"
	};
}
function formatAgo(isoDate) {
	const diff = Date.now() - new Date(isoDate).getTime();
	const mins = Math.floor(diff / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
	const days = Math.floor(hrs / 24);
	return `${days} day${days === 1 ? "" : "s"} ago`;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BOn4884-.js
var styles_default = "/assets/styles-Cb5YwX9j.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var Ctx = (0, import_react.createContext)(null);
function SavedProvider({ children }) {
	const { user } = useAuth();
	const [saved, setSaved] = (0, import_react.useState)([]);
	const storageKey = user ? `saved-referrals-${user.uid}` : null;
	(0, import_react.useEffect)(() => {
		if (!storageKey) {
			setSaved([]);
			return;
		}
		try {
			const raw = window.localStorage.getItem(storageKey);
			if (raw) setSaved(JSON.parse(raw));
			else setSaved([]);
		} catch {
			setSaved([]);
		}
	}, [storageKey]);
	const toggle = (0, import_react.useCallback)((id) => {
		if (!storageKey) return false;
		let next = false;
		setSaved((prev) => {
			const has = prev.includes(id);
			next = !has;
			const list = has ? prev.filter((x) => x !== id) : [...prev, id];
			try {
				window.localStorage.setItem(storageKey, JSON.stringify(list));
			} catch {}
			return list;
		});
		return next;
	}, [storageKey]);
	const value = (0, import_react.useMemo)(() => ({
		saved,
		isSaved: (id) => user ? saved.includes(id) : false,
		toggle,
		canSave: !!user
	}), [
		saved,
		toggle,
		user
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function useSaved() {
	const ctx = (0, import_react.useContext)(Ctx);
	if (!ctx) return {
		saved: [],
		isSaved: () => false,
		toggle: () => false,
		canSave: false
	};
	return ctx;
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Refova — discover and share referrals" },
			{
				name: "description",
				content: "Refova is a curated place to discover, copy and share referral links and codes."
			},
			{
				name: "author",
				content: "Refova"
			},
			{
				property: "og:site_name",
				content: "Refova"
			},
			{
				property: "og:title",
				content: "Refova — discover and share referrals"
			},
			{
				property: "og:description",
				content: "Discover, copy and share referral offers posted by real people."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SavedProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "bottom-right" })] }) })
	});
}
var $$splitComponentImporter$7 = () => import("./routes-D4Lg0ZVV.mjs");
var Route$7 = createFileRoute("/")({
	loader: async () => ({ origin: await getRequestOrigin() }),
	head: ({ loaderData }) => ({
		meta: [
			{ title: "Refova — find referrals, share benefits" },
			{
				name: "description",
				content: "A curated place to discover, copy and share referral links and codes across finance, food, travel, shopping and developer tools."
			},
			{
				property: "og:title",
				content: "Refova — find referrals, share benefits"
			},
			{
				property: "og:description",
				content: "Discover referral offers posted by real people — copy the code, claim the benefit, share your own."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "/"
			},
			{
				property: "og:image",
				content: `${loaderData?.origin ?? ""}/og/home.jpg`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Refova — find referrals, share benefits"
			},
			{
				name: "twitter:description",
				content: "Discover referral offers posted by real people — copy the code, claim the benefit, share your own."
			},
			{
				name: "twitter:image",
				content: `${loaderData?.origin ?? ""}/og/home.jpg`
			}
		],
		links: [{
			rel: "canonical",
			href: "/"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./discover-Dm-_IZUa.mjs");
var searchSchema$1 = objectType({ q: stringType().optional() });
var Route$6 = createFileRoute("/discover")({
	validateSearch: searchSchema$1,
	loader: async () => ({ origin: await getRequestOrigin() }),
	head: ({ loaderData }) => ({
		meta: [
			{ title: "Discover referral codes and links — Refova" },
			{
				name: "description",
				content: "Search, filter and sort community-posted referral links and codes across finance, food, travel, developer tools and more."
			},
			{
				property: "og:title",
				content: "Discover referral codes and links — Refova"
			},
			{
				property: "og:description",
				content: "Search and filter referral offers posted by real people, then copy the code in one click."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "/discover"
			},
			{
				property: "og:image",
				content: `${loaderData?.origin ?? ""}/og/discover.jpg`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Discover referral codes and links — Refova"
			},
			{
				name: "twitter:description",
				content: "Search and filter referral offers posted by real people, then copy the code in one click."
			},
			{
				name: "twitter:image",
				content: `${loaderData?.origin ?? ""}/og/discover.jpg`
			}
		],
		links: [{
			rel: "canonical",
			href: "/discover"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./login-B0iSwrSl.mjs");
var searchSchema = objectType({ redirect: stringType().optional() });
var Route$5 = createFileRoute("/login")({
	validateSearch: searchSchema,
	head: () => ({ meta: [
		{ title: "Log in — Refova" },
		{
			name: "description",
			content: "Log in to your Refova account to post, save and manage your referrals."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./post-CO5iU_sU.mjs");
var Route$4 = createFileRoute("/post")({
	loader: async () => ({ origin: await getRequestOrigin() }),
	head: ({ loaderData }) => ({
		meta: [
			{ title: "Post a referral — Refova" },
			{
				name: "description",
				content: "Paste your referral message or code. Refova organizes the details automatically so you can share in seconds."
			},
			{
				property: "og:title",
				content: "Post a referral — Refova"
			},
			{
				property: "og:description",
				content: "Paste once. We organize everything."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "/post"
			},
			{
				property: "og:image",
				content: `${loaderData?.origin ?? ""}/og/post.jpg`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: "/post"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./signup-ChCDTb6y.mjs");
var Route$3 = createFileRoute("/signup")({
	head: () => ({ meta: [
		{ title: "Create an account — Refova" },
		{
			name: "description",
			content: "Join Refova to discover, share and save referral links and codes."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./category._slug-BXaBJA69.mjs");
var Route$2 = createFileRoute("/category/$slug")({
	loader: ({ params }) => {
		const category = categoryBySlug[params.slug];
		if (!category) throw notFound();
		return { category };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Category unavailable — Refova" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { category } = loaderData;
		const title = `${category.name} referrals — browse and copy · Refova`;
		const description = `${category.count} community-posted ${category.name.toLowerCase()} referral codes and links. ${category.blurb}.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./profile._username-BmoTQLm-.mjs");
var Route$1 = createFileRoute("/profile/$username")({
	loader: ({ params }) => {
		const person = {
			username: params.username,
			name: params.username.charAt(0).toUpperCase() + params.username.slice(1),
			initials: params.username.slice(0, 2).toUpperCase(),
			trustScore: 85
		};
		return {
			username: params.username,
			person
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Member unavailable — Refova" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { person } = loaderData;
		const title = `${person.name} — referrals shared on Refova`;
		const description = `Browse active, past and saved referrals on Refova.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./referral._id-cag2cA41.mjs");
var Route = createFileRoute("/referral/$id")({
	loader: async ({ params }) => {
		let referral;
		try {
			const resp = await apiGet(`/referrals/${params.id}`);
			if (resp && resp.success && resp.data) referral = mapApiReferral(resp.data);
		} catch {}
		if (!referral) throw notFound();
		return {
			referral,
			origin: await getRequestOrigin()
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Referral unavailable — Refova" }, {
			name: "robots",
			content: "noindex"
		}] };
		const r = loaderData.referral;
		const title = `${r.service} referral — ${r.benefit.toLowerCase()} · Refova`;
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: r.summary
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: r.summary
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:url",
					content: `/referral/${r.id}`
				},
				{
					property: "og:image",
					content: `${loaderData.origin}/og/referral.jpg`
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: title
				},
				{
					name: "twitter:description",
					content: r.summary
				},
				{
					name: "twitter:image",
					content: `${loaderData.origin}/og/referral.jpg`
				}
			],
			links: [{
				rel: "canonical",
				href: `/referral/${r.id}`
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	DiscoverRoute: Route$6.update({
		id: "/discover",
		path: "/discover",
		getParentRoute: () => Route$8
	}),
	LoginRoute: Route$5.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$8
	}),
	PostRoute: Route$4.update({
		id: "/post",
		path: "/post",
		getParentRoute: () => Route$8
	}),
	SignupRoute: Route$3.update({
		id: "/signup",
		path: "/signup",
		getParentRoute: () => Route$8
	}),
	CategorySlugRoute: Route$2.update({
		id: "/category/$slug",
		path: "/category/$slug",
		getParentRoute: () => Route$8
	}),
	ProfileUsernameRoute: Route$1.update({
		id: "/profile/$username",
		path: "/profile/$username",
		getParentRoute: () => Route$8
	}),
	ReferralIdRoute: Route.update({
		id: "/referral/$id",
		path: "/referral/$id",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { useAuth as _, Route$5 as a, benefitTypes as c, mapApiReferral as d, maskCode as f, deriveUsername as g, apiPostAuth as h, Route$2 as i, categories as l, apiGet as m, Route as n, Route$6 as o, trustLabel as p, Route$1 as r, useSaved as s, router_exports as t, categoryBySlug as u };
