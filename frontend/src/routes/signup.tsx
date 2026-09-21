import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/site-header";
import { deriveUsername, useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create an account — Refova" },
      {
        name: "description",
        content: "Join Refova to discover, share and save referral links and codes.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignUpPage,
});

// ─── Validation ───────────────────────────────────────────────────────────────

type Fields = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FieldErrors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PW = 8;

function validate(fields: Fields): FieldErrors {
  const errors: FieldErrors = {};

  if (!fields.name.trim()) {
    errors.name = "Please enter your full name.";
  }

  if (!fields.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_RE.test(fields.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!fields.password) {
    errors.password = "Please choose a password.";
  } else if (fields.password.length < MIN_PW) {
    errors.password = `Password must be at least ${MIN_PW} characters.`;
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = "Passwords don't match.";
  }

  return errors;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function SignUpPage() {
  const { user, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Already logged in — send straight to profile
  if (user) {
    void navigate({ to: "/profile/$username", params: { username: user.username } });
    return null;
  }

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    // Clear the error for this field as the user starts correcting it
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Frontend validation
    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Submit to auth layer
    const result = await signup({
      name: fields.name.trim(),
      email: fields.email.trim(),
      password: fields.password,
    });

    if (result.success) {
      const username = deriveUsername(fields.email);

      toast.success("Account created! Welcome to Refova.", {
        description: "Start by exploring referrals or posting your own.",
      });

      void navigate({ to: "/profile/$username", params: { username } });
    } else {
      setServerError(result.error);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="enter w-full max-w-md">
          {/* ← Back link */}
          <Link
            to="/login"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to login
          </Link>

          {/* Card */}
          <div className="rounded-2xl border border-foreground/15 bg-card p-8 shadow-card md:p-10">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Join to discover, save and share referrals with the community.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Full name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-semibold">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={fields.name}
                  onChange={set("name")}
                  placeholder="Jane Smith"
                  aria-invalid={!!fieldErrors.name}
                  className={cn(
                    "h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30",
                    fieldErrors.name
                      ? "border-destructive/60 focus:ring-destructive/20"
                      : "border-border",
                  )}
                />
                {fieldErrors.name && (
                  <p role="alert" className="text-xs text-destructive">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={fields.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  aria-invalid={!!fieldErrors.email}
                  className={cn(
                    "h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30",
                    fieldErrors.email
                      ? "border-destructive/60 focus:ring-destructive/20"
                      : "border-border",
                  )}
                />
                {fieldErrors.email && (
                  <p role="alert" className="text-xs text-destructive">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={fields.password}
                    onChange={set("password")}
                    placeholder={`At least ${MIN_PW} characters`}
                    aria-invalid={!!fieldErrors.password}
                    className={cn(
                      "h-11 w-full rounded-xl border bg-background pl-4 pr-11 text-sm outline-none transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30",
                      fieldErrors.password
                        ? "border-destructive/60 focus:ring-destructive/20"
                        : "border-border",
                    )}
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
                {fieldErrors.password ? (
                  <p role="alert" className="text-xs text-destructive">
                    {fieldErrors.password}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Must be at least {MIN_PW} characters.
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-semibold">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={fields.confirmPassword}
                    onChange={set("confirmPassword")}
                    placeholder="Re-enter your password"
                    aria-invalid={!!fieldErrors.confirmPassword}
                    className={cn(
                      "h-11 w-full rounded-xl border bg-background pl-4 pr-11 text-sm outline-none transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30",
                      fieldErrors.confirmPassword
                        ? "border-destructive/60 focus:ring-destructive/20"
                        : "border-border",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p role="alert" className="text-xs text-destructive">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Server-level error (e.g. email already taken) */}
              {serverError && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
                >
                  {serverError}
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
                    Creating account…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="size-4" />
                    Create account
                  </span>
                )}
              </button>
            </form>

            {/* Log in link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
