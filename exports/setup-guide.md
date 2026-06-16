# Eso Es Auto Poster — Setup Guide

## What you're connecting
Google Sheets → Make.com → Facebook Page + Instagram Business

---

## Step 1 — Google Sheets

1. Create a new Google Sheet named **Eso Es Auto Poster**
2. Import `eso-es-posts-sheet.csv` into a tab named **Posts**
   - File → Import → Upload → Replace current sheet
3. Freeze row 1 (header)
4. Add a sheet named **Log** (Make.com writes errors here)

The status column values:
| Status | Meaning |
|---|---|
| Draft | Not ready yet |
| Ready | Written, needs graphic |
| Graphic Needed | Canva prompt ready, image not made |
| Graphic Done | Image URL pasted into `scheduled_url` column |
| **Approved** | Ready to schedule — Make.com picks this up |
| Scheduled | Make.com has queued it |
| Posted | Live |

**To schedule a post:** change its status to `Approved`.

---

## Step 2 — Canva (manual for now)

1. Open Canva → find your Eso Es brand template
2. For each Approved post, read the `image_prompt` column
3. Create the graphic using the template
4. Download or copy the share URL
5. Paste the URL into the `scheduled_url` column in Sheets
6. Template IDs per product (update `make-blueprint.json` with your real IDs):
   - `ESO-ES-BRAND-01` — Brand / All Products
   - `ESO-ES-RIPPLE-01` — Ripple
   - `ESO-ES-GOTCHA-01` — Gotcha
   - `ESO-ES-FROTHER-01` — Frother
   - `ESO-ES-WSUP-01` — WSUP

> Canva API autofill is wired in the Make blueprint (Module 3) but requires a Canva Teams account.
> If you don't have API access, skip Module 3 and paste graphic URLs manually into the sheet.

---

## Step 3 — Facebook Page

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create an App → Business type
3. Add **Pages API** product
4. Generate a Page Access Token for your Eso Es Facebook page
5. Save the Page ID and token — you'll need them in Make.com

---

## Step 4 — Instagram Business

1. Your Instagram must be set to **Professional → Business**
2. Connect Instagram to your Facebook Page:
   - Meta Business Suite → Settings → Accounts → Instagram
3. The Instagram account ID appears in Business Suite settings
4. Make.com uses the Facebook connection to post to Instagram via the Graph API

---

## Step 5 — Make.com

1. Go to [make.com](https://make.com) → Create a new Scenario
2. Click the 3-dot menu → **Import Blueprint**
3. Upload `make-blueprint.json`
4. Connect each module:
   - Module 1 & 6 (Google Sheets): authenticate your Google account, select the **Eso Es Auto Poster** spreadsheet
   - Module 4 (Facebook): authenticate with your Page Access Token, select your Page
   - Module 5 (Instagram): use the same Facebook connection, select your Instagram account
5. Replace placeholder values in the blueprint:
   - `YOUR_SPREADSHEET_ID` → from your Google Sheets URL
   - `YOUR_FACEBOOK_PAGE_ID` → from Meta Business Suite settings
   - `YOUR_INSTAGRAM_ACCOUNT_ID` → from Meta Business Suite settings
   - `YOUR_CANVA_API_TOKEN` → from Canva Developer settings (skip if manual)

---

## Step 6 — Test one post

1. Find Post #4 (Gotcha — row 1 in the sheet, already Approved)
2. Change status to `Approved` if not already
3. In Make.com → click **Run once**
4. Watch each module turn green
5. Check Facebook and Instagram scheduled posts in Meta Business Suite
6. Confirm the sheet row updated to `Scheduled`

---

## Posting rhythm

| Day | Time | Post type |
|---|---|---|
| Monday | 9:00 AEST | Brand Leak |
| Tuesday | 9:00 AEST | Gotcha |
| Wednesday | 9:00 AEST | WSUP |
| Thursday | 9:00 AEST | Ripple or Frother |
| Friday | 9:00 AEST | Founder / Local |

The first 10 posts (2 weeks) are pre-assigned to these slots with status `Approved`.

---

## Fallback — Buffer

If Meta direct posting gives you grief:

1. Open `buffer-fallback.csv` in a spreadsheet
2. Paste image URLs into the **Image URL** column for each post
3. Go to [buffer.com](https://buffer.com) → Publishing → Import CSV
4. Upload the file
5. Review and confirm each post

Buffer handles scheduling without needing a developer account or Graph API tokens.

---

## Make.com runs on a schedule

The scenario is set to run every **15 minutes**. When it runs:
- It checks the sheet for rows with `status = Approved`
- Processes up to 5 rows per run
- Updates each row to `Scheduled` after queuing

To schedule a post manually: just set its row status to `Approved` and wait for the next Make.com cycle.
