---
name: chat-replayer
description: Convert AI agent chat sessions (Copilot Studio, GitHub Copilot Chat, ChatGPT, Claude, or any pasted/exported conversation) into self-contained, sanitized HTML files that replay the chat for live presentation. Use this skill whenever the user wants to "show a chat", "replay a conversation", "demo an agent session", "turn a chat into HTML", "make a chat for my talk", or needs to present an AI conversation to an audience without doing it live. Also use for sanitizing chat transcripts before sharing, or building reusable demo chats for conference talks, internal training, or sales demos. Strongly prefer this skill over manually constructing HTML or markdown when the goal is to present a chat session.
---

# Chat Replayer

Turn a real (or hand-crafted) AI chat session into a single self-contained HTML file the user can open in a browser and step through during a presentation. Tool calls, inputs, and results are visible.

## Output

One file: `<slug>.html`. No external dependencies. The transcript JSON is embedded inside it. The user can email it, drop it on a USB stick, or open it on conference WiFi-less laptops.

## Workflow

Four steps. Do not skip any.

1. **Acquire the chat** — get the raw conversation from the user.
2. **Normalize to transcript schema** — produce `transcript.json`.
3. **Sanitize** — produce `transcript.sanitized.json` via `scripts/sanitize.mjs`.
4. **Build HTML** — produce `<slug>.html` via `scripts/build.mjs`. Present it.

---

## Step 1 — Acquire the chat

Ask the user how they want to provide the chat. Accept any of:

- **Pasted text** in the conversation (most common for Copilot Studio test pane).
- **An exported file** (JSON, HTML, .md) — they upload it.
- **A screenshot** — Claude is multimodal; OCR the conversation visually if needed.
- **A description** — for hand-crafted demo chats (no real source).

If the source isn't obvious, ask: *"Is this from Copilot Studio, Copilot Chat, ChatGPT, Claude, or something else?"* — knowing the source helps with parsing tool calls, which every platform formats differently.

### Source-specific hints

- **Copilot Studio test pane**: User typically copies the visible conversation. Tool calls (Power Automate flows, knowledge sources, generative actions) often render as collapsed cards labeled "Used X" — ask the user to expand them before copying, or to describe what was called.
- **GitHub Copilot Chat**: Tool calls appear as `🔧 tool_name` headers with collapsible JSON. Workspace search, file edits, and terminal commands are all tool calls.
- **ChatGPT / Claude exports**: JSON exports have explicit `tool_use` and `tool_result` content blocks — easy to map.

---

## Step 2 — Normalize to transcript schema

Map whatever the user gave you into this exact JSON shape and write it to `./transcript.json` in the working directory.

```jsonc
{
  "meta": {
    "title": "BC Telemetry Buddy — slow page load investigation",
    "agent": "BC Telemetry Buddy",
    "model": "gpt-4o",                    // optional
    "source": "copilot-studio"            // optional
  },
  "turns": [
    { "role": "user", "content": "Why is the Sales Order list slow for Contoso since Tuesday?" },
    {
      "role": "assistant",
      "blocks": [
        { "type": "text", "content": "Let me check telemetry for that environment." },
        {
          "type": "tool_use",
          "id": "call_01",
          "name": "query_app_insights",
          "input": {
            "kql": "traces | where customDimensions.environmentName == 'CONTOSO-PROD' | ...",
            "timespan": "P7D"
          }
        }
      ]
    },
    {
      "role": "tool",
      "toolUseId": "call_01",
      "name": "query_app_insights",
      "content": [
        { "type": "text", "content": "1,284 rows. Top operation by duration: PageOpen on Page 9305." }
      ]
    },
    {
      "role": "assistant",
      "blocks": [
        { "type": "text", "content": "Found it. There's a missing key on table 36 since the upgrade..." }
      ]
    }
  ]
}
```

**Schema rules:**

- `role` ∈ `user | assistant | tool`.
- Assistant turns hold a `blocks` array — text and tool_use blocks interleaved, in order.
- Tool turns reference the call they answer via `toolUseId`. Always emit a tool turn for every tool_use, even if the result was empty (use `[{type:"text",content:"(no output)"}]`).
- For tool inputs with a query field (`kql`, `sql`, `code`, `query`, `prompt`), keep them as a single string — the player will syntax-highlight it.
- If you encounter content you can't classify, emit it as a text block prefixed with `[unrecognized: <hint>]` rather than dropping it. The user can fix it later.

**See `examples/telemetry-buddy.json` for a full reference transcript.**

---

## Step 3 — Sanitize

Sanitization is a separate pass so the user can edit `transcript.json` first if they want.

1. Look for `redactions.json` in the working directory. If absent, copy `redactions.default.json` from this skill's folder and tell the user *"I'm using the default redaction patterns. Edit redactions.json if you want to add customer-specific replacements."*
2. **Ask the user**: *"Any specific names, customer IDs, or strings to redact beyond the defaults?"* Add their answers to `redactions.json` as `replacements` entries.
3. Run:
   ```bash
   node scripts/sanitize.mjs ./transcript.json ./redactions.json
   ```
4. This writes `./transcript.sanitized.json` and prints a summary (N replacements, M blocks dropped).
5. **Show the user the summary.** If it shows zero replacements but the transcript clearly contained customer data, something is off — investigate before continuing.

---

## Step 4 — Build the HTML

```bash
node scripts/build.mjs ./transcript.sanitized.json --out ./<slug>.html --title "<optional override>"
```

This injects the sanitized JSON into `templates/replayer.html` and writes a self-contained file. Slug defaults to a kebab-case version of the transcript title.

**Present the file** to the user with `present_files`. Briefly explain:

- Open in any modern browser.
- **Space** or **→** reveals the next turn (use this during presenting).
- **←** hides the last turn. **Home** resets. **End** reveals all.
- **P** toggles auto-play.
- Drag-drop a different transcript JSON onto the page to swap content without rebuilding.

---

## Reusing across demos

The user is building this once to use across many agent demos. After the first run:

- The `redactions.json` they built up is reusable — suggest they keep a master copy and copy it into each new working folder.
- Encourage saving `transcript.json` (pre-sanitization) under version control, so they can re-sanitize with updated rules later.
- If the user has multiple chats to convert in one session, batch them: produce all transcript.json files first, then sanitize, then build.

---

## Common pitfalls

- **Don't render a chat into HTML directly.** Always go through the schema. The schema is what makes the player consistent and makes future edits possible.
- **Don't skip sanitization** even for "internal" chats. The user is building demo material — assume it will end up on a public conference recording.
- **Don't add dependencies** to the scripts beyond what's already there (Node built-ins only). The whole point is portability.
- **Don't modify the HTML template** to hardcode a transcript. Always inject via `build.mjs`.
