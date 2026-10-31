# SMCE Backlog

Bugs, features and ideas, logged on every run so a later software version (Option B: web app plus MCP server) can be specified from real usage. One line per item, newest first inside each section. Move items to Done with the date.

## Bugs

- [ ] **B-001** Notion MCP refuses SQL across several data sources (Business plan required). Single-source queries work. Workaround: one query per object, join in Claude (2026-10-06)

## Features (needed before a second tenant)

- [ ] **F-001** Guided setup from the 37-question intake into `tenants/<tenant>/*.md` (today: hand-written for COM works)
- [ ] **F-002** Dedupe insight cards against cards and posts of the last 90 days (PRD E3)
- [ ] **F-003** Reminder when a draft waits longer than 48 hours (PRD A4)
- [ ] **F-004** Retain the original generated draft next to the edited one (rc3 section 02). Today: `Jana edit notes` field only
- [ ] **F-005** Run state: which source rows were processed in which run, resumable batches (rc3 section 03)

## Ideas

- [ ] **I-001** Postiz as the publishing and scheduling layer once manual posting becomes the bottleneck (Domenico, 01.10.2026)
- [ ] **I-002** Option B: web app as system of record with MCP tools get_config, claim_slot, submit_draft, propose_config_change (rc3 section 01)
- [ ] **I-003** GPT Image illustrations with a brand prompt (T3, excluded from the pilot)

## Done

