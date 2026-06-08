import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import FadeInView from './FadeInView';
import BouncePressable from './BouncePressable';
import ShakeView from './ShakeView';
import { useTheme } from '../theme/ThemeContext';
import { ErrorKind } from '../api/dictionaryApi';

const ICONS = {
  [ErrorKind.NOT_FOUND]: 'book-outline',
  [ErrorKind.NETWORK]: 'cloud-offline-outline',
  [ErrorKind.EMPTY]: 'text-outline',
  [ErrorKind.INVALID]: 'alert-circle-outline',
  default: 'warning-outline',
};

const EMOJI = {
  [ErrorKind.NOT_FOUND]: '📖',
  [ErrorKind.NETWORK]: '📡',
  [ErrorKind.EMPTY]: '✏️',
  [ErrorKind.INVALID]: '🤔',
  default: '⚠️',
};

function WobbleIcon({ name, color, bg }) {
  const rotate = useSharedValue(0);
  const bounce = useSharedValue(1);

  useEffect(() => {
    rotate.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 120 }),
        withTiming(8, { duration: 120 }),
        withTiming(-4, { duration: 100 }),
        withTiming(0, { duration: 100 }),
        withDelay(1400, withTiming(0, { duration: 0 }))
      ),
      -1,
      false
    );
    bounce.value = withRepeat(
      withSequence(
        withSpring(1.08, { damping: 6, stiffness: 200 }),
        withSpring(1, { damping: 8, stiffness: 180 }),
        withDelay(1600, withTiming(1, { duration: 0 }))
      ),
      -1,
      false
    );
  }, [bounce, rotate]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }, { scale: bounce.value }],
  }));

  return (
    <Animated.View style={[styles.iconWrap, { backgroundColor: bg }, style]}>
      <Ionicons name={name} size={36} color={color} />
    </Animated.View>
  );
}

export default function ErrorState({ error, onRetry, suggestions = [] }) {
  const { theme } = useTheme();
  const [shakeKey, setShakeKey] = React.useState(1);

  useEffect(() => {
    setShakeKey((k) => k + 1);
  }, [error?.kind, error?.message]);

  if (!error) return null;

  const icon = ICONS[error.kind] || ICONS.default;
  const emoji = EMOJI[error.kind] || EMOJI.default;
  const title =
    error.kind === ErrorKind.NOT_FOUND
      ? 'Word not found'
      : error.kind === ErrorKind.NETWORK
        ? 'Connection problem'
        : error.kind === ErrorKind.EMPTY
          ? 'Nothing to search'
          : 'Something went wrong';

  return (
    <FadeInView style={styles.wrap} from={28} spring>
      <ShakeView trigger={shakeKey}>
        <View style={[styles.card, { backgroundColor: theme.colors.card }, theme.shadow.card]}>
          <WobbleIcon name={icon} color={theme.colors.danger} bg={theme.colors.dangerSoft} />
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          <FadeInView delay={120} from={12}>
            <Text style={[styles.msg, { color: theme.colors.subtext }]}>{error.message}</Text>
          </FadeInView>
          {onRetry && (
            <FadeInView delay={220}>
              <BouncePressable onPress={() => onRetry()} style={styles.retryWrap}>
                <LinearGradient colors={theme.gradient.cyan} style={styles.retry}>
                  <Ionicons name="refresh" size={18} color="#fff" />
                  <Text style={styles.retryText}>Try again</Text>
                </LinearGradient>
              </BouncePressable>
            </FadeInView>
          )}
          {suggestions.length > 0 && (
            <View style={styles.suggest}>
              <FadeInView delay={300}>
                <Text style={[styles.suggestLabel, { color: theme.colors.muted }]}>Try instead</Text>
              </FadeInView>
              <View style={styles.chips}>
                {suggestions.map((w, i) => (
                  <FadeInView key={w} delay={380 + i * 70} from={10} spring>
                    <BouncePressable
                      onPress={() => onRetry?.(w)}
                      style={[styles.chip, { backgroundColor: theme.colors.chip }]}
                    >
                      <Text style={[styles.chipText, { color: theme.colors.chipText }]}>{w}</Text>
                    </BouncePressable>
                  </FadeInView>
                ))}
              </View>
            </View>
          )}
        </View>
      </ShakeView>
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
    marginBottom: 4,
  },
  emoji: { fontSize: 22, marginBottom: 8 },
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
