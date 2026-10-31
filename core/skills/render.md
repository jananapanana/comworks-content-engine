# /ce-render <tenant> <post>

Renders the visual for one post from `core/render/` with the tenant's `brand.md`.

1. Read the post row (format, asset brief, hook, copy) and `tenants/<tenant>/brand.md`
2. Build the page content JSON (see `core/render/render.js` header for the shape): for a carousel, cover plus 4 to 8 inner pages plus closing; for a single graphic, one statement or number plus source line. Text comes from the copy and the card's evidence, never from elsewhere
3. Check field lengths against the limits in the template (listed in `render.js`). Too long means rewrite the field, not shrink the type
4. Run `node core/render/render.js <content.json> <out path>`. It injects the brand tokens, runs the visual checks (contrast, safe zone, type size, page count) and writes PDF (carousel) or PNG (single graphic) to `output/`
5. Open the result, look at every page. Fix and rerun until it passes
6. Attach the file to the post row (Asset) or tell the operator where it is

Chrome is used headless for rendering. Use the legacy `--headless` flag, `--headless=new` has rendered SVG wrong on this machine before.
