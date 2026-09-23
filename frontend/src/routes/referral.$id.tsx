import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, Copy, Eye, Flag, Share2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { BenefitBadge, CategoryChip, ServiceMark, TrustBadge } from "@/components/referral/badges";
import { SaveButton } from "@/components/referral/actions";
import { ReferralCard } from "@/components/referral/referral-card";
import { maskCode, mapApiReferral, type ApiReferral, type Referral } from "@/lib/referrals";
import { getRequestOrigin } from "@/lib/origin.functions";
import { cn } from "@/lib/utils";
import { apiGet, apiPostAuth } from "@/lib/api";

export const Route = createFileRoute("/referral/$id")({
  loader: async ({ params }) => {
    let referral: Referral | undefined;
    try {
      const resp = await apiGet<{ success: boolean; data: ApiReferral }>(`/referrals/${params.id}`);
      if (resp && resp.success && resp.data) {
        referral = mapApiReferral(resp.data);
      }
    } catch {
      // Backend returned 404 or error
    }
    if (!referral) throw notFound();
    return { referral, origin: await getRequestOrigin() };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Referral unavailable — Refova" }, { name: "robots", content: "noindex" }],
      };
    }
    const r = loaderData.referral;
    const title = `${r.service} referral — ${r.benefit.toLowerCase()} · Refova`;
    return {
      meta: [
        { title },
        { name: "description", content: r.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: r.summary },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/referral/${r.id}` },
        { property: "og:image", content: `${loaderData.origin}/og/referral.jpg` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: r.summary },
        { name: "twitter:image", content: `${loaderData.origin}/og/referral.jpg` },
      ],
      links: [{ rel: "canonical", href: `/referral/${r.id}` }],
    };
  },
  component: ReferralDetail,
});

function ReferralDetail() {
  const { referral: r } = Route.useLoaderData();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: similar = [] } = useQuery({
    queryKey: ["similar-referrals", r.category, r.id],
    queryFn: async () => {
      try {
        const resp = await apiGet<{ success: boolean; data: ApiReferral[] }>(
          `/referrals?category=${r.category}&limit=4`,
        );
        if (resp && resp.success && Array.isArray(resp.data)) {
          return resp.data
            .map(mapApiReferral)
            .filter((x) => x.id !== r.id)
            .slice(0, 3);
        }
      } catch {
        // ignore
      }
      return [] as Referral[];
    },
    staleTime: 30_000,
  });

  const copy = async () => {
    // Call backend to track copy and get the real code
    let codeToUse = r.code;
    try {
      const resp = await apiPostAuth<{
        success: boolean;
        data: { referralCode: string; referralUrl: string };
      }>(`/referrals/${r.id}/copy`);
      if (resp.success && resp.data) {
        codeToUse = resp.data.referralUrl || resp.data.referralCode || r.code;
      }
    } catch {
      // Backend unavailable — use the code already loaded
    }
    try {
      await navigator.clipboard.writeText(codeToUse);
    } catch {
      /* clipboard blocked in preview */
    }
    setRevealed(true);
    setCopied(true);
    toast.success("Referral copied to clipboard", { description: `${r.service} · ${r.benefit}` });
    window.setTimeout(() => setCopied(false), 2200);
  };

  const report = async () => {
    try {
      await apiPostAuth(`/referrals/${r.id}/report`, { reason: "incorrect_info", description: "" });
      toast("Reported for review", { description: "Thanks — a moderator will take a look." });
    } catch {
      toast("Reported for review", { description: "Thanks — a moderator will take a look." });
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/discover"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to discover
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="rounded-2xl border border-foreground/15 bg-card p-6 shadow-card md:p-9">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <ServiceMark initials={r.initials} slug={r.category} size="lg" />
                  <div>
                    <h1 className="text-3xl font-bold md:text-4xl">{r.service}</h1>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <CategoryChip slug={r.category} />
                      {r.trust.map((t) => (
                        <TrustBadge key={t} trust={t} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <SaveButton id={r.id} service={r.service} withLabel />
                  <button
                    type="button"
                    onClick={() =>
                      toast("Share link copied", {
                        description: "Anyone can open this referral page.",
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium press hover:bg-secondary"
                  >
                    <Share2 className="size-4" /> Share
                  </button>
                </div>
              </div>

              <div className="mt-8 border-t border-dashed border-border pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  The benefit
                </p>
                <p className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight md:text-4xl">
                  {r.summary}
                </p>
                <div className="mt-5">
                  <BenefitBadge size="lg">{r.benefit}</BenefitBadge>
                </div>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-lg font-bold">How it works</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.details}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Important conditions</h2>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {r.conditions.map((c) => (
                      <li key={c} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-leaf" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-muted-foreground">Valid until {r.expires}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4">
              <div className="flex items-center gap-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Copy className="size-4" /> {r.copies.toLocaleString("en-IN")} copies
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <TrendingUp className="size-4" /> {r.popularity}% found it useful
                </span>
              </div>
              <button
                type="button"
                onClick={report}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"
              >
                <Flag className="size-4" /> Report referral
              </button>
            </div>

            {similar.length > 0 && (
              <section className="mt-14">
                <h2 className="text-2xl font-bold">Similar referrals</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {similar.map((s: Referral) => (
                    <ReferralCard key={s.id} referral={s} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border-2 border-foreground bg-card p-6 shadow-lift">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {r.isLink ? "Referral link" : "Referral code"}
              </p>

              <div className="relative mt-3 overflow-hidden rounded-xl border border-dashed border-border bg-background p-4">
                <p
                  className={cn(
                    "break-all font-mono text-sm transition-all",
                    !revealed && "select-none blur-[5px]",
                  )}
                >
                  {revealed ? r.code : maskCode(r.code)}
                </p>
                {!revealed && (
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Eye className="size-3.5" /> Hidden until you copy it
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={copy}
                className={cn(
                  "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-foreground px-5 py-3.5 text-base font-semibold transition-all active:translate-y-0.5",
                  copied
                    ? "bg-leaf-soft text-leaf"
                    : "bg-primary text-primary-foreground hover:-translate-y-0.5",
                )}
                style={{ boxShadow: "4px 4px 0 var(--ink)" }}
              >
                {copied ? (
                  <>
                    <Check className="size-5 animate-pop" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-5" /> Copy referral
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Paste it during signup — the benefit applies automatically.
              </p>

              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Posted by
                </p>
                <Link
                  to="/profile/$username"
                  params={{ username: r.postedBy.username }}
                  className="mt-3 flex items-center gap-3 rounded-xl p-2 press hover:bg-secondary"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-secondary font-bold">
                    {r.postedBy.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{r.postedBy.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      Trust score {r.postedBy.trustScore} · posted {r.postedOn}
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
