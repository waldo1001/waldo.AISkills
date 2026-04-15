#!/usr/bin/env node
// list-vscode-sessions.mjs — list GitHub Copilot Chat sessions from VS Code workspace storage
// Usage: node list-vscode-sessions.mjs [<workspace-storage-id>]
//
// Reads the chat session index from VS Code's state.vscdb and prints
// non-empty sessions sorted by last message date (newest first).
//
// If no workspace-storage-id is given, lists available workspace folders.

import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const storageRoot = join(
  homedir(),
  'Library',
  'Application Support',
  'Code',
  'User',
  'workspaceStorage'
);

const wsId = process.argv[2];

if (!wsId) {
  // List workspace storage folders that have copilot-chat data
  console.log('Available workspace storage folders with Copilot Chat sessions:\n');
  const folders = readdirSync(storageRoot, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .filter(d => {
      const dbPath = join(storageRoot, d.name, 'state.vscdb');
      return existsSync(dbPath);
    });

  for (const folder of folders) {
    const dbPath = join(storageRoot, folder.name, 'state.vscdb');
    try {
      const raw = execSync(
        `sqlite3 "${dbPath}" "SELECT value FROM ItemTable WHERE key = 'chat.ChatSessionStore.index'" 2>/dev/null`,
        { encoding: 'utf8', timeout: 5000 }
      ).trim();
      if (!raw) continue;
      const data = JSON.parse(raw);
      const entries = Object.values(data.entries || {}).filter(e => !e.isEmpty);
      if (entries.length === 0) continue;

      // Try to get workspace folder name
      let wsName = folder.name;
      try {
        const wsRaw = execSync(
          `sqlite3 "${dbPath}" "SELECT value FROM ItemTable WHERE key = '__\$__targetStorageMarker'" 2>/dev/null`,
          { encoding: 'utf8', timeout: 5000 }
        ).trim();
        if (wsRaw) {
          const wsMarker = JSON.parse(wsRaw);
          const url = wsMarker.url || wsMarker;
          wsName = typeof url === 'string' ? decodeURIComponent(url.replace(/^file:\/\//, '').split('/').pop()) : folder.name;
        }
      } catch { /* ignore */ }

      console.log(`  ${folder.name}  (${entries.length} sessions)  ${wsName}`);
    } catch { /* ignore folders without valid data */ }
  }
  console.log('\nRe-run with a workspace ID to list sessions:');
  console.log('  node list-vscode-sessions.mjs <workspace-storage-id>\n');
  process.exit(0);
}

const dbPath = join(storageRoot, wsId, 'state.vscdb');
if (!existsSync(dbPath)) {
  console.error(`Error: state.vscdb not found at ${dbPath}`);
  process.exit(1);
}

// Read session index
const raw = execSync(
  `sqlite3 "${dbPath}" "SELECT value FROM ItemTable WHERE key = 'chat.ChatSessionStore.index'"`,
  { encoding: 'utf8', timeout: 5000 }
).trim();

if (!raw) {
  console.error('No chat session index found.');
  process.exit(1);
}

const data = JSON.parse(raw);
const entries = Object.values(data.entries || {})
  .filter(e => !e.isEmpty)
  .sort((a, b) => (b.lastMessageDate || 0) - (a.lastMessageDate || 0));

if (entries.length === 0) {
  console.log('No non-empty chat sessions found.');
  process.exit(0);
}

// Output as JSON for programmatic use
const output = entries.map((e, i) => ({
  index: i + 1,
  sessionId: e.sessionId,
  title: e.title || '(untitled)',
  lastMessage: new Date(e.lastMessageDate).toISOString(),
  created: e.timing?.created ? new Date(e.timing.created).toISOString() : null,
}));

// Pretty table output
console.log(`\nCopilot Chat sessions for workspace ${wsId}:\n`);
console.log('  #  Title                                              Last Message');
console.log('  — ————————————————————————————————————————————————————— ————————————————————');
for (const s of output) {
  const idx = String(s.index).padStart(2);
  const title = s.title.padEnd(55).slice(0, 55);
  const date = s.lastMessage.replace('T', ' ').slice(0, 19);
  console.log(`  ${idx} ${title} ${date}`);
}

// Also output as JSON to stderr for programmatic consumption
console.error(JSON.stringify(output));
