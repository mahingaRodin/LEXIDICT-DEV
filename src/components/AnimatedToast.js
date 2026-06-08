import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

const CONFIG = {
  success: { icon: 'checkmark-circle', emoji: '⭐' },
  error: { icon: 'alert-circle', emoji: '😅' },
  info: { icon: 'information-circle', emoji: '💡' },
};

export default function AnimatedToast({
  message,
  type = 'success',
  visible,
  onDismiss,
  duration = 2600,
  topOffset = 56,
}) {
  const { theme } = useTheme();
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    if (!visible || !message) return;

    translateY.value = withSpring(0, { damping: 14, stiffness: 160 });
    opacity.value = withTiming(1, { duration: 220 });
    scale.value = withSequence(
      withSpring(1.04, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 180 })
    );

    const timer = setTimeout(() => {
      translateY.value = withTiming(-120, { duration: 280 });
      opacity.value = withTiming(0, { duration: 280 }, (finished) => {
        if (finished && onDismiss) runOnJS(onDismiss)();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, message, duration, onDismiss, opacity, scale, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  if (!visible || !message) return null;

  const cfg = CONFIG[type] || CONFIG.info;
  const bg =
    type === 'success'
      ? theme.colors.primarySoft
      : type === 'error'
        ? theme.colors.dangerSoft
        : theme.colors.accentSoft;
  const accent =
    type === 'success' ? theme.colors.primary : type === 'error' ? theme.colors.danger : theme.colors.accent;

  return (
    <Animated.View style={[styles.wrap, { top: topOffset }, style]} pointerEvents="none">
      <View style={[styles.toast, { backgroundColor: bg, borderColor: `${accent}40` }]}>
        <Ionicons name={cfg.icon} size={22} color={accent} />
        <Text style={[styles.text, { color: theme.colors.text }]}>{message}</Text>
        <Text style={styles.emoji}>{cfg.emoji}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  text: { flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  emoji: { fontSize: 18 },
});
