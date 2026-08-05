# Eso Es Content Planner

Interactive content planning dashboard for Eso Es.

## Features

* 30 social media posts
* Ripple posts
* Gotcha posts
* Frother posts
* WSUP posts
* Presentation Mode
* Filtering by category

## Cool Beans — publishing queue

This repo also hosts the ESO ES automated social publishing engine ("Cool
Beans"): Supabase-backed content queue → Netlify Scheduled Function →
Instagram/Facebook adapters. See `supabase/migrations/`, `src/adapters/`,
`src/lib/`, and `netlify/functions/`.

Status flow: `draft` → `approved` → `scheduled` → `publishing` →
`published` (or `failed`, which retries automatically up to
`max_retries` before staying `failed`). "Publish Now" claims a post and
runs it through the same pipeline immediately, bypassing `scheduled_at`.

### Environment variables

Set these in Netlify (Site configuration → Environment variables) — never
commit real values. Nothing in this repo reads secrets from anywhere but
`process.env`.

| Variable | Used by | Where to get it |
|---|---|---|
| `SUPABASE_URL` | Netlify Functions | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Netlify Functions | Supabase project → Settings → API (service_role — server-side only) |
| `SUPABASE_PUBLISHABLE_KEY` | Dashboard (client-side) | Supabase project → Settings → API (anon/publishable) |
| `FACEBOOK_PAGE_ID` | Facebook adapter | Meta Business Suite → Page settings |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Facebook + Instagram adapters | Meta Graph API Explorer (long-lived Page token) |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Instagram adapter | Graph API: `GET /{facebook-page-id}?fields=instagram_business_account` |
| `DASHBOARD_API_SECRET` | `publish-now` function | Generate any random string; the dashboard sends it as `x-dashboard-secret` |
| `ANTHROPIC_API_KEY` | `generate.js` (existing content generator) | console.anthropic.com |

### Seeding the queue

Once the Supabase project + schema exist:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:queue
```

Imports the existing 30 posts from `data/posts.json` as `draft` rows
(no `image_url` yet — graphics are still produced in Canva per
`exports/setup-guide.md` until that step is automated).
