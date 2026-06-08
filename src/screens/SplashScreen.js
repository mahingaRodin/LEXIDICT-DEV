import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Logo from '../components/Logo';

export default function SplashScreen({ onFinish }) {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const line1 = useSharedValue(0);
  const line2 = useSharedValue(0);
  const line3 = useSharedValue(0);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 90 });
    line1.value = withDelay(400, withTiming(1, { duration: 350 }));
    line2.value = withDelay(550, withTiming(1, { duration: 350 }));
    line3.value = withDelay(700, withTiming(1, { duration: 350 }));
    titleOpacity.value = withDelay(900, withTiming(1, { duration: 400 }));

    const timer = setTimeout(() => onFinish?.(), 2200);
    return () => clearTimeout(timer);
  }, [line1, line2, line3, logoOpacity, logoScale, onFinish, titleOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));

  const bar = (sv, width) =>
    useAnimatedStyle(() => ({
      opacity: sv.value,
      transform: [{ scaleX: sv.value }],
      width,
    }));

  const bar1 = bar(line1, 120);
  const bar2 = bar(line2, 120);
  const bar3 = bar(line3, 80);

  return (
    <LinearGradient colors={['#6366F1', '#4F46E5', '#0EA5E9']} style={styles.container}>
      <Animated.View style={logoStyle}>
        <Logo size={120} />
      </Animated.View>
      <View style={styles.bars}>
        <Animated.View style={[styles.bar, bar1]} />
        <Animated.View style={[styles.bar, bar2]} />
        <Animated.View style={[styles.bar, bar3]} />
      </View>
      <Animated.Text style={[styles.title, titleStyle]}>LexiDict</Animated.Text>
      <Animated.Text style={[styles.sub, titleStyle]}>Discover words beautifully</Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bars: { marginTop: 28, gap: 8, alignItems: 'flex-start' },
  bar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 3,
    transformOrigin: 'left',
  },
  title: {
    marginTop: 32,
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  sub: { marginTop: 6, fontSize: 15, color: 'rgba(255,255,255,0.85)' },
});
