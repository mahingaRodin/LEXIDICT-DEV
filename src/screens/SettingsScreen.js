import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import BouncePressable from '../components/BouncePressable';
import FadeInView from '../components/FadeInView';
import Logo from '../components/Logo';
import { tabBarBottomPadding } from '../navigation/FloatingTabBar';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { confirmClearAll } from '../utils/confirm';

const THEME_OPTIONS = [
  { key: 'system', label: 'System', desc: 'Match your device', icon: 'phone-portrait-outline' },
  { key: 'light', label: 'Light', desc: 'Bright & clean', icon: 'sunny-outline' },
  { key: 'dark', label: 'Dark', desc: 'Easy on the eyes', icon: 'moon-outline' },
];

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, preference, setPreference, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const { stats, clearHistory, clearFavorites, history, favorites } = useApp();

  const pickTheme = (key) => {
    Haptics.selectionAsync();
    setPreference(key);
  };

  const confirmClearHist = () => {
    if (!history.length) return;
    confirmClearAll({
      title: 'Clear search history?',
      message: `Remove all ${history.length} recent searches from this device.`,
      onConfirm: clearHistory,
    });
  };

  const confirmClearFavs = () => {
    if (!favorites.length) return;
    confirmClearAll({
      title: 'Clear all favorites?',
      message: `Remove all ${favorites.length} saved words from this device.`,
      onConfirm: clearFavorites,
    });
  };

  const goTab = (screen) => {
    navigation.getParent()?.navigate(screen);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BouncePressable onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={theme.colors.text} />
        </BouncePressable>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarBottomPadding(insets.bottom) }]}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView>
          <LinearGradient colors={theme.gradient.brand} style={styles.hero}>
            <Logo size={48} />
            <View style={styles.heroBody}>
              <Text style={styles.heroTitle}>LexiDict</Text>
              <Text style={styles.heroSub}>Your personal dictionary companion</Text>
              <View style={styles.heroBadge}>
                <Ionicons name="color-palette-outline" size={14} color="#fff" />
                <Text style={styles.heroBadgeText}>{mode} mode active</Text>
              </View>
            </View>
          </LinearGradient>
        </FadeInView>

        <FadeInView delay={80}>
          <Text style={[styles.section, { color: theme.colors.muted }]}>YOUR PROGRESS</Text>
          <View style={styles.statsRow}>
            <StatPill icon="book-outline" value={stats.wordsLearned} label="Searched" theme={theme} />
            <StatPill icon="star" value={stats.favoritesCount} label="Saved" theme={theme} accent={theme.colors.star} />
            <StatPill icon="flame" value={stats.streak} label="Streak" theme={theme} accent={theme.brand.cyan} />
          </View>
        </FadeInView>

        <FadeInView delay={140}>
          <Text style={[styles.section, { color: theme.colors.muted }]}>APPEARANCE</Text>
          <Text style={[styles.sectionHint, { color: theme.colors.subtext }]}>
            Choose how LexiDict looks on your device
          </Text>
          {THEME_OPTIONS.map((opt) => {
            const active = preference === opt.key;
            return (
              <BouncePressable
                key={opt.key}
                onPress={() => pickTheme(opt.key)}
                style={[
                  styles.themeRow,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                  },
                  theme.shadow.card,
                  active && { backgroundColor: theme.colors.primarySoft },
                ]}
              >
                <View style={[styles.themeIcon, { backgroundColor: active ? `${theme.colors.primary}22` : theme.colors.surface }]}>
                  <Ionicons name={opt.icon} size={22} color={active ? theme.colors.primary : theme.colors.subtext} />
                </View>
                <View style={styles.themeText}>
                  <Text style={[styles.themeLabel, { color: theme.colors.text }]}>{opt.label}</Text>
                  <Text style={[styles.themeDesc, { color: theme.colors.subtext }]}>{opt.desc}</Text>
                </View>
                {active ? (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color={theme.colors.muted} />
                )}
              </BouncePressable>
            );
          })}
        </FadeInView>

        <FadeInView delay={220}>
          <Text style={[styles.section, { color: theme.colors.muted }]}>QUICK LINKS</Text>
          <SettingsRow
            icon="time-outline"
            label="Search history"
            sub={`${history.length} word${history.length === 1 ? '' : 's'}`}
            onPress={() => goTab('History')}
            theme={theme}
          />
          <SettingsRow
            icon="star-outline"
            label="Favorites"
            sub={`${favorites.length} saved`}
            onPress={() => goTab('Favorites')}
            theme={theme}
          />
          <SettingsRow
            icon="bulb-outline"
            label="Learn & tips"
            sub="Grow your vocabulary"
            onPress={() => goTab('Learn')}
            theme={theme}
          />
        </FadeInView>

        <FadeInView delay={300}>
          <Text style={[styles.section, { color: theme.colors.muted }]}>DATA</Text>
          <SettingsRow
            icon="trash-outline"
            label="Clear search history"
            sub={history.length ? 'Remove all recent searches' : 'Nothing to clear'}
            onPress={confirmClearHist}
            theme={theme}
            danger
            disabled={!history.length}
          />
          <SettingsRow
            icon="trash-outline"
            label="Clear favorites"
            sub={favorites.length ? 'Remove all saved words' : 'Nothing to clear'}
            onPress={confirmClearFavs}
            theme={theme}
            danger
            disabled={!favorites.length}
          />
        </FadeInView>

        <FadeInView delay={380}>
          <Text style={[styles.section, { color: theme.colors.muted }]}>ABOUT</Text>
          <View style={[styles.aboutCard, { backgroundColor: theme.colors.card }, theme.shadow.card]}>
            <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>LexiTech Solutions Ltd</Text>
            <Text style={[styles.aboutSub, { color: theme.colors.subtext }]}>
              Built in Kigali, Rwanda — helping you explore English words with definitions, examples, and pronunciation.
            </Text>
            <View style={[styles.aboutRow, { borderTopColor: theme.colors.border }]}>
              <Ionicons name="globe-outline" size={18} color={theme.colors.accent} />
              <Text style={[styles.aboutMeta, { color: theme.colors.muted }]}>
                Powered by dictionaryapi.dev
              </Text>
            </View>
            <Text style={[styles.version, { color: theme.colors.muted }]}>Version 1.0.0</Text>
          </View>
        </FadeInView>
      </ScrollView>
    </View>
  );
}

