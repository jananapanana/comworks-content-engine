# The engine: how a run works

Tenant-agnostic. The operator starts a run from Claude Code with `/ce-run <tenant>`. Everything below reads from `tenants/<tenant>/` and writes to that tenant's Notion board (IDs in `tenants/<tenant>/notion.md`). Nothing about a tenant lives in `core/`.

## Before every run

1. Read all of `tenants/<tenant>/`: `about.md`, `icp.md`, `voice.md`, `pillars.md`, `rules.md`, `brand.md`, `sources.md`, `notion.md`, and the files in `samples/`
2. Read `checks.md` and `notion-schema.md`
3. Read the board state you need: pillars and series (shares, slots, status), the last eight weeks of posts (what went out, which pillar, which series), open insight cards (New or Accepted), unprocessed sources
4. Open a run log at `runs/<date>-<tenant>-run-NNN.md` and keep it current while you work

## Step 1: Ingest

Read the sources named in `sources.md` that are new or changed since the last run. Each source has a confidentiality status: **Public** (use as is), **Anonymize** (strip client and people names, products, places, amounts), **Never use** (skip, do not read). Register every source you read as a row in **3 Sources** if it is not there yet.

Sources are read inside the tenant's own Claude environment. They are not copied anywhere.

## Step 2: Extract insight cards

From the sources, write insight cards. One card is **one claim** a buyer or counterpart would find useful, plus the **evidence** behind it (paraphrased, anonymized), the suggested **pillar** and **audience**, and the **source** row it came from.

Rules for a card:
- One claim per card, written as a sentence someone could disagree with
- Evidence is specific: a situation, a number, a before and after. Numbers only when the source states them
- Client identifiers removed. Industry and company type may stay ("a shipping platform", "a DJ school"). People stay out entirely
- Set `Anonymization check` to Passed only after running the check in `checks.md`. Failed cards are written with status Discarded so the attempt is visible
- Skip claims that already exist as a card or a post from the last 90 days

Write the cards to **4 Insight cards** with status New. Stop and show the operator the list. The operator accepts, merges or discards. Only Accepted cards move on.

## Step 3: Plan

Fill the next open slots (default two: Tuesday and Thursday) from Accepted cards:
- Respect pillar target shares against the last eight weeks. The pillar furthest below its share goes first
- Respect series rhythm and slot (a biweekly Tuesday series gets its Tuesday every second week)
- No two consecutive posts from the same pillar unless the shares force it
- Alternate audiences where the pillars allow it
- If there is no usable card for a slot, leave the slot empty and say why. Never invent a post to fill a calendar

Show the plan to the operator before drafting: slot date, pillar, series, card, format, channel.

## Step 4: Draft

For each planned slot write one post in the tenant's voice (`voice.md`, `samples/`) for the chosen audience (`icp.md`) with the company context (`about.md`):
- **Hook:** the first line, shown before "see more". Specific, no question unless the card is a question. Two alternatives: `Hook` and `Alt hook`
- **Copy:** 60 to 180 words. Short sentences. One point per sentence. Ends on the claim or on one concrete instruction. No call to action that sells
- **Asset brief:** what the visual shows, in one line, for the renderer. "none" for text-only
- **X copy** (when the tenant lists X as a channel): one version of the same post for X, at most 280 characters. Same claim, one sentence of evidence, ends on the claim. No thread, no link, no hashtags
- Every claim in the copy must be in the card's evidence. If you need a fact that is not there, leave it out

Run `checks.md` on hook, alt hook, copy, X copy and asset brief. A draft that fails a hard check is not written to the board; log it in the run file with the reason and draft again. A draft that trips a soft check is written with the flag in `Rejection reason` prefixed "CHECK:".

## Step 5: Write to the board

One row per post in **6 Posts**: title, status Not started, channel, slot, slot date, format, hook, alt hook, copy, X copy, asset brief, relations to insight card, pillar, series, audience. One row carries both channel versions; the channel field names the primary channel. Set the card's status to Used.

Tell the operator what is on the board, with the Notion links.

## Step 6: Render (on request or when the format needs it)

`/ce-render` builds the carousel PDF or single graphic PNG from the asset brief and the copy, using `core/render/` and the tenant's `brand.md`. Output goes to `output/` and the file is attached to the post row. See `skills/render.md`.

## Step 7: Publish and log (human)

The operator publishes on LinkedIn by hand, pastes the URL into `Published URL`, posts the X version and pastes its URL into `X published URL`, sets status Done. Once a week the operator enters impressions, reactions, comments and reposts.

## Step 8: Learn (weekly, `/ce-learn`)

Read posts with edits (`Jana edit notes`), rejections and metrics since the last learn pass. Look for **patterns**, not single corrections: the same word removed twice, hooks consistently shortened, one pillar consistently outperforming. For each pattern propose one bounded change to one file in `tenants/<tenant>/` with the examples behind it. The operator approves or rejects each proposal. Approved changes are written to the file with a dated line in that file's change log. Hard rules in `rules.md` and `core/checks.md` cannot be relaxed this way.

Performance supports proposals, it never changes pillar shares on its own.

## Exceptions

- Not enough evidence: the slot stays empty, the run log says so
- A source turns out to contain Never-use material mid-read: stop reading it, mark the row, do not write anything derived from it
- A repeated run finds its rows already on the board: do not create duplicates. Match on slot date plus channel for posts, on claim text for cards
- Anything surprising or broken goes into `BACKLOG.md` during the run, not afterwards
