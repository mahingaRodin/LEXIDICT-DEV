import React, { useCallback, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import StatCard from '../components/StatCard';
import FadeInView from '../components/FadeInView';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { greeting, SUGGESTED_WORDS, wordOfTheDay, capitalize } from '../utils/constants';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { stats } = useApp();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const greet = greeting();
  const wotd = wordOfTheDay();

  const goSearch = useCallback(
    (word) => {
      const w = (word || query).trim();
      if (!w) return;
      Keyboard.dismiss();
      navigation.navigate('WordDetail', { word: w });
    },
    [navigation, query]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <LinearGradient
        colors={theme.gradient.brand}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <Pressable onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
          <Ionicons name="menu" size={26} color="#fff" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Logo size={36} />
          <Text style={styles.brand}>LexiDict</Text>
        </View>
        <View style={styles.menuBtn} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FadeInView>
          <Text style={[styles.greet, { color: theme.colors.text }]}>
            {greet.text} {greet.emoji}
          </Text>
          <Text style={[styles.greetSub, { color: theme.colors.subtext }]}>
            What word shall we explore today?
          </Text>
        </FadeInView>

        <FadeInView delay={80} style={{ marginTop: 20 }}>
          <SearchBar value={query} onChangeText={setQuery} onSubmit={() => goSearch()} />
        </FadeInView>

        <View style={styles.statsRow}>
          <StatCard icon="book" label="Words searched" value={stats.wordsLearned} delay={120} />
          <StatCard
            icon="flame"
            label="Day streak"
            value={stats.streak}
            delay={180}
            accent={theme.brand.cyan}
          />
          <StatCard
            icon="star"
            label="Favorites"
            value={stats.favoritesCount}
            delay={240}
            accent={theme.colors.star}
          />
        </View>

        <FadeInView delay={300}>
          <Pressable
            onPress={() => goSearch(wotd)}
            style={[styles.wotd, { backgroundColor: theme.colors.card }, theme.shadow.card]}
          >
            <LinearGradient colors={theme.gradient.cyan} style={styles.wotdBadge}>
              <Text style={styles.wotdBadgeText}>Word of the Day</Text>
            </LinearGradient>
            <Text style={[styles.wotdWord, { color: theme.colors.text }]}>
              {capitalize(wotd)}
            </Text>
            <Text style={[styles.wotdHint, { color: theme.colors.subtext }]}>
              Tap to discover its meaning
            </Text>
            <Ionicons
              name="arrow-forward-circle"
              size={28}
              color={theme.colors.accent}
              style={styles.wotdIcon}
            />
          </Pressable>
        </FadeInView>

        <FadeInView delay={380}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Try these</Text>
          <View style={styles.chips}>
            {SUGGESTED_WORDS.map((w) => (
              <Pressable
                key={w}
                onPress={() => goSearch(w)}
                style={[styles.chip, { backgroundColor: theme.colors.chip }]}
              >
                <Text style={[styles.chipText, { color: theme.colors.chipText }]}>
                  {capitalize(w)}
                </Text>
              </Pressable>
            ))}
          </View>
        </FadeInView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  menuBtn: { width: 40, alignItems: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  brand: { color: '#fff', fontSize: 20, fontWeight: '800' },
  scroll: { padding: 20, paddingBottom: 40 },
  greet: { fontSize: 28, fontWeight: '800' },
  greetSub: { fontSize: 15, marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 22 },
  wotd: { marginTop: 22, borderRadius: 22, padding: 20, position: 'relative' },
  wotdBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  wotdBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  wotdWord: { fontSize: 32, fontWeight: '800', marginTop: 14 },
  wotdHint: { fontSize: 14, marginTop: 4 },
  wotdIcon: { position: 'absolute', right: 20, top: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 28, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  chipText: { fontSize: 14, fontWeight: '600' },
});
