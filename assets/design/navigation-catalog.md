# Navigation Chrome

UI patterns outside individual screens.

## 1. Custom Drawer
**File:** `src/navigation/CustomDrawerContent.js`

| Section | Content |
|---------|---------|
| Hero | Gradient + logo + "LexiTech Solutions" |
| Stats | Words searched, day streak |
| Menu | Home, History, Favorites, Learn, Settings |
| Recent searches | Up to 12 tappable words → Word Detail |

Width: 300px · Overlay: theme overlay color

## 2. Floating Tab Bar
**File:** `src/navigation/FloatingTabBar.js`

| Spec | Value |
|------|-------|
| Shape | Pill (border-radius 32) |
| Width | 88% max 420px |
| Height | 64px |
| Position | Absolute, floating above bottom safe area |
| Icons | Ionicons only (no labels) |
| Active | Primary color + soft circle background |
| Tabs | Home · History · Favorites · Learn · Settings |

**Important:** Tab bar remains visible on **Word Detail** (nested stack per tab).

## 3. Stack structure

```
Drawer
└── Tab Navigator (floating bar)
    ├── Home Stack → HomeMain, WordDetail
    ├── History Stack → HistoryMain, WordDetail
    ├── Favorites Stack → FavoritesMain, WordDetail
    ├── Learn Stack → LearnMain, WordDetail
    └── Settings Stack → SettingsMain, WordDetail
```

## Figma components to create

1. `Nav/Drawer/Panel`
2. `Nav/TabBar/Floating-Pill`
3. `Nav/TabBar/TabItem-Active`
4. `Nav/TabBar/TabItem-Inactive`
