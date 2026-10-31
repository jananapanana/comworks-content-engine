# Learnings

What Jana takes from building the engine. One to three lines per step, dated, with the Linear issue. Claude proposes, Jana strikes or adds. Linear shows what happened, this file shows what it taught.

## Toolstack (Linear, GitHub, Cursor)

- 2026-10-31 (COM-62, COM-80 to COM-92): A Linear initiative is a parent issue with sub-issues, milestones carry the initiative prefix. Writing "goal, what happens, why, check" into every issue before starting makes the plan reviewable without reading a chat
- 2026-10-31 (COM-81): A nested Git repository inside another one works when the outer `.gitignore` excludes the folder. The vault already does this with `website/`

- 2026-10-31 (COM-84, COM-85): The Notion connector can change a database schema (new select options, new fields) and add rows, so configuration in Markdown and workflow state in Notion can be kept in step from one session. The Markdown file is still the one that counts

## Engine (architecture, decisions)

- 2026-10-31: Markdown configuration is canonical, Notion holds workflow state, Claude Code is the runtime. The same split the Layer Cache proposal called Option A, built without a backend of its own
- 2026-10-31: "Sources are replicated into the repo" is not needed for the engine to work. Reading sources per run through connectors keeps client data where it is and keeps the repo shareable

## Content (what reached the audience)

- (first entries after the post of 2026-11-05)
