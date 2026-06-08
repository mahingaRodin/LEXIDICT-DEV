import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import FadeInView from './FadeInView';
import { useTheme } from '../theme/ThemeContext';
import { capitalize } from '../utils/constants';
import { highlightMatch } from '../utils/wordSuggestions';

const MATCH_ICON = {
  history: 'time-outline',
  favorite: 'star',
  prefix: 'flash-outline',
  contains: 'search-outline',
};

export default function SearchSuggestions({ suggestions = [], query = '', onSelect, visible }) {
  const { theme } = useTheme();
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible && suggestions.length > 0) {
      opacity.value = withTiming(1, { duration: 200 });
      height.value = withSpring(1, { damping: 16, stiffness: 140 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      height.value = withTiming(0, { duration: 150 });
    }
  }, [visible, suggestions.length, height, opacity]);

  const panelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scaleY: height.value }],
  }));

  if (!visible || suggestions.length === 0) return null;

  return (
    <Animated.View
      style={[
        styles.panel,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        theme.shadow.card,
        panelStyle,
      ]}
    >
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={14} color={theme.colors.accent} />
        <Text style={[styles.headerText, { color: theme.colors.muted }]}>Quick suggestions</Text>
      </View>
      {suggestions.map((item, i) => {
        const parts = highlightMatch(item.word, query);
        const icon = MATCH_ICON[item.matchType] || 'search-outline';
        const iconColor =
          item.matchType === 'favorite'
            ? theme.colors.star
            : item.matchType === 'history'
              ? theme.colors.accent
              : theme.colors.primary;

        return (
          <FadeInView key={item.word} delay={i * 40} from={6} spring>
            <Pressable
              onPress={() => onSelect?.(item.word)}
              style={({ pressed }) => [
                styles.row,
                { borderTopColor: theme.colors.border },
                pressed && { backgroundColor: theme.colors.surface },
              ]}
            >
              <View style={[styles.iconWrap, { backgroundColor: `${iconColor}18` }]}>
                <Ionicons name={icon} size={16} color={iconColor} />
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.word}>
                  {parts.map((p, pi) => (
                    <Text
                      key={pi}
                      style={
                        p.match
                          ? [styles.match, { color: theme.colors.primary }]
                          : { color: theme.colors.text, fontWeight: '600' }
                      }
                    >
                      {pi === 0 ? capitalize(p.text) : p.text}
                    </Text>
                  ))}
                </Text>
                <Text style={[styles.label, { color: theme.colors.muted }]}>{item.label}</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.muted} />
            </Pressable>
          </FadeInView>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    transformOrigin: 'top',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  word: { fontSize: 16 },
  match: { fontWeight: '800' },
  label: { fontSize: 11, marginTop: 2 },
});
