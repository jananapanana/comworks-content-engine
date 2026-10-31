#!/usr/bin/env node
/*
 SMCE renderer. Usage:
   node core/render/render.js <content.json> [--out <path>] [--html-only]

 content.json shape:
 {
   "tenant": "comworks",
   "format": "carousel" | "single",
   "theme": "ink" | "red" | "paper",            // page ground, default ink (carousel) / paper (single)
   "pages": [                                   // carousel only, 5 to 10 pages, first = cover, last = closing
     {"type":"cover",     "kicker":"", "headline":"", "sub":""},
     {"type":"statement", "headline":"", "body":""},
     {"type":"list",      "headline":"", "items":["",""]},
     {"type":"diagram",   "headline":"", "steps":["","",""]},   // 2 to 5 steps, rendered as a dotted flow
     {"type":"number",    "number":"", "label":""},
     {"type":"closing",   "headline":"", "body":"", "cta":""}
   ],
   "single": {"number":"", "statement":"", "source":""}        // single only; number may be empty for a pure statement
 }

 Field limits (characters). Longer fails, nothing is shrunk:
   cover.kicker 40, cover.headline 90, cover.sub 120
   statement.headline 80, statement.body 260
   list.headline 70, list.items 2..5 x 80
   diagram.headline 70, diagram.steps 2..5 x 36
   number.number 8, number.label 110
   closing.headline 70, closing.body 160, closing.cta 70
   single.number 8, single.statement 120, single.source 90

 Brand tokens are read from tenants/<tenant>/brand.md (the ```json block).
 Output: PDF for carousel, PNG for single, written to output/ unless --out is given.
*/
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const args = process.argv.slice(2);
if (!args[0]) { console.error('usage: render.js <content.json> [--out path] [--html-only]'); process.exit(2); }
const contentPath = path.resolve(args[0]);
const outIdx = args.indexOf('--out');
const htmlOnly = args.includes('--html-only');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const tenant = content.tenant || 'comworks';

// ---- brand tokens -------------------------------------------------------
const brandMd = fs.readFileSync(path.join(ROOT, 'tenants', tenant, 'brand.md'), 'utf8');
const m = brandMd.match(/```json\s*([\s\S]*?)```/);
if (!m) throw new Error('no json token block in brand.md');
const brand = JSON.parse(m[1]);
const C = brand.colors;
const tenantDir = path.join(ROOT, 'tenants', tenant);
const abs = (p) => 'file://' + path.resolve(tenantDir, p);

// ---- helpers ------------------------------------------------------------
const LIMITS = {
  cover: { kicker: 40, headline: 90, sub: 120 },
  statement: { headline: 80, body: 260 },
  list: { headline: 70, item: 80, min: 2, max: 5 },
  diagram: { headline: 70, step: 36, min: 2, max: 5 },
  number: { number: 8, label: 110 },
  closing: { headline: 70, body: 160, cta: 70 },
  single: { number: 8, statement: 120, source: 90 },
};
const errors = [];
const fail = (msg) => errors.push(msg);
const lim = (val, max, label) => { if ((val || '').length > max) fail(`${label}: ${val.length} chars, limit ${max}`); };
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function lum(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); }
function checkPair(fg, bg, label) { const c = contrast(fg, bg); if (c < 7) fail(`contrast ${label}: ${c.toFixed(1)}:1, needs 7:1`); return c; }

// ---- themes -------------------------------------------------------------
const THEMES = {
  ink:   { bg: C['ink'],      headline: C['lime'],     body: C['paper'],    meta: C['gray-mid'], accent: C['lime'],     logo: 'dark',  dots: C['red-deep'] },
  red:   { bg: C['red-deep'], headline: C['paper'],    body: C['paper'],    meta: C['gray-light'], accent: C['lime'],   logo: 'dark',  dots: C['terracotta'] },
  paper: { bg: C['paper'],    headline: C['red-deep'], body: C['ink'],      meta: C['anthracite'] || '#393E42', accent: C['red-deep'], logo: 'light', dots: C['terracotta'] },
};
const format = content.format;
const theme = THEMES[content.theme || (format === 'single' ? 'paper' : 'ink')];
if (!theme) throw new Error('unknown theme');
checkPair(theme.headline, theme.bg, 'headline/bg');
checkPair(theme.body, theme.bg, 'body/bg');
// meta (page counter) is decorative, not body text; still report it
const metaC = checkPair(theme.meta, theme.bg, 'meta/bg');

