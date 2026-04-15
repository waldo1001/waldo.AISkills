#!/usr/bin/env node
// build.mjs — inject a transcript JSON into the replayer template
// Usage: node build.mjs <transcript.json> [--out file.html] [--title "..."]

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const positional = [];
const flags = {};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a.startsWith('--')) {
    const k = a.replace(/^--/, '');
    const next = args[i + 1];
    if (next && !next.startsWith('--')) { flags[k] = next; i++; }
    else { flags[k] = true; }
  } else {
    positional.push(a);
  }
}

const transcriptPath = positional[0];
if (!transcriptPath) {
  console.error('Usage: node build.mjs <transcript.json> [--out file.html] [--title "..."]');
  process.exit(1);
}

const transcript = JSON.parse(readFileSync(resolve(transcriptPath), 'utf8'));
if (flags.title) transcript.meta = { ...(transcript.meta || {}), title: flags.title };

const slug = (transcript.meta?.title || 'chat')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 60);

const outPath = resolve(flags.out || `./${slug}.html`);

const templatePath = join(dirname(fileURLToPath(import.meta.url)), '..', 'templates', 'replayer.html');
const template = readFileSync(templatePath, 'utf8');

// Escape closing script tags inside the JSON payload to be safe
const payload = JSON.stringify(transcript).replace(/<\/script/gi, '<\\/script');

const html = template.replace('"__TRANSCRIPT_JSON__"', payload);

writeFileSync(outPath, html);
console.log(`✓ Built → ${outPath}`);
console.log(`  ${transcript.turns?.length || 0} turns, ${(html.length / 1024).toFixed(1)} KB`);
