#!/usr/bin/env node
// Seeds content_queue from data/posts.json as drafts (no image_url yet —
// graphics are still produced in Canva per exports/setup-guide.md until
// that step is automated). Run once after the Supabase project exists:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:queue

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const posts = JSON.parse(readFileSync(path.join(ROOT, 'data/posts.json'), 'utf8'));

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  process.exit(1);
}

const supabase = createClient(url, key);

const rows = posts.map((p) => ({
  post_num: p.num,
  product: p.product,
  category: p.category,
  title: p.title,
  caption: p.caption,
  hashtags: p.hashtags,
  image_prompt: p.image_prompt,
  platforms: ['instagram', 'facebook'],
  status: 'draft',
}));

const { data, error } = await supabase.from('content_queue').insert(rows).select('id');
if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}
console.log(`Seeded ${data.length} posts into content_queue as drafts.`);
