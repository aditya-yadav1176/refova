import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/referrals";
import { Wordmark } from "./wordmark";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A calmer place for referral links and codes — posted by people, checked by the
            community, easy to copy.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Browse</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
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

        <div>
          <h4 className="text-sm font-semibold">Platform</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
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
              <Link
                to="/profile/$username"
                params={{ username: "aditya" }}
                className="transition-colors hover:text-foreground"
              >
                Your profile
              </Link>
            </li>
            <li>
              <a href="/#how-it-works" className="transition-colors hover:text-foreground">
                How it works
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Good to know</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Community guidelines</li>
            <li>How verification works</li>
            <li>Report a referral</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        Refova · prototype concept · All companies, referrals and members shown here are fictional.
      </div>
    </footer>
  );
}
