import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, Rows3, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  benefitTypes,
  categories,
  referrals,
  type BenefitType,
  type CategorySlug,
} from "@/lib/referrals";
import { ReferralCard } from "./referral-card";

const suggestions = [
  "₹500 cashback",
  "free month",
  "food delivery",
  "developer tools",
  "travel credit",
  "verified",
];

type Sort = "newest" | "popular";

export function ResultsExplorer({
  initialQuery = "",
  lockedCategory,
  showSearch = true,
}: {
  initialQuery?: string;
  lockedCategory?: CategorySlug;
  showSearch?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategorySlug | "all">(lockedCategory ?? "all");
  const [benefit, setBenefit] = useState<BenefitType | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = referrals.filter((r) => {
      if (lockedCategory && r.category !== lockedCategory) return false;
      if (!lockedCategory && category !== "all" && r.category !== category) return false;
      if (benefit !== "all" && r.benefitType !== benefit) return false;
      if (verifiedOnly && !r.trust.includes("verified")) return false;
      if (!q) return true;
      return (
        r.service.toLowerCase().includes(q) ||
        r.benefit.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.category.includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
    return sort === "popular"
      ? list.sort((a, b) => b.popularity - a.popularity)
      : list.sort((a, b) => b.copies / 5000 + (b.trust.length - a.trust.length) - a.copies / 5000);
  }, [query, category, benefit, verifiedOnly, sort, lockedCategory]);

  const signature = `${query}|${category}|${benefit}|${verifiedOnly}|${sort}`;
  const [shown, setShown] = useState(results);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setPhase("out");
    const t = setTimeout(() => {
      setShown(results);
      setPhase("in");
    }, 140);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const reset = () => {
    setQuery("");
    setBenefit("all");
    setVerifiedOnly(false);
    if (!lockedCategory) setCategory("all");
  };

  return (
    <div>
      {showSearch && (
        <div className="rounded-2xl border border-foreground/15 bg-card p-5 shadow-card md:p-7">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, services or benefits..."
              className="h-14 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-base outline-none transition-[box-shadow,border-color] duration-300 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30 md:h-16 md:text-lg"
            />
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Try
            </span>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium press hover:border-foreground/40 hover:bg-secondary"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-2 pb-3 text-sm font-semibold">
            <SlidersHorizontal className="size-4" /> Filters
          </div>

          {!lockedCategory && (
            <FilterGroup title="Category">
              <FilterPill active={category === "all"} onClick={() => setCategory("all")}>
                All categories
              </FilterPill>
              {categories.map((c) => (
                <FilterPill
                  key={c.slug}
                  active={category === c.slug}
                  onClick={() => setCategory(c.slug)}
                >
                  <span className="mr-1">{c.emoji}</span>
                  {c.name}
                </FilterPill>
              ))}
            </FilterGroup>
          )}

          <FilterGroup title="Benefit type">
            <FilterPill active={benefit === "all"} onClick={() => setBenefit("all")}>
              Any benefit
            </FilterPill>
            {benefitTypes.map((b) => (
              <FilterPill
                key={b.value}
                active={benefit === b.value}
                onClick={() => setBenefit(b.value)}
              >
                {b.label}
              </FilterPill>
            ))}
          </FilterGroup>

          <FilterGroup title="Trust">
            <FilterPill active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>
              Verified only
            </FilterPill>
          </FilterGroup>

          <button
            type="button"
            onClick={reset}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <X className="size-3" /> Clear filters
          </button>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{results.length}</span> referrals
              {query && (
                <>
                  {" "}
                  for <span className="font-semibold text-foreground">“{query}”</span>
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-border bg-card p-0.5">
                {(["newest", "popular"] as Sort[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSort(s)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                      sort === s
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {s === "newest" ? "Newest" : "Most popular"}
                  </button>
                ))}
              </div>
              <div className="flex rounded-lg border border-border bg-card p-0.5">
                <button
                  type="button"
                  aria-label="Grid view"
                  onClick={() => setView("grid")}
                  className={cn(
                    "rounded-md p-1.5 transition-colors duration-200",
                    view === "grid"
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  onClick={() => setView("list")}
                  className={cn(
                    "rounded-md p-1.5 transition-colors duration-200",
                    view === "list"
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Rows3 className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {shown.length === 0 ? (
            <div className="results-swap" data-phase={phase}>
              <div className="result-item rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-2xl">
                  🔍
                </div>
                <h3 className="mt-4 text-xl font-bold">Nothing matches that yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Try a broader search, or drop the filters. You can also post the referral you were
                  hoping to find.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="press mt-5 rounded-lg border-2 border-foreground bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Reset search
                </button>
              </div>
            </div>
          ) : view === "grid" ? (
            <div
              className="results-swap grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3"
              data-phase={phase}
            >
              {shown.map((r, i) => (
                <div
                  key={r.id}
                  className="result-item flex"
                  style={{ ["--item-delay" as string]: `${Math.min(i, 8) * 25}ms` }}
                >
                  <ReferralCard referral={r} className="w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="results-swap flex flex-col gap-4" data-phase={phase}>
              {shown.map((r, i) => (
                <div
                  key={r.id}
                  className="result-item"
                  style={{ ["--item-delay" as string]: `${Math.min(i, 8) * 25}ms` }}
                >
                  <ReferralCard referral={r} variant="list" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 border-t border-border pt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5 lg:flex-col lg:items-start">{children}</div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-2.5 py-1.5 text-left text-xs font-medium transition-all duration-200 active:scale-[0.98] lg:w-full",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
