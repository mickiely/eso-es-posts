#!/usr/bin/env node
// Generates three export files from data/posts.json:
//   scripts/prompts.csv
//   scripts/export-canva-prompts.json
//   scripts/export-chatgpt-images.md

const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/posts.json'),'utf8'));
const out = __dirname;

// ── prompts.csv ───────────────────────────────────────────────────────────────
const csvHeader = 'post_id,product,title,canva_prompt';
const csvRows = posts.map(p =>
  [p.id, p.product,
   `"${p.caption.replace(/"/g,'""')}"`,
   `"${p.image_prompt.replace(/"/g,'""')}"`
  ].join(',')
);
fs.writeFileSync(path.join(out,'prompts.csv'), [csvHeader,...csvRows].join('\n'));

// ── export-canva-prompts.json ─────────────────────────────────────────────────
const json = posts.map(p => ({
  post_id: p.id,
  product: p.product,
  title: p.caption,
  canva_template: p.canva_template,
  canva_prompt: p.image_prompt
}));
fs.writeFileSync(path.join(out,'export-canva-prompts.json'), JSON.stringify(json, null, 2));

// ── export-chatgpt-images.md ──────────────────────────────────────────────────
const md = posts.map((p,i) => {
  const num = String(i+1).padStart(2,'0');
  return `## POST ${num} — ${p.product.toUpperCase()} (ID ${p.id})

**Caption:** ${p.caption}

**Prompt:**
${p.image_prompt}

**Template:** \`${p.canva_template}\``;
}).join('\n\n---\n\n');

const header = `# Eso Es — ChatGPT / Canva Image Prompts
Generated: ${new Date().toISOString().split('T')[0]}
Posts: ${posts.length}

Paste each prompt into ChatGPT (DALL-E), Canva AI, or Midjourney.
When the image is ready, paste the URL into the approval page → Mark Image Ready.

---

`;
fs.writeFileSync(path.join(out,'export-chatgpt-images.md'), header + md);

console.log(`✓ prompts.csv              — ${posts.length} rows`);
console.log(`✓ export-canva-prompts.json — ${posts.length} entries`);
console.log(`✓ export-chatgpt-images.md  — ${posts.length} prompts`);
