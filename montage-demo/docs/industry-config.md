# Industry Configuration Reference

All industry-specific content lives in a single file:
`src/config/industries.ts`, exporting `INDUSTRIES: Record<string, IndustryConfig>`.

## Shape

```ts
interface IndustryConfig {
  id: IndustryId;              // 'barber' | 'builder' | 'electrician' | 'cafe'
  label: string;                // Display label, e.g. "Barber"
  businessName: string;         // Fictional business name, e.g. "Montage Cuts"
  tagline: string;
  accent: string;                // CSS color value used for step accents
  address: string;               // Fictional address
  reviewScore: number;           // e.g. 4.8
  reviewCount: number;
  services: string[];            // Shown as tags on the search result card
  missedCallText: string;        // Shown in the missed-call banner
  instantSmsIntro: string;       // First auto-SMS shown after the missed call
  avgJobValue: number;           // Used as fallback "value saved" figure
  enquiryOptions: EnquiryOption[];
  followUp: FollowUpConfig;
}

interface EnquiryOption {
  id: string;
  label: string;          // Button label, e.g. "Book appointment"
  need: string;            // Plain-language description shown in lead capture
  urgency: 'Low' | 'Medium' | 'High' | 'Urgent';
  estValue: number;        // Estimated job value in dollars
  nextAction: string;      // Recommended next action, shown in lead capture
  smsReply: string;        // Auto-suggested SMS reply shown in Gotcha step
  playbook: string[];      // Checklist items shown in the W'SUP step
}

interface FollowUpConfig {
  product: 'Frother' | 'Ripple';
  headline: string;
  message: string;   // Follow-up SMS text shown in the Follow-up step
  explain: string;    // One-line explanation of what the product is doing
}
```

## Current industries

| Industry    | Business Name        | Follow-up product |
|-------------|----------------------|--------------------|
| Barber      | Montage Cuts          | Frother (return visit) |
| Builder     | Montage Build Co.     | Ripple (review/referral) |
| Electrician | Montage Electrical    | Ripple (review/referral) |
| Cafe        | Montage Coffee        | Frother (loyalty) |

## How to add another industry

1. Open `src/config/industries.ts`.
2. Add a new key to the `INDUSTRIES` object matching the `IndustryConfig`
   shape above. Use an existing entry as a template — copy one and edit the
   business name, services, enquiry options, and follow-up content.
3. Add the new `IndustryId` string to the `IndustryId` union type in
   `src/types.ts`.
4. Add an icon for the industry selector in
   `src/components/IndustrySelector.tsx` (`ICONS` map).
5. Run `npm run build` to confirm everything still type-checks.

No other files need to change — the rest of the app (steps, components,
navigation, progress bar) is fully data-driven.
