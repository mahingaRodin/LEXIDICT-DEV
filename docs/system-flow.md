# LexiDict — System Flow Diagram

End-to-end user journeys and system behaviour for all five activities in the project brief.

## Application Lifecycle

```mermaid
flowchart TD
    Launch["App Launch"] --> Hydrate["Hydrate AsyncStorage\n(theme, history, favorites, streak)"]
    Hydrate --> Splash["Animated Splash\n(logo + bar reveal)"]
    Splash --> Main["Main App\n(Drawer + Tabs)"]
```

## Activity 1 — Word Search & API Integration

```mermaid
flowchart TD
    A1["User opens Home screen"] --> A2["Types word in SearchBar"]
    A2 --> A3{"Input valid?"}
    A3 -->|empty| A4["Show validation error\non Word Detail"]
    A3 -->|invalid chars| A5["Show invalid input error"]
    A3 -->|valid| A6["Navigate to WordDetail"]
    A6 --> A7["Show loading skeleton"]
    A7 --> A8["axios GET /entries/en/{word}"]
    A8 --> A9["Parse & normalise JSON"]
    A9 --> A10["Display results"]
```

## Activity 2 — Display Word Details

```mermaid
flowchart TD
    B1["Receive normalised view-model"] --> B2["Show headword + phonetic"]
    B2 --> B3["Loop meanings by part of speech"]
    B3 --> B4["Render PartOfSpeechChip"]
    B4 --> B5["List numbered definitions"]
    B5 --> B6{"Example exists?"}
    B6 -->|yes| B7["Show quoted example block"]
    B6 -->|no| B8["Definition only"]
    B7 --> B9{"More definitions?"}
    B8 --> B9
    B9 -->|yes| B5
    B9 -->|no| B10{"Origin available?"}
    B10 -->|yes| B11["Show etymology card"]
    B10 -->|no| B12["Done"]
    B11 --> B12
```

## Activity 3 — Audio Pronunciation

```mermaid
flowchart TD
    C1["Check audios[] in view-model"] --> C2{"hasAudio?"}
    C2 -->|no| C3["Hide AudioButton"]
    C2 -->|yes| C4["Show speaker icon"]
    C4 --> C5{"User taps"}
    C5 -->|playing| C6["pause()"]
    C5 -->|stopped| C7["play()"]
    C4 --> C8{"Long press / swap\n(multiple audios)"}
    C8 --> C9["Cycle to next pronunciation URL"]
```

## Activity 4 — Drawer Navigation & Search History

```mermaid
flowchart TD
    D1["User opens drawer"] --> D2["Show menu + recent searches"]
    D2 --> D3{"User action"}
    D3 -->|tap history word| D4["Close drawer"]
    D4 --> D5["Navigate to WordDetail"]
    D5 --> D6["Fetch word from API"]
    D3 -->|tap menu item| D7["Navigate to tab screen"]
    D6 --> D8["On success: addToHistory"]
    D8 --> D9{"Duplicate?"}
    D9 -->|yes| D10["Move to top, dedupe"]
    D9 -->|no| D11["Prepend to history"]
    D10 --> D12["Persist to AsyncStorage"]
    D11 --> D12
```

## Activity 5 — Error Handling & User Feedback

```mermaid
flowchart TD
    E1["API request"] --> E2{"Outcome"}
    E2 -->|404| E3["Word not found message\n+ fallback suggestions"]
    E2 -->|network| E4["Connection problem\n+ Try again"]
    E2 -->|5xx| E5["Server error message"]
    E2 -->|malformed JSON| E6["Parse error — no crash"]
    E2 -->|empty input| E7["Validation message"]
    E3 --> E8["Hide loading skeleton"]
    E4 --> E8
    E5 --> E8
    E6 --> E8
    E7 --> E8
    E8 --> E9{"User taps retry?"}
    E9 -->|yes| E1
```

## Complete User Journey (Happy Path)

```mermaid
flowchart LR
    subgraph Input
        S1["Search 'hello'"]
    end
    subgraph Processing
        S2["Validate"]
        S3["API fetch"]
        S4["Normalise"]
    end
    subgraph Output
        S5["Show definitions"]
        S6["Play audio"]
        S7["Save to history"]
        S8["Update streak"]
    end
    S1 --> S2 --> S3 --> S4 --> S5
    S5 --> S6
    S5 --> S7 --> S8
```

## Screen Map

| Screen | Entry Points | Primary Actions |
|--------|-------------|-----------------|
| **Splash** | App launch | Auto-transition to main |
| **Home** | Tab, Drawer | Search, Word of the Day, suggestions |
| **Word Detail** | Search, History, Drawer, Favorites, Learn | View defs, audio, favorite |
| **History** | Tab, Drawer | Re-search, remove, clear all |
| **Favorites** | Tab, Drawer | Open saved words, unfavorite |
| **Learn** | Tab | Tips, discover random word |
| **Settings** | Tab | Theme: system / light / dark |