// ---- validate content ---------------------------------------------------
let pages = [];
if (format === 'carousel') {
  pages = content.pages || [];
  if (pages.length < 5 || pages.length > 10) fail(`carousel has ${pages.length} pages, needs 5 to 10`);
  if (pages[0]?.type !== 'cover') fail('first page must be cover');
  if (pages[pages.length - 1]?.type !== 'closing') fail('last page must be closing');
  pages.forEach((p, i) => {
    const L = LIMITS[p.type]; const tag = `page ${i + 1} (${p.type})`;
    if (!L) { fail(`${tag}: unknown type`); return; }
    if (p.type === 'cover') { lim(p.kicker, L.kicker, tag + ' kicker'); lim(p.headline, L.headline, tag + ' headline'); lim(p.sub, L.sub, tag + ' sub'); }
    if (p.type === 'statement') { lim(p.headline, L.headline, tag + ' headline'); lim(p.body, L.body, tag + ' body'); }
    if (p.type === 'list') { lim(p.headline, L.headline, tag + ' headline'); const n = (p.items || []).length; if (n < L.min || n > L.max) fail(`${tag}: ${n} items, needs ${L.min} to ${L.max}`); (p.items || []).forEach((it, k) => lim(it, L.item, `${tag} item ${k + 1}`)); }
    if (p.type === 'diagram') { lim(p.headline, L.headline, tag + ' headline'); const n = (p.steps || []).length; if (n < L.min || n > L.max) fail(`${tag}: ${n} steps, needs ${L.min} to ${L.max}`); (p.steps || []).forEach((it, k) => lim(it, L.step, `${tag} step ${k + 1}`)); }
    if (p.type === 'number') { lim(p.number, L.number, tag + ' number'); lim(p.label, L.label, tag + ' label'); }
    if (p.type === 'closing') { lim(p.headline, L.headline, tag + ' headline'); lim(p.body, L.body, tag + ' body'); lim(p.cta, L.cta, tag + ' cta'); }
  });
} else if (format === 'single') {
  const s = content.single || {}; const L = LIMITS.single;
  lim(s.number, L.number, 'single number'); lim(s.statement, L.statement, 'single statement'); lim(s.source, L.source, 'single source');
  if (!s.statement) fail('single needs a statement');
} else fail('format must be carousel or single');

// ---- money and dash checks on all text (hard H1 light, soft S1) --------
const allText = JSON.stringify(content.pages || content.single || {});
if (/(€|\bEUR\b|\$|\bUSD\b)/.test(allText)) fail('currency symbol found in content (H1 client money)');
if (/\s[—–]\s|\s--\s/.test(allText)) fail('dash breaking a sentence (S1)');

if (errors.length) { console.error('RENDER BLOCKED:\n- ' + errors.join('\n- ')); process.exit(1); }

// ---- HTML ---------------------------------------------------------------
const W = brand.canvas.width, H = brand.canvas.height, SAFE = brand.canvas.safe;
const logoSrc = abs(brand.logo[theme.logo]);
const fontFace = (k) => `@font-face{font-family:"smce-${k}";src:url("${abs(brand.fonts[k].file)}");font-weight:${brand.fonts[k].weight || 400};}`;
const css = `
${fontFace('headline')}${fontFace('sub')}${fontFace('body')}
@page{size:${W}px ${H}px;margin:0}
html,body{margin:0;padding:0;background:${theme.bg}}
.page{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${theme.bg};color:${theme.body};page-break-after:always;box-sizing:border-box;padding:${SAFE + 40}px ${SAFE + 20}px ${SAFE + 150}px ${SAFE + 20}px;display:flex;flex-direction:column;font-family:"smce-body",monospace}
.page:last-child{page-break-after:auto}
.kicker{font-family:"smce-sub",monospace;font-size:40px;letter-spacing:.06em;text-transform:uppercase;color:${theme.meta};margin-bottom:48px}
h1{font-family:"smce-headline",monospace;font-weight:400;color:${theme.headline};font-size:120px;line-height:1.02;margin:0 0 56px 0;word-wrap:break-word}
h2{font-family:"smce-sub",monospace;font-weight:600;color:${theme.headline};font-size:72px;line-height:1.1;margin:0 0 48px 0}
p{font-size:44px;line-height:1.4;margin:0 0 28px 0;color:${theme.body}}
.sub{font-size:48px;line-height:1.35;color:${theme.body}}
ul{list-style:none;padding:0;margin:0}
li{position:relative;padding-left:70px;font-size:44px;line-height:1.35;margin-bottom:34px}
li:before{content:"";position:absolute;left:0;top:22px;width:28px;height:28px;border-radius:50%;background:${theme.accent}}
.flow{display:flex;flex-direction:column;gap:0;margin-top:20px}
.step{display:flex;align-items:center;gap:36px;font-size:44px;line-height:1.3}
.step .n{flex:0 0 96px;height:96px;border-radius:50%;border:4px dotted ${theme.accent};display:flex;align-items:center;justify-content:center;font-family:"smce-sub",monospace;font-size:44px;color:${theme.accent}}
.conn{width:4px;height:48px;margin-left:46px;border-left:4px dotted ${theme.meta}}
.big{font-family:"smce-headline",monospace;font-size:380px;line-height:.95;color:${theme.accent};margin:40px 0 40px -10px}
.label{font-size:48px;line-height:1.35}
.cta{margin-top:auto;font-family:"smce-sub",monospace;font-size:48px;color:${theme.accent}}
.source{font-size:40px;color:${theme.meta};margin-top:40px}
.counter{position:absolute;top:${SAFE}px;right:${SAFE}px;font-size:40px;color:${theme.meta}}
.logo{position:absolute;left:${SAFE}px;bottom:${SAFE}px;width:160px}
.foot{position:absolute;right:${SAFE}px;bottom:${SAFE + 8}px;font-size:40px;color:${theme.meta}}
.dots{position:absolute;right:${SAFE}px;bottom:${SAFE + 150}px;width:160px;height:160px;background-image:radial-gradient(${theme.dots} 6px, transparent 7px);background-size:40px 40px;opacity:.9}
.spacer{flex:1}
`;
const chrome = (inner, i, n, withDots) => `<section class="page">${withDots ? '<div class="dots"></div>' : ''}${n > 1 ? `<div class="counter">${i + 1} / ${n}</div>` : ''}${inner}<img class="logo" src="${logoSrc}"><div class="foot">${esc(brand.footer || '')}</div></section>`;

