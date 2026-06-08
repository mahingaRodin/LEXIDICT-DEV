import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { capitalize } from '../utils/constants';

const NAV_ITEMS = [
  { name: 'Home', icon: 'home-outline', route: 'Tabs', screen: 'Home' },
  { name: 'History', icon: 'time-outline', route: 'Tabs', screen: 'History' },
  { name: 'Favorites', icon: 'star-outline', route: 'Tabs', screen: 'Favorites' },
  { name: 'Learn', icon: 'bulb-outline', route: 'Tabs', screen: 'Learn' },
  { name: 'Settings', icon: 'settings-outline', route: 'Tabs', screen: 'Settings' },
];

export default function CustomDrawerContent(props) {
  const { navigation } = props;
  const { theme } = useTheme();
  const { history, stats } = useApp();
  const insets = useSafeAreaInsets();

  const openWord = (word) => {
    navigation.closeDrawer();
    navigation.navigate('Tabs', {
      screen: 'Home',
      params: { screen: 'WordDetail', params: { word } },
    });
  };

  const goTo = (item) => {
    navigation.closeDrawer();
    navigation.navigate(item.route, { screen: item.screen });
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 8 }]}
      style={{ backgroundColor: theme.colors.bg }}
    >
      <LinearGradient colors={theme.gradient.brand} style={styles.hero}>
        <Logo size={52} />
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>LexiDict</Text>
          <Text style={styles.heroSub}>by LexiTech Solutions</Text>
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={[styles.stat, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.statVal, { color: theme.colors.text }]}>{stats.wordsLearned}</Text>
          <Text style={[styles.statLbl, { color: theme.colors.subtext }]}>searched</Text>
        </View>
        <View style={[styles.stat, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.statVal, { color: theme.colors.text }]}>{stats.streak}</Text>
          <Text style={[styles.statLbl, { color: theme.colors.subtext }]}>day streak</Text>
        </View>
      </View>

      <Text style={[styles.section, { color: theme.colors.muted }]}>MENU</Text>
      {NAV_ITEMS.map((item) => (
        <Pressable key={item.screen} onPress={() => goTo(item)} style={styles.navItem}>
          <Ionicons name={item.icon} size={22} color={theme.colors.primary} />
          <Text style={[styles.navLabel, { color: theme.colors.text }]}>{item.name}</Text>
        </Pressable>
      ))}

      <Text style={[styles.section, { color: theme.colors.muted, marginTop: 20 }]}>
        RECENT SEARCHES
      </Text>
      {history.length === 0 ? (
        <Text style={[styles.emptyHist, { color: theme.colors.subtext }]}>
          Your searches will appear here
        </Text>
      ) : (
        <ScrollView style={styles.histList} nestedScrollEnabled>
          {history.slice(0, 12).map((item) => (
            <Pressable
              key={item.word}
              onPress={() => openWord(item.word)}
              style={[styles.histItem, { backgroundColor: theme.colors.cardAlt }]}
            >
              <Ionicons name="search" size={14} color={theme.colors.accent} />
              <Text style={[styles.histWord, { color: theme.colors.text }]}>
                {capitalize(item.word)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 32 },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
    gap: 14,
  },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  heroText: { flex: 1 },
  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 16 },
  stat: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: '800' },
  statLbl: { fontSize: 11, marginTop: 2 },
  section: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  navLabel: { fontSize: 16, fontWeight: '600' },
  emptyHist: { marginHorizontal: 20, fontSize: 14, fontStyle: 'italic' },
  histList: { maxHeight: 220, marginHorizontal: 16 },
  histItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 6,
  },
  histWord: { fontSize: 15, fontWeight: '600' },
});
