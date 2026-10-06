#!/usr/bin/env node
// Convert a Claude Code terminal export (the .txt written by `/export`) into the chat-replayer
// transcript schema.
//
// Usage:
//   node extract-claude-export.mjs <export.txt> [--out transcript.json] [--title "..."]
//        [--questions questions.json] [--keep-all]
//
// --questions  Optional. The export keeps only "question → answer" for AskUserQuestion dialogs,
//              not the answer options. A JSON array of rounds (one array of questions per dialog,
//              in order) restores them: [{ header, question, multiSelect?, options:[{label,
//              description}], answer, other? }]. `other: true` marks a typed (free-text) answer.
// --keep-all   Do not cut the export at the first `/chat-replayer` prompt (cut by default, so the
//              replay ends before the request to build it).
//
// Node built-ins only.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const valued = new Set(['--out', '--title', '--questions']);
const src = args.find((a, i) => !a.startsWith('--') && !(i > 0 && valued.has(args[i - 1])));
if (!src) { console.error('usage: extract-claude-export.mjs <export.txt> [--out f] [--title t] [--questions q.json] [--keep-all]'); process.exit(1); }
const out = opt('--out') || './transcript.json';
const qfile = opt('--questions');
const rounds = qfile ? JSON.parse(fs.readFileSync(qfile, 'utf8')) : null;

let lines = fs.readFileSync(src, 'utf8').split('\n').map(l => l.replace(/ /g, ' ').replace(/\s+$/, ''));
if (!args.includes('--keep-all')) {
  const stop = lines.findIndex(l => /^❯ \/chat-replayer\b/.test(l));
  if (stop >= 0) lines = lines.slice(0, stop);
}

// Split into items: ❯ user prompt, ⏺ assistant item, › subagent message, "Ran N shell commands".
const items = [];
for (const l of lines) {
  let m;
  if (l.startsWith('❯ ')) items.push({ kind: 'user', lines: [l.slice(2)] });
  else if (l.startsWith('⏺ ')) items.push({ kind: 'asst', lines: [l.slice(2)] });
  else if (l.startsWith('› ')) items.push({ kind: 'agentmsg', lines: [l.slice(2)] });
  else if ((m = l.match(/^\s*Ran (\d+) shell commands?\b/))) items.push({ kind: 'ran', n: +m[1], lines: [] });
  else if (items.length) items[items.length - 1].lines.push(l.startsWith('  ') ? l.slice(2) : l);
}

