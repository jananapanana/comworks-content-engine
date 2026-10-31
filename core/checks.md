# Content checks

Run on every insight card (claim and evidence) and on every draft (hook, alt hook, copy, asset brief) before anything is written to the board. Hard checks block. Soft checks flag.

## Hard checks (block)

| # | Check | How |
| --- | --- | --- |
| H1 | **No client money.** No currency amounts, prices, rates, budgets, tool spend, contract values, invoice figures that belong to a client | Scan for currency symbols and words (EUR, €, $, k, "per day", "per hour", "budget", "cost", "price", "fee", "rate" in a money sense). Percentages and counts are fine when they describe outcomes |
| H2 | **No client names** or identifying details unless `rules.md` lists the client as released | Match against the client list in `tenants/<tenant>/rules.md`. Also catch domains, product names, office locations and people's names |
| H3 | **No people.** No names of client staff, partners or third parties | Any proper noun that is a person. The tenant's own voice (for example "I") is fine |
| H4 | **No Never-use topics** from `rules.md` | Keyword and meaning match |
| H5 | **Every factual claim traces to the card's evidence** | Read the copy claim by claim. A claim with no backing in the evidence is removed or the draft is rewritten |
| H6 | **No invented numbers** | Every number in the copy appears in the evidence, or is arithmetic on evidence numbers that the run log shows |

## Soft checks (flag with "CHECK:" in Rejection reason)

| # | Check | Rule |
| --- | --- | --- |
| S1 | No dashes breaking a sentence (em, en or double hyphen). Period or colon instead | Style, from WRITING_STYLE.md |
| S2 | No "not X, but Y" or "X is not A, it is B" contrast reveals | Style |
| S3 | No emojis, no hashtags in the copy | Style |
| S4 | Bullets without trailing periods | Style |
| S5 | Banned words from `voice.md` | List match |
| S6 | Tool name used as the tenant's own label ("HubSpot expert"). Tool names that describe the reader's situation or the evidence pass | Tenant rule, see `rules.md` |
| S7 | "AI does it for you" framing, AI as the product | Tenant rule |
| S8 | Hook longer than 140 characters | LinkedIn cuts around there on mobile |
| S11 | Question used as engagement bait ("Agree?", "Thoughts?", "Want to know how?"). A question the reader can answer from their own work passes | Tenant voice |
| S12 | Blurry claim: a sentence with no situation, number or object behind it ("Most companies get this wrong") | Tenant guiding principle |
| S9 | Copy outside 60 to 180 words | Length |
| S10 | Two posts in a row from the same pillar | Planning |
| S13 | X copy over 280 characters, or containing a link, hashtag or thread marker ("1/") | X limit, pilot rule (2026-10-31) |

## Visual checks (renderer, before a file is written)

| # | Check |
| --- | --- |
| V1 | Canvas 1080 x 1350 px for carousel pages and single graphics |
| V2 | Text and logo inside the safe zone (60 px all sides) |
| V3 | Smallest text 40 px at 1080 width |
| V4 | Text and background pair passes 7:1 contrast, computed from the hex values in `brand.md` |
| V5 | One accent colour per page |
| V6 | Carousel 5 to 10 pages, cover and closing page present, page counter on every page |
| V7 | No text overflow: a field longer than its limit fails, nothing is shrunk or cut silently |
