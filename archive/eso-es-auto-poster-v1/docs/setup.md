# Eso Es Auto Poster v1 — Setup Guide

## What this does
Google Sheets holds your post schedule. Make.com watches for `Approved` rows, generates the Canva image, posts to Facebook + Instagram, and marks the row `Scheduled`. If Meta fails, Buffer CSV is the fallback.

---

## Step 1 — Google Sheets

1. Go to [sheets.google.com](https://sheets.google.com) → New spreadsheet
2. Name it: **Eso Es Content Schedule**
3. Import `scripts/sheets_template.csv`:
   - File → Import → Upload → select `sheets_template.csv`
   - Import location: Replace current sheet
4. Name the tab: **Posts**
5. Copy the spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/**THIS_PART**/edit`

**Status meanings:**
| Status | Meaning |
|--------|---------|
| Draft | Not ready |
| Ready | Written, needs graphic |
| Graphic Needed | Caption ready, waiting on image |
| Graphic Done | Image ready, awaiting approval |
| Approved | Ready to schedule — Make.com trigger |
| Scheduled | Make.com has queued it |
| Posted | Live |

---

## Step 2 — Canva Templates

1. In Canva, create or confirm you have these templates:
   - `eso-es-brand-square-v1` (1080×1080)
   - `eso-es-brand-landscape-v1` (1200×630)
   - `eso-es-product-square-v1` (1080×1080)
   - `eso-es-product-landscape-v1` (1200×630)
   - `eso-es-founder-square-v1` (1080×1080)
   - `eso-es-founder-landscape-v1` (1200×630)

2. In each template, make the text layer editable with a variable named `caption`

3. Get your Canva API token:
   - [canva.com/developers](https://www.canva.com/developers) → Create app → copy token

> **Note:** Canva's API for template automation is available on Canva for Teams. If not available, skip the Canva step in Make.com and manually upload the image URL to the `scheduled_url` column before setting status to `Approved`.

---

## Step 3 — Meta (Facebook + Instagram)

### Facebook Page
1. Go to [developers.facebook.com](https://developers.facebook.com) → My Apps → Create App
2. Add **Instagram Graph API** and **Pages API** products
3. Generate a Page Access Token (long-lived, 60 days):
   - Tools → Graph API Explorer → select your Page → generate token
   - Exchange for long-lived: `GET /oauth/access_token?grant_type=fb_exchange_token&...`
4. Copy your **Facebook Page ID** (Settings → About → Page ID)

### Instagram Business Account
1. Connect your Instagram account to your Facebook Page (Facebook Page → Settings → Instagram)
2. Get your Instagram Business Account ID:
   - Graph API call: `GET /{facebook-page-id}?fields=instagram_business_account`

### Token storage
Paste these into Make.com as connection credentials — never into the sheet.

---

## Step 4 — Make.com

1. Go to [make.com](https://make.com) → Create new scenario
2. Click the three dots → Import blueprint
3. Upload `scripts/make_blueprint.json`
4. Replace all `REPLACE_WITH_*` variables in the blueprint with your real values:
   | Variable | Where to find it |
   |----------|-----------------|
   | `GOOGLE_SHEET_ID` | Google Sheets URL |
   | `CANVA_API_TOKEN` | Canva Developers dashboard |
   | `META_ACCESS_TOKEN` | Meta Graph API Explorer |
   | `META_PAGE_ACCESS_TOKEN` | Meta Graph API Explorer (page-scoped) |
   | `FACEBOOK_PAGE_ID` | Facebook Page → About |
   | `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Graph API call above |

5. Set schedule: Every day at **8:50am AEST** (runs before 9am posts)
6. Turn scenario ON

---

## Step 5 — Test one post

1. In the Google Sheet, find a row for **today's date**
2. Make sure the `image_prompt` is filled and `canva_template` matches an existing template
3. Change `status` to `Approved`
4. In Make.com, click **Run once**
5. Watch the execution — confirm:
   - Canva image generated ✓
   - Post appears on Facebook Page ✓
   - Post appears on Instagram ✓
   - Sheet row updated to `Scheduled` ✓

---

## Fallback — Buffer CSV

If Meta API is unreliable, use Buffer:

1. Complete graphics manually and paste image URLs into the `Image URL` column of `scripts/buffer_export.csv`
2. Go to [buffer.com](https://buffer.com) → Import
3. Upload the CSV
4. Buffer schedules all rows automatically

The Buffer CSV is pre-filled with the same 10-post, 2-week schedule.

---

## Posting Rhythm

| Day | Product |
|-----|---------|
| Monday 9am | Brand / Leak |
| Tuesday 9am | Gotcha |
| Wednesday 9am | WSUP |
| Thursday 9am | Ripple or Frother |
| Friday 9am | Founder / Local |

---

## Replacing placeholder content with your 30 posts

1. Open `scripts/sheets_template.csv` in Google Sheets
2. For each row, paste in the matching caption and hashtags from your Content Engine doc
3. Update `image_prompt` with the matching Canva prompt
4. Set status to `Graphic Needed` until the image is done, then `Graphic Done`, then `Approved`
