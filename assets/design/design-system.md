# LexiDict Design System

Synced with `src/theme/themes.js`.

## Brand

| Token | Hex | Usage |
|-------|-----|-------|
| Indigo | `#4F46E5` | Primary actions, active tab, links |
| Indigo Light | `#6366F1` | Dark mode primary |
| Cyan | `#06B6D4` | CTA buttons, accents, floating bar highlights |
| Cyan Light | `#22D3EE` | Dark mode accent |

## Gradients

| Name | Stops | Usage |
|------|-------|-------|
| Brand hero | `#6366F1 → #4F46E5 → #0EA5E9` | Home header, drawer hero, splash |
| Cyan CTA | `#22D3EE → #06B6D4` | Search submit, retry buttons |
| Light brand (soft) | `#7B7FED → #5E58DC → #3D9FD4` | Light mode headers |

## Typography (system font)

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | 40px | 800 | Word headword |
| H2 | 30px | 800 | Screen greetings |
| H3 | 22px | 800 | Screen titles |
| Title | 18px | 700 | Card titles |
| Body | 15px | 400–600 | Definitions, body |
| Small | 13px | 500–600 | Subtitles, chips |
| Tiny | 11px | 700 | Section labels (uppercase) |

## Spacing scale

`4 · 8 · 12 · 16 · 24 · 32` (xs → xxl)

## Border radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 10px | Small chips |
| md | 16px | Inputs, rows |
| lg | 22px | Cards |
| xl | 28px | Header curves |
| pill | 999px | Tags, floating tab bar |

## Light palette (soft)

| Role | Hex |
|------|-----|
| Background | `#E6E4EE` |
| Card | `#F3F1F8` |
| Text | `#1E2433` |
| Subtext | `#5A6478` |
| Border | `#D4D0DE` |

## Dark palette

| Role | Hex |
|------|-----|
| Background | `#0A0E1A` |
| Card | `#141B2E` |
| Text | `#F1F5F9` |
| Subtext | `#94A3B8` |
| Border | `#23304D` |

## Part-of-speech colors

| POS | Color |
|-----|-------|
| Noun | `#4F46E5` |
| Verb | `#0E7490` |
| Adjective | `#7C3AED` |
| Adverb | `#DB2777` |
| Exclamation | `#EA580C` |

## Shadows

- **Card** — soft, low elevation
- **Floating** — tab bar, toasts (stronger)

## Motion

| Pattern | Duration | Usage |
|---------|----------|-------|
| Fade in + slide up | 420ms | Content entrance |
| Spring | damping 12–16 | Buttons, chips |
| Shake | 50ms steps | Empty search, errors |
| Skeleton shimmer | 700ms loop | Loading |
| Min API loading | 750ms | Dictionary fetch |

## Icon set

**Ionicons** via `@expo/vector-icons` — outline inactive, filled active.
