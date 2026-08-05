#!/usr/bin/env node
/**
 * generate-variants.js
 * Usage: node generate-variants.js [module] [type] [headline] [body]
 * Or:    node generate-variants.js  (reads data/current.json if present)
 *
 * Writes data/variants.json
 * Requires: ANTHROPIC_API_KEY in environment or .env file
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

// Load .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && !process.env[k.trim()]) process.env[k.trim()] = v.join('=').trim();
  });
}

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY not set. Add it to .env or export it.');
  process.exit(1);
}

// Read input: CLI args or data/current.json
let input = { module: 'Gotcha', type: 'problem', headline: '', tagline: '', body: '', cta: '' };

const currentPath = path.join(__dirname, 'data', 'current.json');
if (fs.existsSync(currentPath)) {
  Object.assign(input, JSON.parse(fs.readFileSync(currentPath, 'utf8')));
}

if (process.argv[2]) input.module   = process.argv[2];
if (process.argv[3]) input.type     = process.argv[3];
if (process.argv[4]) input.headline = process.argv[4];
if (process.argv[5]) input.body     = process.argv[5];

if (!input.headline && !input.body) {
  console.error('No content to vary. Pass headline + body as args, or create data/current.json.');
  process.exit(1);
}

const prompt = `You are writing social media content for Eso Es, a local business operations service in Australia. Write in a direct, no-fluff tone — punchy, confident, sometimes blunt. Module: ${input.module}. Card type: ${input.type}.

Current post:
Headline: ${input.headline}
Card subtext: ${input.tagline}
Body: ${input.body}
CTA: ${input.cta}

Generate 5 alternative versions covering the same topic and intent. Vary the hook, angle, or structure — some punchy, some story-driven, some data-led, some direct challenge.

Return ONLY a valid JSON array of exactly 5 objects. Each object must have: "headline", "tagline", "body", "cta". No markdown, no commentary.`;

console.log(`Generating 5 variants for [${input.module}/${input.type}]…`);

const payload = JSON.stringify({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 2400,
  messages: [{ role: 'user', content: prompt }]
});

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
    if (res.statusCode !== 200) {
      console.error('API error', res.statusCode, raw.slice(0, 300));
      process.exit(1);
    }
    try {
      const data = JSON.parse(raw);
      const text = data.content?.[0]?.text?.trim() || '';
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('No JSON array in response:\n' + text.slice(0, 200));
      const variants = JSON.parse(match[0]);

      const outPath = path.join(__dirname, 'data', 'variants.json');
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify({
        module: input.module,
        type: input.type,
        generated: new Date().toISOString(),
        variants
      }, null, 2));

      console.log(`✓ ${variants.length} variants written to data/variants.json`);
      variants.forEach((v, i) => console.log(`  ${i + 1}. ${v.headline}`));
    } catch (err) {
      console.error('Parse error:', err.message);
      process.exit(1);
    }
  });
});

req.on('error', err => { console.error('Request error:', err.message); process.exit(1); });
req.write(payload);
req.end();
