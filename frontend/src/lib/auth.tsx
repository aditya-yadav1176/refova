import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";
import { apiPost, getIdToken } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthUser = {
  uid: string;
  name: string;
  username: string;
  initials: string;
  email: string;
  photoURL: string | null;
  role: "user" | "admin";
  trustScore: number;
};

type LoginResult = { success: true } | { success: false; error: string };
type SignupResult = { success: true } | { success: false; error: string };

export type SignupData = {
  name: string;
  email: string;
  password: string;
};

type AuthCtx = {
  user: AuthUser | null;
  /** True while a login or signup request is in flight. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  signup: (data: SignupData) => Promise<SignupResult>;
  loginWithGoogle: () => Promise<LoginResult>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function deriveUsername(email: string): string {
  const localPart = email
    .split("@")[0]
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return localPart || "user";
}

// eslint-disable-next-line react-refresh/only-export-components
export function deriveInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??"
  );
}

interface BackendUserData {
  displayName?: string;
  username?: string;
  photoURL?: string | null;
  role?: "user" | "admin";
  trustScore?: number;
  isCustomDisplayName?: boolean;
}

/** Convert a backend user object or Firebase user into our AuthUser shape. */
function mapToAuthUser(fbUser: FirebaseUser, backendUser?: BackendUserData): AuthUser {
  const email = fbUser.email ?? "";
  const emailPrefix = deriveUsername(email);

  // Fallback priority:
  // 1. Manually customized Refova displayName (backendUser with isCustomDisplayName or custom name)
  // 2. Firebase/Google displayName (fbUser.displayName)
  // 3. Backend displayName (if present and not equal to email)
  // 4. Email username portion
  // 5. "User"
  let name = "";
  if (backendUser?.isCustomDisplayName && backendUser.displayName?.trim()) {
    name = backendUser.displayName.trim();
  } else if (fbUser.displayName?.trim()) {
    name = fbUser.displayName.trim();
  } else if (
    backendUser?.displayName?.trim() &&
    backendUser.displayName.trim().toLowerCase() !== email.toLowerCase()
  ) {
    name = backendUser.displayName.trim();
  } else if (emailPrefix) {
    name = emailPrefix;
  } else {
    name = "User";
  }

  const initials = deriveInitials(name);
  return {
    uid: fbUser.uid,
    name,
    username: backendUser?.username || emailPrefix || "user",
    initials,
    email,
    photoURL: backendUser?.photoURL || fbUser.photoURL || null,
    role: backendUser?.role || "user",
    trustScore: backendUser?.trustScore || 0,
  };
}

/** Map Firebase Auth error codes to human-readable messages. */
function mapFirebaseError(code: string): string {
  const map: Record<string, string> = {
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
    "auth/user-disabled": "This account has been disabled. Contact support for help.",
  };
  return map[code] || "Authentication failed. Please try again.";
}

const SESSION_KEY = "refova-auth-user";
const Ctx = createContext<AuthCtx | null>(null);
const googleProvider = new GoogleAuthProvider();

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true — waiting for onAuthStateChanged
  const unsubscribeRef = useRef<(() => void) | null>(null);

  /** Persist authed user to state + sessionStorage. */
  const persist = useCallback((authedUser: AuthUser) => {
    setUser(authedUser);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(authedUser));
    } catch {
      /* storage quota or private-mode — proceed without persistence */
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  /** Call the backend to register or sync user, get back enriched profile. */
  const syncWithBackend = useCallback(
    async (fbUser: FirebaseUser, isNew = false): Promise<AuthUser> => {
      try {
        const token = await fbUser.getIdToken();
        const endpoint = isNew ? "/auth/register" : "/auth/me";
        const resp = await apiPost<{ success: boolean; data: Record<string, unknown> }>(
          endpoint,
          {},
          token,
        );
        if (resp.success && resp.data) {
          return mapToAuthUser(fbUser, resp.data);
        }
      } catch {
        // Backend call failed — still allow auth with basic Firebase data
      }
      return mapToAuthUser(fbUser);
    },
    [],
  );

  // Restore session on mount from sessionStorage (instant, before Firebase resolves)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as AuthUser;
        setUser(cached);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Firebase Auth state listener — single source of truth for auth
  useEffect(() => {
    // Skip on server (SSR)
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const enriched = await syncWithBackend(fbUser, false);
          persist(enriched);
        } catch {
          const fallback = mapToAuthUser(fbUser);
          persist(fallback);
        }
      } else {
        clearUser();
      }
      setIsLoading(false);
    });

    unsubscribeRef.current = unsubscribe;
    return () => unsubscribe();
  }, [persist, clearUser, syncWithBackend]);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      if (!isFirebaseConfigured) {
        return {
          success: false,
          error:
            "Firebase Web API key is not configured. Please add VITE_FIREBASE_API_KEY in .env.local",
        };
      }
      if (!email.trim() || !password.trim()) {
        return { success: false, error: "Please enter your email and password." };
      }
      setIsLoading(true);
      try {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const enriched = await syncWithBackend(cred.user, false);
        persist(enriched);
        return { success: true };
      } catch (err: unknown) {
        const code = (err as { code?: string }).code ?? "";
        return { success: false, error: mapFirebaseError(code) };
      } finally {
        setIsLoading(false);
      }
    },
    [persist, syncWithBackend],
  );

  // ── signup ─────────────────────────────────────────────────────────────────
  const signup = useCallback(
    async (data: SignupData): Promise<SignupResult> => {
      if (!isFirebaseConfigured) {
        return {
          success: false,
          error:
            "Firebase Web API key is not configured. Please add VITE_FIREBASE_API_KEY in .env.local",
        };
      }
      setIsLoading(true);
      try {
        const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
        // Update Firebase displayName
        await updateProfile(cred.user, { displayName: data.name.trim() });
        const enriched = await syncWithBackend(cred.user, true);
        persist(enriched);
        return { success: true };
      } catch (err: unknown) {
        const code = (err as { code?: string }).code ?? "";
        return { success: false, error: mapFirebaseError(code) };
      } finally {
        setIsLoading(false);
      }
    },
    [persist, syncWithBackend],
  );

  // ── Google sign-in ─────────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async (): Promise<LoginResult> => {
    if (!isFirebaseConfigured) {
      return {
        success: false,
        error:
          "Firebase Web API key is not configured. Please add VITE_FIREBASE_API_KEY in .env.local",
      };
    }
    setIsLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const enriched = await syncWithBackend(cred.user, false);
      persist(enriched);
      return { success: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        return { success: false, error: "" }; // silent — user closed popup deliberately
      }
      return { success: false, error: mapFirebaseError(code) };
    } finally {
      setIsLoading(false);
    }
  }, [persist, syncWithBackend]);

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    signOut(auth).catch(() => {});
    clearUser();
  }, [clearUser]);

  // ── password reset ─────────────────────────────────────────────────────────
  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ user, isLoading, login, signup, loginWithGoogle, logout, resetPassword }),
    [user, isLoading, login, signup, loginWithGoogle, logout, resetPassword],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>.");
  return ctx;
}
