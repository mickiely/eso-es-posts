# Montage — Powered by Eso Es

A standalone, interactive sales demonstration of the Eso Es service stack
(Ripple, Gotcha, W'SUP, Frother). Visitors pick a fictional industry —
Barber, Builder, Electrician, or Cafe — and walk through a guided simulation
of a missed call becoming a qualified lead, a staff playbook, and a
follow-up, ending in a summary of the value recovered.

This is a demonstration, not a marketing landing page: it behaves like a
guided product walkthrough, with real interactive choices and state.

Target deployment: `demo.esoes.com.au`

## Project purpose

- Let prospects *experience* the Eso Es stack working inside a business
  like theirs, instead of reading about it.
- One shared app, one industry configuration object — no duplicated pages
  or codebases per industry.
- No login, no backend, no real SMS/calls sent. All data shown is clearly
  labelled as demonstration data.

See `/docs` for the full strategy, industry config reference, sales script,
and future live-integration notes:

- [`docs/demo-strategy.md`](./docs/demo-strategy.md)
- [`docs/industry-config.md`](./docs/industry-config.md)
- [`docs/demo-sales-script.md`](./docs/demo-sales-script.md)
- [`docs/future-live-integrations.md`](./docs/future-live-integrations.md)

## Getting started

```bash
npm install
```

### Dev server

```bash
npm run dev
```

### Production build

```bash
npm run build
```

Outputs static files to `dist/`. Preview the build locally with
`npm run preview`.

## Deploying to Netlify

This is a static Vite build — no backend required.

1. Connect the repository (or this subdirectory) to a new Netlify site.
2. Build settings:
   - **Base directory:** `montage-demo` (if deploying from the monorepo root)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Set the custom domain to `demo.esoes.com.au` in Netlify's domain
   settings, and point the corresponding DNS record (CNAME) at the Netlify
   site.
4. No environment variables are required for v1 — the app has no backend
   dependencies.

## Adding another industry

All industry content lives in `src/config/industries.ts`. To add a new
industry:

1. Copy an existing entry in the `INDUSTRIES` object and edit the business
   name, services, enquiry options, and follow-up content.
2. Add the new id to the `IndustryId` union in `src/types.ts`.
3. Add an icon for it in `src/components/IndustrySelector.tsx`.
4. Run `npm run build` to confirm it type-checks.

Full reference: [`docs/industry-config.md`](./docs/industry-config.md).

## Future integration options

The demo is frontend-only by design for v1. Documented options for a live
version — Twilio (real SMS/calls), Supabase (persistence, real leads),
embedded forms, analytics, and consent-based real SMS demonstrations — are
detailed in [`docs/future-live-integrations.md`](./docs/future-live-integrations.md).
