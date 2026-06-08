import { WORD_BANK } from '../data/wordBank';
import {
  FALLBACK_SUGGESTIONS,
  SUGGESTED_WORDS,
  WORD_OF_THE_DAY_POOL,
} from './constants';

const STATIC_POOL = Array.from(
  new Set([
    ...WORD_BANK,
    ...WORD_OF_THE_DAY_POOL,
    ...SUGGESTED_WORDS,
    ...FALLBACK_SUGGESTIONS,
  ])
);

const SOURCE_LABEL = {
  history: 'Recent',
  favorite: 'Favorite',
  prefix: 'Match',
  contains: 'Contains',
};

function scoreWord(word, query, source) {
  let score = 0;
  if (word.startsWith(query)) {
    score += 100 - (word.length - query.length);
    return { score, matchType: source === 'history' || source === 'favorite' ? source : 'prefix' };
  }
  if (word.includes(query)) {
    const idx = word.indexOf(query);
    score += 50 - idx;
    return { score, matchType: source === 'history' || source === 'favorite' ? source : 'contains' };
  }
  return null;
}

/**
 * Returns quick suggestions while the user types.
 * Matches prefix first, then substring ("part of a word").
 * Prioritises history and favorites.
 */
export function getWordSuggestions(query, { history = [], favorites = [] } = {}, limit = 7) {
  const q = (query ?? '').trim().toLowerCase();
  if (!q) return [];

  const seen = new Set();
  const results = [];

  const add = (word, source) => {
    const w = (word || '').trim().toLowerCase();
    if (!w || seen.has(w) || w === q) return;
    const match = scoreWord(w, q, source);
    if (!match) return;
    seen.add(w);
    let bonus = 0;
    if (source === 'history') bonus = 30;
    if (source === 'favorite') bonus = 25;
    results.push({
      word: w,
      score: match.score + bonus,
      matchType: source === 'history' || source === 'favorite' ? source : match.matchType,
      label: SOURCE_LABEL[source === 'history' || source === 'favorite' ? source : match.matchType],
    });
  };

  history.forEach((item) => add(item.word, 'history'));
  favorites.forEach((item) => add(item.word, 'favorite'));
  STATIC_POOL.forEach((word) => add(word, 'bank'));

  return results
    .sort((a, b) => b.score - a.score || a.word.localeCompare(b.word))
    .slice(0, limit);
}

/** Split a word to highlight the matched query substring. */
export function highlightMatch(word, query) {
  const w = word || '';
  const q = (query ?? '').trim().toLowerCase();
  if (!q) return [{ text: w, match: false }];

  const lower = w.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return [{ text: w, match: false }];

  const parts = [];
  if (idx > 0) parts.push({ text: w.slice(0, idx), match: false });
  parts.push({ text: w.slice(idx, idx + q.length), match: true });
  if (idx + q.length < w.length) parts.push({ text: w.slice(idx + q.length), match: false });
  return parts;
}
