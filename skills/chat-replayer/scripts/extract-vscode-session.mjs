#!/usr/bin/env node
// extract-vscode-session.mjs — extract a VS Code Copilot Chat JSONL session
// into the chat-replayer transcript schema.
//
// Usage: node extract-vscode-session.mjs <session.jsonl> [--out <transcript.json>]
//
// Reads a .jsonl file from VS Code's chatSessions/ folder and produces a
// transcript.json compatible with the chat-replayer build pipeline.

import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const args = process.argv.slice(2);
let inputPath = null;
let outputPath = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out' && args[i + 1]) {
    outputPath = args[++i];
  } else if (!inputPath) {
    inputPath = args[i];
  }
}

if (!inputPath) {
  console.error('Usage: node extract-vscode-session.mjs <session.jsonl> [--out <transcript.json>]');
  process.exit(1);
}

// ── Parse JSONL ──────────────────────────────────────────────────────────────
const rawLines = readFileSync(inputPath, 'utf8').trim().split('\n');
const jsonlEntries = rawLines.map(l => JSON.parse(l));

// ── Reconstruct state by replaying the JSONL log ────────────────────────────
// kind 0 = initial snapshot, kind 1 = set (replace), kind 2 = array splice
let state = {};

// Track which array paths have been targeted by kind:2 (to handle pre-populated arrays)
const appendedPaths = new Set();

for (const entry of jsonlEntries) {
  if (entry.kind === 0) {
    state = entry.v;
  } else if (entry.kind === 1) {
    // Set a value at a path
    setPath(state, entry.k, entry.v);
  } else if (entry.kind === 2) {
    // Array splice / append at path
    const pathKey = entry.k.join('/');
    const target = getPath(state, entry.k);
    if (Array.isArray(target)) {
      // If this is the first kind:2 for this path and the array was pre-populated
      // (e.g. request object created with response[] already filled), clear it first
      // to avoid duplicates — the incremental log re-supplies all items.
      // Exception: the top-level `requests` array is always appended to, never re-supplied.
      const isTopLevelRequests = entry.k.length === 1 && entry.k[0] === 'requests';
      if (!isTopLevelRequests && !appendedPaths.has(pathKey) && target.length > 0) {
        target.length = 0;
      }
      appendedPaths.add(pathKey);
      if (entry.v) {
        if (typeof entry.i === 'number') {
          // Indexed append: VS Code may overwrite existing items at this index.
          // Splice at the specified position, replacing any items that overlap.
          const startIdx = entry.i;
          const count = entry.v.length;
          target.splice(startIdx, target.length - startIdx, ...entry.v);
        } else {
          for (const item of entry.v) {
            target.push(item);
          }
        }
      }
    } else if (target === undefined) {
      // Path doesn't exist yet — create it as an array
      setPath(state, entry.k, entry.v || []);
      appendedPaths.add(pathKey);
    }
  }
}

function getPath(obj, keys) {
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
}

function setPath(obj, keys, value) {
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] == null) {
      cur[k] = typeof keys[i + 1] === 'number' ? [] : {};
    }
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
}

// ── Extract metadata ─────────────────────────────────────────────────────────
const sessionId = state.sessionId || basename(inputPath, '.jsonl');
const customTitle = state.customTitle || state.title || 'Untitled Chat Session';
const inputState = state.inputState || {};
const modelMeta = inputState.selectedModel?.metadata || {};
const modelName = modelMeta.name || modelMeta.id || 'unknown';
const responder = state.responderUsername || 'GitHub Copilot';

const meta = {
  title: customTitle,
  agent: responder,
  model: modelName,
  source: 'github-copilot-chat'
};

// ── Process requests into turns ──────────────────────────────────────────────
const turns = [];
const requests = state.requests || [];

// Tool names we want to skip (internal VS Code tools, not interesting for demos)
const SKIP_TOOLS = new Set([
  'copilot_readFile',
  'copilot_listDirectory',
  'copilot_getWorkspaceStructure',
  'copilot_searchWorkspace',
  'manage_todo_list',
]);

let callCounter = 0;

