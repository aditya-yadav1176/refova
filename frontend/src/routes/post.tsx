import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Pencil, PartyPopper, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { BenefitBadge, CategoryChip, ServiceMark } from "@/components/referral/badges";
import { categories, type CategorySlug } from "@/lib/referrals";
import { parseReferralContent } from "@/lib/referral-parser";
import { apiPostAuth } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { getRequestOrigin } from "@/lib/origin.functions";
import { cn } from "@/lib/utils";

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/post")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => ({
    meta: [
      { title: "Post a referral — Refova" },
      {
        name: "description",
        content:
          "Paste your referral message or code. Refova organizes the details automatically so you can share in seconds.",
      },
      { property: "og:title", content: "Post a referral — Refova" },
      {
        property: "og:description",
        content: "Paste once. We organize everything.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/post" },
      { property: "og:image", content: `${loaderData?.origin ?? ""}/og/post.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/post" }],
  }),
  component: PostPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "paste" | "review" | "published";

type ReviewForm = {
  service: string;
  code: string;
  benefit: string;
  category: CategorySlug;
  summary: string;
  conditionsText: string; // one condition per line; converted to string[] on publish
  expires: string;
  expiryType: "fixed_date" | "no_expiry_specified" | "unknown" | "expired";
  expiryDate: string | null;
  needsReview?: boolean;
  warnings?: string[];
};

const EMPTY_FORM: ReviewForm = {
  service: "",
  code: "",
  benefit: "",
  category: "finance",
  summary: "",
  conditionsText: "",
  expires: "",
  expiryType: "no_expiry_specified",
  expiryDate: null,
  needsReview: false,
  warnings: [],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

function PostPage() {
  const [step, setStep] = useState<Step>("paste");
  const [rawText, setRawText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [form, setForm] = useState<ReviewForm>(EMPTY_FORM);

  const setField = <K extends keyof ReviewForm>(k: K, v: ReviewForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const { user } = useAuth();
  const [isPublishing, setIsPublishing] = useState(false);

  // ── Step 1 → Step 2: parse the pasted text ──────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    setParseError(null);
    setIsParsing(true);
    try {
      // ← parseReferralContent is the backend-swap point (see referral-parser.ts)
      const p = await parseReferralContent(rawText);
      setForm({
        service: p.service,
        code: p.code,
        benefit: p.benefit,
        category: p.category,
        summary: p.summary,
        conditionsText: p.conditions.join("\n"),
        expires: p.expires,
        expiryType: p.expiryType,
        expiryDate: p.expiryDate,
        needsReview: p.needsReview,
        warnings: p.warnings,
      });
      setStep("review");
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Failed to process. Please try again.");
    } finally {
      setIsParsing(false);
    }
  };

  // ── Step 2 → Step 3: publish ────────────────────────────────────────────────
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to publish your referral.");
      return;
    }
    if (!form.service.trim() || !form.code.trim() || !form.benefit.trim()) {
      toast.error("Please fill in the required fields (service, code, and benefit).");
      return;
    }

    setIsPublishing(true);
    try {
      const conditions = form.conditionsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const isUrl = /^https?:\/\//i.test(form.code.trim());

      let expiryIso: string | undefined = undefined;
      let expiryType = form.expiryType || "no_expiry_specified";

      if (form.expires.trim()) {
        const parsedTs = Date.parse(form.expires.trim());
        if (!isNaN(parsedTs)) {
          expiryIso = new Date(parsedTs).toISOString().split("T")[0];
          expiryType = "fixed_date";
        }
      }

      await apiPostAuth("/referrals", {
        brandName: form.service.trim(),
        categoryId: form.category,
        benefitHeadline: form.benefit.trim(),
        description: form.summary.trim() || `${form.service.trim()} referral: ${form.benefit.trim()}`,
        referralCode: isUrl ? "" : form.code.trim(),
        referralUrl: isUrl ? form.code.trim() : undefined,
        conditions: conditions.length > 0 ? conditions : undefined,
        expiryType,
        expiryDate: expiryIso,
      });

      setStep("published");
      toast.success("Referral published successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish referral";
      toast.error(msg);
    } finally {
      setIsPublishing(false);
    }
  };

  // ── Reset to step 1 ─────────────────────────────────────────────────────────
  const handleReset = () => {
    setStep("paste");
    setRawText("");
    setForm(EMPTY_FORM);
    setParseError(null);
  };

  // ── Step 3: Success screen (preserved from original) ────────────────────────
  if (step === "published") {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto grid max-w-2xl place-items-center px-4 py-24 text-center">
          <div className="grid size-20 place-items-center rounded-2xl border-2 border-foreground bg-leaf-soft text-leaf animate-pop">
            <PartyPopper className="size-9" />
          </div>
          <h1 className="mt-8 text-4xl font-bold md:text-5xl">Your referral is live</h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground">
            <strong>{form.service || "Your referral"}</strong> is now in the discover feed. You'll
            get a nudge each time someone copies it, and verification usually completes within a
            day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/discover"
              className="rounded-lg border-2 border-foreground bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground press"
              style={{ boxShadow: "3px 3px 0 var(--ink)" }}
            >
              See it in discover
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold press"
            >
              Post another
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // ── Step 2: Review & Edit ────────────────────────────────────────────────────
  if (step === "review") {
    const initials =
      form.service
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??";

    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl">
            <button
              type="button"
              onClick={() => setStep("paste")}
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Edit paste
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Review your referral
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
              Looks good? Edit anything, then publish.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              We've organized the details from your paste. Correct any field before going live.
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* ── Left: Editable form ── */}
            <form onSubmit={handlePublish} className="space-y-6">
              {form.warnings && form.warnings.length > 0 && (
                <div className="rounded-xl border border-amber/30 bg-amber-soft/50 p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Sparkles className="size-4 text-amber" />
                    Please review highlighted details:
                  </div>
                  <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
                    {form.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Service + category */}
              <Section title="The basics" step="01">
                <Field label="Brand / service name" required>
                  <input
                    required
                    value={form.service}
                    onChange={(e) => setField("service", e.target.value)}
                    placeholder="e.g. Myntra or MobiKwik"
                    className={inputCls}
                  />
                </Field>
                <Field label="Category" required>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setField("category", c.slug)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                          form.category === c.slug
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background hover:border-foreground/30",
                        )}
                      >
                        {c.emoji} {c.name}
                      </button>
                    ))}
                  </div>
                </Field>
              </Section>

              {/* Offer */}
              <Section title="The offer" step="02">
                <Field
                  label="Benefit badge"
                  required
                  hint="Short and loud — this becomes the badge on your card."
                >
                  <input
                    required
                    value={form.benefit}
                    onChange={(e) => setField("benefit", e.target.value)}
                    placeholder="e.g. Cashback or ₹500 CASHBACK"
                    className={inputCls}
                  />
                </Field>
                <Field label="Description" required>
                  <textarea
                    required
                    rows={3}
                    value={form.summary}
                    onChange={(e) => setField("summary", e.target.value)}
                    placeholder="What does the referee get, and how do they claim it?"
                    className={`${inputCls} resize-none py-3`}
                  />
                </Field>
              </Section>

              {/* How to claim */}
              <Section title="How to claim" step="03">
                <Field label="Referral code or link" required>
                  <input
                    required
                    value={form.code}
                    onChange={(e) => setField("code", e.target.value)}
                    placeholder="CODE123 or https://…"
                    className={`${inputCls} font-mono`}
                  />
                </Field>
                <Field label="Conditions" hint="One per line. Only list conditions explicitly stated in the offer.">
                  <textarea
                    rows={Math.max(4, Math.min(8, (form.conditionsText.split("\n").filter(Boolean).length || 1) + 1))}
                    value={form.conditionsText}
                    onChange={(e) => setField("conditionsText", e.target.value)}
                    placeholder={"Make any payment to activate\nValid on first transaction"}
                    className={`${inputCls} min-h-[110px] max-h-[260px] resize-y py-3 font-sans`}
                  />
                </Field>
                <Field
                  label="Expiry date"
                  hint={
                    form.expires
                      ? "Format: 30 Sep 2026 or YYYY-MM-DD"
                      : "Leave blank if this is an ongoing offer without a stated expiration date."
                  }
                >
                  <input
                    value={form.expires}
                    onChange={(e) => {
                      const val = e.target.value;
                      setField("expires", val);
                      setField("expiryType", val.trim() ? "fixed_date" : "no_expiry_specified");
                    }}
                    placeholder="No expiry specified (ongoing offer)"
                    className={inputCls}
                  />
                </Field>
              </Section>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="press rounded-xl border-2 border-foreground bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ boxShadow: isPublishing ? "none" : "4px 4px 0 var(--ink)" }}
                >
                  {isPublishing ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                      Publishing…
                    </span>
                  ) : (
                    "Publish Referral"
                  )}
                </button>
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={() => setStep("paste")}
                  className="press rounded-xl border border-border bg-card px-5 py-3.5 text-base font-semibold hover:bg-secondary disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <Pencil className="size-4" />
                    Edit paste
                  </span>
                </button>
              </div>
            </form>

            {/* ── Right: Live preview ── */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Sparkles className="size-3.5" /> Live preview
              </p>
              <article className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <ServiceMark initials={initials} slug={form.category} />
                  <div>
                    <p className="font-semibold">{form.service || "Your service"}</p>
                    <p className="text-xs text-muted-foreground">posted just now</p>
                  </div>
                </div>
                <div className="mt-4">
                  <BenefitBadge>{form.benefit || "YOUR BENEFIT"}</BenefitBadge>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                  {form.summary || "A short description of what the other person gets."}
                </p>
                {form.conditionsText && (
                  <ul className="mt-3 space-y-1">
                    {form.conditionsText
                      .split("\n")
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((c) => (
                        <li
                          key={c}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <span className="mt-px inline-grid size-4 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-bold">
                            ✓
                          </span>
                          {c}
                        </li>
                      ))}
                  </ul>
                )}
                <div className="mt-3">
                  <CategoryChip slug={form.category} />
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-dashed border-border pt-3 text-xs text-muted-foreground">
                  <span>0 copies</span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-1.5 font-semibold text-background">
                    <Check className="size-3" /> Copy referral
                  </span>
                </div>
              </article>
              <p className="mt-3 text-xs text-muted-foreground">
                This is roughly how your card appears in the discover feed.
              </p>
            </aside>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // ── Step 1: Paste ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="enter w-full max-w-2xl">
          {/* Heading */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Post a referral
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">Share a referral</h1>
            <p className="mt-4 text-base text-muted-foreground">
              Paste your referral message, code, or offer.{" "}
              <span className="font-medium text-foreground">
                We'll organize the details for you.
              </span>
            </p>
          </div>

          {/* Paste card */}
          <div className="rounded-2xl border border-foreground/15 bg-card p-6 shadow-card md:p-8">
            <form onSubmit={handleCreate} className="space-y-5">
              {/* Textarea */}
              <div className="space-y-1.5">
                <label htmlFor="referral-text" className="text-sm font-semibold">
                  Your referral
                </label>
                <textarea
                  id="referral-text"
                  rows={7}
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    if (parseError) setParseError(null);
                  }}
                  placeholder={`Paste your referral here…\n\nExamples:\n• "I have a Myntra code - 58201"\n• "Get ₹150 cashback on Navi UPI. Use code NAVI150. New users only."\n• Paste a full promotional SMS or message`}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-4 text-sm leading-relaxed outline-none transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Any format works — code, URL, or a full message.
                  </p>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {rawText.length > 0 ? `${rawText.length} chars` : ""}
                  </span>
                </div>
              </div>

              {/* Parse error */}
              {parseError && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
                >
                  {parseError}
                </div>
              )}

              {/* CTA */}
              <button
                type="submit"
                disabled={isParsing || !rawText.trim()}
                style={{
                  boxShadow: isParsing || !rawText.trim() ? "none" : "3px 3px 0 var(--ink)",
                }}
                className={cn(
                  "press w-full rounded-xl border-2 border-foreground bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                {isParsing ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <span className="inline-block size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Organizing your referral…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2.5">
                    <Wand2 className="size-4" />
                    Create Referral
                  </span>
                )}
              </button>
            </form>

            {/* Footer hint */}
            <p className="mt-5 text-center text-xs text-muted-foreground">
              Paste once.{" "}
              <span className="font-semibold text-foreground">We organize everything.</span>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

// ─── Shared sub-components (unchanged from original) ─────────────────────────

const inputCls =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/40";

function Section({
  title,
  step,
  children,
}: {
  title: string;
  step: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-7 place-items-center rounded-md bg-secondary font-display text-xs font-bold">
          {step}
        </span>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-primary"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
