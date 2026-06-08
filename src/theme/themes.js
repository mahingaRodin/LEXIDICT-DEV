/**
 * Design tokens for LexiDict.
 * Two full palettes (light / dark) derived from the brand identity:
 *   indigo  #4F46E5  ->  cyan  #06B6D4
 * Everything in the UI reads from these tokens so dark mode is a single switch.
 */

const brand = {
  indigo: '#4F46E5',
  indigoLight: '#6366F1',
  indigoSoft: '#818CF8',
  cyan: '#06B6D4',
  cyanLight: '#22D3EE',
  teal: '#0E7490',
};

// Shared, theme-agnostic values
const base = {
  brand,
  gradient: {
    brand: ['#6366F1', '#4F46E5', '#0EA5E9'], // hero / splash
    cyan: ['#22D3EE', '#06B6D4'], // Find button
    teal: ['#0E7490', '#155E75'], // thesaurus card (dark)
  },
  radius: { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  font: {
    // Use system fonts for zero-config cross-platform crispness.
    h1: 40,
    h2: 30,
    h3: 22,
    title: 18,
    body: 15,
    small: 13,
    tiny: 11,
  },
  pos: {
    noun: '#4F46E5',
    verb: '#0E7490',
    adjective: '#7C3AED',
    adverb: '#DB2777',
    exclamation: '#EA580C',
    pronoun: '#0891B2',
    preposition: '#16A34A',
    conjunction: '#CA8A04',
    interjection: '#EA580C',
    default: '#64748B',
  },
};

export const lightTheme = {
  ...base,
  mode: 'light',
  isDark: false,
  colors: {
    bg: '#F4F4FB',
    bgElevated: '#FFFFFF',
    card: '#FFFFFF',
    cardAlt: '#F1F0FB',
    surface: '#EDECF7',
    primary: brand.indigo,
    primarySoft: '#E0E7FF',
    accent: brand.cyan,
    accentSoft: '#CFFAFE',
    text: '#0F172A',
    textSoft: '#334155',
    subtext: '#64748B',
    muted: '#94A3B8',
    border: '#E6E5F0',
    borderStrong: '#D8D7E8',
    danger: '#DC2626',
    dangerSoft: '#FEE2E2',
    success: '#16A34A',
    warning: '#D97706',
    chip: '#ECEBF7',
    chipText: '#475569',
    quoteBg: '#EEF0FF',
    tabBar: '#FBFBFE',
    skeleton: '#E7E6F2',
    skeletonHi: '#F3F2FB',
    overlay: 'rgba(15,23,42,0.45)',
    onPrimary: '#FFFFFF',
    star: '#F59E0B',
  },
  shadow: {
    card: {
      shadowColor: '#4F46E5',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      elevation: 4,
    },
    floating: {
      shadowColor: '#4F46E5',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.28,
      shadowRadius: 22,
      elevation: 10,
    },
  },
};

export const darkTheme = {
  ...base,
  mode: 'dark',
  isDark: true,
  colors: {
    bg: '#0A0E1A',
    bgElevated: '#111729',
    card: '#141B2E',
    cardAlt: '#1A2238',
    surface: '#1C2540',
    primary: brand.indigoLight,
    primarySoft: '#1E2547',
    accent: brand.cyanLight,
    accentSoft: '#0C3A44',
    text: '#F1F5F9',
    textSoft: '#CBD5E1',
    subtext: '#94A3B8',
    muted: '#64748B',
    border: '#23304D',
    borderStrong: '#2D3B5C',
    danger: '#F87171',
    dangerSoft: '#3A1E20',
    success: '#4ADE80',
    warning: '#FBBF24',
    chip: '#1B2440',
    chipText: '#C7D2FE',
    quoteBg: '#1A2138',
    tabBar: '#0C1322',
    skeleton: '#1A2238',
    skeletonHi: '#222C47',
    overlay: 'rgba(0,0,0,0.6)',
    onPrimary: '#FFFFFF',
    star: '#FBBF24',
  },
  shadow: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 18,
      elevation: 4,
    },
    floating: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5,
      shadowRadius: 22,
      elevation: 10,
    },
  },
};

export const getTheme = (mode) => (mode === 'dark' ? darkTheme : lightTheme);
