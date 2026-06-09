import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
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
import { capitalize } from '../utils/constants';

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
  const [shakeKey, setShakeKey] = useState(1);
  const [iconShakeKey, setIconShakeKey] = useState(0);
  const [messageKey, setMessageKey] = useState(0);

  useEffect(() => {
    setShakeKey((k) => k + 1);
    setMessageKey((k) => k + 1);
  }, [error?.kind, error?.message]);

  const handleTryAgain = useCallback(() => {
    if (error?.kind === ErrorKind.NOT_FOUND) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setIconShakeKey((k) => k + 1);
      setMessageKey((k) => k + 1);
      return;
    }
    onRetry?.();
  }, [error?.kind, onRetry]);

  if (!error) return null;

  const icon = ICONS[error.kind] || ICONS.default;
  const emoji = EMOJI[error.kind] || EMOJI.default;
  const isNotFound = error.kind === ErrorKind.NOT_FOUND;
  const title =
    error.kind === ErrorKind.NOT_FOUND
      ? 'Word not found'
      : error.kind === ErrorKind.NETWORK
        ? 'Connection problem'
        : error.kind === ErrorKind.EMPTY
          ? 'Nothing to search'
          : 'Something went wrong';
  const reaffirmMessage = isNotFound
    ? error.word
      ? `"${capitalize(error.word)}" is not in the dictionary. Try another word or pick a suggestion below.`
      : 'This word is not in the dictionary. Try a single word or pick a suggestion below.'
    : error.message;

  return (
    <FadeInView style={styles.wrap} from={28} spring>
      <ShakeView trigger={shakeKey}>
        <View style={[styles.card, { backgroundColor: theme.colors.card }, theme.shadow.card]}>
          <ShakeView trigger={iconShakeKey}>
            <WobbleIcon name={icon} color={theme.colors.danger} bg={theme.colors.dangerSoft} />
          </ShakeView>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          <FadeInView key={`msg-${messageKey}`} delay={80} from={12} spring>
            <View style={[styles.msgBox, { backgroundColor: theme.colors.dangerSoft }]}>
              <Ionicons name="information-circle-outline" size={18} color={theme.colors.danger} />
              <Text style={[styles.msg, { color: theme.colors.textSoft }]}>
                {isNotFound ? reaffirmMessage : error.message}
              </Text>
            </View>
          </FadeInView>
          {onRetry && (
            <FadeInView delay={220}>
              <BouncePressable onPress={handleTryAgain} style={styles.retryWrap}>
                <LinearGradient colors={theme.gradient.cyan} style={styles.retry}>
                  <View style={styles.retryInner}>
                    <Ionicons name="refresh" size={18} color="#fff" />
                    <Text style={styles.retryText}>Try again</Text>
                  </View>
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
  msgBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 14,
    marginTop: 4,
    width: '100%',
  },
  msg: { flex: 1, fontSize: 15, lineHeight: 22, marginLeft: 10 },
  retryWrap: { marginTop: 22, width: '100%', alignSelf: 'stretch' },
  retry: { borderRadius: 16, overflow: 'hidden', width: '100%' },
  retryInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 16, marginLeft: 8, includeFontPadding: false },
  suggest: { marginTop: 24, width: '100%' },
  suggestLabel: { fontSize: 12, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  chipText: { fontSize: 14, fontWeight: '600' },
});
