import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryBySlug, type Referral } from "@/lib/referrals";
import { BenefitBadge, CategoryChip, ServiceMark, TrustBadge } from "./badges";
import { CopyButton, SaveButton } from "./actions";

type Variant = "featured" | "standard" | "compact" | "list";

function Poster({ r, className }: { r: Referral; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}>
      <span className="inline-flex size-6 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">
        {r.postedBy.initials}
      </span>
      <span className="font-medium text-foreground">{r.postedBy.name}</span>
      <span aria-hidden>·</span>
      <span>{r.postedAgo}</span>
    </div>
  );
}

export function ReferralCard({
  referral: r,
  variant = "standard",
  className,
}: {
  referral: Referral;
  variant?: Variant;
  className?: string;
}) {
  const to = "/referral/$id" as const;
  const params = { id: r.id };

  if (variant === "featured") {
    const c = categoryBySlug[r.category];
    return (
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/15 bg-card p-6 shadow-card card-lift md:p-7",
          className,
        )}
      >
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(var(--ink) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />

        {/* Top */}
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <ServiceMark initials={r.initials} slug={r.category} size="lg" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Featured referral
              </p>
              <h3 className="mt-0.5 font-display text-2xl font-extrabold leading-tight md:text-3xl">
                {r.service}
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <CategoryChip slug={r.category} />
                {r.trust.slice(0, 2).map((t) => (
                  <TrustBadge key={t} trust={t} />
                ))}
              </div>
            </div>
          </div>
          <SaveButton id={r.id} service={r.service} />
        </div>

        {/* Middle — reward panel */}
        <div className={cn("relative mt-6 rounded-xl border border-foreground/12 p-5", c.soft)}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/55">
                You get
              </p>
              <div className="mt-2">
                <BenefitBadge size="lg">{r.benefit}</BenefitBadge>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-foreground/12 bg-card/70 px-3 py-2 text-xs font-semibold">
              <Clock3 className="size-3.5" /> Ends {r.expires}
            </div>
          </div>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-foreground/70">
            {r.summary}
          </p>
        </div>

        {/* Stats + tags */}
        <div className="relative mt-4 grid gap-3 sm:grid-cols-3">
          {[
            [r.copies.toLocaleString("en-IN"), "codes copied"],
            [`${r.postedBy.trustScore}%`, "poster trust score"],
            [String(r.conditions.length), "simple conditions"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl border border-border bg-background/60 px-4 py-3">
              <p className="font-display text-lg font-bold leading-none">{v}</p>
              <p className="mt-1 text-xs text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        {/* How to claim */}
        <div className="relative mt-4 flex flex-1 flex-col justify-between rounded-xl border border-dashed border-border p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            How to claim
          </p>
          <ol className="mt-3 space-y-2">
            {r.conditions.slice(0, 3).map((cond, i) => (
              <li key={cond} className="flex items-start gap-2.5 text-sm text-foreground/75">
                <span className="mt-px inline-grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-bold text-foreground">
                  {i + 1}
                </span>
                <span className="leading-snug">{cond}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {r.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-border pt-5">
          <Poster r={r} />
          <div className="flex items-center gap-2">
            <Link
              to={to}
              params={params}
              className="press inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              Details{" "}
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <CopyButton code={r.code} service={r.service} />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        to={to}
        params={params}
        className={cn(
          "group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card card-lift",
          className,
        )}
      >
        <ServiceMark initials={r.initials} slug={r.category} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{r.service}</p>
          <p className="truncate text-xs text-muted-foreground">{r.summary}</p>
        </div>
        <BenefitBadge size="sm" className="shrink-0">
          {r.benefit}
        </BenefitBadge>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <article
        className={cn(
          "group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-lift sm:flex-row sm:items-center",
          className,
        )}
      >
        <ServiceMark initials={r.initials} slug={r.category} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={to}
              params={params}
              className="font-semibold decoration-2 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {r.service}
            </Link>
            <CategoryChip slug={r.category} />
            {r.trust.slice(0, 1).map((t) => (
              <TrustBadge key={t} trust={t} />
            ))}
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{r.summary}</p>
          <Poster r={r} className="mt-2" />
        </div>
        <BenefitBadge size="sm">{r.benefit}</BenefitBadge>
        <div className="flex items-center gap-2">
          <SaveButton id={r.id} service={r.service} />
          <CopyButton code={r.code} service={r.service} size="sm" />
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card card-lift",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ServiceMark initials={r.initials} slug={r.category} />
          <div>
            <Link
              to={to}
              params={params}
              className="font-semibold decoration-2 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {r.service}
            </Link>
            <p className="text-xs text-muted-foreground">{r.tags.slice(0, 2).join(" · ")}</p>
          </div>
        </div>
        <SaveButton id={r.id} service={r.service} />
      </div>

      <div className="mt-4">
        <BenefitBadge>{r.benefit}</BenefitBadge>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{r.summary}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <CategoryChip slug={r.category} />
        {r.trust.slice(0, 1).map((t) => (
          <TrustBadge key={t} trust={t} />
        ))}
      </div>

      <div className="mt-auto pt-5">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <Poster r={r} />
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-dashed border-border pt-3">
          <span className="inline-flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users2 className="size-3.5" /> {r.copies.toLocaleString("en-IN")} copies
            </span>
            <span className="hidden items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:inline-flex">
              <Clock3 className="size-3.5" /> ends {r.expires}
            </span>
          </span>
          <CopyButton code={r.code} service={r.service} size="sm" />
        </div>
      </div>
    </article>
  );
}
