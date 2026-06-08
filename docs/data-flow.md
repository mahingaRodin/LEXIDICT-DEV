# LexiDict — Data Flow Diagram

This document describes how data moves through the application from user input to display and persistence.

## Word Search Data Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Home / WordDetail Screen
    participant Hook as useDictionarySearch
    participant API as dictionaryApi.js
    participant Remote as Free Dictionary API
    participant Ctx as AppContext
    participant Store as AsyncStorage

    User->>UI: Enter word + submit
    UI->>Hook: search(word)
    Hook->>Hook: dispatch SEARCH_START
    Hook->>API: lookupWord(word)
    API->>API: validateWord()
    API->>Remote: GET /entries/en/{word}
    
    alt Success
        Remote-->>API: JSON array
        API->>API: normalizeResponse()
        API-->>Hook: view-model {word, phonetics, meanings…}
        Hook->>Hook: dispatch SEARCH_SUCCESS
        Hook->>Ctx: onSuccess → addToHistory(word)
        Ctx->>Store: persist history + streak
        Hook-->>UI: render definitions
    else 404 Not Found
        Remote-->>API: 404
        API-->>Hook: DictionaryError NOT_FOUND
        Hook->>Hook: dispatch SEARCH_ERROR
        Hook-->>UI: show ErrorState + suggestions
    else Network Error
        Remote-->>API: timeout / no response
        API-->>Hook: DictionaryError NETWORK
        Hook-->>UI: show retry button
    end
```

## API Response Normalisation

```mermaid
flowchart LR
    Raw["Raw API JSON\n(array of entries)"] --> Merge["Merge entries"]
    Merge --> Phonetics["phonetics[]\n(fix // audio URLs)"]
    Merge --> Meanings["meanings[]\n(parts of speech)"]
    Merge --> Meta["origin, sourceUrl"]
    Phonetics --> VM["View-Model"]
    Meanings --> VM
    Meta --> VM
    VM --> Screen["WordDetailScreen"]
```

### Normalised View-Model Shape

```json
{
  "word": "hello",
  "phonetic": "həˈləʊ",
  "phonetics": [{ "text": "həˈləʊ", "audio": "https://…" }],
  "audios": [{ "text": "…", "audio": "https://…" }],
  "hasAudio": true,
  "meanings": [{
    "partOfSpeech": "noun",
    "definitions": [{
      "definition": "…",
      "example": "…",
      "synonyms": [],
      "antonyms": []
    }]
  }],
  "origin": "…",
  "synonyms": ["…"],
  "sourceUrl": "…",
  "fetchedAt": 1710000000000
}
```

## Audio Pronunciation Flow (Activity 3)

```mermaid
sequenceDiagram
    participant UI as WordDetailScreen
    participant Btn as AudioButton
    participant Player as expo-audio useAudioPlayer
    participant CDN as Audio CDN

    UI->>Btn: audios[] from view-model
    Btn->>Player: init with audio URL
    Player->>CDN: download / stream
    User->>Btn: tap play
    Btn->>Player: play()
    Player-->>Btn: status.playing = true
    User->>Btn: tap pause
    Btn->>Player: pause()
    User->>Btn: long-press (multiple audios)
    Btn->>Btn: cycle audio index
```

## Persistence Data Flow

```mermaid
flowchart TB
    subgraph Writes
        SearchOK["Successful search"] --> Hist["history[]"]
        StarTap["Favorite toggle"] --> Fav["favorites[]"]
        ThemePick["Theme change"] --> Theme["preference"]
        DailyUse["First search of day"] --> Streak["streak {count, lastDay}"]
    end

    Hist --> AS1["@lexidict/history"]
    Fav --> AS2["@lexidict/favorites"]
    Theme --> AS3["@lexidict/theme-preference"]
    Streak --> AS4["@lexidict/streak"]

    subgraph Reads["App Launch Hydration"]
        AS1 --> AppCtx
        AS2 --> AppCtx
        AS3 --> ThemeCtx
        AS4 --> AppCtx
    end
```

## Search State Machine

```mermaid
stateDiagram-v2
    [*] --> idle
    idle --> loading : search(word)
    loading --> success : API OK
    loading --> error : API fail / validation
    success --> loading : new search
    error --> loading : retry
    success --> idle : reset
    error --> idle : reset
```
