import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FadeInView from './FadeInView';
import { useTheme } from '../theme/ThemeContext';

export default function EmptyState({ icon = 'folder-open-outline', title, message }) {
  const { theme } = useTheme();
  return (
    <FadeInView style={styles.wrap}>
      <View style={[styles.icon, { backgroundColor: theme.colors.primarySoft }]}>
        <Ionicons name={icon} size={40} color={theme.colors.primary} />
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {message ? (
        <Text style={[styles.msg, { color: theme.colors.subtext }]}>{message}</Text>
      ) : null}
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  msg: { fontSize: 15, textAlign: 'center', marginTop: 8, lineHeight: 22 },
});
