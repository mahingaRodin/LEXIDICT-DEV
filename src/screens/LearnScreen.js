import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FadeInView from '../components/FadeInView';
import { useTheme } from '../theme/ThemeContext';
import { tabBarBottomPadding } from '../navigation/FloatingTabBar';
import { WORD_OF_THE_DAY_POOL } from '../utils/constants';

const TIPS = [
  {
    icon: 'search',
    title: 'Smart search',
    body: 'Search any English word — we fetch definitions, examples, and pronunciation from the Free Dictionary API.',
  },
  {
    icon: 'account-voice',
    iconFamily: 'material',
    title: 'Hear it',
    body: 'Tap the voice icon to hear pronunciation. Long-press to switch between available accents.',
  },
  {
    icon: 'star',
    title: 'Save favorites',
    body: 'Bookmark words you want to revisit. Your favorites persist across app restarts.',
  },
  {
    icon: 'flame',
    title: 'Build a streak',
    body: 'Look up at least one word each day to grow your learning streak.',
  },
];

export default function LearnScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [poolIndex, setPoolIndex] = useState(0);

  const randomWord = WORD_OF_THE_DAY_POOL[poolIndex % WORD_OF_THE_DAY_POOL.length];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.text }]}>Learn</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarBottomPadding(insets.bottom) }]}
      >
        <FadeInView>
          <LinearGradient colors={theme.gradient.brand} style={styles.hero}>
            <Ionicons name="school" size={32} color="#fff" />
            <Text style={styles.heroTitle}>Grow your vocabulary</Text>
            <Text style={styles.heroSub}>
              Explore one new word at a time and build a daily habit.
            </Text>
          </LinearGradient>
        </FadeInView>

        <FadeInView delay={100}>
          <Pressable
            onPress={() => {
              setPoolIndex((i) => i + 1);
              navigation.navigate('WordDetail', { word: randomWord });
            }}
            style={[styles.discover, { backgroundColor: theme.colors.card }, theme.shadow.card]}
          >
            <Text style={[styles.discoverLabel, { color: theme.colors.muted }]}>
              DISCOVER A WORD
            </Text>
            <Text style={[styles.discoverWord, { color: theme.colors.text }]}>{randomWord}</Text>
            <View style={styles.discoverRow}>
              <Text style={[styles.discoverCta, { color: theme.colors.accent }]}>Look it up</Text>
              <Ionicons name="arrow-forward" size={18} color={theme.colors.accent} />
            </View>
          </Pressable>
        </FadeInView>

        {TIPS.map((tip, i) => (
          <FadeInView key={tip.title} delay={160 + i * 70}>
            <View style={[styles.tip, { backgroundColor: theme.colors.card }, theme.shadow.card]}>
              <View style={[styles.tipIcon, { backgroundColor: theme.colors.primarySoft }]}>
                {tip.iconFamily === 'material' ? (
                  <MaterialCommunityIcons name={tip.icon} size={22} color={theme.colors.primary} />
                ) : (
                  <Ionicons name={tip.icon} size={22} color={theme.colors.primary} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.tipTitle, { color: theme.colors.text }]}>{tip.title}</Text>
                <Text style={[styles.tipBody, { color: theme.colors.subtext }]}>{tip.body}</Text>
              </View>
            </View>
          </FadeInView>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: { fontSize: 22, fontWeight: '800' },
  scroll: { padding: 20 },
  hero: { borderRadius: 22, padding: 24, marginBottom: 16 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 12 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 8, lineHeight: 20 },
  discover: { borderRadius: 20, padding: 20, marginBottom: 20 },
  discoverLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  discoverWord: { fontSize: 28, fontWeight: '800', marginTop: 8, textTransform: 'capitalize' },
  discoverRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  discoverCta: { fontSize: 15, fontWeight: '700' },
  tip: {
    flexDirection: 'row',
    gap: 14,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  tipIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: { fontSize: 16, fontWeight: '700' },
  tipBody: { fontSize: 14, marginTop: 4, lineHeight: 20 },
});
