---
name: sync-from-user
description: Pull skill updates from the user-level Claude skills folder (~/.claude/skills/) back into this repo's skills/ directory. Use whenever the user says "sync skills", "pull skills", "update skills from user folder", "bring my skill edits back", or after they've been editing a skill live in another project and want the changes reflected here. Only applies inside the waldo.AISkills repo.
---

# Sync skills from user folder

This repo is the source of truth for the user's Claude Skills, but they edit skills live from `~/.claude/skills/<name>/` while working in other projects. This skill pulls those edits back.

## When to run

- The user says some variation of "sync skills", "pull skills from user folder", "update the repo from my live skills".
- After the user mentions editing a skill while in another project.

## Preconditions

- Current working directory must be the root of `waldo.AISkills` (the folder containing `skills/`, `demos/`, `dist/`).
- If not, stop and tell the user — do not guess paths.

## Procedure

1. **List candidates.** For each subfolder `skills/<name>/` in this repo, check whether `~/.claude/skills/<name>/` exists. Those are the skills that can be synced. Report the list to the user before touching anything.

2. **Show a diff first.** For each candidate, run:

   ```bash
   diff -rq skills/<name> ~/.claude/skills/<name>
   ```

   Summarize per skill: "N files changed, M added, K removed" or "no changes". If a skill has no changes, skip it in step 3.

3. **Sync with rsync.** For each skill with changes, immediately run:

   ```bash
   rsync -a --delete ~/.claude/skills/<name>/ skills/<name>/
   ```

   The trailing slashes matter — they make rsync copy *contents* into the target. `--delete` mirrors deletions from the user folder, which is what "source of truth lives in user folder during edits" implies.

4. **Report what changed.** After syncing, run `git status skills/` (if this is a git repo) and show the user a short summary of modified/added/removed files per skill. Do not commit — leave that to the user.

## Edge cases

- **Skill exists in user folder but not in repo.** That's a new skill the user authored live. Import it automatically: `cp -R ~/.claude/skills/<name> skills/<name>` and remind them to add it to [README.md](../../README.md)'s skill table.
- **Skill exists in repo but not in user folder.** Leave it alone — the user simply hasn't deployed it to `~/.claude/skills/` yet. Mention it in the report but don't touch it.
- **Symlinked skill.** If `~/.claude/skills/<name>` is a symlink back into this repo, there is nothing to sync — skip it and tell the user.
- **Dirty working tree.** If `skills/` already has uncommitted changes in this repo, warn the user — they may lose work. But still proceed with the sync unless they explicitly say stop.

## Do not

- Do not touch `demos/` or `dist/` — this skill is scoped to `skills/` only.
- Do not commit on the user's behalf.
- Do not sync in the other direction (repo → user). That's what the deployment instructions in [README.md](../../README.md) are for.
