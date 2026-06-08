import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const PARTICLES = ['✨', '🎉', '💫', '⭐'];

function Particle({ emoji, index }) {
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);
  const x = useSharedValue(0);

  useEffect(() => {
    const spread = (index - 1.5) * 28;
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 200 }));
    y.value = withDelay(index * 80, withTiming(-70 - index * 12, { duration: 900 }));
    x.value = withDelay(index * 80, withTiming(spread, { duration: 900 }));
    opacity.value = withDelay(index * 80 + 500, withTiming(0, { duration: 400 }));
  }, [index, opacity, x, y]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }, { translateX: x.value }],
  }));

  return <Animated.Text style={[styles.particle, style]}>{emoji}</Animated.Text>;
}

/** Quick burst when a word loads successfully. */
export default function CelebrationBurst({ trigger = 0 }) {
  if (!trigger) return null;

  return (
    <View style={styles.wrap} pointerEvents="none">
      {PARTICLES.map((emoji, i) => (
        <Particle key={`${trigger}-${i}`} emoji={emoji} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  particle: { position: 'absolute', fontSize: 22 },
});
