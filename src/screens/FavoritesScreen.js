import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EmptyState from '../components/EmptyState';
import WordListItem from '../components/WordListItem';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/ThemeContext';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { favorites, toggleFavorite } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.text }]}>Favorites</Text>
        <View style={{ width: 26 }} />
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
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <WordListItem
              word={item.word}
              subtitle={item.definition}
              showStar
              starred
              onPress={(w) => navigation.navigate('WordDetail', { word: w })}
              onToggleStar={() => toggleFavorite(item)}
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
