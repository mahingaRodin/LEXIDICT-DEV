import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

export default function InlineHint({ message, type = 'warning', visible }) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-8);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    if (visible && message) {
      opacity.value = withTiming(1, { duration: 280 });
      translateY.value = withSpring(0, { damping: 14, stiffness: 180 });
      scale.value = withSequence(
        withSpring(1.03, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12 })
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(-8, { duration: 200 });
    }
  }, [visible, message, opacity, scale, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  if (!message) return null;

  const isWarning = type === 'warning';
  const color = isWarning ? theme.colors.warning : theme.colors.danger;
  const bg = isWarning ? `${theme.colors.warning}18` : theme.colors.dangerSoft;

  return (
    <Animated.View style={[styles.wrap, style, { backgroundColor: bg, borderColor: `${color}35` }]}>
      <Ionicons name={isWarning ? 'hand-left-outline' : 'alert-circle-outline'} size={18} color={color} />
      <Text style={[styles.text, { color: theme.colors.textSoft }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
  },
  text: { flex: 1, fontSize: 14, fontWeight: '500', lineHeight: 19 },
});
