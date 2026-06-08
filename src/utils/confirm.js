import { Alert } from 'react-native';
import { capitalize } from './constants';

export function confirmDeleteWord(word, { title, message, onConfirm }) {
  const label = capitalize(word);
  Alert.alert(
    title ?? 'Remove word?',
    message ?? `Are you sure you want to remove "${label}"?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: onConfirm },
    ]
  );
}

export function confirmClearAll({ title, message, onConfirm }) {
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Clear all', style: 'destructive', onPress: onConfirm },
  ]);
}
