# Referral Discovery Platform — Frontend Prototype

A high-fidelity, frontend-only concept site for discovering, sharing, and managing referral links and codes. Mock data only, no backend. Unnamed platform throughout (logo mark is an abstract glyph, no wordmark brand).

## Visual system

- Warm cream/off-white background, near-black text, one bright accent for CTAs (warm coral-orange), plus muted secondary accents (purple, green, blue, amber) used only for category identity.
- Typography: expressive bold display face for headings, clean grotesk for UI/body. Large hero type, strong hierarchy.
- Cards: medium radius (not pill-soft), thin borders, soft layered shadows, occasional sticker/badge/tape-style accents rotated slightly for an editorial, hand-curated feel.
- Motion: card lift on hover, gentle float on hero cards, press states, copy-to-success transition, save-icon pop. Restrained, never decorative noise.
- All colors as semantic tokens in `src/styles.css`; no hardcoded color utilities.

## Pages

1. **Home (`/`)** — navbar (Discover, Categories, How it Works, Post a Referral CTA, search, Login/Sign Up), hero with headline "Find referrals. Share benefits." and floating referral cards, community strip, featured referrals in an asymmetric grid (1 large + 2 medium + compact row), browse-by-category, 3-step how it works (Discover → Copy → Benefit), trending referrals, share-your-referral CTA band, footer.
2. **Discover (`/discover`)** — big search input with suggestion tags, filter rail (category, benefit type, verified) plus sort (newest / most popular), grid/list view toggle, results built from mock data with real client-side filtering, and a designed empty state.
3. **Referral detail (`/referral/$id`)** — identity area, large benefit statement, tags, full explanation, conditions, blurred/protected code panel revealed on copy, big Copy button with Copied! success + toast, share and save, poster profile, engagement stats, report link, similar referrals below.
4. **Post a referral (`/post`)** — sectioned form (service, category, benefit, description, link/code, terms, expiry, optional proof) with a live sticky card preview on desktop, and a polished success state after publish.
5. **Profile (`/profile/$username`)** — avatar, username, bio, member since, stats, trust badge, tabs for Active / Past / Saved referrals using profile-adapted cards.
6. **Category listing (`/category/$slug`)** — reuses the discover results layout scoped to one category (reached from category cards).

## Components

- `ReferralCard` with `featured | standard | compact | list` variants, one design language.
- `BenefitBadge` (₹500 OFF, 1 MONTH FREE, ₹1,000 REWARD, 20% DISCOUNT) — visually loud.
- `TrustBadge` (Verified, Community Trusted, New, Expiring Soon) — used sparingly.
- `CopyButton` (icon → success state → toast via sonner).
- `SaveButton` (bookmark toggle with pop animation, state held in a small client store).
- Shared `SiteHeader` / `SiteFooter`, filter controls, category tile, empty state, section headers.

## Data & state

- Single mock dataset (~24 referrals across Finance, Shopping, Food, Travel, Education, Productivity, Dev Tools, Entertainment) with realistic Indian-market benefit copy, posters, timestamps, verification, and engagement counts.
- Saved referrals and posted-referral drafts live in React state/localStorage only. No database, no auth.

## Technical notes

- TanStack Start file routes under `src/routes/`; each page gets its own `head()` metadata.
- Tailwind v4 tokens in `src/styles.css` (`@theme inline`), fonts loaded via `<link>` in `__root.tsx`.
- Motion for React for hero float, hover lift, and copy/save transitions; sonner Toaster mounted once in `__root.tsx`.
- A few generated illustration/logo-placeholder assets under `src/assets/` for category tiles and hero texture.
