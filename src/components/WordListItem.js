import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { capitalize, relativeTime } from '../utils/constants';

export default function WordListItem({
  word,
  subtitle,
  ts,
  onPress,
  onRemove,
  showStar,
  starred,
  onToggleStar,
}) {
  const { theme } = useTheme();

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress?.(word);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
      <View style={styles.body}>
        <Text style={[styles.word, { color: theme.colors.text }]}>{capitalize(word)}</Text>
        {subtitle ? (
          <Text style={[styles.sub, { color: theme.colors.subtext }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : ts ? (
          <Text style={[styles.sub, { color: theme.colors.muted }]}>{relativeTime(ts)}</Text>
        ) : null}
      </View>
      {showStar && (
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleStar?.();
          }}
          hitSlop={10}
        >
          <Ionicons
            name={starred ? 'star' : 'star-outline'}
            size={22}
            color={starred ? theme.colors.star : theme.colors.muted}
          />
        </Pressable>
      )}
      {onRemove && (
        <Pressable onPress={() => onRemove(word)} hitSlop={10}>
          <Ionicons name="close" size={20} color={theme.colors.muted} />
        </Pressable>
      )}
      <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
    </Pressable>
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
  body: { flex: 1 },
  word: { fontSize: 17, fontWeight: '700' },
  sub: { fontSize: 13, marginTop: 2 },
});
