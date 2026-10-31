# Social Media Content Engine (SMCE)

**Owner:** Jana Pelchen, COM works. **Started:** 2026-10-06 (Session 145). **Status:** pilot, tenant 1 is COM works.
**Language:** everything in this folder, on the Notion board and in every post is English. German belongs in the vault files outside this folder.

The engine turns approved company knowledge into source-backed insight cards, a weekly LinkedIn plan, draft posts and branded visuals. A human accepts the insights, approves every post and publishes by hand. Edits and performance numbers flow back as proposed configuration changes.

Built in-house in Claude Code after the Layer Cache proposal (rc3, 01.10.2026) was declined on price. The architecture follows that proposal's Option A: Markdown configuration is canonical, Notion holds the workflow state, the operator starts every run, no server, no scheduling. Plan: [[com-works-brand/smce-plan-v0.1-2026-09-23|smce-plan-v0.1-2026-09-23.md]] (rc1, de-branded). PRD: Google Doc `1pHNwqXcCsQ4lA67bUegyO5jIzVqbkSg6mjXMBQen0XY`.

## Layout

```
content-engine/
├── README.md              this file
├── BACKLOG.md             bugs, features, ideas. Every run logs here so Option B (web app) can be built from it
├── core/                  tenant-agnostic. Ships to other companies unchanged
│   ├── ENGINE.md          the run, step by step, with the rules every step obeys
│   ├── checks.md          content checks a draft must pass before it reaches the board
│   ├── notion-schema.md   the nine objects and their fields (schema only, no IDs)
│   ├── skills/            setup.md, run.md, render.md, learn.md (what the operator invokes)
│   └── render/            carousel.html, single.html, render.js (HTML templates with brand tokens)
├── tenants/
│   ├── comworks/          tenant 1. about, icp, voice, pillars, rules, brand, sources, notion, samples/
│   └── deskmagic/         tenant 2, prepared and empty
├── runs/                  one log per run: what was read, produced, skipped, and why
└── output/                rendered PDFs and PNGs, named <tenant>-<slot date>-<format>.<ext>
```

## Commands (Claude Code, this vault)

| Command | Does |
| --- | --- |
| `/ce-setup <tenant>` | Builds or refreshes the tenant configuration from the intake answers and reviews it with the operator |
| `/ce-run <tenant>` | Weekly run: sources to insight cards to plan to drafts to Notion |
| `/ce-render <tenant> <post>` | Renders the carousel PDF or single graphic PNG for one post |
| `/ce-learn <tenant>` | Reads edits and metrics on the board, proposes configuration changes, writes approved ones back |

## Three rules that outrank everything else

1. **No client money.** No costs, prices, day rates, budgets, tool spend or contract values of any client, on the board, in a card, in a post or in a rendered asset. Effort, outcomes and time saved are fine
2. **Nothing reaches the board before the checks pass** ([[content-engine/core/checks|checks.md]]). Client names and identifying details are removed at the insight-card stage
3. **Markdown is canonical.** The plugin reads `tenants/<tenant>/*.md` at the start of every run. Notion holds workflow state only. Configuration changes go through `/ce-learn` proposals that the operator approves

## Decisions of 2026-10-31 (Jana, Session 158)

- No build partner. The engine is built in-house; the Layer Cache proposal stays the concept reference, nothing more
- No raw copies of sources in this repo. Configuration and anonymised knowledge notes only. Raw sources are read per run through the connectors, Notion keeps the workflow state
- Inbox (Gmail) is **Never use** for now
- This folder becomes its own private GitHub repository (`jananapanana/comworks-content-engine`), nested in the vault like `website/`
- Cursor Free works on this repo for renderer, templates and reading code. Claude Code runs the engine
- New sources: My 2 Cents (Notion), Claude Code sessions. Transcripts move from planned to active
- Audience widened: CEO, CMO, CRO stay the core, Director and VP level at enterprise and Series B companies added, solopreneurs read along
- Channels: LinkedIn and X, both English, posted by hand
- Series unchanged: Before and after, One number, Workflow of the week
- First real post Thursday 2026-11-05
- Task tracking in Linear, parent COM-62, milestones prefixed "SMCE:". Every sub-issue states goal, what happens, why, and the check. `LEARNINGS.md` records what Jana takes from each step

## Decisions carried into the build

- Four pillars from the live board (Opinions on GTM, Build and hand over, Data before campaigns, AI as the method). The six-pillar planner "SoMe Content Calendar" from 22.09. is retired (Jana, 06.10.2026)
- The former dummy board is the live board. Dummy rows stay as examples until real rows replace them
- Voice reference: the four example posts on the board, saved in `tenants/comworks/samples/`
- First run COM works only. DeskMagic is prepared as tenant 2 and stays empty until its data agreement is signed
