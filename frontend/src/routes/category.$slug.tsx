import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ResultsExplorer } from "@/components/referral/results-explorer";
import { categoryBySlug, type CategorySlug } from "@/lib/referrals";

const SITE_URL = "https://refova.vercel.app";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = categoryBySlug[params.slug as CategorySlug];
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Category unavailable — Refova" }, { name: "robots", content: "noindex" }],
      };
    }
    const { category } = loaderData;
    const title = `${category.name} referrals — browse and copy · Refova`;
    const description = `${category.count} community-posted ${category.name.toLowerCase()} referral codes and links. ${category.blurb}.`;
    const url = `${SITE_URL}/category/${category.slug}`;
    const ogImage = `${SITE_URL}/og-image.jpg`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:site_name", content: "Refova" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { property: "og:image:secure_url", content: ogImage },
        { property: "og:image:type", content: "image/jpeg" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "627" },
        { property: "og:image:alt", content: title },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
        { name: "twitter:image:alt", content: title },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/discover"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All referrals
        </Link>
        <div className={`enter mt-6 rounded-2xl border border-foreground/15 p-8 ${category.soft}`}>
          <span className="text-3xl">{category.emoji}</span>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">{category.name}</h1>
          <p className="mt-2 max-w-xl text-base text-foreground/70">{category.blurb}</p>
          <p className="mt-4 text-sm font-semibold">Live community referrals</p>
        </div>

        <div className="mt-10">
          <ResultsExplorer lockedCategory={category.slug} showSearch={false} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
