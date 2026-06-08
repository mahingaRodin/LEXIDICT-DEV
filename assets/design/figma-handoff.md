# Figma Handoff Guide — LexiDict

How to link this repository to your Figma account and display **all implemented screens + utilities** in one Figma file.

---

## Recommended Figma file structure

Create one Figma file named **LexiDict — Full Design System** with these pages:

```
📄 Cover          → logo, screen.png reference, version, links to repo
🎨 Design System  → tokens, typography, icons, components
📱 Screens Light  → all screens in light theme
📱 Screens Dark   → all screens in dark theme
🔀 Flows          → user journeys, loading/error states
🧩 Utilities      → toasts, loaders, chips, empty states
```

---

## Method 1 — Import the HTML catalog (fastest, one file)

This imports every screen frame and the component library into Figma in minutes.

### Steps

1. **Install** the [html.to.design](https://www.html.to.design/) plugin in Figma (free tier works).
2. On your computer, open:
   ```
   assets/design/design-catalog.html
   ```
   in **Google Chrome** (best compatibility).
3. In Figma: **Plugins → html.to.design → Import from URL**  
   - If local file: use **Import from HTML** and paste/upload the file contents, or run a local server:
   ```bash
   cd assets/design
   npx serve .
   ```
   Then import `http://localhost:3000/design-catalog.html`
4. Select **all sections** (Design System, Components, Screens) and import.
5. Arrange imported frames on the pages listed above.

### Result

You get pixel-close frames for Home, Word Detail, History, Favorites, Learn, Settings, Splash, plus component tiles.

---

## Method 2 — Design tokens sync (colors match code)

### Using Tokens Studio for Figma

1. Install **[Tokens Studio for Figma](https://tokens.studio/)** plugin.
2. In Figma: **Plugins → Tokens Studio → Load from file**
3. Select `assets/design/design-tokens.json`
4. Click **Create variables** → maps to Figma **Local variables** (Light + Dark modes)
5. Apply variables to imported frames so theme switches work in Figma.

### Token groups included

- `brand` — indigo, cyan
- `color/light/*` — full light palette
- `color/dark/*` — full dark palette
- `radius`, `spacing`, `fontSize`
- `gradient/*` — brand hero, cyan CTA

---

## Method 3 — Live app screenshots (pixel-perfect)

For presentation-ready frames:

1. Run the app: `npx expo start`
2. Capture each screen on emulator or device (see checklist in `screens-catalog.md`)
3. In Figma: **Place image** → drag screenshots onto **Screens Light** / **Screens Dark** pages
4. Add **annotation sticky notes** from `screens-catalog.md` for each frame

### Screenshot checklist

- [ ] Splash
- [ ] Home (empty search)
- [ ] Home (suggestions visible)
- [ ] Home (empty-search hint)
- [ ] Word Detail (success + audio)
- [ ] Word Detail (API loading)
- [ ] Word Detail (not found error)
- [ ] Word Detail (network error)
- [ ] History (with items)
- [ ] History (empty)
- [ ] Favorites (with items)
- [ ] Favorites (empty)
- [ ] Learn
- [ ] Settings
- [ ] Drawer open
- [ ] Favorite toast visible
- [ ] Floating tab bar on Word Detail

---

## Method 4 — Link Figma to this repo (Dev Mode)

For ongoing sync between design and code:

1. In Figma, enable **Dev Mode** on your team file.
2. Add a **Cover** sticky with repo path: `LexiTech/`
3. Link each component in Figma to its code path (examples):

| Figma component | Code path |
|-----------------|-----------|
| SearchBar | `src/components/SearchBar.js` |
| FloatingTabBar | `src/navigation/FloatingTabBar.js` |
| ErrorState | `src/components/ErrorState.js` |
| ApiLoadingIndicator | `src/components/ApiLoadingIndicator.js` |
| Word Detail | `src/screens/WordDetailScreen.js` |

4. Use **Figma → Share → Copy link** and paste in your project README or Notion for the team.

---

## Method 5 — FigJam flow board (optional)

1. Create a **FigJam** file linked from your main Figma project.
2. Copy the Mermaid diagram from `screen-map.md` or import `docs/system-flow.md` flows.
3. Link each sticky to the corresponding Figma screen frame.

---

## Connecting to *your* Figma account

1. Log in at [figma.com](https://www.figma.com)
2. **Drafts → New design file** → name it **LexiDict**
3. Follow Method 1 + Method 2 above
4. **Share** the file with your team (View or Edit)
5. Copy the file URL — format: `https://www.figma.com/design/XXXXXXXX/LexiDict`

Store that URL in your project wiki or `assets/design/README.md` under **Team Figma link**.

---

## Original vs implemented designs

| Asset | Role |
|-------|------|
| `screen.png` | Seed icon / brand reference — place on Cover page |
| `LexiTech.pdf` | Client brief — attach as Figma PDF or link |
| `design-catalog.html` | **Full implemented UI** — all added screens |
| `screens-catalog.md` | Written specs for screens not in original PDF |

---

## Maintenance

When you add a screen or component in code:

1. Update `screens-catalog.md` or `components-catalog.md`
2. Add a frame to `design-catalog.html`
3. Re-import or update the Figma frame
4. Sync `design-tokens.json` if colors changed in `src/theme/themes.js`
