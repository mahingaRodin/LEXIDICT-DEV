import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

function Bone({ width, height, radius, style }) {
  const { theme } = useTheme();
  const shimmer = useSharedValue(0.45);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(withTiming(1, { duration: 700 }), withTiming(0.45, { duration: 700 })),
      -1,
      false
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: shimmer.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: theme.colors.skeleton,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function WordDetailSkeleton() {
  const { theme } = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.bg }]}>
      <Bone width="55%" height={42} radius={12} />
      <Bone width="35%" height={18} radius={8} style={{ marginTop: 14 }} />
      <View style={[styles.card, { backgroundColor: theme.colors.card }, theme.shadow.card]}>
        <Bone width={90} height={26} radius={theme.radius.pill} />
        <Bone width="100%" height={14} radius={6} style={{ marginTop: 16 }} />
        <Bone width="92%" height={14} radius={6} style={{ marginTop: 10 }} />
        <Bone width="78%" height={14} radius={6} style={{ marginTop: 10 }} />
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.card }, theme.shadow.card]}>
        <Bone width={70} height={26} radius={theme.radius.pill} />
        <Bone width="100%" height={14} radius={6} style={{ marginTop: 16 }} />
        <Bone width="88%" height={14} radius={6} style={{ marginTop: 10 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, paddingTop: 8 },
  card: { marginTop: 16, padding: 18, borderRadius: 18 },
});
