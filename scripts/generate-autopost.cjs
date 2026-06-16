#!/usr/bin/env node
/**
 * Generates auto-poster exports from posts.json:
 *   exports/eso-es-posts-sheet.csv  — Google Sheets import (all 30 posts)
 *   exports/buffer-fallback.csv     — Buffer CSV (first 2 weeks, Approved posts)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const posts = require(path.join(ROOT, 'data/posts.json'));

/* ── CONFIG ── */

// Posts selected for first 2 weeks + their scheduled dates
const SCHEDULE = {
  7:  { date: '2026-06-16', slot: 'Mon — Brand Leak' },
  4:  { date: '2026-06-17', slot: 'Tue — Gotcha' },
  3:  { date: '2026-06-18', slot: 'Wed — WSUP' },
  5:  { date: '2026-06-19', slot: 'Thu — Ripple/Frother' },
  8:  { date: '2026-06-20', slot: 'Fri — Founder/Local' },
  2:  { date: '2026-06-23', slot: 'Mon — Brand Leak' },
  15: { date: '2026-06-24', slot: 'Tue — Gotcha' },
  9:  { date: '2026-06-25', slot: 'Wed — WSUP' },
  6:  { date: '2026-06-26', slot: 'Thu — Ripple/Frother' },
  25: { date: '2026-06-27', slot: 'Fri — Founder/Local' },
};

const PLATFORM_CATS = ['Brand Story', 'Founder Post', 'Educational', 'Audience', 'Brand Voice'];

const CANVA_TEMPLATES = {
  'Ripple':       'ESO-ES-RIPPLE-01',
  'Gotcha':       'ESO-ES-GOTCHA-01',
  'Frother':      'ESO-ES-FROTHER-01',
  'WSUP':         'ESO-ES-WSUP-01',
  'Brand':        'ESO-ES-BRAND-01',
  'All Products': 'ESO-ES-BRAND-01',
};

const POST_TIME = '09:00 AEST';

/* ── HELPERS ── */

function platform(p) {
  return PLATFORM_CATS.includes(p.category)
    ? 'Instagram, Facebook, LinkedIn'
    : 'Instagram, Facebook';
}

function canvaTemplate(p) {
  return CANVA_TEMPLATES[p.product] || 'ESO-ES-BRAND-01';
}

function csvCell(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function csvRow(cells) {
  return cells.map(csvCell).join(',');
}

/* ── GOOGLE SHEETS CSV ── */

const SHEET_HEADERS = [
  'post_num', 'date', 'time', 'day_slot', 'platform',
  'product', 'category', 'title',
  'caption', 'hashtags', 'image_prompt',
  'canva_template', 'status', 'scheduled_url', 'posted_url'
];

const sheetRows = [SHEET_HEADERS.join(',')];

// Sort: approved (first 2 weeks) first, then remaining by date
const approved = posts
  .filter(p => SCHEDULE[p.num])
  .sort((a, b) => SCHEDULE[a.num].date.localeCompare(SCHEDULE[b.num].date));

const draft = posts
  .filter(p => !SCHEDULE[p.num])
  .sort((a, b) => a.date.localeCompare(b.date));

[...approved, ...draft].forEach(p => {
  const sched = SCHEDULE[p.num];
  const date = sched ? sched.date : p.date;
  const status = sched ? 'Approved' : 'Draft';
  const daySlot = sched ? sched.slot : '';

  sheetRows.push(csvRow([
    p.num,
    date,
    POST_TIME,
    daySlot,
    platform(p),
    p.product,
    p.category,
    p.title,
    p.caption,
    p.hashtags,
    p.image_prompt,
    canvaTemplate(p),
    status,
    '', // scheduled_url — filled after scheduling
    '', // posted_url — filled after posting
  ]));
});

fs.writeFileSync(
  path.join(ROOT, 'exports/eso-es-posts-sheet.csv'),
  sheetRows.join('\n'),
  'utf8'
);
console.log(`✓ Google Sheets CSV: ${sheetRows.length - 1} posts`);

/* ── BUFFER FALLBACK CSV ── */
// Buffer import format: Date, Time, Content (caption + hashtags), Image URL

const BUFFER_HEADERS = ['Date', 'Time', 'Content', 'Image URL', 'Platforms'];
const bufferRows = [BUFFER_HEADERS.join(',')];

approved.forEach(p => {
  const sched = SCHEDULE[p.num];
  const content = p.caption + '\n\n' + p.hashtags;

  bufferRows.push(csvRow([
    sched.date,
    POST_TIME,
    content,
    '', // image URL — fill after Canva graphic is done
    platform(p),
  ]));
});

fs.writeFileSync(
  path.join(ROOT, 'exports/buffer-fallback.csv'),
  bufferRows.join('\n'),
  'utf8'
);
console.log(`✓ Buffer fallback CSV: ${bufferRows.length - 1} posts (weeks 1-2)`);
