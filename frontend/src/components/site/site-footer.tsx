import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Star, Tag, Users } from "lucide-react";
import { categories } from "@/lib/referrals";
import { Wordmark } from "./wordmark";
import { cn } from "@/lib/utils";

interface SiteFooterProps {
  hideCta?: boolean;
}

export function SiteFooter({ hideCta = false }: SiteFooterProps) {
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const [wordmarkVisible, setWordmarkVisible] = useState(false);

  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setWordmarkVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setWordmarkVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="relative mt-8 sm:mt-12 bg-background pb-6 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ─── 1. CLOSING CTA (Two-intent + floating badges) ─── */}
        {!hideCta && (
          <div className="mb-10 sm:mb-14 md:mb-16">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#EBDDCF]/80 bg-[#FDFBF7] p-8 shadow-card sm:p-10 md:p-12 lg:px-14 lg:py-12">
              {/* Subtle ambient gradient highlights */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-primary/8 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -left-16 size-80 rounded-full bg-amber/10 blur-3xl"
              />

              <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
                {/* Left side: editorial content */}
                <div>
                  {/* Decorative ribbon loop doodle */}
                  <svg
                    aria-hidden
                    className="mb-3 size-7 text-primary sm:mb-4"
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-3-2-5-5-3-8s6 1 10 5c4-4 8-8 10-5s0 6-3 8" />
                    <path d="M16 16c-2 4-5 9-7 11" />
                    <path d="M16 16c2 4 5 9 7 11" />
                  </svg>

                  {/* Headline in Refova display typography */}
                  <h2 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-[#221C18] sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                    <span className="block">Have a referral worth sharing?</span>
                    <span className="mt-1 block font-bold text-muted-foreground sm:mt-1.5">
                      Or looking for one worth using?
                    </span>
                  </h2>

                  {/* Action buttons: filled primary + outlined secondary */}
                  <div className="mt-7 flex flex-wrap items-center gap-3.5 sm:gap-5">
                    <Link
                      to="/post"
                      className="press inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-primary/95"
                    >
                      Post a referral <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      to="/discover"
                      className="group inline-flex items-center gap-2 rounded-full border-2 border-foreground/80 px-6 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-foreground hover:bg-foreground hover:text-background"
                    >
                      <span>Find a referral</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Right side: floating tilted visual cards & thread loop */}
                <div
                  aria-hidden
                  className="relative hidden items-center justify-center md:flex md:h-52 lg:h-60"
                >
                  {/* Decorative background looping thread */}
                  <svg
                    className="pointer-events-none absolute inset-0 size-full text-foreground/15"
                    viewBox="0 0 300 200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path
                      d="M20,120 C70,40 180,30 250,90 C300,140 220,180 150,150 C90,120 130,50 200,60"
                      strokeDasharray="4 4"
                    />
                  </svg>

                  {/* Sparkle burst at top right */}
                  <div className="pointer-events-none absolute right-4 top-2 flex gap-1 text-primary">
                    <span className="block h-3.5 w-0.5 rotate-[-25deg] rounded-full bg-primary" />
                    <span className="block h-4 w-0.5 translate-y-[-2px] rounded-full bg-primary" />
                    <span className="block h-3.5 w-0.5 rotate-[25deg] rounded-full bg-primary" />
                  </div>

                  {/* Floating card 1: Save more */}
                  <div className="absolute right-8 top-4 flex rotate-3 items-center gap-2.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 shadow-card transition-transform hover:rotate-0">
                    <span className="grid size-7 place-items-center rounded-lg bg-leaf-soft text-leaf">
                      <Tag className="size-3.5" />
                    </span>
                    <span className="font-sans text-xs font-bold text-foreground">Save more</span>
                  </div>

                  {/* Floating card 2: Better deals */}
                  <div className="absolute left-6 top-16 flex -rotate-3 items-center gap-2.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 shadow-card transition-transform hover:rotate-0">
                    <span className="grid size-7 place-items-center rounded-lg bg-rose-soft text-primary">
                      <Star className="size-3.5 fill-current" />
                    </span>
                    <span className="font-sans text-xs font-bold text-foreground">
                      Better deals
                    </span>
                  </div>

                  {/* Floating card 3: Real people */}
                  <div className="absolute bottom-4 right-14 flex rotate-1 items-center gap-2.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 shadow-card transition-transform hover:rotate-0">
                    <span className="grid size-7 place-items-center rounded-lg bg-grape-soft text-grape">
                      <Users className="size-3.5" />
                    </span>
                    <span className="font-sans text-xs font-bold text-foreground">Real people</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── 2. NORMAL FOOTER LINKS (Tightened spacing) ─── */}
        <div className="grid gap-8 pb-8 sm:grid-cols-2 md:grid-cols-12 md:gap-8 md:pb-10">
          {/* Brand info */}
          <div className="sm:col-span-2 md:col-span-5">
            <Link to="/" className="inline-block transition-opacity hover:opacity-90">
              <Wordmark size="md" />
            </Link>
            <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A calmer place for referral links and codes — posted by people, checked by the
              community, easy to copy.
            </p>
          </div>

          {/* Browse Categories */}
          <div className="md:col-span-3">
            <h4 className="font-display text-sm font-semibold text-foreground">Explore</h4>
            <ul className="mt-3.5 space-y-2 text-sm text-muted-foreground">
              {categories.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="transition-colors hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="md:col-span-2">
            <h4 className="font-display text-sm font-semibold text-foreground">Platform</h4>
            <ul className="mt-3.5 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/discover" className="transition-colors hover:text-foreground">
                  Discover referrals
                </Link>
              </li>
              <li>
                <Link to="/post" className="transition-colors hover:text-foreground">
                  Post a referral
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="transition-colors hover:text-foreground">
                  How it works
                </a>
              </li>
            </ul>
          </div>

          {/* More / Account */}
          <div className="md:col-span-2">
            <h4 className="font-display text-sm font-semibold text-foreground">More</h4>
            <ul className="mt-3.5 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/login" className="transition-colors hover:text-foreground">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/signup" className="transition-colors hover:text-foreground">
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── 3. GIANT REFOVA WORDMARK (Display Typography + Tight Proximity) ─── */}
        <div ref={wordmarkRef} className="overflow-hidden pt-2 text-center md:pt-4">
          <div
            className={cn(
              "transform select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              wordmarkVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
          >
            <span className="block font-display text-[clamp(3.5rem,14.5vw,13.8rem)] font-black leading-[0.84] tracking-[-0.05em] text-[#221C18] uppercase">
              REFOVA
              <span className="inline-block size-[0.14em] rounded-full bg-primary align-baseline" />
            </span>
          </div>
        </div>

        {/* ─── 4. BOTTOM BAR (Seamless, no extra thick divider) ─── */}
        <div className="mt-3 flex flex-col items-center justify-between gap-2.5 pt-3 text-xs text-muted-foreground sm:flex-row md:mt-4">
          <p>© 2026 Refova</p>
          <p>
            Designed &amp; developed by{" "}
            <a
              href="https://yadavaditya.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Aditya
            </a>{" "}
            &amp;{" "}
            <a
              href="https://harshittripathi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Harshit
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
