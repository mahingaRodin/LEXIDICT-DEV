import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

/**
 * Activity 3: play / pause pronunciation from API audio URL.
 * Cycles through multiple pronunciations when provided.
 */
export default function AudioButton({ audios = [], size = 44 }) {
  const { theme } = useTheme();
  const [index, setIndex] = React.useState(0);
  const pulse = useSharedValue(1);

  const current = audios[index] || audios[0];
  const url = current?.audio || null;
  const player = useAudioPlayer(url, { downloadFirst: true });
  const status = useAudioPlayerStatus(player);

  const isPlaying = status?.playing;
  const isLoading = url && !status?.isLoaded && !status?.error;

  useEffect(() => {
    if (isPlaying) {
      pulse.value = withRepeat(
        withSequence(withTiming(1.12, { duration: 400 }), withTiming(1, { duration: 400 })),
        -1,
        false
      );
    } else {
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [isPlaying, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (!url) return null;

  const toggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPlaying) {
      player.pause();
    } else {
      if (status?.didJustFinish || status?.currentTime >= (status?.duration || 0)) {
        player.seekTo(0);
      }
      player.play();
    }
  };

  const cycle = () => {
    if (audios.length <= 1) return;
    player.pause();
    setIndex((i) => (i + 1) % audios.length);
  };

  return (
    <View style={styles.row}>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={toggle}
          onLongPress={cycle}
          style={[
            styles.btn,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: theme.colors.primarySoft,
            },
          ]}
          accessibilityLabel={isPlaying ? 'Pause pronunciation' : 'Play pronunciation'}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'volume-high'}
              size={size * 0.45}
              color={theme.colors.primary}
            />
          )}
        </Pressable>
      </Animated.View>
      {audios.length > 1 && (
        <Pressable onPress={cycle} style={styles.badge}>
          <Ionicons name="swap-horizontal" size={14} color={theme.colors.subtext} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btn: { alignItems: 'center', justifyContent: 'center' },
  badge: { padding: 4 },
});
