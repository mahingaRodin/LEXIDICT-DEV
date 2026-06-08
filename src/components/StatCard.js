import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FadeInView from './FadeInView';
import { useTheme } from '../theme/ThemeContext';

export default function StatCard({ icon, label, value, delay = 0, accent }) {
  const { theme } = useTheme();
  const color = accent || theme.colors.primary;

  return (
    <FadeInView delay={delay} style={[styles.card, { backgroundColor: theme.colors.card }, theme.shadow.card]}>
      <View style={[styles.icon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.colors.subtext }]}>{label}</Text>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    minWidth: 100,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  value: { fontSize: 22, fontWeight: '800' },
  label: { fontSize: 12, marginTop: 2, fontWeight: '500' },
});
