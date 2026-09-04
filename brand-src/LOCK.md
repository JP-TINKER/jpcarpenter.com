# Soft Block T04-D — locked mark (2026-09-01)

**Master:** `public/brand/mark.svg` (editable `<text>`; needs Atkinson Bold)  
**Reproduction:** `public/brand/mark-outlined.svg` (JP as paths — use when the font is not loaded)  
**Favicon:** `public/favicon.svg` (outlined Atkinson Bold on a 512 canvas; thin plate field for tab contrast)  
**PNG fallbacks:** `/favicon-32.png`, `/favicon-192.png`, `/apple-touch-icon.png` (180)  
**Rebuild:** `python3 scripts/build-favicon.py`  
**Component:** `src/components/BrandMark.astro`

## Recipe (chrome / in-page mark)

- Soft face only: `#b8c9c4` with lift-hot stroke `#3d4a46`
- No full dark plate square behind the mark
- JP: Atkinson Hyperlegible Bold, `letter-spacing: -0.08em`, plate fill
- Amber rule `#c47a3a` under JP

## Don't

Shields, locks, swooshes. Amber as body text. Loose JP tracking. Nesting the soft face inside an extra dark square on the plate.
