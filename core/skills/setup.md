# /ce-setup <tenant>

Builds or refreshes `tenants/<tenant>/` from the intake questionnaire ([[standards/CONTENT_ENGINE_INTAKE|standards/CONTENT_ENGINE_INTAKE.md]]) and whatever material the tenant supplied.

1. Create `tenants/<tenant>/` from the file list in `tenants/comworks/` (same file names, empty bodies with the section headings)
2. Map the intake blocks: A to `about.md`, B to `icp.md`, C to `brand.md`, D to `voice.md` plus `samples/`, E to `pillars.md` (pillars, series, slots, channels), F to `sources.md`, G to the Posts object (who logs metrics)
3. Write `rules.md`: never-say list from A5, client and partner names that must never appear from F33, off-limits topics from E29. Mark released clients explicitly
4. Write `notion.md`: duplicate the board template, record page and database URLs plus the `collection://` IDs
5. Show the operator every file with the `[CHECK]` marks for anything inferred rather than stated. The operator corrects. Nothing is used in a run until the operator has read every file once
6. Mirror `about.md`, `brand.md`, `voice.md` to the Notion pages 1, 7, 8 so readers without vault access see the same text

Setup never invents business facts. A question without an answer stays as `[OPEN]` in the file.
