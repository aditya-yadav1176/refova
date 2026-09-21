import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/site-header";
import { deriveUsername, useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

// ─── Route ────────────────────────────────────────────────────────────────────

const searchSchema = z.object({
  // Where to send the user after a successful login (for future protected routes)
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Log in — Refova" },
      {
        name: "description",
        content: "Log in to your Refova account to post, save and manage your referrals.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function LoginPage() {
  const { redirect } = Route.useSearch();
  const { user, login, loginWithGoogle, isLoading, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already logged in — send straight to profile (or the intended redirect target)
  if (user) {
    if (redirect) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      void navigate({ to: redirect as any });
    } else {
      void navigate({ to: "/profile/$username", params: { username: user.username } });
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await login(email, password);

    if (result.success) {
      const username = deriveUsername(email);

      if (redirect) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        void navigate({ to: redirect as any });
      } else {
        void navigate({
          to: "/profile/$username",
          params: { username },
        });
      }
    } else {
      setError(result.error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email address first, then click Forgot password.");
      return;
    }
    try {
      await resetPassword(email.trim());
      toast("Password reset email sent", {
        description: `Check your inbox at ${email}.`,
      });
    } catch {
      setError("Could not send reset email. Check your email address and try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const result = await loginWithGoogle();
    if (result.success) {
      const username = deriveUsername(email || "user");
      if (redirect) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        void navigate({ to: redirect as any });
      } else {
        void navigate({ to: "/", replace: true });
      }
    } else if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="enter w-full max-w-md">
          {/* ← Back link */}
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>

          {/* Card */}
          <div className="rounded-2xl border border-foreground/15 bg-card p-8 shadow-card md:p-10">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Log in to discover, save and share referrals.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-xl border border-border bg-background pl-4 pr-11 text-sm outline-none transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Inline error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                style={{ boxShadow: isLoading ? "none" : "3px 3px 0 var(--ink)" }}
                className={cn(
                  "press w-full rounded-xl border-2 border-foreground bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Logging in…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="size-4" />
                    Log in
                  </span>
                )}
              </button>
            </form>

            {/* ─── Divider ─── */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-xs font-medium text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="press w-full rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              <span className="flex items-center justify-center gap-2.5">
                {/* Google G logo */}
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </span>
            </button>

            {/* Sign up link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
