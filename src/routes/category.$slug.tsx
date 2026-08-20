import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ResultsExplorer } from "@/components/referral/results-explorer";
import { categoryBySlug, type CategorySlug } from "@/lib/referrals";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = categoryBySlug[params.slug as CategorySlug];
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Category unavailable — Refova" }, { name: "robots", content: "noindex" }] };
    }
    const { category } = loaderData;
    const title = `${category.name} referrals — browse and copy · Refova`;
    const description = `${category.count} community-posted ${category.name.toLowerCase()} referral codes and links. ${category.blurb}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
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
          <p className="mt-4 text-sm font-semibold">{category.count} referrals available</p>
        </div>

        <div className="mt-10">
          <ResultsExplorer lockedCategory={category.slug} showSearch={false} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
