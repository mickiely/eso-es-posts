#!/usr/bin/env node
/**
 * Eso Es Content Generator
 * Usage: node generate.js [--count 10] [--product Gotcha]
 * Requires: ANTHROPIC_API_KEY in .env
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag, def) => { const i = args.indexOf(flag); return i !== -1 ? args[i+1] : def; };
const COUNT = parseInt(getArg('--count', '10'), 10);
const PRODUCT_FILTER = getArg('--product', null);

// ── Load .env ────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY not set. Add it to .env');
  process.exit(1);
}

// ── Load brand context ───────────────────────────────────────────────────
const brand = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/brand.json'), 'utf8'));

// ── Load ingest files ────────────────────────────────────────────────────
const ingestDir = path.join(__dirname, 'data/ingest');
const ingestContent = fs.readdirSync(ingestDir)
  .filter(f => /\.(txt|md|csv|json)$/.test(f))
  .map(f => {
    const content = fs.readFileSync(path.join(ingestDir, f), 'utf8');
    return `--- ${f} ---\n${content}`;
  }).join('\n\n');

// ── Load existing posts ──────────────────────────────────────────────────
const postsPath = path.join(__dirname, 'data/posts.json');
const existing = fs.existsSync(postsPath) ? JSON.parse(fs.readFileSync(postsPath, 'utf8')) : [];
const nextNum = existing.length > 0 ? Math.max(...existing.map(p => p.num)) + 1 : 1;

// ── Products to generate ──────────────────────────────────────────────────
const PRODUCTS = PRODUCT_FILTER
  ? [PRODUCT_FILTER]
  : ['Gotcha', 'Ripple', 'Frother', 'WSUP', 'Brand'];

const productList = PRODUCTS.join(', ');

// ── Build prompt ─────────────────────────────────────────────────────────
const systemPrompt = `You are a content strategist for Eso Es, an Australian local business systems company.

BRAND:
${JSON.stringify(brand, null, 2)}

${ingestContent ? `CONTEXT FROM INGEST FILES:\n${ingestContent}\n` : ''}

Generate ${COUNT} social media posts for: ${productList}

REQUIREMENTS:
- Each post must have a distinct angle (Pain Point, Product Feature, Brand Story, Offer, Before/After, Educational, Founder Post, Urgency, Industry-specific, Audience)
- Voice: Direct, practical, Australian, anti-agency, short punchy sentences
- No corporate speak. No buzzwords. Real business problems.
- CTA must use DM keyword format (DM "GOTCHA", DM "RIPPLE" etc.)
- Captions: short paragraphs, line breaks, problem → solution structure

Return a JSON array. Each post must have ALL these fields:
{
  "num": <next number starting at ${nextNum}>,
  "date": "<YYYY-MM-DD, schedule weekdays starting from next Monday>",
  "product": "<Gotcha|Ripple|Frother|WSUP|Brand|All Products>",
  "category": "<Pain Point|Product Feature|Brand Story|Offer|Before/After|Educational|Founder Post|Urgency|Industry|Audience>",
  "title": "<short internal title>",
  "hook": "<opening line that stops the scroll — the first sentence>",
  "headline": "<ALL CAPS card headline, max 6 words>",
  "subtext": "<short subtitle for card, max 6 words>",
  "cta": "<DM keyword call to action>",
  "caption": "<full post caption, 100-250 words, use \\n for line breaks>",
  "graphic_concept": "<brief description of visual concept for designer>",
  "image_prompt": "<detailed AI image generation prompt for Midjourney/DALL-E>",
  "hashtags": "<10 relevant hashtags as single string>"
}

Return ONLY the JSON array, no markdown, no explanation.`;

// ── Generate ─────────────────────────────────────────────────────────────
async function generate() {
  console.log(`\n⚡ Eso Es Content Generator`);
  console.log(`   Generating ${COUNT} posts for: ${productList}`);
  console.log(`   Starting at post #${nextNum}\n`);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let raw;
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: systemPrompt }]
    });
    raw = msg.content[0].text;
  } catch (err) {
    console.error('API error:', err.message);
    process.exit(1);
  }

  // Parse JSON — strip any accidental markdown fences
  let newPosts;
  try {
    const clean = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    newPosts = JSON.parse(clean);
  } catch {
    console.error('Failed to parse response as JSON. Raw output saved to data/generate-error.txt');
    fs.writeFileSync(path.join(__dirname, 'data/generate-error.txt'), raw);
    process.exit(1);
  }

  // Merge with existing and save
  const merged = [...existing, ...newPosts];
  fs.writeFileSync(postsPath, JSON.stringify(merged, null, 2));

  console.log(`✓ Generated ${newPosts.length} new posts`);
  console.log(`✓ Total posts in data/posts.json: ${merged.length}`);
  console.log(`\nPost titles:`);
  newPosts.forEach(p => console.log(`  #${p.num} [${p.product}] ${p.title}`));
  console.log('\nOpen index.html to review.\n');
}

generate();
