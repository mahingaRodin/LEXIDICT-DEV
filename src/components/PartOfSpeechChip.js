import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function PartOfSpeechChip({ partOfSpeech }) {
  const { theme } = useTheme();
  const key = (partOfSpeech || 'default').toLowerCase();
  const color = theme.pos[key] || theme.pos.default;

  return (
    <View style={[styles.chip, { backgroundColor: `${color}18`, borderColor: `${color}40` }]}>
      <Text style={[styles.text, { color }]}>{partOfSpeech}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
});
