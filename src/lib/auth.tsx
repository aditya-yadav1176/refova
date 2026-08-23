import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthUser = {
  name: string;
  username: string;
  initials: string;
  email: string;
  trustScore: number;
};

type LoginResult  = { success: true } | { success: false; error: string };
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
  login:  (email: string, password: string) => Promise<LoginResult>;
  signup: (data: SignupData)               => Promise<SignupResult>;
  logout: () => void;
};

// ─── Mock login — REPLACE THIS FUNCTION BODY with a real API call ─────────────
//
// Interface contract (keep when replacing):
//   • Receives: email (string), password (string)
//   • Returns:  Promise<AuthUser>  on success
//   • Throws:   Error              on failure (message is shown to user)
//
async function mockAuthLogin(email: string, _password: string): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 900));

  const localPart =
    email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") || "user";

  return {
    email,
    name:      localPart.charAt(0).toUpperCase() + localPart.slice(1),
    username:  localPart,
    initials:  localPart.slice(0, 2).toUpperCase(),
    trustScore: 0,
  };
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── Mock signup — REPLACE THIS FUNCTION BODY with a real API call ────────────
//
// Interface contract (keep when replacing):
//   • Receives: data: SignupData  { name, email, password }
//   • Returns:  Promise<AuthUser>  on success (user is auto-logged-in)
//   • Throws:   Error              on failure (e.g. email already taken)
//
async function mockAuthSignup(data: SignupData): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 1000));

  const { name, email } = data;
  const trimmedName = name.trim();

  // Build initials from full name (up to 2 letters)
  const initials = trimmedName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Derive a URL-safe username from the email local-part
  const username =
    email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") || "user";

  return {
    email,
    name:      trimmedName,
    username,
    initials:  initials || username.slice(0, 2).toUpperCase(),
    trustScore: 0,
  };
}
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_KEY = "refova-auth-user";

const Ctx = createContext<AuthCtx | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Restore session on mount (client-only — sessionStorage is unavailable on server)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      /* ignore parse errors */
    }
  }, []);

  /** Persist authed user to state + sessionStorage. */
  const persist = useCallback((authedUser: AuthUser) => {
    setUser(authedUser);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(authedUser));
    } catch {
      /* storage quota or private-mode — proceed without persistence */
    }
  }, []);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      if (!email.trim() || !password.trim()) {
        return { success: false, error: "Please enter your email and password." };
      }

      setIsLoading(true);
      try {
        // ← Replace mockAuthLogin with your real auth call here
        const authedUser = await mockAuthLogin(email, password);
        persist(authedUser);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Login failed. Please try again.",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [persist],
  );

  // ── signup ─────────────────────────────────────────────────────────────────
  const signup = useCallback(
    async (data: SignupData): Promise<SignupResult> => {
      setIsLoading(true);
      try {
        // ← Replace mockAuthSignup with your real registration call here
        const authedUser = await mockAuthSignup(data);
        persist(authedUser);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Sign up failed. Please try again.",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [persist],
  );

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ user, isLoading, login, signup, logout }),
    [user, isLoading, login, signup, logout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>.");
  return ctx;
}
