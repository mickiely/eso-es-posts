# Montage Co™ — Landing Page

A 1980s VHS public-access-infomercial-styled landing page for the fictional
brand **Montage Co.** Built with React, TypeScript, Vite, and Tailwind CSS v4.

Target domain: `montageco.com.au`

## Visual concept

- Dark wood-panel gym backdrop on hero/CTA sections.
- Hot pink, cyan, yellow, black palette.
- CRT scanlines, animated VHS grain/noise, and fake horizontal tracking
  lines — all pure CSS (`src/index.css`), fixed-position overlays with no
  JS animation libraries.
- 4:3 "video frame" boxes (`.video-frame`) used throughout for a tape-in-a-
  player feel.
- Chunky display type (Anton) for headlines, VT323 (a pixel terminal/VHS
  font) for captions and labels.
- Hover-triggered chromatic-aberration "glitch" on headings and a flicker
  effect on buttons — both CSS `@keyframes`, no extra dependencies.

## Getting started

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Structure

- `src/components/ScreenEffects.tsx` — the fixed CRT/VHS overlay layers.
- `src/components/GlitchHeading.tsx` — reusable glitch headline + REC badge.
- `src/components/FlexPortrait.tsx` — stylized SVG "archive footage"
  placeholder for Flex Montage (no real photography asset is bundled).
- `src/components/Hero.tsx`, `FlexIntro.tsx`, `MontageComparison.tsx`,
  `Divisions.tsx`, `FakeScience.tsx`, `Testimonials.tsx`,
  `CallToAction.tsx`, `Footer.tsx` — one component per page section, in the
  order they're composed in `src/App.tsx`.

## Notes

- All testimonials, statistics, and the "Flex Montage" portrait are
  fictional/parody content for a satirical brand — not real customer data.
- Tailwind v4 is configured via the `@tailwindcss/vite` plugin and a
  `@theme` block in `src/index.css` (no separate `tailwind.config.js`
  needed).
