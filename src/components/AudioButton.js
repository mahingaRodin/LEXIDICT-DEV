import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAudioPlayback, PlaybackState } from '../hooks/useAudioPlayback';
import { useTheme } from '../theme/ThemeContext';

const STATE_LABEL = {
  [PlaybackState.IDLE]: 'Tap to play',
  [PlaybackState.LOADING]: 'Loading…',
  [PlaybackState.PLAYING]: 'Playing',
  [PlaybackState.PAUSED]: 'Paused',
  [PlaybackState.FINISHED]: 'Play again',
  [PlaybackState.ERROR]: 'Unavailable',
};

const MAIN_ICON = {
  [PlaybackState.IDLE]: 'volume-high',
  [PlaybackState.LOADING]: 'hourglass-outline',
  [PlaybackState.PLAYING]: 'pause',
  [PlaybackState.PAUSED]: 'play',
  [PlaybackState.FINISHED]: 'play',
  [PlaybackState.ERROR]: 'volume-mute',
};

/**
 * Activity 3: play, pause, and stop pronunciation audio.
 * Long-press main button or tap swap icon to cycle accents.
 */
export default function AudioButton({ audios = [], size = 44 }) {
  const { theme } = useTheme();
  const [index, setIndex] = React.useState(0);
  const pulse = useSharedValue(1);

  const current = audios[index] || audios[0];
  const url = current?.audio || null;
  const { state, isLoading, canStop, toggle, stop } = useAudioPlayback(url);

  useEffect(() => {
    if (state === PlaybackState.PLAYING) {
      pulse.value = withRepeat(
        withSequence(withTiming(1.12, { duration: 400 }), withTiming(1, { duration: 400 })),
        -1,
        false
      );
    } else {
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [state, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (!url) return null;

  const handleToggle = async () => {
    if (state === PlaybackState.ERROR || state === PlaybackState.LOADING) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await toggle();
  };

  const handleStop = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await stop();
  };

  const cycle = async () => {
    if (audios.length <= 1) return;
    await stop();
    setIndex((i) => (i + 1) % audios.length);
  };

  const mainIcon = isLoading ? null : MAIN_ICON[state] || 'volume-high';
  const statusLabel = STATE_LABEL[state] || 'Audio';

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Animated.View style={animatedStyle}>
          <Pressable
            onPress={handleToggle}
            onLongPress={audios.length > 1 ? cycle : undefined}
            disabled={state === PlaybackState.LOADING || state === PlaybackState.ERROR}
            style={[
              styles.btn,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor:
                  state === PlaybackState.PLAYING
                    ? `${theme.colors.primary}22`
                    : theme.colors.primarySoft,
                borderColor:
                  state === PlaybackState.PLAYING ? theme.colors.primary : 'transparent',
              },
            ]}
            accessibilityLabel={`${statusLabel} pronunciation`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Ionicons name={mainIcon} size={size * 0.45} color={theme.colors.primary} />
            )}
          </Pressable>
        </Animated.View>

        {canStop && (
          <Pressable
            onPress={handleStop}
            style={[styles.stopBtn, { backgroundColor: theme.colors.dangerSoft }]}
            accessibilityLabel="Stop pronunciation"
          >
            <Ionicons name="stop" size={18} color={theme.colors.danger} />
          </Pressable>
        )}

        {audios.length > 1 && (
          <Pressable onPress={cycle} style={styles.badge} accessibilityLabel="Switch accent">
            <Ionicons name="swap-horizontal" size={14} color={theme.colors.subtext} />
          </Pressable>
        )}
      </View>

      <Text style={[styles.status, { color: theme.colors.muted }]}>{statusLabel}</Text>
      {current?.text && (
        <Text style={[styles.phonetic, { color: theme.colors.subtext }]} numberOfLines={1}>
          {current.text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-end' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  stopBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: { padding: 4 },
  status: { fontSize: 10, fontWeight: '600', marginTop: 6, textTransform: 'uppercase', letterSpacing: 0.4 },
  phonetic: { fontSize: 11, marginTop: 2, fontStyle: 'italic', maxWidth: 120 },
});
