import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme } from './themes';

const STORAGE_KEY = '@lexidict/theme-preference';

/**
 * ThemeContext exposes:
 *  - theme: the resolved token object (light/dark)
 *  - preference: 'system' | 'light' | 'dark'  (what the user picked)
 *  - setPreference / toggleTheme
 */
const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [preference, setPreferenceState] = useState('system');
  const [hydrated, setHydrated] = useState(false);

  // Load saved preference once.
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setPreferenceState(saved);
        }
      } catch {
        // ignore – fall back to system
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const setPreference = async (next) => {
    setPreferenceState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {
      // non-fatal
    }
  };

  const resolvedMode =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const toggleTheme = () => setPreference(resolvedMode === 'dark' ? 'light' : 'dark');

  const value = useMemo(
    () => ({
      theme: getTheme(resolvedMode),
      mode: resolvedMode,
      preference,
      setPreference,
      toggleTheme,
      hydrated,
    }),
    [resolvedMode, preference, hydrated]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
