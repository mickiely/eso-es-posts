#!/usr/bin/env node
// Usage: node generate_schedule.js [start-date YYYY-MM-DD]
// Generates buffer_export.csv from data/posts.json

const fs = require('fs');
const path = require('path');

const POSTS_FILE = path.join(__dirname, '../data/posts.json');
const OUTPUT_FILE = path.join(__dirname, 'buffer_export.csv');
const POST_TIME = '09:00';
const PLATFORMS = ['Instagram', 'Facebook'];

// Posting rhythm: day-of-week (1=Mon) → product category
const DAY_PRODUCT = { 1: 'Brand', 2: 'Gotcha', 3: 'WSUP', 4: 'Ripple', 5: 'Brand' };

function nextMonday(from) {
  const d = new Date(from);
  const day = d.getDay(); // 0=Sun
  const diff = day === 1 ? 0 : (8 - day) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function fmt(date) {
  return date.toISOString().split('T')[0];
}

const startDateArg = process.argv[2];
const startDate = startDateArg ? new Date(startDateArg) : nextMonday(new Date());

const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
const rows = [];

// Assign one post per weekday, cycling through the 30 posts
const weekdays = [1, 2, 3, 4, 5]; // Mon–Fri offsets within a week
let postIndex = 0;
let weekOffset = 0;

while (postIndex < posts.length) {
  for (const dayOffset of weekdays) {
    if (postIndex >= posts.length) break;
    const date = addDays(startDate, weekOffset * 7 + (dayOffset - 1));
    const post = posts[postIndex];
    for (const platform of PLATFORMS) {
      rows.push({
        date: fmt(date),
        time: POST_TIME,
        channel: platform === 'Instagram' ? 'Instagram - Eso Es' : 'Facebook - Eso Es',
        text: `${post.caption}\n\n${post.hashtags}`,
        media_url: '',
        status: post.status,
        product: post.product,
        image_prompt: post.image_prompt
      });
    }
    postIndex++;
  }
  weekOffset++;
}

const header = 'date,time,channel,text,media_url,status,product,image_prompt';
const csvRows = rows.map(r =>
  [r.date, r.time, r.channel,
    `"${r.text.replace(/"/g, '""')}"`,
    r.media_url,
    r.status,
    r.product,
    `"${r.image_prompt.replace(/"/g, '""')}"`
  ].join(',')
);

fs.writeFileSync(OUTPUT_FILE, [header, ...csvRows].join('\n'));
console.log(`✓ ${rows.length} rows written to ${OUTPUT_FILE}`);
console.log(`  Schedule: ${fmt(startDate)} → ${rows[rows.length - 1].date}`);
console.log(`  Posts: ${posts.length} posts × ${PLATFORMS.length} platforms = ${rows.length} rows`);
