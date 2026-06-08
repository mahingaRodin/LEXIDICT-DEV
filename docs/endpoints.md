# LexiDict — API Endpoints

LexiDict is a **client-only** mobile application. It does not host a backend. All remote data comes from the public Free Dictionary API.

## External Endpoint (Consumed)

### Look Up Word

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `https://api.dictionaryapi.dev/api/v2/entries/en/{word}` |
| **Auth** | None |
| **Client** | axios (`src/api/dictionaryApi.js`) |
| **Timeout** | 12 seconds |

#### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `word` | string | English word to look up (URL-encoded) |

#### Success Response

- **Status:** `200 OK`
- **Body:** JSON array of entry objects (see [dictionaryapi.dev](https://dictionaryapi.dev/))

#### Error Responses

| Status | Meaning | App Behaviour |
|--------|---------|---------------|
| `404` | Word not found | Show "Word not found" + suggestions |
| `5xx` | Server error | Show service unavailable message |
| Network / timeout | No connectivity | Show connection error + retry |

#### Example

```http
GET https://api.dictionaryapi.dev/api/v2/entries/en/hello
```

## Internal "Endpoints" (App Service Functions)

These are not HTTP endpoints — they are the app's service-layer API:

| Function | Module | Description |
|----------|--------|-------------|
| `lookupWord(rawWord)` | `dictionaryApi.js` | Validate → fetch → normalise → return view-model or throw `DictionaryError` |
| `validateWord(raw)` | `dictionaryApi.js` | Client-side input validation |
| `addToHistory(word)` | `AppContext.js` | Add deduplicated search to history |
| `toggleFavorite(entry)` | `AppContext.js` | Add/remove favorite with snapshot |
| `setPreference(mode)` | `ThemeContext.js` | Set light / dark / system theme |

## Audio Resources

Pronunciation URLs are returned inside the dictionary API response (`phonetics[].audio`). The app prepends `https:` to protocol-relative URLs (`//ssl.gstatic.com/...`) before passing them to `expo-audio`.
