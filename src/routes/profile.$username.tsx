import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award, CalendarDays, Copy, Share2 } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ReferralCard } from "@/components/referral/referral-card";
import { referrals } from "@/lib/referrals";
import { useSaved } from "@/lib/saved";
import { cn } from "@/lib/utils";

const bios: Record<string, { bio: string; since: string }> = {
  aditya: { bio: "Collects fintech referrals, tests every one before posting.", since: "March 2024" },
  mira: { bio: "Product designer. Mostly SaaS and design tool invites.", since: "July 2024" },
  kabir: { bio: "Backend dev. Hosting credits, databases, dev tooling.", since: "January 2024" },
  neha: { bio: "Food-first. Delivery, groceries and the odd snack box.", since: "October 2024" },
  ravi: { bio: "Books too many trips. Travel and cab referrals.", since: "May 2024" },
  isha: { bio: "Learning something new every quarter. Courses and test prep.", since: "February 2025" },
  tara: { bio: "Shopping deals, sale hunting, honest reviews.", since: "August 2025" },
  arun: { bio: "Streaming, music and games — invites that actually work.", since: "June 2024" },
  sana: { bio: "Freelancer. Banking and invoicing tools I actually use.", since: "November 2023" },
  dev: { bio: "New here. Sharing whatever I find useful.", since: "June 2026" },
};

export const Route = createFileRoute("/profile/$username")({
  loader: ({ params }) => {
    const posted = referrals.filter((r) => r.postedBy.username === params.username);
    // Allow profiles for users who haven't posted any referrals yet
    // (e.g. a freshly signed-up user). The page's existing empty-state handles zero results.
    const person = posted[0]?.postedBy ?? {
      username: params.username,
      name: params.username.charAt(0).toUpperCase() + params.username.slice(1),
      initials: params.username.slice(0, 2).toUpperCase(),
      trustScore: 0,
    };
    return { username: params.username, person, posted };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Member unavailable — Refova" }, { name: "robots", content: "noindex" }] };
    }
    const { person, posted } = loaderData;
    const title = `${person.name} — referrals shared on Refova`;
    const description = `${person.name} has shared ${posted.length} referrals with a trust score of ${person.trustScore}. Browse their active, past and saved referrals on Refova.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProfilePage,
});

const tabs = ["active", "past", "saved"] as const;

function ProfilePage() {
  const { username, person, posted } = Route.useLoaderData();
  const { saved } = useSaved();
  const [tab, setTab] = useState<(typeof tabs)[number]>("active");

  const meta = bios[username] ?? { bio: "Sharing referrals with the community.", since: "2025" };
  const totalCopies = posted.reduce((n, r) => n + r.copies, 0);
  const list =
    tab === "active"
      ? posted.filter((r) => r.status === "active")
      : tab === "past"
        ? posted.filter((r) => r.status === "past")
        : referrals.filter((r) => saved.includes(r.id));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-8 rounded-2xl border border-foreground/15 bg-card p-7 shadow-card md:grid-cols-[auto_1fr_auto] md:items-center md:p-10">
          <div className="grid size-24 place-items-center rounded-2xl border-2 border-foreground bg-amber-soft font-display text-3xl font-extrabold">
            {person.initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold md:text-4xl">{person.name}</h1>
              {posted.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-soft px-3 py-1 text-xs font-semibold text-leaf">
                  <Award className="size-3.5" /> Helpful contributor
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">@{username}</p>
            <p className="mt-3 max-w-lg text-base">{meta.bio}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" /> Member since {meta.since}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:text-right">
            <Stat value={posted.length} label="Referrals shared" />
            <Stat value={totalCopies.toLocaleString("en-IN")} label="Copies" icon />
            <Stat value={person.trustScore} label="Trust score" />
          </div>
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-semibold capitalize transition-colors",
                tab === t
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t} referrals
            </button>
          ))}
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium"
          >
            <Share2 className="size-4" /> Share profile
          </button>
        </div>

        <div className="mt-6">
          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <h2 className="text-xl font-bold">
                {tab === "saved" ? "No saved referrals yet" : `No ${tab} referrals`}
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                {tab === "saved"
                  ? "Tap the bookmark icon on any referral to keep it here for later."
                  : "Nothing in this tab right now."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((r) => (
                <ReferralCard key={r.id} referral={r} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ value, label, icon }: { value: string | number; label: string; icon?: boolean }) {
  return (
    <div>
      <p className="inline-flex items-center gap-1.5 font-display text-2xl font-bold">
        {icon && <Copy className="size-4 text-muted-foreground" />}
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
