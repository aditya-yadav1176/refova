import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, Rows3, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  benefitTypes,
  categories,
  mapApiReferral,
  type ApiReferral,
  type BenefitType,
  type CategorySlug,
  type Referral,
} from "@/lib/referrals";
import { apiGet } from "@/lib/api";
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
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategorySlug | "all">(lockedCategory ?? "all");
  const [benefit, setBenefit] = useState<BenefitType | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  // Debounce search query by 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Build API query string
  const apiPath = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("search", debouncedQuery);
    if (lockedCategory) params.set("category", lockedCategory);
    else if (category !== "all") params.set("category", category);
    if (sort) params.set("sort", sort === "newest" ? "latest" : "popular");
    params.set("limit", "100");
    return `/referrals?${params.toString()}`;
  }, [debouncedQuery, category, sort, lockedCategory]);

  // Fetch only from real API
  const { data: apiData = [], isLoading } = useQuery({
    queryKey: ["referrals", apiPath],
    queryFn: async () => {
      try {
        const resp = await apiGet<{ success: boolean; data: ApiReferral[] }>(apiPath);
        if (resp && resp.success && Array.isArray(resp.data)) {
          return resp.data.map(mapApiReferral);
        }
      } catch (err) {
        console.error("Failed to load referrals from backend:", err);
      }
      return [] as Referral[];
    },
    placeholderData: (prev) => prev,
    staleTime: 5_000,
    refetchOnWindowFocus: true,
  });

  const results = useMemo(() => {
    let list = apiData;
    if (benefit !== "all") list = list.filter((r) => r.benefitType === benefit);
    if (verifiedOnly) list = list.filter((r) => r.trust.includes("verified"));
    return list;
  }, [apiData, benefit, verifiedOnly]);

  const [shown, setShown] = useState(results);
  const [phase, setPhase] = useState<"in" | "out">("in");

  // Keep shown synchronized whenever results changes (API resolves, filters toggle, search updates)
  useEffect(() => {
    if (shown.length === 0 && results.length > 0) {
      setShown(results);
      setPhase("in");
      return;
    }
    setPhase("out");
    const t = setTimeout(() => {
      setShown(results);
      setPhase("in");
    }, 120);
    return () => clearTimeout(t);
  }, [results]);

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
              {isLoading ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
                  Loading referrals…
                </span>
              ) : (
                <>
                  <span className="font-semibold text-foreground">{results.length}</span> referrals
                  {query && (
                    <>
                      {" "}
                      for <span className="font-semibold text-foreground">"{query}"</span>
                    </>
                  )}
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

          {isLoading && shown.length === 0 ? (
            <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-56 rounded-2xl border border-foreground/10 bg-card p-6 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-secondary" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 rounded bg-secondary" />
                      <div className="h-3 w-1/2 rounded bg-secondary" />
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-secondary" />
                    <div className="h-3 w-full rounded bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          ) : shown.length === 0 ? (
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
