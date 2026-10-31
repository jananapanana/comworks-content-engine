# Sources: where COM works knowledge lives

Source: intake block F. Every source has a default confidentiality; a row in the board database "3 Sources" can override it. The engine reads only what is listed here.

| Source | Where | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| Case studies | `com-works-brand/case-studies/*.md` | Existing content | Public for released clients, otherwise Anonymize | woolworth-2025 final, nory-2026 draft (numbers pending release), bridgewave-2026 released |
| Repositioning status | `com-works-brand/repositioning-status-2026-07-24.md` | Vault note | Public | Claim, differentiator, three layers |
| Playbooks | `knowledge/*.md` | Vault note | Anonymize | lifecycle-strecken.md, client names inside |
| Decisions | `DECISIONS.md` | Vault note | Anonymize | Technical and business decisions, client names inside, client money inside: strip |
| Client deliverables | `clients/<client>/deliverables/*.md` | Vault note | Anonymize | Only the clients listed as anonymizable in `rules.md`. Peakora engagements: industry only |
| Client briefings and changelogs | `clients/<client>/BRIEFING.md`, `CHANGELOG.md` | Vault note | Anonymize | Rich in situations and numbers, also rich in money: strip hard |
| Meeting transcripts | Fathom, Wispr Flow, Jamie via connectors | Transcript | Anonymize | Client weeklies and scoping calls. Partner calls (DeskMagic) are Never use. **Active from run 002** (skipped in run 001) |
| My 2 Cents | Notion page `56239a9ddcab4ecf87d401f721868d9c`, database "Thoughts & Learnings" (`collection://45e36500-04a0-447e-91bf-e885f7f51050`: Name, Format, topic tags, Source, URL) and "AI Use Cases" (`collection://0699ac90-1f07-4acc-8be8-ec901c1db4e4`) | Vault note (Notion) | Public | Jana's own reading notes and learnings, last edited 2024 `[CHECK]` whether still maintained. Read through the Notion connector per run, entries created after the last run. Added 2026-10-31 |
| Claude Code sessions | `~/.claude/projects/-Users-janapelchen-Documents-Jana-HQ/` (local JSONL) | Working notes | Anonymize | What was found, decided and built in the last 14 days of sessions. Only the insight is extracted, never client data, never pasted material. Added 2026-10-31 |
| Notion, other pages | | | **Never use** unless listed above | No workspace-wide search. A page becomes a source by getting its own row here |
| Gmail inbox | | | **Never use** | Decision 2026-10-31, follows the rule of 2026-09-22 (no personal client data in Claude). Revisit when a sent-mail-only, insight-only route is agreed |
| Pipeline and partner files | `pipeline/`, `partners/` | | **Never use** | Deals in negotiation, partner strategy |
| Peakora tools | Slack, ClickUp of Peakora | | **Never use** | NDA wall relaxed in the vault, still never in content |
| Manual upload | pasted text or a file in `content-engine/inbox/` | Manual upload | as stated by the operator | |

## What never enters this repository

Raw sources stay where they are. No transcript, chat export, email or Notion page is copied into `content-engine/`. The engine reads them per run through the connectors and keeps only the anonymised insight card on the board. Decision 2026-10-31.

## Ingest order for a run

1. New or changed case studies and playbooks (richest, already written for an audience)
2. Transcripts from the last 14 days, client weeklies first
3. Client deliverables and changelogs changed in the last 14 days
4. My 2 Cents entries and Claude Code sessions of the last 14 days
5. Decisions of the last 14 days

Stop when six to ten candidate cards exist. More cards than slots is fine, the board keeps Accepted cards for later weeks.

## Change log

- 2026-10-06: created
- 2026-10-31: My 2 Cents and Claude Code sessions added, transcripts set active, Gmail and unlisted Notion pages set to Never use, no-raw-copies rule written down (Linear COM-86)
