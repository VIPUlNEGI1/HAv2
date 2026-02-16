import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale } from '@/Helpers/Responsive';

const DIGITS = 6;

interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
  onFulfill?: (otp: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  onFulfill,
}) => {
  const { theme, borderRadius } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const boxRadius = borderRadius?.md ?? moderateScale(12);

  const digits = value.split('').concat(Array(DIGITS - value.length).fill(''));

  const handleChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, DIGITS);
    onChange(cleaned);
    if (cleaned.length === DIGITS && onFulfill) onFulfill(cleaned);
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (value.length === DIGITS && e.nativeEvent.key !== 'Backspace') return;
  };

  return (
    <View style={styles.wrap}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onKeyPress={handleKeyPress}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        maxLength={DIGITS}
        autoComplete="one-time-code"
        autoFocus
        style={[styles.hiddenInput, { color: theme.text }]}
        caretHidden
      />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        style={styles.boxRow}
      >
        {digits.map((digit, index) => (
          <View
            key={index}
            style={[
              styles.box,
              {
                backgroundColor: theme.surface,
                borderColor: index === value.length && focused ? theme.primary : theme.border,
                borderWidth: index === value.length && focused ? 2 : 1,
                borderRadius: boxRadius,
              },
            ]}
          >
            <Text style={[styles.digitText, { color: theme.text }]}>
              {digit}
            </Text>
            {index === value.length && focused && (
              <View style={[styles.cursor, { backgroundColor: theme.primary }]} />
            )}
          </View>
        ))}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'relative', width: '100%' },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: 56,
    opacity: 0,
    fontSize: 1,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(8),
  },
  box: {
    flex: 1,
    height: moderateScale(52),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  digitText: {
    fontSize: moderateScale(22),
    fontWeight: '700',
  },
  cursor: {
    width: 2,
    height: 24,
    position: 'absolute',
    borderRadius: 1,
    bottom: 14,
  },
});
