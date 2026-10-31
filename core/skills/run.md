# /ce-run <tenant>

Weekly production run. Follow `core/ENGINE.md` steps 1 to 5 exactly. This file adds the operator protocol.

## Protocol

1. **Load.** Read `tenants/<tenant>/` completely, `core/checks.md`, `core/notion-schema.md`. Fetch board state (single-database queries only, see BACKLOG B-001): pillars, series, posts of the last eight weeks, cards with status New or Accepted, sources with Processed unchecked
2. **Open the run log** `runs/<YYYY-MM-DD>-<tenant>-run-NNN.md` with: date, operator, slots to fill, sources considered
3. **Ingest and extract.** Produce cards. Show them as a table (claim, evidence, pillar, audience, source, check result). **Stop.** Wait for accept, merge, discard per card. Write Accepted and Discarded cards to the board
4. **Plan.** Show the plan table. **Stop.** Wait for a go or changes
5. **Draft.** Write the drafts, run the checks, show hook, alt hook, copy and asset brief per post with the check results. **Stop.** Wait for a go
6. **Write** the posts to the board, mark cards Used, mark sources Processed with today's date. Report the Notion links
7. **Close the run log** with what was written, what was skipped and why, and anything added to `BACKLOG.md`

Three stops, no exceptions. The operator decides what reaches the board.

## Voice and style

Drafts follow `tenants/<tenant>/voice.md` and the samples. Before showing a draft, read it against the four samples once more: same sentence length, same specificity, same ending.
