import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Logo from './Logo';
import { WordDetailSkeleton } from './Skeleton';
import FadeInView from './FadeInView';
import { useTheme } from '../theme/ThemeContext';
import { capitalize } from '../utils/constants';

/**
 * Branded loading state for dictionary API requests.
 * Shows even on fast responses (minimum duration handled in useDictionarySearch).
 */
export default function ApiLoadingIndicator({
  message = 'Searching the dictionary',
  query = '',
  showSkeleton = true,
}) {
  const { theme } = useTheme();
  const spin = useSharedValue(0);
  const pulse = useSharedValue(1);
  const bar1 = useSharedValue(0.4);
  const bar2 = useSharedValue(0.4);
  const bar3 = useSharedValue(0.4);

  useEffect(() => {
    spin.value = withRepeat(withTiming(360, { duration: 1400, easing: Easing.linear }), -1, false);
    pulse.value = withRepeat(
      withSequence(withTiming(1.06, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1,
      false
    );
    bar1.value = withRepeat(
      withSequence(withTiming(1, { duration: 400 }), withTiming(0.35, { duration: 400 })),
      -1,
      false
    );
    bar2.value = withDelay(
      150,
      withRepeat(
        withSequence(withTiming(1, { duration: 400 }), withTiming(0.35, { duration: 400 })),
        -1,
        false
      )
    );
    bar3.value = withDelay(
      300,
      withRepeat(
        withSequence(withTiming(1, { duration: 400 }), withTiming(0.35, { duration: 400 })),
        -1,
        false
      )
    );
  }, [bar1, bar2, bar3, pulse, spin]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const b1 = useAnimatedStyle(() => ({ opacity: bar1.value, width: 36 }));
  const b2 = useAnimatedStyle(() => ({ opacity: bar2.value, width: 36 }));
  const b3 = useAnimatedStyle(() => ({ opacity: bar3.value, width: 24 }));

  return (
    <View style={styles.wrap}>
      <FadeInView spring>
        <View style={[styles.card, { backgroundColor: theme.colors.card }, theme.shadow.card]}>
          <View style={styles.center}>
            <Animated.View style={[styles.ringWrap, ringStyle]}>
              <LinearGradient
                colors={theme.gradient.cyan}
                style={styles.ring}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
            <Animated.View style={[styles.logoCenter, logoStyle]}>
              <Logo size={52} />
            </Animated.View>
          </View>

          <View style={styles.bars}>
            <Animated.View style={[styles.bar, styles.barGap, { backgroundColor: theme.colors.primary }, b1]} />
            <Animated.View style={[styles.bar, styles.barGap, { backgroundColor: theme.colors.accent }, b2]} />
            <Animated.View style={[styles.bar, { backgroundColor: theme.colors.primary }, b3]} />
          </View>

          <Text style={[styles.title, { color: theme.colors.text }]}>{message}</Text>
          {query ? (
            <Text style={[styles.query, { color: theme.colors.subtext }]}>
              Looking up <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>{capitalize(query)}</Text>…
            </Text>
          ) : null}

          <View style={styles.spinnerRow}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.hint, { color: theme.colors.muted, marginLeft: 10 }]}>
              Fetching definitions & pronunciation
            </Text>
          </View>
        </View>
      </FadeInView>

      {showSkeleton && (
        <FadeInView delay={120}>
          <WordDetailSkeleton />
        </FadeInView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  card: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 22,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  center: { width: 88, height: 88, alignItems: 'center', justifyContent: 'center' },
  ringWrap: { position: 'absolute', width: 88, height: 88 },
  ring: {
    width: 88,
    height: 88,
    borderRadius: 44,
    opacity: 0.35,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  logoCenter: { position: 'absolute' },
  bars: { flexDirection: 'row', marginTop: 18, height: 6, alignItems: 'center' },
  bar: { height: 6, borderRadius: 3 },
  barGap: { marginRight: 6 },
  title: { marginTop: 16, fontSize: 17, fontWeight: '800' },
  query: { marginTop: 6, fontSize: 14 },
  spinnerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  hint: { fontSize: 12, fontWeight: '500' },
});
