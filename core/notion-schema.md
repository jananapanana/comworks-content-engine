# Notion board schema: the nine objects

Schema only. Database IDs per tenant live in `tenants/<tenant>/notion.md`. Property names must match exactly when writing rows.

| # | Object | Type | Properties (title first) |
| --- | --- | --- | --- |
| 1 | About the company | page | free text, mirrors `about.md` |
| 2 | ICP | database | Persona (title), Role (CEO / GF, CMO, CRO / CSO, Counterpart), Priority (P1, P2, P3), Industry group (multi), Company size (50-200, 200-500, 500+), Pain, Belief to build, Top objection, Insight cards (rel), Posts (rel) |
| 3 | Sources | database | Source (title), Type (Transcript, Notion page, Vault note, Manual upload, Existing content), Recorder / system (Wispr Flow, Fathom, Jamie, Notion, Drive, Other), Date, Participants, Link, Confidentiality (Public, Anonymize, Never use), Processed (checkbox), Processed on, Insight cards (rel) |
| 4 | Insight cards | database | Claim (title), Evidence (anonymized), Source (rel), Pillar (rel), Audience (rel), Status (New, Accepted, Used, Discarded), Anonymization check (Passed, Failed, Pending), Extracted on, Posts (rel) |
| 5a | Pillars | database | Pillar (title), Description, Target share % (number, percent), Audience focus (Buyer, Counterpart, Both), Channel (LinkedIn personal, LinkedIn company), Status (Proposed, Approved, Retired), Series (rel), Insight cards (rel), Posts (rel) |
| 5b | Series | database | Series (title), Description, Rhythm (Weekly, Biweekly, Monthly, Ad hoc), Slot (Tuesday, Thursday, Either), Format (Carousel, Single graphic, Text only), Status (Proposed, Approved, Retired), Pillar (rel), Posts (rel) |
| 6 | Posts | database | Post (title), Status (Not started, In progress, Done), Channel (LinkedIn personal, LinkedIn company, X), Slot (Tuesday, Thursday), Slot date, Format (Carousel, Single graphic, Illustration, Text only), Hook, Alt hook, Copy, X copy (max 280 characters, added 2026-10-31), Asset brief, Asset (file), Insight card (rel), Pillar (rel), Series (rel), Audience (rel), Jana edit notes, Rejection reason, Published URL, X published URL (added 2026-10-31), Impressions, Reactions, Comments, Reposts, Metrics logged on, Engagement rate (formula) |
| 7 | Brand and CI | page | tokens, fonts, logo, dos and don'ts, mirrors `brand.md` |
| 8 | Tone of voice | page | profile and corrections log, mirrors `voice.md` |
| 9 | Asset templates | page | template specs and design rules, mirrors `core/render/` |

## Status meaning in 6 Posts

Not started = draft waiting for review. In progress = being edited or approved, ready to publish. Done = published, URL filled. A rejected draft stays Not started with a `Rejection reason`.

## Writing rules

- Dates are day-only (`is_datetime` 0), Berlin
- Relations take the page URL of the related row
- Numbers are numbers, not strings
- Never write a tenant's config into Notion as the source of truth. Pages 1, 7, 8, 9 are mirrors for readers without vault access; the Markdown wins when they differ
