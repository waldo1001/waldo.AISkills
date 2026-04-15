# waldo.AISkills

My personal collection of [Claude Skills](https://docs.claude.com/en/docs/claude-code/skills), ready to copy into other projects or upload to Claude.

## Layout

```
skills/         One folder per skill. Each is self-contained around its SKILL.md.
demos/          Rendered demo output (e.g. replayed chats for talks).
dist/           Packaged skill .zip files, ready to upload.
```

## Skills

| Skill | Description |
|---|---|
| [chat-replayer](skills/chat-replayer/SKILL.md) | Convert AI agent chat sessions into self-contained, sanitized HTML files that replay the chat for live presentation. |
| [sync-from-user](skills/sync-from-user/SKILL.md) | Local repo skill. Pull skill edits from `~/.claude/skills/` back into this repo after editing them live in another project. |

---

# Deploying a skill

Claude Code discovers skills in two locations:

- **Per-project** — `.claude/skills/<skill-name>/SKILL.md` inside a target repo. Committed with the project so the whole team gets it.
- **User-level** — `~/.claude/skills/<skill-name>/SKILL.md`. Available across every project on your machine, not shared with others.

In both cases, `SKILL.md` must sit directly inside the `<skill-name>/` folder. The paths referenced inside it (`scripts/`, `templates/`, `examples/`) resolve relative to that folder, so copying the whole skill folder "just works."

## Deploy to another repo (project-scoped)

From the root of this repo:

```bash
TARGET=/path/to/target-repo
mkdir -p "$TARGET/.claude/skills"
cp -R skills/chat-replayer "$TARGET/.claude/skills/"
```

Commit the `.claude/skills/chat-replayer/` folder in the target repo so teammates pick it up.

## Deploy user-wide

```bash
mkdir -p ~/.claude/skills
cp -R skills/chat-replayer ~/.claude/skills/
```

Available in every project you open, but only on your machine.

## Upload to Claude.ai / the API

Zip the **contents** of the skill folder so `SKILL.md` sits at the zip root (not nested under a folder), then upload via the Skills UI:

```bash
cd skills/chat-replayer
zip -r ../../dist/chat-replayer.zip . -x '*.DS_Store'
cd -
```

The resulting `dist/chat-replayer.zip` is what you upload.

## Keeping deployed copies in sync

`cp -R` is a one-shot snapshot — future edits in this repo don't flow to deployed copies. Options:

- **Re-copy on update.** Simplest. Just run the `cp -R` again when you change a skill.
- **Symlink (user-level only).** `ln -s "$PWD/skills/chat-replayer" ~/.claude/skills/chat-replayer`. Don't symlink into a committed `.claude/skills/` — git won't follow it usefully.
- **Git submodule / subtree.** Heavier; only worth it when a skill is actively co-developed alongside a consuming repo.

For most cases, plain `cp -R` plus re-copying on updates is fine.

## Authoring checklist for a new skill

1. Create `skills/<skill-name>/SKILL.md` with YAML frontmatter (`name`, `description`).
2. Put supporting files next to it under `scripts/`, `templates/`, `examples/` as needed — reference them by relative path from `SKILL.md`.
3. Keep dependencies minimal (Node built-ins, no `npm install`) so the skill is portable.
4. Add the skill to the table above.
5. Build the zip into `dist/` if you intend to upload it.
