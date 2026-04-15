#!/usr/bin/env node
// sanitize.mjs — apply redactions to a transcript JSON
// Usage: node sanitize.mjs <transcript.json> [<redactions.json>]

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [, , transcriptArg, redactionsArg] = process.argv;
if (!transcriptArg) {
  console.error('Usage: node sanitize.mjs <transcript.json> [<redactions.json>]');
  process.exit(1);
}

const transcriptPath = resolve(transcriptArg);
const redactionsPath = redactionsArg
  ? resolve(redactionsArg)
  : existsSync(resolve('./redactions.json'))
    ? resolve('./redactions.json')
    : join(dirname(fileURLToPath(import.meta.url)), '..', 'redactions.default.json');

const transcript = JSON.parse(readFileSync(transcriptPath, 'utf8'));
const redactions = JSON.parse(readFileSync(redactionsPath, 'utf8'));

let replacementCount = 0;
let droppedCount = 0;

const replacements = redactions.replacements || [];
const patterns = (redactions.patterns || []).map(p => ({
  regex: new RegExp(p.regex, p.flags || 'g'),
  replace: p.replace,
}));
const dropBlocks = redactions.dropBlocks || [];

function sanitizeString(s) {
  let out = s;
  for (const { find, replace } of replacements) {
    if (out.includes(find)) {
      const before = out;
      out = out.split(find).join(replace);
      replacementCount += (before.length - out.length === 0)
        ? before.split(find).length - 1
        : before.split(find).length - 1;
    }
  }
  for (const { regex, replace } of patterns) {
    const matches = out.match(regex);
    if (matches) {
      replacementCount += matches.length;
      out = out.replace(regex, replace);
    }
  }
  return out;
}

function shouldDropBlock(block) {
  const json = JSON.stringify(block);
  return dropBlocks.some(d => d.ifContains && json.includes(d.ifContains));
}

function walk(value) {
  if (typeof value === 'string') return sanitizeString(value);
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = walk(v);
    return out;
  }
  return value;
}

// Drop blocks first, then sanitize strings
for (const turn of transcript.turns || []) {
  if (Array.isArray(turn.blocks)) {
    const before = turn.blocks.length;
    turn.blocks = turn.blocks.filter(b => {
      if (shouldDropBlock(b)) { droppedCount++; return false; }
      return true;
    });
  }
  if (Array.isArray(turn.content)) {
    turn.content = turn.content.filter(b => {
      if (shouldDropBlock(b)) { droppedCount++; return false; }
      return true;
    });
  }
}

const sanitized = walk(transcript);

const outPath = transcriptPath.replace(/\.json$/, '.sanitized.json');
writeFileSync(outPath, JSON.stringify(sanitized, null, 2));

console.log(`✓ Sanitized → ${outPath}`);
console.log(`  ${replacementCount} replacements, ${droppedCount} blocks dropped`);
