import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Handles Android hardware back button: calls onBack when back is pressed while screen is focused.
 * Use in auth screens that show a back button in the header.
 */
export function useAuthBackHandler(onBack: () => void) {
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        onBack();
        return true;
      });
      return () => sub.remove();
    }, [onBack]),
  );
}
