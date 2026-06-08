import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/** Subtle floating decoration for playful screens. */
export default function FloatingEmoji({ emoji, style, delay = 0, size = 22 }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.5);
  const rotate = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.7, { duration: 600 }));
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(-10, { duration: 1800 }), withTiming(0, { duration: 1800 })),
        -1,
        true
      )
    );
    rotate.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(-6, { duration: 2200 }), withTiming(6, { duration: 2200 })),
        -1,
        true
      )
    );
  }, [delay, opacity, rotate, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.Text style={[styles.emoji, { fontSize: size }, animStyle, style]}>{emoji}</Animated.Text>
  );
}

const styles = StyleSheet.create({
  emoji: { position: 'absolute' },
});
