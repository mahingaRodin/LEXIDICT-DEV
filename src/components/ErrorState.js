import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FadeInView from './FadeInView';
import { useTheme } from '../theme/ThemeContext';
import { ErrorKind } from '../api/dictionaryApi';

const ICONS = {
  [ErrorKind.NOT_FOUND]: 'book-outline',
  [ErrorKind.NETWORK]: 'cloud-offline-outline',
  [ErrorKind.EMPTY]: 'text-outline',
  [ErrorKind.INVALID]: 'alert-circle-outline',
  default: 'warning-outline',
};

export default function ErrorState({ error, onRetry, suggestions = [] }) {
  const { theme } = useTheme();
  if (!error) return null;

  const icon = ICONS[error.kind] || ICONS.default;
  const title =
    error.kind === ErrorKind.NOT_FOUND
      ? 'Word not found'
      : error.kind === ErrorKind.NETWORK
        ? 'Connection problem'
        : 'Something went wrong';

  return (
    <FadeInView style={styles.wrap}>
      <View style={[styles.card, { backgroundColor: theme.colors.card }, theme.shadow.card]}>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.dangerSoft }]}>
          <Ionicons name={icon} size={36} color={theme.colors.danger} />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.msg, { color: theme.colors.subtext }]}>{error.message}</Text>
        {onRetry && (
          <Pressable onPress={onRetry} style={styles.retryWrap}>
            <LinearGradient colors={theme.gradient.cyan} style={styles.retry}>
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={styles.retryText}>Try again</Text>
            </LinearGradient>
          </Pressable>
        )}
        {suggestions.length > 0 && (
          <View style={styles.suggest}>
            <Text style={[styles.suggestLabel, { color: theme.colors.muted }]}>Try instead</Text>
            <View style={styles.chips}>
              {suggestions.map((w) => (
                <Pressable
                  key={w}
                  onPress={() => onRetry?.(w)}
                  style={[styles.chip, { backgroundColor: theme.colors.chip }]}
                >
                  <Text style={[styles.chipText, { color: theme.colors.chipText }]}>{w}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20 },
  card: { borderRadius: 22, padding: 28, alignItems: 'center' },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  msg: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  retryWrap: { marginTop: 22, width: '100%' },
  retry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  suggest: { marginTop: 24, width: '100%' },
  suggestLabel: { fontSize: 12, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  chipText: { fontSize: 14, fontWeight: '600' },
});
