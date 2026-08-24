# Social previews (og / twitter) — Refova

## What each route ships

| Route           | Title                                          | Image              |
| --------------- | ---------------------------------------------- | ------------------ |
| `/`             | Refova — find referrals, share benefits        | `/og/home.jpg`     |
| `/discover`     | Discover referral codes and links — Refova     | `/og/discover.jpg` |
| `/post`         | Post a referral and share the benefit — Refova | `/og/post.jpg`     |
| `/referral/$id` | `<Service> referral — <benefit> · Refova`      | `/og/referral.jpg` |

Every one of these routes sets `og:title`, `og:description`, `og:type`,
`og:url`, `og:image`, `twitter:card=summary_large_image`, `twitter:title`,
`twitter:description`, `twitter:image`, and a self-referencing `canonical`.
Sitewide defaults (`og:site_name`, charset, viewport) live in `__root.tsx`.

Images are 1200×630 JPEG in `public/og/` and are served as static files.
`og:image` / `twitter:image` are absolute URLs, built at request time by
`getRequestOrigin()` (`src/lib/origin.functions.ts`), so they resolve
correctly on preview, published, and custom-domain hosts without hardcoding.

## Verify locally

```bash
curl -s https://<your-domain>/discover | grep -aoE '<meta[^>]*(og:|twitter:)[^>]*>'
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' https://<your-domain>/og/discover.jpg
```

Expect one unique title/description per route and `200 image/jpeg` for
each image.

## Forcing a re-scrape

Crawlers cache the preview they last fetched, so an updated tag or image
will not appear in already-shared links until you refresh it.

- **Facebook / Instagram / WhatsApp** — Sharing Debugger:
  https://developers.facebook.com/tools/debug/ → paste the URL → **Scrape Again**.
  WhatsApp uses the same cache, so this fixes WhatsApp link cards too.
- **LinkedIn** — Post Inspector: https://www.linkedin.com/post-inspector/ →
  paste URL → **Inspect** (it re-scrapes on every inspection).
- **X / Twitter** — the Card Validator is retired. Post the link in a draft
  or DM to trigger a fresh fetch; cache expires on its own within ~7 days.
  Adding a harmless query param (`?v=2`) forces a new fetch immediately.
- **Slack** — the unfurl cache is ~30 min. Post `<url>?v=2`, or remove and
  re-post the link after the cache expires.
- **Discord** — cache is roughly 24h per URL; a `?v=2` param bypasses it.
- **Telegram** — message [@WebpageBot](https://t.me/webpagebot) with the URL
  to refresh its preview.
- **Google** — Search Console → URL Inspection → **Request indexing**.

Tip: when you change an image, publishing it under a new filename
(`home-v2.jpg`) sidesteps every image-level CDN and crawler cache.