for (const req of requests) {
  // ── User turn ──────────────────────────────────────────────────────────
  const userText = req.message?.text?.trim();
  if (userText) {
    turns.push({ role: 'user', content: userText });
  }

  // ── Collect semantic groups from response blocks ───────────────────────
  // A "group" is a batch of tool calls (possibly with a preceding text),
  // split whenever a text block appears between tool calls.
  const responseBlocks = req.response || [];

  // First pass: classify each block
  const classified = [];
  for (const block of responseBlocks) {
    const kind = block.kind;
    if (kind === 'toolInvocationSerialized') {
      const toolId = block.toolId || '';
      if (SKIP_TOOLS.has(toolId)) continue;
      if (!block.isComplete) continue;
      classified.push({ type: 'tool', block });
    } else if (kind === 'thinking' || kind === 'mcpServersStarting') {
      continue;
    } else {
      const val = (block.value || '').trim();
      if (val) classified.push({ type: 'text', value: val });
    }
  }

  // Dedup: when VS Code streams a response, it may write a partial text block
  // then later overwrite it with the complete version. If two consecutive text
  // blocks exist where the longer one starts with the shorter one's content,
  // keep only the longer one.
  for (let i = classified.length - 1; i > 0; i--) {
    const cur = classified[i];
    const prev = classified[i - 1];
    if (cur.type === 'text' && prev.type === 'text') {
      const shorter = cur.value.length < prev.value.length ? cur.value : prev.value;
      const longer = cur.value.length >= prev.value.length ? cur.value : prev.value;
      if (longer.startsWith(shorter) || longer.startsWith(shorter.substring(0, Math.min(200, shorter.length)))) {
        // Remove the shorter one
        const removeIdx = cur.value.length < prev.value.length ? i : i - 1;
        classified.splice(removeIdx, 1);
      }
    }
  }

  // Second pass: split into assistant turns at text boundaries
  // Strategy: accumulate tool_use blocks; when a text block appears,
  // flush previous tools as one assistant turn + tool results,
  // then start a new group with the text.
  let currentBlocks = [];
  let currentToolResults = [];

  function flushTurn() {
    if (currentBlocks.length === 0) return;
    turns.push({ role: 'assistant', blocks: currentBlocks });
    for (const tr of currentToolResults) {
      turns.push(tr);
    }
    currentBlocks = [];
    currentToolResults = [];
  }

  for (const item of classified) {
    if (item.type === 'text') {
      // If we have pending tool calls, flush them as a turn first
      if (currentBlocks.some(b => b.type === 'tool_use')) {
        flushTurn();
      }
      currentBlocks.push({ type: 'text', content: item.value });

    } else if (item.type === 'tool') {
      const block = item.block;
      const toolId = block.toolId || '';

      // Extract tool name (strip mcp prefix pattern)
      let toolName = toolId;
      const mcpMatch = toolId.match(/^mcp_[^_]+(?:_[^_]+)*__(.+)$/);
      if (mcpMatch) toolName = mcpMatch[1];

      // Extract input
      const rd = block.resultDetails || {};
      let input = {};
      if (rd.input) {
        try {
          input = typeof rd.input === 'string' ? JSON.parse(rd.input) : rd.input;
        } catch { input = { raw: rd.input }; }
      }

      const callId = `call_${String(++callCounter).padStart(2, '0')}`;

      currentBlocks.push({
        type: 'tool_use',
        id: callId,
        name: toolName,
        input
      });

      // Extract output
      let outputText = '(no output)';
      if (rd.output) {
        const outputs = Array.isArray(rd.output) ? rd.output : [rd.output];
        const parts = [];
        for (const o of outputs) {
          if (typeof o === 'string') {
            parts.push(o);
          } else if (o?.value) {
            try {
              const parsed = JSON.parse(o.value);
              parts.push(formatToolOutput(parsed, toolName));
            } catch {
              parts.push(o.value);
            }
          }
        }
        outputText = parts.join('\n') || '(no output)';
      }

      currentToolResults.push({
        role: 'tool',
        toolUseId: callId,
        name: toolName,
        content: [{ type: 'text', content: outputText }]
      });
    }
  }

  // Flush remaining
  flushTurn();
}

