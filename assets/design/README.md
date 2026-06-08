# LexiDict — Design Package

Complete design documentation for every screen and utility implemented in the app, extending the original brief (`screen.png`, `LexiTech.pdf`).

## Contents

| File | Purpose |
|------|---------|
| [design-system.md](./design-system.md) | Colors, typography, spacing, radii, gradients |
| [screens-catalog.md](./screens-catalog.md) | All 7 screens + states (loading, error, empty) |
| [components-catalog.md](./components-catalog.md) | All 18 UI components + navigation chrome |
| [navigation-catalog.md](./navigation-catalog.md) | Drawer, floating tab bar, stacks |
| [figma-handoff.md](./figma-handoff.md) | **Link this project to Figma** (step-by-step) |
| [design-tokens.json](./design-tokens.json) | Import into Figma via Tokens Studio |
| [design-catalog.html](./design-catalog.html) | **Single visual file** — open in browser or import to Figma |
| [screen-map.md](./screen-map.md) | Screen flow diagram |
| `screen.png` | Original seed design |
| `LexiTech.pdf` | Original client brief PDF |

## Quick start — display everything in Figma

1. Read **[figma-handoff.md](./figma-handoff.md)** (full workflow).
2. Open **`design-catalog.html`** in Chrome → use the **html.to.design** Figma plugin to import all frames at once.
3. Import **`design-tokens.json`** with **Tokens Studio for Figma** to sync colors with code.
4. Place **`screen.png`** on your Figma **Cover** page as the original reference.

## Screens implemented (vs original design)

| Screen | In original brief? | Doc section |
|--------|-------------------|-------------|
| Splash | Added | screens-catalog §1 |
| Home / Dashboard | Partial (search) | screens-catalog §2 |
| Word Detail | Partial | screens-catalog §3 |
| History | Activity 4 | screens-catalog §4 |
| Favorites | Added | screens-catalog §5 |
| Learn | Added | screens-catalog §6 |
| Settings | Added (dark mode) | screens-catalog §7 |
| Drawer | Activity 4 | navigation-catalog §1 |
| Floating Tab Bar | Added | navigation-catalog §2 |

## Team Figma link

After you import into your Figma account, paste your file URL here:

```
https://www.figma.com/design/YOUR_FILE_ID/LexiDict
```

Share that link with your team. Dev Mode annotations can point to code paths listed in [figma-handoff.md](./figma-handoff.md).

## Code ↔ design sync

Design tokens in code live at `src/theme/themes.js`. When you change colors in Figma, update that file (or re-export `design-tokens.json` from Tokens Studio).

## One-command local preview (for Figma import)

From the project root:

```bash
npx serve assets/design
```

Then in **html.to.design**: import `http://localhost:3000/design-catalog.html`
