# Components & Utilities Catalog

All reusable UI built for LexiDict. Use these names in Figma components.

## Input & search

| Component | File | Description |
|-----------|------|-------------|
| **SearchBar** | `SearchBar.js` | Search input, cyan submit, shake, border states |
| **SearchSuggestions** | `SearchSuggestions.js` | Live prefix/substring dropdown |
| **InlineHint** | `InlineHint.js` | Animated warning below search |

## Feedback & states

| Component | File | Description |
|-----------|------|-------------|
| **ErrorState** | `ErrorState.js` | Wobble icon, shake card, retry, suggestion chips |
| **EmptyState** | `EmptyState.js` | Centered icon + title + message |
| **AnimatedToast** | `AnimatedToast.js` | Slide-in success/info/error banner |
| **ApiLoadingIndicator** | `ApiLoadingIndicator.js` | Branded API loader + skeleton |
| **Skeleton / WordDetailSkeleton** | `Skeleton.js` | Shimmer placeholder bones |

## Word display

| Component | File | Description |
|-----------|------|-------------|
| **PartOfSpeechChip** | `PartOfSpeechChip.js` | Colored POS tag |
| **AudioButton** | `AudioButton.js` | Play / pause / stop pronunciation |
| **WordListItem** | `WordListItem.js` | History/favorites row with delete |
| **StatCard** | `StatCard.js` | Home dashboard stat tile |

## Brand & delight

| Component | File | Description |
|-----------|------|-------------|
| **Logo** | `Logo.js` | SVG gradient brand mark |
| **FadeInView** | `FadeInView.js` | Entrance animation wrapper |
| **ShakeView** | `ShakeView.js` | Horizontal shake trigger |
| **BouncePressable** | `BouncePressable.js` | Spring scale on press |
| **FloatingEmoji** | `FloatingEmoji.js` | Ambient bobbing emoji |
| **CelebrationBurst** | `CelebrationBurst.js` | Confetti on word load |

## Hooks (logic utilities)

| Hook | File | Role |
|------|------|------|
| useDictionarySearch | `useDictionarySearch.js` | Search state machine |
| useAudioPlayback | `useAudioPlayback.js` | Play / pause / stop states |
| useToast | `useToast.js` | Toast show/hide |
| useTheme | `ThemeContext.js` | Light / dark / system |
| useApp | `AppContext.js` | History, favorites, streak |

## API layer

| Module | File | Role |
|--------|------|------|
| dictionaryApi | `dictionaryApi.js` | axios client, normalization, errors |
| wordSuggestions | `wordSuggestions.js` | Local suggestion matching |
| loading | `loading.js` | Minimum 750ms loading display |
| confirm | `confirm.js` | Delete confirmation alerts |

## Data

| Asset | File | Role |
|-------|------|------|
| wordBank | `wordBank.js` | ~800 suggestion words |
