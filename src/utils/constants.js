// Curated word pools used for decorative-but-real features that the API supports.
// (Word of the Day / suggestions are fetched from the SAME dictionary endpoint.)

export const WORD_OF_THE_DAY_POOL = [
  'serendipity',
  'ephemeral',
  'mellifluous',
  'ineffable',
  'luminous',
  'ethereal',
  'petrichor',
  'eloquent',
  'resilience',
  'wanderlust',
  'solitude',
  'euphoria',
  'aurora',
  'cascade',
  'nostalgia',
];

export const SUGGESTED_WORDS = [
  'ethereal',
  'ephemeral',
  'luminous',
  'serendipity',
  'eloquent',
  'resilience',
];

// Shown on the "not found" screen as helpful alternatives.
export const FALLBACK_SUGGESTIONS = ['lexicon', 'etymology', 'ephemeral', 'serendipity'];

/** Deterministic pick so the Word of the Day is stable for a given calendar day. */
export function wordOfTheDay(date = new Date()) {
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / 86400000
  );
  return WORD_OF_THE_DAY_POOL[dayOfYear % WORD_OF_THE_DAY_POOL.length];
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return { text: 'Good morning', emoji: '👋' };
  if (h < 17) return { text: 'Good afternoon', emoji: '☀️' };
  if (h < 21) return { text: 'Good evening', emoji: '🌆' };
  return { text: 'Good night', emoji: '🌙' };
}

export function capitalize(s = '') {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function relativeTime(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