// ── Format tool outputs for readability ──────────────────────────────────────
function formatToolOutput(parsed, toolName) {
  // For query_telemetry, create a readable table summary
  if (toolName === 'query_telemetry' && parsed.type === 'table') {
    const lines = [];
    if (parsed.summary) lines.push(parsed.summary);
    if (parsed.columns && parsed.rows) {
      const colNames = parsed.columns.map((c, i) => c || `col_${i}`);
      // Show as markdown table (up to 15 rows)
      const displayRows = parsed.rows.slice(0, 15);
      if (colNames.some(c => c !== `col_${colNames.indexOf(c)}`)) {
        lines.push('| ' + colNames.join(' | ') + ' |');
        lines.push('|' + colNames.map(() => '---').join('|') + '|');
      }
      for (const row of displayRows) {
        lines.push('| ' + row.join(' | ') + ' |');
      }
      if (parsed.rows.length > 15) {
        lines.push(`... and ${parsed.rows.length - 15} more rows`);
      }
    }
    return lines.join('\n') || JSON.stringify(parsed, null, 2);
  }

  // For get_tenant_mapping
  if (parsed.mappings) {
    const lines = [`Found ${parsed.totalMappings} mapping(s):`];
    for (const m of parsed.mappings) {
      lines.push(`  ${m.companyName} → ${m.aadTenantId} (${m.occurrences} occurrences)`);
    }
    return lines.join('\n');
  }

  // For get_event_catalog
  if (parsed.events && parsed.summary) {
    const lines = [parsed.summary, ''];
    const significant = parsed.significantEvents || [];
    const sigIds = significant.map(s => typeof s === 'object' ? (s.eventId || s.id || '') : String(s));
    for (const e of parsed.events.slice(0, 20)) {
      const marker = sigIds.includes(e.eventId) ? ' ★' : '';
      lines.push(`  ${e.eventId}: ${e.shortMessage || e.description || '?'} — ${e.count} occurrences${marker}`);
    }
    if (sigIds.length > 0) {
      lines.push(`\nSignificant events (90% of volume): ${sigIds.join(', ')}`);
    }
    return lines.join('\n');
  }

  // For get_event_field_samples
  if (parsed.eventId && parsed.fields) {
    const lines = [`Event ${parsed.eventId}: ${parsed.description || ''}`];
    lines.push(`Samples analyzed: ${parsed.samplesAnalyzed}`);
    lines.push('');
    lines.push('Key fields:');
    for (const f of parsed.fields || []) {
      const name = f.name || f.field || f.fieldName || '(unnamed)';
      const type = f.type || f.dataType || '';
      const rate = f.occurrenceRate != null ? ` (${Math.round(f.occurrenceRate * 100)}%)` : '';
      const sample = f.sampleValues?.[0] ? ` — e.g. "${String(f.sampleValues[0]).substring(0, 80)}"` : '';
      lines.push(`  ${name} (${type})${rate}${sample}`);
    }
    return lines.join('\n');
  }

  // For get_knowledge
  if ('articles' in parsed && 'count' in parsed) {
    if (parsed.count === 0) {
      return 'No knowledge base articles found.';
    }
    const lines = [`Found ${parsed.count} article(s):`];
    for (const a of parsed.articles) {
      lines.push(`  - ${a.title || a.id} (${a.category || 'uncategorized'})`);
    }
    return lines.join('\n');
  }

  // Default: compact JSON
  const str = JSON.stringify(parsed, null, 2);
  if (str.length > 1000) {
    return str.substring(0, 1000) + '\n... (truncated)';
  }
  return str;
}

// ── Write output ─────────────────────────────────────────────────────────────
const transcript = { meta, turns };
const outPath = outputPath || './transcript.json';
writeFileSync(outPath, JSON.stringify(transcript, null, 2) + '\n', 'utf8');

console.log(`✓ Extracted → ${outPath}`);
console.log(`  ${turns.length} turns (${turns.filter(t => t.role === 'user').length} user, ${turns.filter(t => t.role === 'assistant').length} assistant, ${turns.filter(t => t.role === 'tool').length} tool)`);
console.log(`  Model: ${modelName}`);
console.log(`  Title: ${customTitle}`);
