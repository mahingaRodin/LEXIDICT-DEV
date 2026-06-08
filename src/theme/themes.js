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
  // Softer gradients — less glare on light backgrounds
  gradient: {
    brand: ['#7B7FED', '#5E58DC', '#3D9FD4'],
    cyan: ['#4DBED9', '#0E9AB5'],
    teal: ['#0E7490', '#155E75'],
  },
  colors: {
    bg: '#E6E4EE',
    bgElevated: '#EFEDF5',
    card: '#F3F1F8',
    cardAlt: '#EAE7F2',
    surface: '#DFDCE8',
    primary: '#5248D8',
    primarySoft: '#D8D4F0',
    accent: '#0E9AB5',
    accentSoft: '#C8E8F0',
    text: '#1E2433',
    textSoft: '#3D4659',
    subtext: '#5A6478',
    muted: '#7B8496',
    border: '#D4D0DE',
    borderStrong: '#C4BFD0',
    danger: '#C93B3B',
    dangerSoft: '#F0D8D8',
    success: '#15803D',
    warning: '#B45309',
    chip: '#E4E1EC',
    chipText: '#4A5268',
    quoteBg: '#E6E7F2',
    tabBar: '#F0EEF6',
    skeleton: '#D8D4E2',
    skeletonHi: '#E8E5F0',
    overlay: 'rgba(30,36,51,0.38)',
    onPrimary: '#FFFFFF',
    star: '#D97706',
  },
  shadow: {
    card: {
      shadowColor: '#5C5670',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.07,
      shadowRadius: 16,
      elevation: 3,
    },
    floating: {
      shadowColor: '#5C5670',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.14,
      shadowRadius: 20,
      elevation: 8,
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
