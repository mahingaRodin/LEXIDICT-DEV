import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import BouncePressable from './BouncePressable';
import { useTheme } from '../theme/ThemeContext';
import { capitalize, relativeTime } from '../utils/constants';

export default function WordListItem({
  word,
  subtitle,
  ts,
  onPress,
  onDelete,
  showStar,
}) {
  const { theme } = useTheme();

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress?.(word);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete?.(word);
  };

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.body, pressed && { opacity: 0.85 }]}
      >
        <Text style={[styles.word, { color: theme.colors.text }]}>{capitalize(word)}</Text>
        {subtitle ? (
          <Text style={[styles.sub, { color: theme.colors.subtext }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : ts ? (
          <Text style={[styles.sub, { color: theme.colors.muted }]}>{relativeTime(ts)}</Text>
        ) : null}
      </Pressable>
      {showStar && (
        <Ionicons name="star" size={20} color={theme.colors.star} style={styles.star} />
      )}
      {onDelete && (
        <BouncePressable onPress={handleDelete} style={styles.deleteBtn} hitSlop={6}>
          <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
        </BouncePressable>
      )}
      <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  body: { flex: 1, paddingVertical: 2 },
  word: { fontSize: 17, fontWeight: '700' },
  sub: { fontSize: 13, marginTop: 2 },
  star: { marginRight: 2 },
  deleteBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
