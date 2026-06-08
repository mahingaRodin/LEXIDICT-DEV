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
import { tabBarBottomPadding } from '../navigation/FloatingTabBar';
import { confirmClearAll, confirmDeleteWord } from '../utils/confirm';
import { capitalize } from '../utils/constants';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { favorites, removeFavorite, clearFavorites } = useApp();

  const openWord = useCallback(
    (word) => navigation.navigate('WordDetail', { word }),
    [navigation]
  );

  const confirmRemoveOne = useCallback(
    (word) => {
      confirmDeleteWord(word, {
        title: 'Remove from favorites?',
        message: `Remove "${capitalize(word)}" from your favorites? You can always save it again from the word page.`,
        onConfirm: () => removeFavorite(word),
      });
    },
    [removeFavorite]
  );

  const confirmRemoveAll = useCallback(() => {
    confirmClearAll({
      title: 'Clear all favorites?',
      message: `This will remove all ${favorites.length} saved word${favorites.length === 1 ? '' : 's'}. This cannot be undone.`,
      onConfirm: clearFavorites,
    });
  }, [clearFavorites, favorites.length]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BouncePressable onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={theme.colors.text} />
        </BouncePressable>
        <Text style={[styles.title, { color: theme.colors.text }]}>Favorites</Text>
        {favorites.length > 0 ? (
          <BouncePressable onPress={confirmRemoveAll} hitSlop={8}>
            <Ionicons name="trash-outline" size={22} color={theme.colors.danger} />
          </BouncePressable>
        ) : (
          <View style={{ width: 22 }} />
        )}
      </View>

      {favorites.length === 0 ? (
        <EmptyState
          icon="star-outline"
          title="No favorites yet"
          message="Tap the star on any word to save it here."
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.word}
          contentContainerStyle={[styles.list, { paddingBottom: tabBarBottomPadding(insets.bottom) }]}
          renderItem={({ item }) => (
            <WordListItem
              word={item.word}
              subtitle={item.definition}
              showStar
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
