import axios from 'axios';

/**
 * Dictionary API service (Activity 1 & 5).
 * Base: https://api.dictionaryapi.dev/api/v2/entries/en/<word>
 *
 * Responsibilities:
 *  - Build the request URL dynamically from a (validated) word.
 *  - Perform the GET via axios with a sane timeout.
 *  - Normalise the (sometimes messy) JSON into one predictable shape.
 *  - Translate every failure into a typed, user-friendly error.
 */

export const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 12000,
  headers: { Accept: 'application/json' },
});

// Error "kinds" the UI can branch on.
export const ErrorKind = {
  EMPTY: 'EMPTY', // validation: blank input
  INVALID: 'INVALID', // validation: non-letters
  NOT_FOUND: 'NOT_FOUND', // 404 from API
  NETWORK: 'NETWORK', // no connectivity / DNS / timeout
  SERVER: 'SERVER', // 5xx
  PARSE: 'PARSE', // malformed payload
  UNKNOWN: 'UNKNOWN',
};

export class DictionaryError extends Error {
  constructor(kind, message, { word, status } = {}) {
    super(message);
    this.name = 'DictionaryError';
    this.kind = kind;
    this.word = word;
    this.status = status;
  }
}

/** Client-side validation. Returns the cleaned word or throws DictionaryError. */
export function validateWord(raw) {
  const word = (raw ?? '').trim();
  if (!word) {
    throw new DictionaryError(ErrorKind.EMPTY, 'Please type a word to search.');
  }
  // Allow letters, spaces, hyphens and apostrophes (e.g. "well-being", "o'clock").
  if (!/^[A-Za-z][A-Za-z\s'-]*$/.test(word)) {
    throw new DictionaryError(
      ErrorKind.INVALID,
      'Use letters only — no numbers or symbols.',
      { word }
    );
  }
  return word.toLowerCase();
}

// --- normalisers -----------------------------------------------------------

function fixAudioUrl(url) {
  if (!url || typeof url !== 'string') return null;
  if (url.startsWith('//')) return `https:${url}`; // protocol-relative legacy URLs
  return url;
}

function normalizePhonetics(entries = []) {
  const list = Array.isArray(entries) ? entries : [];
  return list
    .map((p) => ({
      text: typeof p?.text === 'string' ? p.text : null,
      audio: fixAudioUrl(p?.audio),
    }))
    .filter((p) => p.text || p.audio);
}

function normalizeMeanings(meanings = []) {
  const list = Array.isArray(meanings) ? meanings : [];
  return list
    .map((m) => ({
      partOfSpeech: typeof m?.partOfSpeech === 'string' ? m.partOfSpeech : 'other',
      definitions: (Array.isArray(m?.definitions) ? m.definitions : [])
        .map((d) => ({
          definition: typeof d?.definition === 'string' ? d.definition : '',
          example: typeof d?.example === 'string' ? d.example : null,
          synonyms: Array.isArray(d?.synonyms) ? d.synonyms.filter(Boolean) : [],
          antonyms: Array.isArray(d?.antonyms) ? d.antonyms.filter(Boolean) : [],
        }))
        .filter((d) => d.definition),
      synonyms: Array.isArray(m?.synonyms) ? m.synonyms.filter(Boolean) : [],
      antonyms: Array.isArray(m?.antonyms) ? m.antonyms.filter(Boolean) : [],
    }))
    .filter((m) => m.definitions.length > 0);
}

/**
 * Merge the array of API entries into a single view-model.
 * Throws PARSE if nothing usable is present (protects against crashes).
 */
function normalizeResponse(data, word) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new DictionaryError(ErrorKind.PARSE, 'We received an unexpected response.', {
      word,
    });
  }

  const headword = data.find((e) => e?.word)?.word || word;

  // Merge phonetics across all entries; de-dupe by text+audio.
  const phoneticsRaw = data.flatMap((e) => normalizePhonetics(e?.phonetics));
  const seen = new Set();
  const phonetics = [];
  for (const p of phoneticsRaw) {
    const key = `${p.text || ''}|${p.audio || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      phonetics.push(p);
    }
  }

  // First textual phonetic spelling (falls back to top-level `phonetic`).
  const phoneticText =
    data.find((e) => typeof e?.phonetic === 'string' && e.phonetic)?.phonetic ||
    phonetics.find((p) => p.text)?.text ||
    null;

  const audios = phonetics.filter((p) => p.audio);

  const meanings = data.flatMap((e) => normalizeMeanings(e?.meanings));
  if (meanings.length === 0) {
    throw new DictionaryError(ErrorKind.PARSE, 'No definitions found in the response.', {
      word,
    });
  }

  const origin = data.find((e) => typeof e?.origin === 'string' && e.origin)?.origin || null;

  const sourceUrl =
    data.find((e) => Array.isArray(e?.sourceUrls) && e.sourceUrls[0])?.sourceUrls?.[0] || null;

  // Flat synonym pool (handy for the synonyms section).
  const synonymPool = Array.from(
    new Set(
      meanings.flatMap((m) => [...m.synonyms, ...m.definitions.flatMap((d) => d.synonyms)])
    )
  ).slice(0, 12);

  return {
    word: headword,
    phonetic: phoneticText,
    phonetics,
    audios,
    hasAudio: audios.length > 0,
    meanings,
    origin,
    synonyms: synonymPool,
    sourceUrl,
    fetchedAt: Date.now(),
  };
}

// --- public API ------------------------------------------------------------

/**
 * Look up a word. Returns a normalised view-model or throws DictionaryError.
 * @param {string} rawWord
 */
export async function lookupWord(rawWord) {
  const word = validateWord(rawWord); // may throw EMPTY / INVALID

  try {
    const { data } = await client.get(`/${encodeURIComponent(word)}`);
    return normalizeResponse(data, word);
  } catch (err) {
    if (err instanceof DictionaryError) throw err; // parse errors bubble up

    if (axios.isAxiosError(err)) {
      // No response at all -> network / timeout.
      if (!err.response) {
        const isTimeout = err.code === 'ECONNABORTED';
        throw new DictionaryError(
          ErrorKind.NETWORK,
          isTimeout
            ? 'The request timed out. Check your connection and try again.'
            : 'No internet connection. Please check your network and retry.',
          { word }
        );
      }
      const status = err.response.status;
      if (status === 404) {
        throw new DictionaryError(
          ErrorKind.NOT_FOUND,
          `We couldn't find "${word}" in the dictionary.`,
          { word, status }
        );
      }
      if (status >= 500) {
        throw new DictionaryError(
          ErrorKind.SERVER,
          'The dictionary service is having trouble. Please try again shortly.',
          { word, status }
        );
      }
      throw new DictionaryError(ErrorKind.UNKNOWN, 'Something went wrong with the request.', {
        word,
        status,
      });
    }

    throw new DictionaryError(ErrorKind.UNKNOWN, 'An unexpected error occurred.', { word });
  }
}
