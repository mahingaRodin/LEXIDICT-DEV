# LexiDict — Pages & Screens

## Screen Inventory

### 1. Splash Screen
- **File:** `src/screens/SplashScreen.js`
- **Purpose:** Branded launch experience with animated logo and loading bars
- **Data:** None (static)
- **Navigation:** Auto → Main app after ~2.2s

### 2. Home (Dashboard)
- **File:** `src/screens/HomeScreen.js`
- **Purpose:** Primary search entry, stats, Word of the Day, suggestions
- **API:** None directly — navigates to Word Detail which fetches
- **Features:**
  - Greeting based on time of day
  - SearchBar with validation on submit
  - Stats cards (searched, streak, favorites) from AppContext
  - Word of the Day (deterministic daily pick from curated pool)
  - Suggested word chips

### 3. Word Detail
- **File:** `src/screens/WordDetailScreen.js`
- **Purpose:** Display full word information (Activity 2)
- **API:** `lookupWord(word)` on mount / retry
- **Features:**
  - Headword, phonetic spelling
  - AudioButton (Activity 3)
  - Parts of speech with numbered definitions
  - Example sentences in quote blocks
  - Origin / etymology
  - Synonym chips (tap to search)
  - Favorite toggle
  - Error states with retry (Activity 5)
  - Loading skeleton

### 4. History
- **File:** `src/screens/HistoryScreen.js`
- **Purpose:** Search history list (Activity 4)
- **Data:** `AppContext.history` from AsyncStorage
- **Features:**
  - Tap to re-fetch word
  - Swipe-remove per item
  - Clear all with confirmation

### 5. Favorites
- **File:** `src/screens/FavoritesScreen.js`
- **Purpose:** Bookmarked words with definition preview
- **Data:** `AppContext.favorites`
- **Features:** Open word, unfavorite from list

### 6. Learn
- **File:** `src/screens/LearnScreen.js`
- **Purpose:** Onboarding tips + discover random vocabulary word
- **API:** Uses real dictionary API when user taps discover (no mock data for definitions)

### 7. Settings
- **File:** `src/screens/SettingsScreen.js`
- **Purpose:** Dark mode / theme control + about info
- **Data:** `ThemeContext.preference` persisted to AsyncStorage
- **Options:** System, Light, Dark

### 8. Drawer (Custom)
- **File:** `src/navigation/CustomDrawerContent.js`
- **Purpose:** Side menu with navigation links + recent searches (Activity 4)
- **Features:**
  - Brand header with logo
  - Quick stats
  - Menu links to all tabs
  - Recent search list (tap → Word Detail)

## Navigation Hierarchy

```
Root Stack
├── Main (Drawer)
│   └── Tabs
│       ├── Home
│       ├── History
│       ├── Favorites
│       ├── Learn
│       └── Settings
└── Word Detail (modal-style push)
```

## Shared Components Used Across Pages

| Component | Used On |
|-----------|---------|
| SearchBar | Home |
| WordListItem | History, Favorites |
| StatCard | Home |
| ErrorState | Word Detail |
| EmptyState | History, Favorites |
| AudioButton | Word Detail |
| PartOfSpeechChip | Word Detail |
| FadeInView | All content screens |
| Skeleton | Word Detail (loading) |
| Logo | Home header, Drawer, Splash |
