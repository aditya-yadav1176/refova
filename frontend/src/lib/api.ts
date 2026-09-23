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

import { auth } from "@/lib/firebase";

const API_BASE = (
  (import.meta.env["VITE_API_URL"] as string | undefined) || "http://localhost:10000"
).replace(/\/$/, "");

// ─── Token helper ─────────────────────────────────────────────────────────────

/** Gets the current user's Firebase ID token, or null if not signed in. */
async function getIdToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch {
    return null;
  }
}

// ─── Base request ─────────────────────────────────────────────────────────────

interface ApiOptions {
  token?: string | null | undefined;
  body?: unknown;
  method?: string | undefined;
}

async function request<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, body, method = "GET" } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const init: RequestInit = {
    method,
    headers,
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}/api${path}`, init);

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server error: ${res.status} ${res.statusText}`);
  }

  if (!res.ok) {
    const msg =
      (data as { message?: string })?.message || `Request failed with status ${res.status}`;
    const err = new Error(msg) as Error & { status: number; data: unknown };
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

// ─── Exported helpers ─────────────────────────────────────────────────────────

export async function apiGet<T = unknown>(
  path: string,
  token?: string | null | undefined,
): Promise<T> {
  const opts: ApiOptions = { method: "GET" };
  if (token !== undefined) opts.token = token;
  return request<T>(path, opts);
}

export async function apiPost<T = unknown>(
  path: string,
  body?: unknown,
  token?: string | null | undefined,
): Promise<T> {
  const opts: ApiOptions = { method: "POST" };
  if (body !== undefined) opts.body = body;
  if (token !== undefined) opts.token = token;
  return request<T>(path, opts);
}

export async function apiPut<T = unknown>(
  path: string,
  body?: unknown,
  token?: string | null | undefined,
): Promise<T> {
  const opts: ApiOptions = { method: "PUT" };
  if (body !== undefined) opts.body = body;
  if (token !== undefined) opts.token = token;
  return request<T>(path, opts);
}

export async function apiPatch<T = unknown>(
  path: string,
  body?: unknown,
  token?: string | null | undefined,
): Promise<T> {
  const opts: ApiOptions = { method: "PATCH" };
  if (body !== undefined) opts.body = body;
  if (token !== undefined) opts.token = token;
  return request<T>(path, opts);
}

export async function apiDelete<T = unknown>(
  path: string,
  token?: string | null | undefined,
): Promise<T> {
  const opts: ApiOptions = { method: "DELETE" };
  if (token !== undefined) opts.token = token;
  return request<T>(path, opts);
}

/** Convenience: auto-fetches the current user's ID token before the request. */
export async function apiGetAuth<T = unknown>(path: string): Promise<T> {
  const token = await getIdToken();
  return apiGet<T>(path, token);
}

export async function apiPostAuth<T = unknown>(path: string, body?: unknown): Promise<T> {
  const token = await getIdToken();
  return apiPost<T>(path, body, token);
}

export async function apiPutAuth<T = unknown>(path: string, body?: unknown): Promise<T> {
  const token = await getIdToken();
  return apiPut<T>(path, body, token);
}

export async function apiPatchAuth<T = unknown>(path: string, body?: unknown): Promise<T> {
  const token = await getIdToken();
  return apiPatch<T>(path, body, token);
}

export async function apiDeleteAuth<T = unknown>(path: string): Promise<T> {
  const token = await getIdToken();
  return apiDelete<T>(path, token);
}

export { getIdToken };
