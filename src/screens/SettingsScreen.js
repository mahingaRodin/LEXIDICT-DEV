import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import FadeInView from '../components/FadeInView';
import { useTheme } from '../theme/ThemeContext';

const PREFS = [
  { key: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { key: 'light', label: 'Light', icon: 'sunny-outline' },
  { key: 'dark', label: 'Dark', icon: 'moon-outline' },
];

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, preference, setPreference, mode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <FadeInView>
          <Text style={[styles.section, { color: theme.colors.muted }]}>APPEARANCE</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.card }, theme.shadow.card]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Theme</Text>
            <Text style={[styles.cardSub, { color: theme.colors.subtext }]}>
              Currently using {mode} mode
            </Text>
            <View style={styles.prefs}>
              {PREFS.map((p) => {
                const active = preference === p.key;
                return (
                  <Pressable
                    key={p.key}
                    onPress={() => setPreference(p.key)}
                    style={[
                      styles.prefBtn,
                      {
                        backgroundColor: active ? theme.colors.primarySoft : theme.colors.surface,
                        borderColor: active ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={p.icon}
                      size={22}
                      color={active ? theme.colors.primary : theme.colors.subtext}
                    />
                    <Text
                      style={[
                        styles.prefLabel,
                        { color: active ? theme.colors.primary : theme.colors.text },
                      ]}
                    >
                      {p.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={120}>
          <Text style={[styles.section, { color: theme.colors.muted }]}>ABOUT</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.card }, theme.shadow.card]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>LexiDict</Text>
            <Text style={[styles.cardSub, { color: theme.colors.subtext }]}>
              Dictionary app by LexiTech Solutions Ltd — Kigali, Rwanda.
            </Text>
            <Text style={[styles.cardSub, { color: theme.colors.muted, marginTop: 12 }]}>
              Data provided by the Free Dictionary API (dictionaryapi.dev).
            </Text>
            <Text style={[styles.version, { color: theme.colors.muted }]}>Version 1.0.0</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: { fontSize: 22, fontWeight: '800' },
  scroll: { padding: 20, paddingBottom: 40 },
  section: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 10 },
  card: { borderRadius: 20, padding: 20, marginBottom: 24 },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  cardSub: { fontSize: 14, marginTop: 6, lineHeight: 20 },
  prefs: { flexDirection: 'row', gap: 10, marginTop: 16 },
  prefBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 6,
  },
  prefLabel: { fontSize: 13, fontWeight: '600' },
  version: { fontSize: 12, marginTop: 16 },
});
