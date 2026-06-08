import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EmptyState from '../components/EmptyState';
import WordListItem from '../components/WordListItem';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/ThemeContext';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { history, clearHistory, removeFromHistory } = useApp();

  const confirmClear = () => {
    Alert.alert('Clear history?', 'This removes all recent searches.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearHistory },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.text }]}>Search History</Text>
        {history.length > 0 ? (
          <Pressable onPress={confirmClear}>
            <Ionicons name="trash-outline" size={22} color={theme.colors.danger} />
          </Pressable>
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
              onPress={(w) => navigation.navigate('WordDetail', { word: w })}
              onRemove={removeFromHistory}
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
