import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

const TAB_ICONS = {
  Home: ['home', 'home-outline'],
  History: ['time', 'time-outline'],
  Favorites: ['star', 'star-outline'],
  Learn: ['bulb', 'bulb-outline'],
  Settings: ['settings', 'settings-outline'],
};

export const FLOATING_TAB_HEIGHT = 64;
export const FLOATING_TAB_MARGIN = 20;

/** Bottom inset reserved for the floating pill tab bar on scrollable screens. */
export function tabBarBottomPadding(insetsBottom = 0) {
  return FLOATING_TAB_HEIGHT + FLOATING_TAB_MARGIN + insetsBottom + 12;
}

export default function FloatingTabBar({ state, descriptors, navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 10);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.outer, { paddingBottom: bottom + FLOATING_TAB_MARGIN }]}
    >
      <View
        style={[
          styles.pill,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
          theme.shadow.floating,
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const pair = TAB_ICONS[route.name] || ['ellipse', 'ellipse-outline'];
          const iconName = focused ? pair[0] : pair[1];
          const color = focused ? theme.colors.primary : theme.colors.muted;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={route.key}
              focused={focused}
              onPress={onPress}
              icon={iconName}
              color={color}
              activeSoft={theme.colors.primarySoft}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? route.name}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabButton({ focused, onPress, icon, color, activeSoft, accessibilityLabel }) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.88, { damping: 14, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 220 });
      }}
      style={styles.tabBtn}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.iconWrap,
          focused && { backgroundColor: activeSoft },
          animStyle,
        ]}
      >
        <Ionicons name={icon} size={24} color={color} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '88%',
    maxWidth: 420,
    height: FLOATING_TAB_HEIGHT,
    borderRadius: FLOATING_TAB_HEIGHT / 2,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
