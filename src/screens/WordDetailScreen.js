import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import AudioButton from '../components/AudioButton';
import AnimatedToast from '../components/AnimatedToast';
import ErrorState from '../components/ErrorState';
import FadeInView from '../components/FadeInView';
import BouncePressable from '../components/BouncePressable';
import PartOfSpeechChip from '../components/PartOfSpeechChip';
import { WordDetailSkeleton } from '../components/Skeleton';
import CelebrationBurst from '../components/CelebrationBurst';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { useDictionarySearch } from '../hooks/useDictionarySearch';
import { useToast } from '../hooks/useToast';
import { ErrorKind } from '../api/dictionaryApi';
import { FALLBACK_SUGGESTIONS, capitalize } from '../utils/constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WordDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { addToHistory, isFavorite, toggleFavorite } = useApp();
  const { toast, show, hide, visible } = useToast();
  const [activeWord, setActiveWord] = useState(route.params?.word || '');
  const [celebrateKey, setCelebrateKey] = useState(0);
  const starScale = useSharedValue(1);

  useEffect(() => {
    if (route.params?.word) setActiveWord(route.params.word);
  }, [route.params?.word]);

  const onSuccess = useCallback(
    (data) => {
      addToHistory(data.word);
      setCelebrateKey((k) => k + 1);
    },
    [addToHistory]
  );

  const { data, error, isLoading, search } = useDictionarySearch({ onSuccess });

  useEffect(() => {
    if (activeWord) search(activeWord).catch(() => {});
  }, [activeWord, search]);

  const handleRetry = useCallback(
    (w) => {
      const next = (typeof w === 'string' ? w : activeWord).trim();
      if (!next) return;
      setActiveWord(next);
      if (navigation.setParams) {
        navigation.setParams({ word: next });
      }
    },
    [activeWord, navigation]
  );

  const favSnapshot = data
    ? {
        word: data.word,
        phonetic: data.phonetic,
        partOfSpeech: data.meanings[0]?.partOfSpeech,
        definition: data.meanings[0]?.definitions[0]?.definition,
      }
    : null;

  const starred = data ? isFavorite(data.word) : false;

  const starAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: starScale.value }],
  }));

  const handleFavorite = () => {
    if (!favSnapshot) return;
    const added = toggleFavorite(favSnapshot);
    starScale.value = withSequence(
      withSpring(1.45, { damping: 6, stiffness: 280 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    if (added) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      show(`"${capitalize(data.word)}" saved to favorites!`, 'success');
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      show(`Removed "${capitalize(data.word)}" from favorites`, 'info');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <AnimatedToast
        message={toast?.message}
        type={toast?.type}
        visible={visible}
        onDismiss={hide}
        topOffset={insets.top + 12}
      />

      <View style={[styles.topBar, { paddingTop: insets.top + 8, borderBottomColor: theme.colors.border }]}>
        <BouncePressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </BouncePressable>
        <Text style={[styles.topTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {capitalize(activeWord)}
        </Text>
        {data && (
          <AnimatedPressable onPress={handleFavorite} style={[styles.backBtn, starAnimStyle]}>
            <Ionicons
              name={starred ? 'star' : 'star-outline'}
              size={24}
              color={starred ? theme.colors.star : theme.colors.text}
            />
          </AnimatedPressable>
        )}
        {!data && <View style={styles.backBtn} />}
      </View>

      <CelebrationBurst trigger={celebrateKey} />

      {isLoading && <WordDetailSkeleton />}

      {!isLoading && error && (
        <ErrorState
          error={error}
          onRetry={handleRetry}
          suggestions={error.kind === ErrorKind.NOT_FOUND ? FALLBACK_SUGGESTIONS : []}
        />
      )}

      {!isLoading && data && (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <FadeInView spring>
            <View style={styles.headRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.word, { color: theme.colors.text }]}>
                  {capitalize(data.word)}
                </Text>
                {data.phonetic && (
                  <Text style={[styles.phonetic, { color: theme.colors.subtext }]}>
                    /{data.phonetic}/
                  </Text>
                )}
              </View>
              {data.hasAudio && <AudioButton audios={data.audios} />}
            </View>
          </FadeInView>

          {data.origin && (
            <FadeInView delay={60} spring>
              <View style={[styles.originCard, { backgroundColor: theme.colors.quoteBg }]}>
                <Ionicons name="leaf-outline" size={18} color={theme.colors.accent} />
                <Text style={[styles.origin, { color: theme.colors.textSoft }]}>{data.origin}</Text>
              </View>
            </FadeInView>
          )}

          {data.synonyms.length > 0 && (
            <FadeInView delay={100}>
              <Text style={[styles.section, { color: theme.colors.muted }]}>SYNONYMS</Text>
              <View style={styles.synRow}>
                {data.synonyms.map((s, i) => (
                  <FadeInView key={s} delay={120 + i * 40} from={6} spring>
                    <BouncePressable
                      onPress={() => navigation.push('WordDetail', { word: s })}
                      style={[styles.synChip, { backgroundColor: theme.colors.chip }]}
                    >
                      <Text style={[styles.synText, { color: theme.colors.chipText }]}>{s}</Text>
                    </BouncePressable>
                  </FadeInView>
                ))}
              </View>
            </FadeInView>
          )}

          {data.meanings.map((meaning, mi) => (
            <FadeInView key={`${meaning.partOfSpeech}-${mi}`} delay={140 + mi * 60} spring>
              <View
                style={[styles.meaningCard, { backgroundColor: theme.colors.card }, theme.shadow.card]}
              >
                <PartOfSpeechChip partOfSpeech={meaning.partOfSpeech} />
                {meaning.definitions.map((def, di) => (
                  <View key={di} style={[styles.defBlock, di > 0 && styles.defBorder, { borderTopColor: theme.colors.border }]}>
                    <Text style={[styles.defNum, { color: theme.colors.muted }]}>{di + 1}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.definition, { color: theme.colors.text }]}>
                        {def.definition}
                      </Text>
                      {def.example && (
                        <FadeInView delay={80 + di * 30} from={6}>
                          <View style={[styles.example, { backgroundColor: theme.colors.quoteBg }]}>
                            <Text style={[styles.exampleText, { color: theme.colors.textSoft }]}>
                              "{def.example}"
                            </Text>
                          </View>
                        </FadeInView>
                      )}
                      {def.synonyms?.length > 0 && (
                        <Text style={[styles.miniSyn, { color: theme.colors.subtext }]}>
                          Synonyms: {def.synonyms.slice(0, 5).join(', ')}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </FadeInView>
          ))}

          {data.sourceUrl && (
            <FadeInView delay={400}>
              <Text style={[styles.source, { color: theme.colors.muted }]}>
                Source: dictionaryapi.dev
              </Text>
            </FadeInView>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700' },
  scroll: { padding: 20, paddingBottom: 40 },
  headRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  word: { fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  phonetic: { fontSize: 17, marginTop: 4, fontStyle: 'italic' },
  originCard: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
    alignItems: 'flex-start',
  },
  origin: { flex: 1, fontSize: 14, lineHeight: 20, fontStyle: 'italic' },
  section: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginTop: 20, marginBottom: 10 },
  synRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  synChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  synText: { fontSize: 13, fontWeight: '600' },
  meaningCard: { marginTop: 16, borderRadius: 20, padding: 18 },
  defBlock: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 16 },
  defBorder: { borderTopWidth: 1 },
  defNum: { fontSize: 14, fontWeight: '800', width: 20 },
  definition: { fontSize: 16, lineHeight: 24 },
  example: { marginTop: 10, padding: 12, borderRadius: 12 },
  exampleText: { fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  miniSyn: { fontSize: 12, marginTop: 8 },
  source: { textAlign: 'center', fontSize: 12, marginTop: 24 },
});
