#!/usr/bin/env node
/**
 * generate-campaign.js
 * Usage: node generate-campaign.js <topic> [module]
 * Example: node generate-campaign.js "Missed Calls" Gotcha
 *
 * Writes to campaigns/<slug>/
 *   captions.json  — all 5 post captions
 *   prompts.json   — image briefs
 *   meta_schedule.csv — Mon-Fri 9am schedule
 *
 * Requires: ANTHROPIC_API_KEY in environment or .env file
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && !process.env[k.trim()]) process.env[k.trim()] = v.join('=').trim();
  });
}

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) { console.error('Error: ANTHROPIC_API_KEY not set.'); process.exit(1); }

const topic  = process.argv[2];
const module = process.argv[3] || 'Gotcha';

if (!topic) {
  console.error('Usage: node generate-campaign.js <topic> [module]');
  process.exit(1);
}

const POST_TYPES = ['problem','stat','proof','process','cta'];
const LAYOUTS    = { problem:'b', stat:'d', proof:'e', process:'a', cta:'c' };

const prompt = `You are writing a 5-post social media campaign for Eso Es, a local business operations service in Australia. Module: ${module}. Topic: "${topic}".

These 5 posts form a logical content arc (Monday–Friday):
Post 1 — PROBLEM: Hook on the pain. Name it clearly. Agitate.
Post 2 — STATISTIC: One compelling data point that proves the problem is costly.
Post 3 — PROOF: A brief testimonial or real-world proof story.
Post 4 — PROCESS: Step-by-step: exactly how the solution works.
Post 5 — CTA: Clear offer. Low-commitment entry point. Urgency.

Brand voice: direct, no-fluff, confident, a bit blunt. Australian small business audience. No corporate language.

Return ONLY a valid JSON array of exactly 5 objects, each with these keys:
headline (short ALL CAPS card headline), tagline (1 short card subtext line), body (100-150 words line-break-heavy brand voice), cta (action command e.g. DM "GOTCHA"), hashtags (8-10 hashtags space-separated), image_prompt (40-word Canva/AI graphic brief).

Zero other text outside the JSON array.`;

const payload = JSON.stringify({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 3200,
  messages: [{ role: 'user', content: prompt }]
});

console.log(`Generating campaign: "${topic}" [${module}]…`);

const options = {
  hostname: 'api.anthropic.com',
  path: '/v1/messages',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01'
  }
};

const req = https.request(options, res => {
  let raw = '';
  res.on('data', chunk => raw += chunk);
  res.on('end', () => {
    if (res.statusCode !== 200) { console.error('API error', res.statusCode, raw.slice(0,300)); process.exit(1); }
    try {
      const data  = JSON.parse(raw);
      const text  = (data.content?.[0]?.text || '').trim();
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('No JSON array in response:\n' + text.slice(0,200));
      const posts = JSON.parse(match[0]);
      if (!Array.isArray(posts) || posts.length < 5) throw new Error('Expected 5 posts');

      const slug    = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const outDir  = path.join(__dirname, 'campaigns', slug);
      fs.mkdirSync(outDir, { recursive: true });
      fs.mkdirSync(path.join(outDir, 'images'), { recursive: true });

      // captions.json
      const captions = {
        topic, module, generated: new Date().toISOString(),
        posts: posts.map((p, i) => ({
          post: i + 1, type: POST_TYPES[i], layout: LAYOUTS[POST_TYPES[i]],
          headline: p.headline, tagline: p.tagline, body: p.body, cta: p.cta, hashtags: p.hashtags,
          full_caption: [p.body, p.cta, 'https://esoes.com.au', p.hashtags].filter(Boolean).join('\n\n')
        }))
      };
      fs.writeFileSync(path.join(outDir, 'captions.json'), JSON.stringify(captions, null, 2));

      // prompts.json
      const prompts = {
        topic, module, generated: captions.generated,
        images: posts.map((p, i) => ({
          post: i + 1, type: POST_TYPES[i],
          filename: `post-${String(i+1).padStart(2,'0')}-${slug}-${POST_TYPES[i]}.jpg`,
          headline: p.headline, image_prompt: p.image_prompt
        }))
      };
      fs.writeFileSync(path.join(outDir, 'prompts.json'), JSON.stringify(prompts, null, 2));

      // meta_schedule.csv
      const today = new Date();
      const daysToMonday = (8 - today.getDay()) % 7 || 7;
      const start = new Date(today);
      start.setDate(today.getDate() + daysToMonday);

      const csvCell = s => '"' + String(s || '').replace(/"/g, '""') + '"';
      const rows = ['Post,Date,Time,Type,Headline,Caption,Image,Hashtags,Module'];
      posts.forEach((p, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        const caption = [p.body, p.cta, 'https://esoes.com.au'].filter(Boolean).join('\n\n');
        const fname   = `post-${String(i+1).padStart(2,'0')}-${slug}-${POST_TYPES[i]}.jpg`;
        rows.push([i+1, ds, '09:00', POST_TYPES[i], csvCell(p.headline), csvCell(caption), fname, csvCell(p.hashtags), module].join(','));
      });
      fs.writeFileSync(path.join(outDir, 'meta_schedule.csv'), rows.join('\n'));

      console.log(`\n✓ Campaign written to campaigns/${slug}/`);
      console.log('  captions.json');
      console.log('  prompts.json');
      console.log('  meta_schedule.csv');
      console.log('  images/ (add your graphics here)');
      posts.forEach((p, i) => console.log(`\n  Post ${i+1} [${POST_TYPES[i].toUpperCase()}]: ${p.headline}`));

    } catch (err) {
      console.error('Parse error:', err.message);
      process.exit(1);
    }
  });
});

req.on('error', err => { console.error('Request error:', err.message); process.exit(1); });
req.write(payload);
req.end();
