import { createFileRoute } from "@tanstack/react-router";
import { getRequestOrigin } from "@/lib/origin.functions";
import { z } from "zod";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ResultsExplorer } from "@/components/referral/results-explorer";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/discover")({
  validateSearch: searchSchema,
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => ({
    meta: [
      { title: "Discover referral codes and links — Refova" },
      {
        name: "description",
        content:
          "Search, filter and sort community-posted referral links and codes across finance, food, travel, developer tools and more.",
      },
      { property: "og:title", content: "Discover referral codes and links — Refova" },
      {
        property: "og:description",
        content: "Search and filter referral offers posted by real people, then copy the code in one click.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/discover" },
      { property: "og:image", content: `${loaderData?.origin ?? ""}/og/discover.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Discover referral codes and links — Refova" },
      {
        name: "twitter:description",
        content: "Search and filter referral offers posted by real people, then copy the code in one click.",
      },
      { name: "twitter:image", content: `${loaderData?.origin ?? ""}/og/discover.jpg` },
    ],
    links: [{ rel: "canonical", href: "/discover" }],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const { q } = Route.useSearch();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="enter max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Discover</p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.05] md:text-5xl">
            Every referral worth using, in one searchable place.
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            No more scrolling WhatsApp groups or dead Reddit threads. Filter by category, benefit and trust — then copy
            what you need.
          </p>
        </div>

        <div className="enter mt-10" style={{ ["--reveal-delay" as string]: "120ms" }}>
          <ResultsExplorer key={q ?? ""} initialQuery={q ?? ""} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
