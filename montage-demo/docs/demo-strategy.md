# Montage Demo — Strategy

## Purpose

Montage is a standalone, interactive sales demonstration of the Eso Es service
stack (Ripple, Gotcha, W'SUP, Frother). It is built for prospects to
*experience* the stack working inside a fictional version of their own
industry, rather than reading about it on a landing page.

The demo is not a marketing site. It is a guided walkthrough with state,
choices, and a result — closer to a product trial than a brochure.

## Why a single app, single config

One React app renders all four fictional businesses (Montage Cuts, Montage
Build Co., Montage Electrical, Montage Coffee) from one `IndustryConfig`
object per industry (`src/config/industries.ts`). The flow, components, and
styling are 100% shared — only the data changes. This keeps the demo
maintainable: adding a fifth industry never means duplicating a page.

## The narrative arc

The demo intentionally follows the same arc a real customer journey takes:

1. **Discovery** (Ripple) — a fictional customer finds the business online.
2. **Missed call recovery** (Gotcha) — the call is missed, but instantly
   followed up by SMS, and the enquiry gets triaged.
3. **Lead capture** — the enquiry becomes a structured lead: need, urgency,
   estimated value, next action.
4. **Staff playbook** (W'SUP) — the team gets a clear, illustrative checklist
   for handling that specific enquiry type.
5. **Follow-up** (Frother or Ripple) — depending on industry, either a
   loyalty/return-visit nudge (Frother) or a review/referral/reminder
   nudge (Ripple).
6. **Results** — a summary of what happened, and the call to action.

Each step explicitly names the product responsible and explains, in plain
language, what it just did. This is deliberate: prospects should leave the
demo able to repeat back what each product does.

## Tone and honesty constraints

- Everything shown is explicitly labelled as demonstration data.
- No SMS or call is actually sent — this is a frontend-only simulation.
- The W'SUP playbook step explicitly disclaims that checklists are
  illustrative only and not legal, safety, or compliance certification.
- The demo never claims a real action (real SMS, real call, real booking)
  occurred.

## Design language

The demo reuses the existing Eso Es visual identity: cream background, black
ink, thick borders, drop-shadow "comic operations" cards, and chunky
monospace typography — consistent with the Eso Es Content Engine
(`index.html` in the parent repository).
