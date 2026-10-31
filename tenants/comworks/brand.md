# Brand and CI tokens: COM works

Source: `com-works-brand/DESIGN_TOKENS.md` (Brandbook 2026 by Bureau Uno), board page "7 Brand and CI". The renderer reads the JSON block at the end of this file.

## Colours

| Token | Hex | Role |
| --- | --- | --- |
| red-deep | #942120 | Primary 1, dark ground or headline on paper |
| terracotta | #D87046 | Primary 2, sparingly, never as text on red |
| lime | #DFFF00 | The only accent. One per page, carries the one thing to remember |
| gray-mid | #B4B4B4 | Meta, lines, page counter. Never body text on dark |
| gray-light | #D9D9D9 | Surfaces |
| paper | #F2F1EB | Light background, body text on dark |
| ink | #000000 | Dark ground, text on paper |
| anthracite | #393E42 | Meta text on paper (gray-mid fails contrast on light ground) |

Permitted text and background pairs (7:1 or better): lime on ink (18.0), paper on ink (17.6), ink on paper (17.6), paper on red-deep (about 8.4), lime on red-deep (about 8.6), red-deep on paper (about 8.4). Not permitted for text: gray-mid on anything dark, terracotta on red-deep, lime on paper.

## Typography

| Level | Brand font | Renderer font | Notes |
| --- | --- | --- | --- |
| Headline | Citylight Dots | Codystar (OFL) | Citylight is Canva-only. Codystar sits in `com-works-brand/fonts/Citylight-Alternativen (gepunktet)/` |
| Subheadline | Anca Coder | Fira Code SemiBold | Anca Coder files missing |
| Body | Fira Code | Fira Code Regular and Light | OFL, `com-works-brand/fonts/Fira Code/` |

Minimum size on a 1080 px canvas: 40 px body, 56 px subheadline, 88 px headline (cover 120 px).

## Logo

`com-works-brand/logo/Final logo-01.svg` on light, `Final logo WHITE-01.svg` on dark. Bottom left on every page, 160 px wide, inside the safe zone. Never recoloured, never cropped.

## Visual rules

- Dark ground (ink or red-deep) is the default for carousels. Paper ground for the single graphic when the number is red-deep
- One dominant element per page. Two headlines means none
- Dotted motif from the logo as the recurring element: dotted divider lines, a dot grid in one corner. No gradients, no stock photos, no screenshots without a frame
- Safe zone 60 px on all sides. Page counter top right in gray-mid, "3 / 7"
- Carousel 1080 x 1350 PDF, 5 to 10 pages. Single graphic 1080 x 1350 PNG

## Tokens for the renderer

```json
{
  "colors": {
    "red-deep": "#942120",
    "terracotta": "#D87046",
    "lime": "#DFFF00",
    "gray-mid": "#B4B4B4",
    "gray-light": "#D9D9D9",
    "paper": "#F2F1EB",
    "ink": "#000000",
    "anthracite": "#393E42"
  },
  "fonts": {
    "headline": {"family": "Codystar", "file": "../../../com-works-brand/fonts/Citylight-Alternativen (gepunktet)/Codystar_400Regular.ttf"},
    "sub": {"family": "Fira Code", "file": "../../../com-works-brand/fonts/Fira Code/FiraCode_600SemiBold.ttf", "weight": 600},
    "body": {"family": "Fira Code", "file": "../../../com-works-brand/fonts/Fira Code/FiraCode_400Regular.ttf", "weight": 400}
  },
  "logo": {
    "light": "../../../com-works-brand/logo/Final logo-01.svg",
    "dark": "../../../com-works-brand/logo/Final logo WHITE-01.svg"
  },
  "canvas": {"width": 1080, "height": 1350, "safe": 60},
  "footer": "com-wrks.com"
}
```

## Change log

- 2026-10-06: created from DESIGN_TOKENS.md. Font paths to be verified by the renderer