// Reflow terminal-wrapped text back into markdown paragraphs, lists and headings.
function reflow(ls) {
  const res = [];
  let para = null;
  const flush = () => { if (para !== null) { res.push(para); para = null; } };
  for (let i = 0; i < ls.length; i++) {
    const l = ls[i].replace(/^▎ ?/, '> ');
    const blankBefore = i === 0 || ls[i - 1].trim() === '';
    const blankAfter = i === ls.length - 1 || ls[i + 1].trim() === '';
    if (l.trim() === '') { flush(); res.push(''); continue; }
    if (/^─{6,}/.test(l.trim())) { flush(); res.push('---'); continue; }
    const starts = /^(\s*[-*]\s|\s*\d+\.\s|>|#|\|)/.test(l);
    if (blankBefore && blankAfter && !starts && l.length < 70 && !/[.:;,?!)]$/.test(l.trim())) {
      flush(); res.push('### ' + l.trim()); continue;
    }
    if (starts || para === null) { flush(); para = l; continue; }
    para += ' ' + l.trim();
  }
  flush();
  return res.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// "· question → answer" pairs as the export prints them.
function exportAnswers(ls) {
  const text = ls.slice(1).map(l => l.replace(/^⎿\s*/, '').trim()).join(' ');
  return text.split(/\s*·\s+/).filter(Boolean).map(s => {
    const k = s.lastIndexOf(' → ');
    return k < 0 ? { question: s, answer: '' } : { question: s.slice(0, k), answer: s.slice(k + 3) };
  });
}

const turns = [];
let asst = null, callN = 0, roundN = 0;
const ensureAsst = () => { if (!asst) { asst = { role: 'assistant', blocks: [] }; turns.push(asst); } return asst; };
const tool = (name, input, result) => {
  const id = 'call_' + String(++callN).padStart(3, '0');
  ensureAsst().blocks.push({ type: 'tool_use', id, name, input });
  turns.push({ role: 'tool', toolUseId: id, name, content: [{ type: 'text', content: result || '(no output)' }] });
  asst = null;
};

for (const it of items) {
  if (it.kind === 'user') { asst = null; turns.push({ role: 'user', content: reflow(it.lines) }); continue; }
  if (it.kind === 'ran') {
    tool('Bash', { description: `Ran ${it.n} shell command${it.n > 1 ? 's' : ''} (collapsed in the export)` },
      '(details collapsed in the terminal export)');
    continue;
  }
  if (it.kind === 'agentmsg') {
    const [head, ...body] = it.lines;
    tool('SubagentReport', { description: head }, body.join('\n').trim());
    continue;
  }
  const first = it.lines[0];
  if (/^User answered Claude.s questions/.test(first)) {
    roundN++;
    const qs = rounds ? rounds[roundN - 1] : null;
    if (rounds && !qs) throw new Error(`question round ${roundN} is in the export but not in ${qfile}`);
    let md, input, result;
    if (qs) {
      input = { description: `Question dialog — round ${roundN}`, questions: qs.map(q => ({ header: q.header, question: q.question, multiSelect: !!q.multiSelect, options: q.options })) };
      md = qs.map((q, i) => {
        const picked = q.answer.split(/,\s*/);
        const opts = q.options.map(o => `- ${!q.other && (picked.includes(o.label) || q.answer === o.label) ? '✅' : '◻️'} **${o.label}** — ${o.description}`).join('\n');
        const other = q.other ? `\n- ✅ **Other (typed):** ${q.answer.replace(/\n/g, ' ')}` : '\n- ◻️ *Other*';
        return `**${i + 1}. [${q.header}]${q.multiSelect ? ' (multi-select)' : ''}** ${q.question}\n\n${opts}${other}`;
      }).join('\n\n');
      result = qs.map(q => `· ${q.header}: ${q.answer}`).join('\n');
    } else {
      const qa = exportAnswers(it.lines);
      input = { description: `Question dialog — round ${roundN}`, questions: qa.map(x => ({ question: x.question })) };
      md = qa.map((x, i) => `**${i + 1}.** ${x.question}\n\n- ✅ ${x.answer}`).join('\n\n');
      result = qa.map(x => `· ${x.question} → ${x.answer}`).join('\n');
    }
    ensureAsst().blocks.push({ type: 'text', content: `🗳️ **Question dialog — round ${roundN}**\n\n${md}` });
    tool('AskUserQuestion', input, result);
    continue;
  }
  const tm = first.match(/^([A-Z][A-Za-z_]+)\((.*)$/);
  if (tm) {
    let header = tm[2], i = 1;
    while (i < it.lines.length && !it.lines[i].startsWith('⎿')) { header += ' ' + it.lines[i].trim(); i++; }
    header = header.replace(/\)\s*$/, '');
    const result = it.lines.slice(i).map(l => l.replace(/^⎿\s{0,2}/, '')).join('\n').trim();
    const key = tm[1] === 'Bash' ? 'command' : tm[1] === 'Skill' ? 'skill' : 'file';
    tool(tm[1], { [key]: header }, result);
    continue;
  }
  if (/^\d+ background agents? launched/.test(first)) {
    const names = it.lines.slice(1).map(l => l.replace(/^\s*[├└]\s*/, '').trim()).filter(Boolean);
    tool('Agent', { description: first, agents: names.join('\n') }, 'Running in the background');
    continue;
  }
  if (/^Agent ".*" finished/.test(first)) { ensureAsst().blocks.push({ type: 'text', content: `*✓ ${first}*` }); continue; }
  ensureAsst().blocks.push({ type: 'text', content: reflow(it.lines) });
}

if (rounds && roundN !== rounds.length) throw new Error(`export has ${roundN} question rounds, ${qfile} has ${rounds.length}`);
const firstUser = turns.find(t => t.role === 'user');
const title = opt('--title') || (firstUser ? firstUser.content.split('\n')[0].slice(0, 80) : path.basename(src, '.txt'));
fs.writeFileSync(out, JSON.stringify({ meta: { title, agent: 'Claude Code', source: 'claude-code-export' }, turns: turns.filter(t => t.role !== 'assistant' || t.blocks.length) }, null, 2));
const c = { user: 0, assistant: 0, tool: 0 };
turns.forEach(t => c[t.role]++);
console.log(`✓ ${out}: ${c.user} user, ${c.assistant} assistant, ${c.tool} tool turns; ${roundN} question round(s)${rounds ? ' (options restored)' : ' (options not in export)'}`);
