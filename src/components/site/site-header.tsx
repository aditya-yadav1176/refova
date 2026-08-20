import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "./wordmark";

const nav = [
  { to: "/discover", label: "Discover" },
  { to: "/#categories", label: "Categories", hash: true },
  { to: "/#how-it-works", label: "How it works", hash: true },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/discover", search: { q: q || undefined } });
    setOpen(false);
  };

  return (
    <header className="enter sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Refova home" className="press flex shrink-0 items-center">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) =>
            item.hash ? (
              <a
                key={item.label}
                href={item.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                activeProps={{ className: "text-foreground bg-secondary" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden items-center lg:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search referrals…"
              className="h-10 w-56 rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition-[width,box-shadow,border-color] duration-300 focus:w-72 focus:border-foreground/30 focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </form>

        <div className={cn("hidden items-center gap-2 md:flex", "lg:ml-3 ml-auto lg:ml-3")}>
          <Link
            to="/profile/$username"
            params={{ username: "aditya" }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            to="/post"
            className="rounded-lg border-2 border-foreground bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground press"
            style={{ boxShadow: "3px 3px 0 var(--ink)" }}
          >
            Post a referral
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="press ml-auto grid size-10 place-items-center rounded-lg border border-border hover:bg-secondary md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-border bg-background px-4 py-4 md:hidden">
          <form onSubmit={submit} className="mb-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search referrals…"
              className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-foreground/30 focus:ring-2 focus:ring-ring/30"
            />
          </form>
          <div className="flex flex-col gap-1">
            <Link to="/discover" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              Discover
            </Link>
            <a href="/#categories" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              Categories
            </a>
            <a href="/#how-it-works" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              How it works
            </a>
            <Link
              to="/post"
              onClick={() => setOpen(false)}
              className="press mt-2 rounded-lg border-2 border-foreground bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
            >
              Post a referral
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
