import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, PartyPopper, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { BenefitBadge, CategoryChip, ServiceMark } from "@/components/referral/badges";
import { categories, type CategorySlug } from "@/lib/referrals";
import { getRequestOrigin } from "@/lib/origin.functions";

export const Route = createFileRoute("/post")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => ({
    meta: [
      { title: "Post a referral and share the benefit — Refova" },
      {
        name: "description",
        content:
          "Share your referral link or code on Refova in a couple of minutes. Add the benefit, conditions and expiry, and preview the card before publishing.",
      },
      { property: "og:title", content: "Post a referral and share the benefit — Refova" },
      {
        property: "og:description",
        content: "Add your referral link or code, describe the benefit, and publish it to the community.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/post" },
      { property: "og:image", content: `${loaderData?.origin ?? ""}/og/post.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Post a referral and share the benefit — Refova" },
      {
        name: "twitter:description",
        content: "Add your referral link or code, describe the benefit, and publish it to the community.",
      },
      { name: "twitter:image", content: `${loaderData?.origin ?? ""}/og/post.jpg` },
    ],
    links: [{ rel: "canonical", href: "/post" }],
  }),
  component: PostPage,
});

const empty = {
  service: "",
  category: "finance" as CategorySlug,
  benefit: "",
  description: "",
  code: "",
  conditions: "",
  expiry: "",
  proof: "",
};

function PostPage() {
  const [form, setForm] = useState(empty);
  const [published, setPublished] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  if (published) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto grid max-w-2xl place-items-center px-4 py-24 text-center">
          <div className="grid size-20 place-items-center rounded-2xl border-2 border-foreground bg-leaf-soft text-leaf animate-pop">
            <PartyPopper className="size-9" />
          </div>
          <h1 className="mt-8 text-4xl font-bold md:text-5xl">Your referral is live</h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground">
            {form.service || "Your referral"} is now in the discover feed. You'll get a nudge each time someone copies
            it, and verification usually completes within a day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/discover"
              className="rounded-lg border-2 border-foreground bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              style={{ boxShadow: "3px 3px 0 var(--ink)" }}
            >
              See it in discover
            </Link>
            <button
              type="button"
              onClick={() => {
                setForm(empty);
                setPublished(false);
              }}
              className="rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold"
            >
              Post another
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Post a referral</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
            Share a referral. Someone out there is looking for exactly this.
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Tell people what they get, what the catch is, and how to claim it. Clear posts get copied far more often.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPublished(true);
              toast.success("Referral published");
            }}
            className="space-y-6"
          >
            <Section title="The basics" step="01">
              <Field label="Company / service name" required>
                <input
                  required
                  value={form.service}
                  onChange={(e) => set("service", e.target.value)}
                  placeholder="e.g. PayWise"
                  className={inputCls}
                />
              </Field>
              <Field label="Category" required>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => set("category", c.slug)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        form.category === c.slug
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background hover:border-foreground/30"
                      }`}
                    >
                      {c.emoji} {c.name}
                    </button>
                  ))}
                </div>
              </Field>
            </Section>

            <Section title="The offer" step="02">
              <Field label="Referral benefit" required hint="Short and loud — this becomes the badge on your card.">
                <input
                  required
                  value={form.benefit}
                  onChange={(e) => set("benefit", e.target.value)}
                  placeholder="e.g. ₹500 CASHBACK"
                  className={inputCls}
                />
              </Field>
              <Field label="Description" required>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Get ₹500 after your first successful payment of ₹100 or more."
                  className={`${inputCls} resize-none py-3`}
                />
              </Field>
            </Section>

            <Section title="How to claim" step="03">
              <Field label="Referral link or code" required>
                <input
                  required
                  value={form.code}
                  onChange={(e) => set("code", e.target.value)}
                  placeholder="PAYWISE-YOU500 or https://…"
                  className={`${inputCls} font-mono`}
                />
              </Field>
              <Field label="Terms & conditions" hint="One per line.">
                <textarea
                  rows={3}
                  value={form.conditions}
                  onChange={(e) => set("conditions", e.target.value)}
                  placeholder={"New users only\nKYC within 7 days"}
                  className={`${inputCls} resize-none py-3`}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Expiry date">
                  <input
                    type="date"
                    value={form.expiry}
                    onChange={(e) => set("expiry", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Proof / verification" hint="Optional — helps you get verified faster.">
                  <input
                    value={form.proof}
                    onChange={(e) => set("proof", e.target.value)}
                    placeholder="Link to the offer page or a screenshot"
                    className={inputCls}
                  />
                </Field>
              </div>
            </Section>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-xl border-2 border-foreground bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground press"
                style={{ boxShadow: "4px 4px 0 var(--ink)" }}
              >
                Publish referral
              </button>
              <span className="text-xs text-muted-foreground">
                Prototype — nothing is stored, submission is simulated.
              </span>
            </div>
          </form>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles className="size-3.5" /> Live preview
            </p>
            <article className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <ServiceMark initials={(form.service || "??").slice(0, 2).toUpperCase()} slug={form.category} />
                <div>
                  <p className="font-semibold">{form.service || "Your service"}</p>
                  <p className="text-xs text-muted-foreground">posted just now</p>
                </div>
              </div>
              <div className="mt-4">
                <BenefitBadge>{form.benefit || "YOUR BENEFIT"}</BenefitBadge>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                {form.description || "A short, honest description of what the other person gets."}
              </p>
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
              This is roughly how your referral appears in the discover feed.
            </p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/40";

function Section({ title, step, children }: { title: string; step: string; children: React.ReactNode }) {
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
