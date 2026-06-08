import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BouncePressable from '../components/BouncePressable';
import EmptyState from '../components/EmptyState';
import WordListItem from '../components/WordListItem';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { confirmClearAll, confirmDeleteWord } from '../utils/confirm';
import { capitalize } from '../utils/constants';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { history, clearHistory, removeFromHistory } = useApp();

  const openWord = useCallback(
    (word) => navigation.navigate('WordDetail', { word }),
    [navigation]
  );

  const confirmRemoveOne = useCallback(
    (word) => {
      confirmDeleteWord(word, {
        title: 'Remove from history?',
        message: `Remove "${capitalize(word)}" from your search history?`,
        onConfirm: () => removeFromHistory(word),
      });
    },
    [removeFromHistory]
  );

  const confirmRemoveAll = useCallback(() => {
    confirmClearAll({
      title: 'Clear all history?',
      message: `This will remove all ${history.length} recent search${history.length === 1 ? '' : 'es'}. This cannot be undone.`,
      onConfirm: clearHistory,
    });
  }, [clearHistory, history.length]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BouncePressable onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={theme.colors.text} />
        </BouncePressable>
        <Text style={[styles.title, { color: theme.colors.text }]}>Search History</Text>
        {history.length > 0 ? (
          <BouncePressable onPress={confirmRemoveAll} hitSlop={8}>
            <Ionicons name="trash-outline" size={22} color={theme.colors.danger} />
          </BouncePressable>
        ) : (
          <View style={{ width: 22 }} />
        )}
      </View>

      {history.length === 0 ? (
        <EmptyState
          icon="time-outline"
          title="No searches yet"
          message="Words you look up will be saved here for quick access."
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.word}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <WordListItem
              word={item.word}
              ts={item.ts}
              onPress={openWord}
              onDelete={confirmRemoveOne}
            />
          )}
        />
      )}
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
  list: { padding: 20, paddingTop: 4 },
});
