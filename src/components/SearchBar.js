import React, { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import ShakeView from './ShakeView';
import InlineHint from './InlineHint';
import { sanitizeSearchInput } from '../api/dictionaryApi';
import { useTheme } from '../theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onEmptySubmit,
  onInvalidInput,
  placeholder = 'Search a word…',
  autoFocus = false,
  shakeTrigger = 0,
  hintMessage = '',
  hintVisible = false,
  suggestionsVisible = false,
}) {
  const { theme } = useTheme();
  const inputRef = useRef(null);
  const scale = useSharedValue(1);

  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handleSubmit = () => {
    const trimmed = (value ?? '').trim();
    if (!trimmed) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      onEmptySubmit?.();
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSubmit?.();
  };

  return (
    <View>
      <ShakeView trigger={shakeTrigger}>
        <View
          style={[
            styles.row,
            {
              backgroundColor: theme.colors.card,
              borderColor: hintVisible
                ? theme.colors.warning
                : suggestionsVisible
                  ? theme.colors.primary
                  : 'transparent',
            },
            theme.shadow.card,
            hintVisible && styles.rowWarn,
          ]}
        >
          <Ionicons name="text-outline" size={20} color={hintVisible ? theme.colors.warning : theme.colors.muted} style={styles.icon} />
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={(t) => {
              const sanitized = sanitizeSearchInput(t);
              if (sanitized !== t) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                onInvalidInput?.();
              }
              onChangeText(sanitized);
            }}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.muted}
            style={[styles.input, { color: theme.colors.text }]}
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={autoFocus}
          />
          {value?.length > 0 && (
            <Pressable onPress={() => onChangeText('')} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color={theme.colors.muted} />
            </Pressable>
          )}
          <AnimatedPressable
            onPressIn={() => {
              scale.value = withSpring(0.92);
            }}
            onPressOut={() => {
              scale.value = withSpring(1);
            }}
            onPress={handleSubmit}
            style={[styles.btnWrap, btnStyle]}
          >
            <LinearGradient colors={theme.gradient.cyan} style={styles.btn}>
              <Ionicons name="search-outline" size={18} color="#fff" />
            </LinearGradient>
          </AnimatedPressable>
        </View>
      </ShakeView>
      <InlineHint message={hintMessage} type="warning" visible={hintVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    minHeight: 54,
    borderWidth: 1.5,
  },
  rowWarn: {},
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, paddingVertical: 8 },
  btnWrap: { marginLeft: 8 },
  btn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