function renderPage(p, i, n) {
  switch (p.type) {
    case 'cover': return chrome(`${p.kicker ? `<div class="kicker">${esc(p.kicker)}</div>` : ''}<h1>${esc(p.headline)}</h1>${p.sub ? `<div class="sub">${esc(p.sub)}</div>` : ''}`, i, n, true);
    case 'statement': return chrome(`<h2>${esc(p.headline)}</h2><p>${esc(p.body)}</p>`, i, n, false);
    case 'list': return chrome(`<h2>${esc(p.headline)}</h2><ul>${p.items.map(it => `<li>${esc(it)}</li>`).join('')}</ul>`, i, n, false);
    case 'diagram': return chrome(`<h2>${esc(p.headline)}</h2><div class="flow">${p.steps.map((s, k) => `${k ? '<div class="conn"></div>' : ''}<div class="step"><div class="n">${k + 1}</div><div>${esc(s)}</div></div>`).join('')}</div>`, i, n, false);
    case 'number': return chrome(`<div class="big">${esc(p.number)}</div><div class="label">${esc(p.label)}</div>`, i, n, false);
    case 'closing': return chrome(`<h2>${esc(p.headline)}</h2>${p.body ? `<p>${esc(p.body)}</p>` : ''}<div class="cta">${esc(p.cta)}</div>`, i, n, true);
  }
}
let body = '';
if (format === 'carousel') body = pages.map((p, i) => renderPage(p, i, pages.length)).join('');
else { const s = content.single; body = chrome(`${s.number ? `<div class="big">${esc(s.number)}</div>` : '<div class="spacer"></div>'}<div class="label" style="font-size:${s.number ? 56 : 80}px;line-height:1.2;color:${theme.headline};font-family:smce-sub,monospace">${esc(s.statement)}</div>${s.source ? `<div class="source">${esc(s.source)}</div>` : ''}<div class="spacer"></div>`, 0, 1, true); }

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`;
const base = content.name || path.basename(contentPath, '.json');
const outDir = path.join(ROOT, 'output');
fs.mkdirSync(outDir, { recursive: true });
const htmlPath = path.join(outDir, base + '.html');
fs.writeFileSync(htmlPath, html);
if (htmlOnly) { console.log('html:', htmlPath); process.exit(0); }

// ---- Chrome -------------------------------------------------------------
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const out = outIdx > -1 ? path.resolve(args[outIdx + 1]) : path.join(outDir, base + (format === 'carousel' ? '.pdf' : '.png'));
const common = ['--headless', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--allow-file-access-from-files', '--run-all-compositor-stages-before-draw', '--virtual-time-budget=4000'];
if (format === 'carousel') execFileSync(CHROME, [...common, '--no-pdf-header-footer', `--print-to-pdf=${out}`, 'file://' + htmlPath], { stdio: 'pipe' });
else execFileSync(CHROME, [...common, `--window-size=${W},${H}`, `--screenshot=${out}`, 'file://' + htmlPath], { stdio: 'pipe' });
console.log(JSON.stringify({ out, html: htmlPath, pages: format === 'carousel' ? pages.length : 1, contrast: { headline: contrast(theme.headline, theme.bg).toFixed(1), body: contrast(theme.body, theme.bg).toFixed(1), meta: metaC.toFixed(1) } }));