function StatPill({ icon, value, label, theme, accent }) {
  const color = accent || theme.colors.primary;
  return (
    <View style={[styles.statPill, { backgroundColor: theme.colors.card }, theme.shadow.card]}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={[styles.statVal, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.statLbl, { color: theme.colors.subtext }]}>{label}</Text>
    </View>
  );
}

function SettingsRow({ icon, label, sub, onPress, theme, danger, disabled }) {
  return (
    <BouncePressable
      onPress={disabled ? undefined : onPress}
      style={[
        styles.row,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border, opacity: disabled ? 0.5 : 1 },
        theme.shadow.card,
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: danger ? theme.colors.dangerSoft : theme.colors.primarySoft }]}>
        <Ionicons name={icon} size={20} color={danger ? theme.colors.danger : theme.colors.primary} />
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowLabel, { color: theme.colors.text }]}>{label}</Text>
        <Text style={[styles.rowSub, { color: theme.colors.subtext }]}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
    </BouncePressable>
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
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 22,
    marginBottom: 8,
  },
  heroBody: { flex: 1 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  heroBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  section: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginTop: 22, marginBottom: 8 },
  sectionHint: { fontSize: 13, marginBottom: 12, lineHeight: 18 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statPill: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', gap: 4 },
  statVal: { fontSize: 20, fontWeight: '800' },
  statLbl: { fontSize: 11, fontWeight: '500' },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 10,
    gap: 12,
  },
  themeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeText: { flex: 1 },
  themeLabel: { fontSize: 16, fontWeight: '700' },
  themeDesc: { fontSize: 12, marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '700' },
  rowSub: { fontSize: 12, marginTop: 2 },
  aboutCard: { borderRadius: 20, padding: 20 },
  aboutTitle: { fontSize: 17, fontWeight: '800' },
  aboutSub: { fontSize: 14, marginTop: 8, lineHeight: 21 },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  aboutMeta: { fontSize: 13 },
  version: { fontSize: 12, marginTop: 12 },
});
