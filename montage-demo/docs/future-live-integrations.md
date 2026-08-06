# Future Live Integrations

The current Montage demo is intentionally frontend-only: no backend, no
real SMS, no real calls, state held in `localStorage`/React state. This
document outlines what a "live" version could connect to, without changing
the existing component structure.

## Twilio (real SMS / call simulation)

- Replace the simulated missed-call and SMS bubbles in
  `GotchaMissedCall.tsx` and `FollowUp.tsx` with calls to a backend endpoint
  that triggers Twilio Programmable SMS / Voice.
  - Inbound: a Twilio number forwards real calls to a webhook, which
    triggers the same "missed call → auto SMS" flow shown in the demo.
  - Outbound: the auto-suggested SMS reply (`EnquiryOption.smsReply`) would
    be sent via Twilio's REST API instead of just rendered.
- Would require a small backend (e.g. a Node/Express or serverless
  function) to hold Twilio credentials — never expose them client-side.

## Supabase (persistence + real lead data)

- Replace the `INDUSTRIES` static config with rows in a Supabase table, so
  the demo (or a real client instance) can be configured without a code
  deploy.
- Store captured leads (`LeadCapture` data) in a `leads` table instead of
  only in React state, enabling a real dashboard of enquiries over time.
- Supabase Auth could gate a future "client portal" version of this same
  flow, separate from the public, no-login demo.

## Forms (Ops Check requests)

- Currently, the "Book an Ops Check" and "Build This For My Business" CTAs
  open a `mailto:` link. A live version could replace this with an embedded
  form (e.g. via a serverless function, Supabase, or a forms provider) that
  captures the prospect's business name, industry, and contact details
  directly, removing the dependency on the visitor's email client.

## Analytics

- Add lightweight, privacy-respecting analytics to understand which
  industry is selected most often, where prospects drop off in the funnel,
  and how often the final CTA is clicked.
- Suggested minimal approach: a small set of custom events (`industry
  selected`, `step completed`, `cta clicked`) sent to a privacy-friendly
  analytics provider — avoid invasive tracking given this is a sales tool,
  not a product.

## Real SMS demonstrations (with consent)

- A future "live mode" could let a prospect enter their **own** mobile
  number to receive an actual demo SMS (via Twilio), with explicit consent
  and clear opt-in language, rather than only showing a simulated SMS
  bubble. This would need:
  - Explicit consent checkbox before sending.
  - Rate limiting / abuse protection on the backend endpoint.
  - Clear messaging that this is still a demo, not a live business
    account.

## What does NOT need to change

The step components (`RippleDiscovery`, `GotchaMissedCall`, `LeadCapture`,
`WsupPlaybook`, `FollowUp`, `ResultsScreen`) and the `IndustryConfig` data
shape are designed to keep working unchanged — live integrations should
plug in behind the existing callbacks (`onCall`, `onSelectEnquiry`, etc.)
rather than requiring a rewrite of the UI layer.
