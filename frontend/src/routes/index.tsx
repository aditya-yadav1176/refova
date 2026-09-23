import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, Copy, Gift, Search, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ReferralCard } from "@/components/referral/referral-card";
import { BenefitBadge } from "@/components/referral/badges";
import { categories, mapApiReferral, type ApiReferral } from "@/lib/referrals";
import { apiGet } from "@/lib/api";
import { Reveal } from "@/components/site/reveal";
import { getRequestOrigin } from "@/lib/origin.functions";

export const Route = createFileRoute("/")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => ({
    meta: [
      { title: "Refova — find referrals, share benefits" },
      {
        name: "description",
        content:
          "A curated place to discover, copy and share referral links and codes across finance, food, travel, shopping and developer tools.",
      },
      { property: "og:title", content: "Refova — find referrals, share benefits" },
      {
        property: "og:description",
        content:
          "Discover referral offers posted by real people — copy the code, claim the benefit, share your own.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: `${loaderData?.origin ?? ""}/og/home.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Refova — find referrals, share benefits" },
      {
        name: "twitter:description",
        content:
          "Discover referral offers posted by real people — copy the code, claim the benefit, share your own.",
      },
      { name: "twitter:image", content: `${loaderData?.origin ?? ""}/og/home.jpg` },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const heroCards = [
  {
    label: "₹500 off",
    sub: "PayWise · finance",
    cls: "bg-leaf-soft text-leaf",
    pos: "left-0 top-6",
    tilt: "-5deg",
    anim: "animate-float-slow",
  },
  {
    label: "1 month free",
    sub: "LoomNote · productivity",
    cls: "bg-grape-soft text-grape",
    pos: "right-2 top-0",
    tilt: "4deg",
    anim: "animate-float-med",
  },
  {
    label: "₹1,000 reward",
    sub: "SkyHop · travel",
    cls: "bg-sky-soft text-sky",
    pos: "left-10 bottom-4",
    tilt: "3deg",
    anim: "animate-float-med",
  },
  {
    label: "20% discount",
    sub: "BiteCart · food",
    cls: "bg-rose-soft text-rose",
    pos: "right-0 bottom-16",
    tilt: "-3deg",
    anim: "animate-float-slow",
  },
];

function Home() {
  const { data: realReferrals = [] } = useQuery({
    queryKey: ["home-all-referrals"],
    queryFn: async () => {
      try {
        const res = await apiGet<{ success: boolean; data: ApiReferral[] }>("/referrals?limit=20");
        if (res?.data && Array.isArray(res.data)) {
          return res.data.map(mapApiReferral);
        }
      } catch {
        // ignore
      }
      return [];
    },
    staleTime: 5_000,
    refetchOnWindowFocus: true,
  });

  const featured = realReferrals.slice(0, 1);
  const medium = realReferrals.slice(1, 3);
  const compact = realReferrals.slice(3, 7);
  const displayTrending = realReferrals.slice(0, 6);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden dotted-paper">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24 lg:px-8">
            <div>
              <span
                className="enter inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold"
                style={{ ["--reveal-delay" as string]: "60ms" }}
              >
                <Sparkles className="size-3.5 text-primary" /> 547 referrals posted this month
              </span>
              <h1
                className="enter mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-tight md:text-7xl"
                style={{ ["--reveal-delay" as string]: "140ms" }}
              >
                Find referrals.
                <br />
                <span className="relative inline-block">
                  Share benefits.
                  <span className="absolute -bottom-1 left-0 h-3 w-full -rotate-1 rounded bg-primary/25" />
                </span>
              </h1>
              <p
                className="enter mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
                style={{ ["--reveal-delay" as string]: "220ms" }}
              >
                Referral links and codes people actually posted — organised by category, checked by
                the community, and one click from your clipboard. No more digging through group
                chats.
              </p>
              <div
                className="enter mt-8 flex flex-wrap gap-3"
                style={{ ["--reveal-delay" as string]: "300ms" }}
              >
                <Link
                  to="/discover"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground press"
                  style={{ boxShadow: "4px 4px 0 var(--ink)" }}
                >
                  Explore referrals <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/post"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-card px-6 py-3.5 text-base font-semibold press"
                >
                  Share a referral
                </Link>
              </div>
              <p
                className="enter mt-5 text-sm text-muted-foreground"
                style={{ ["--reveal-delay" as string]: "360ms" }}
              >
                Free to browse · no signup needed to copy a code
              </p>
            </div>

            <div
              className="enter relative w-full md:h-[460px]"
              style={{ ["--reveal-delay" as string]: "260ms" }}
            >
              {/* mobile / tablet: tidy stacked grid */}
              <div className="grid grid-cols-2 gap-3 md:hidden">
                {heroCards.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-2xl border border-foreground/15 bg-card p-4 shadow-card card-lift"
                  >
                    <span
                      className={`inline-grid size-9 place-items-center rounded-lg ${c.cls} font-bold`}
                    >
                      <Gift className="size-4" />
                    </span>
                    <p className="mt-3 font-display text-lg font-bold leading-tight">{c.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.sub}</p>
                  </div>
                ))}
              </div>

              {/* desktop: floating collage */}
              <div className="relative hidden h-full md:block">
                <div className="absolute inset-6 rounded-[2rem] bg-primary/8" />
                {heroCards.map((c) => (
                  <div
                    key={c.label}
                    className={`absolute ${c.pos} ${c.anim} w-56 rounded-2xl border border-foreground/15 bg-card p-4 shadow-lift transition-shadow duration-300 hover:shadow-card`}
                    style={{ ["--tilt" as string]: c.tilt, transform: `rotate(${c.tilt})` }}
                  >
                    <span
                      className={`inline-grid size-9 place-items-center rounded-lg ${c.cls} font-bold`}
                    >
                      <Gift className="size-4" />
                    </span>
                    <p className="mt-3 font-display text-xl font-bold">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.sub}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold">
                      <Copy className="size-3" /> Copy referral
                    </span>
                  </div>
                ))}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-2deg]"
                  aria-hidden
                >
                  <BenefitBadge size="lg">Invite benefit</BenefitBadge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community strip */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              ["12,400+", "referrals shared"],
              ["68,900", "codes copied"],
              ["8", "curated categories"],
              ["94%", "reported as working"],
            ].map(([v, l], i) => (
              <Reveal key={l} delay={i * 70} className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold">{v}</span>
                <span className="text-sm text-muted-foreground">{l}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Featured right now"
              title="Hand-picked referrals worth your click"
              action={{ to: "/discover", label: "See all" }}
            />
            <div className="mt-10 grid auto-rows-fr items-stretch gap-5 lg:grid-cols-3">
              <Reveal className="flex lg:col-span-2 lg:row-span-2">
                {featured.map((r) => (
                  <ReferralCard
                    key={r.id}
                    referral={r}
                    variant="featured"
                    className="h-full w-full"
                  />
                ))}
              </Reveal>
              {medium.map((r, i) => (
                <Reveal key={r.id} delay={80 + i * 80} className="flex">
                  <ReferralCard referral={r} className="w-full" />
                </Reveal>
              ))}
            </div>
            {compact.length > 0 && (
              <div className="mt-5 grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {compact.map((r, i) => (
                  <Reveal key={r.id} delay={i * 70} className="flex">
                    <ReferralCard referral={r} variant="compact" className="w-full" />
                  </Reveal>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Categories */}
        <section id="categories" className="border-y border-border bg-card py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Browse by category"
              title="Start where you were already looking"
            />
            <div className="mt-10 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((c, i) => (
                <Reveal key={c.slug} delay={(i % 4) * 70} className="flex">
                  <Link
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className={`group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-foreground/12 p-6 card-lift ${c.soft}`}
                  >
                    <span className="text-3xl">{c.emoji}</span>
                    <div className="mt-8">
                      <h3 className="text-lg font-bold">{c.name}</h3>
                      <p className="mt-1 text-sm text-foreground/60">{c.blurb}</p>
                      <p
                        className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${c.accent}`}
                      >
                        {c.count} referrals{" "}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHead eyebrow="How it works" title="Three steps, no account required to start" />
          <div className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Discover",
                body: "Search or browse by category and see what people are actually offering right now.",
              },
              {
                icon: Copy,
                title: "Copy",
                body: "Check the conditions, then copy the code or link. It stays hidden until you do.",
              },
              {
                icon: BadgeCheck,
                title: "Benefit",
                body: "Claim the reward at signup. Both you and the person who posted it win.",
              },
            ].map((s, i) => (
              <Reveal
                key={s.title}
                delay={i * 90}
                className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card card-lift"
              >
                <span className="absolute right-6 top-5 font-display text-5xl font-extrabold text-foreground/6">
                  0{i + 1}
                </span>
                <span className="inline-grid size-12 place-items-center rounded-xl border-2 border-foreground bg-primary text-primary-foreground">
                  <s.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Trending */}
        {displayTrending.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Trending this week"
              title="What everyone is copying"
              action={{ to: "/discover", label: "Browse all" }}
            />
            <div className="mt-10 flex flex-col gap-4">
              {displayTrending.map((r, i) => (
                <Reveal key={r.id} delay={Math.min(i, 4) * 60}>
                  <ReferralCard referral={r} variant="list" />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { to: "/discover"; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h2 className="mt-2 max-w-xl text-3xl font-bold leading-tight md:text-4xl">{title}</h2>
      </div>
      {action && (
        <Link
          to={action.to}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold press hover:bg-secondary"
        >
          {action.label} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
