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
- No login required. The missed-call step can optionally call a live n8n
  webhook for a real generated response; if it's unreachable, the demo
  falls back to local mock data automatically. No real SMS or phone calls
  are ever sent. All data shown is clearly labelled as demonstration data.

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
4. Set the `VITE_N8N_WEBHOOK_URL` environment variable in Netlify's site
   settings if you want the missed-call step to hit a live n8n webhook
   (see "Live webhook integration" below). The demo works fine without it —
   it just always uses local mock data in that case.

## Live webhook integration

The missed-call step (Gotcha) can optionally POST the simulated enquiry to a
live n8n webhook for a real generated response, instead of always using the
local mock data baked into `src/config/industries.ts`.

1. Copy `.env.example` to `.env` and set `VITE_N8N_WEBHOOK_URL` to your n8n
   webhook URL.
2. `.env` is gitignored — never commit real webhook URLs or credentials. Only
   `.env.example` (a placeholder template) is tracked in git.
3. If `VITE_N8N_WEBHOOK_URL` is unset, or the webhook is unreachable, slow
   (8s timeout), or returns an unexpected response, the demo automatically
   falls back to the local mock data for that industry/enquiry. The UI always
   labels which is which ("Live webhook response (demo data)" vs "Demo
   fallback data").

**Request payload** (POST, JSON):

```json
{
  "industryId": "barber",
  "businessName": "Montage Cuts",
  "enquiryId": "...",
  "enquiryLabel": "...",
  "customerReply": "..."
}
```

**Expected response shape** (JSON):

```json
{
  "gotchaReply": "string",
  "leadSummary": {
    "customer": "string",
    "need": "string",
    "urgency": "Low" | "Medium" | "High" | "Urgent",
    "estValue": 0,
    "nextAction": "string"
  },
  "wsupChecklist": ["string", "..."],
  "followUpAction": "string"
}
```

Any missing or malformed fields in the response are individually replaced
with the local mock fallback values, so a partial response never breaks the
demo. No real SMS or phone calls are ever sent by either path.

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
