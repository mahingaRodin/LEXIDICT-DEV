import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Global app state (Activity 4 + favorites):
 *  - history: list of successfully searched words (no duplicates, newest first)
 *  - favorites: words the user bookmarked (with a tiny snapshot for display)
 *  - stats: derived from REAL data only (words learned, day streak) — no fake XP.
 * Everything is persisted with AsyncStorage so it survives restarts.
 */

const HISTORY_KEY = '@lexidict/history';
const FAVORITES_KEY = '@lexidict/favorites';
const STREAK_KEY = '@lexidict/streak';
const MAX_HISTORY = 50;

const AppContext = createContext(undefined);

const todayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const dayDiff = (a, b) => Math.round((new Date(a) - new Date(b)) / 86400000);

export function AppProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [streak, setStreak] = useState({ count: 0, lastDay: null });
  const [hydrated, setHydrated] = useState(false);

  // --- hydrate ---
  useEffect(() => {
    (async () => {
      try {
        const [h, f, s] = await Promise.all([
          AsyncStorage.getItem(HISTORY_KEY),
          AsyncStorage.getItem(FAVORITES_KEY),
          AsyncStorage.getItem(STREAK_KEY),
        ]);
        if (h) setHistory(JSON.parse(h));
        if (f) setFavorites(JSON.parse(f));
        if (s) setStreak(JSON.parse(s));
      } catch {
        // start fresh on corrupt storage
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const persist = useCallback((key, value) => {
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, []);

  // --- streak: bump once per calendar day of activity ---
  const bumpStreak = useCallback(() => {
    setStreak((prev) => {
      const today = todayKey();
      if (prev.lastDay === today) return prev; // already counted today
      let count = 1;
      if (prev.lastDay && dayDiff(today, prev.lastDay) === 1) count = prev.count + 1;
      const next = { count, lastDay: today };
      persist(STREAK_KEY, next);
      return next;
    });
  }, [persist]);

  // --- history (Activity 4: add on success, no duplicates, newest first) ---
  const addToHistory = useCallback(
    (word) => {
      const w = (word || '').trim().toLowerCase();
      if (!w) return;
      setHistory((prev) => {
        const deduped = prev.filter((item) => item.word !== w);
        const next = [{ word: w, ts: Date.now() }, ...deduped].slice(0, MAX_HISTORY);
        persist(HISTORY_KEY, next);
        return next;
      });
      bumpStreak();
    },
    [persist, bumpStreak]
  );

  const removeFromHistory = useCallback(
    (word) => {
      setHistory((prev) => {
        const next = prev.filter((i) => i.word !== word);
        persist(HISTORY_KEY, next);
        return next;
      });
    },
    [persist]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    persist(HISTORY_KEY, []);
  }, [persist]);

  // --- favorites ---
  const isFavorite = useCallback(
    (word) => favorites.some((f) => f.word === (word || '').toLowerCase()),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (entry) => {
      // entry: { word, phonetic, partOfSpeech, definition }
      const w = (entry?.word || '').toLowerCase();
      if (!w) return false;
      let added = false;
      setFavorites((prev) => {
        const exists = prev.some((f) => f.word === w);
        const next = exists
          ? prev.filter((f) => f.word !== w)
          : [{ ...entry, word: w, ts: Date.now() }, ...prev];
        added = !exists;
        persist(FAVORITES_KEY, next);
        return next;
      });
      return added;
    },
    [persist]
  );

  const removeFavorite = useCallback(
    (word) => {
      const w = (word || '').trim().toLowerCase();
      if (!w) return;
      setFavorites((prev) => {
        const next = prev.filter((f) => f.word !== w);
        persist(FAVORITES_KEY, next);
        return next;
      });
    },
    [persist]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    persist(FAVORITES_KEY, []);
  }, [persist]);

  const stats = useMemo(
    () => ({
      wordsLearned: history.length,
      favoritesCount: favorites.length,
      streak: streak.count,
    }),
    [history.length, favorites.length, streak.count]
  );

  const value = useMemo(
    () => ({
      hydrated,
      history,
      favorites,
      stats,
      addToHistory,
      removeFromHistory,
      clearHistory,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [
      hydrated,
      history,
      favorites,
      stats,
      addToHistory,
      removeFromHistory,
      clearHistory,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      clearFavorites,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
