# Screens Catalog

All screens implemented in LexiDict. Frame size: **390 × 844** (iPhone 14 logical).

---

## 1. Splash Screen
**File:** `src/screens/SplashScreen.js`  
**Original design:** Added (not in brief)

| Element | Spec |
|---------|------|
| Background | Brand gradient full bleed |
| Logo | 120px, scale-in animation |
| Bars | 3 white bars slide-in (brand motif) |
| Title | "LexiDict" 34px white |
| Duration | ~2.2s auto → main app |

---

## 2. Home / Dashboard
**File:** `src/screens/HomeScreen.js`  
**Original design:** Partial (search concept)

| Element | Spec |
|---------|------|
| Header | Gradient, menu + logo + "LexiDict" |
| Greeting | Time-based + emoji |
| SearchBar | Card, cyan submit, shake on empty |
| InlineHint | Warning below search when empty |
| SearchSuggestions | Dropdown with highlighted match |
| StatCards | Words searched, streak, favorites |
| Word of the Day | Tappable card |
| Suggested chips | BouncePressable row |
| FloatingEmoji | Ambient decoration |

**States:** default · suggestions open · empty-search hint

**On search:** Input clears → navigate to Word Detail

---

## 3. Word Detail
**File:** `src/screens/WordDetailScreen.js`  
**Original design:** Core requirement

| Element | Spec |
|---------|------|
| Top bar | Back, title, favorite star |
| ApiLoadingIndicator | Branded loader + skeleton |
| Headword | 40px bold + phonetic |
| AudioButton | Play / pause / stop + accent swap |
| Origin card | Quote-style etymology |
| Synonym chips | Tappable → new word |
| Meaning cards | POS chip + numbered definitions |
| Example blocks | Italic quoted text |
| ErrorState | Not found / network / retry |
| CelebrationBurst | On successful load |
| AnimatedToast | Favorite added/removed |
| Tab bar | Floating pill stays visible |

**States:** loading · success · not-found · network error

---

## 4. History
**File:** `src/screens/HistoryScreen.js`  
**Activity 4**

| Element | Spec |
|---------|------|
| Header | Menu, title, bulk delete |
| WordListItem | Word, relative time, trash, chevron |
| EmptyState | "No searches yet" |
| Delete | Per-item + bulk confirm alerts |

---

## 5. Favorites
**File:** `src/screens/FavoritesScreen.js`  
**Added**

| Element | Spec |
|---------|------|
| Header | Menu, title, bulk clear |
| WordListItem | Definition preview, star (display), trash |
| Tap row | Opens Word Detail (does NOT unfavorite) |
| EmptyState | "No favorites yet" |

---

## 6. Learn
**File:** `src/screens/LearnScreen.js`  
**Added**

| Element | Spec |
|---------|------|
| Hero gradient | Tips intro |
| Discover card | Random word from pool |
| Tip cards | Search, audio, favorites, streak |

---

## 7. Settings
**File:** `src/screens/SettingsScreen.js`  
**Added (dark mode + utilities)**

| Element | Spec |
|---------|------|
| Hero | Logo + active mode badge |
| Progress stats | Searched, saved, streak |
| Theme rows | System / Light / Dark with checkmark |
| Quick links | History, Favorites, Learn |
| Data | Clear history / favorites |
| About | Company + API credit |

---

## Screen states matrix

| Screen | Loading | Empty | Error | Success |
|--------|---------|-------|-------|---------|
| Home | — | hint | — | default |
| Word Detail | ApiLoading | — | ErrorState | definitions |
| History | — | EmptyState | — | list |
| Favorites | — | EmptyState | — | list |
| Learn | — | — | — | tips |
| Settings | — | — | — | prefs |
