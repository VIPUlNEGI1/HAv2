import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/Theme/useTheme';
import { AuthTheme } from '@/Theme/AuthTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/; // Indian 10-digit mobile

export type ValidationType =
  | 'email'
  | 'phone'
  | 'required'
  | 'numeric'
  | 'minLength'
  | { pattern: RegExp; message: string }
  | ((value: string) => string | null);

function validateValue(value: string, type: ValidationType, minLength?: number): string | null {
  const trimmed = value.trim();
  if (typeof type === 'function') {
    return type(trimmed);
  }
  if (type === 'required') {
    return trimmed.length === 0 ? 'This field is required' : null;
  }
  if (type === 'email') {
    if (trimmed.length === 0) return 'Email is required';
    return EMAIL_REGEX.test(trimmed) ? null : 'Enter a valid email address';
  }
  if (type === 'phone') {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return 'Mobile number is required';
    if (digits.length < 10) return 'Enter a valid 10-digit number';
    return PHONE_REGEX.test(digits) ? null : 'Enter a valid mobile number';
  }
  if (type === 'numeric') {
    if (trimmed.length === 0) return null;
    return /^\d+$/.test(trimmed) ? null : 'Please enter numbers only';
  }
  if (type === 'minLength' && minLength != null) {
    if (trimmed.length === 0) return null;
    return trimmed.length >= minLength ? null : `Minimum ${minLength} characters`;
  }
  if (typeof type === 'object' && type.pattern) {
    if (trimmed.length === 0) return null;
    return type.pattern.test(trimmed) ? null : type.message;
  }
  return null;
}

export interface ValidatedInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  validation?: ValidationType;
  minLength?: number;
  /** Show error only after first blur or submit (default: show as user types after first touch) */
  validateOnBlurOnly?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  required?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  /** External error override (e.g. from form submit) */
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  /** Use auth flow styling (light input bg, teal focus, AuthTheme colors) */
  variant?: 'default' | 'auth';
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  validation,
  minLength,
  validateOnBlurOnly = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  secureTextEntry = false,
  required = false,
  style,
  containerStyle,
  error: externalError,
  autoCapitalize,
  autoCorrect = false,
  variant = 'default',
}) => {
  const { theme, borderRadius } = useTheme();
  const [touched, setTouched] = useState(false);
  const [blurred, setBlurred] = useState(false);
  const isAuth = variant === 'auth';

  const showValidation = touched && (blurred || !validateOnBlurOnly);
  const validationError = useMemo(() => {
    if (externalError) return externalError;
    if (!validation || !showValidation) return null;
    return validateValue(value, validation, minLength);
  }, [externalError, validation, value, showValidation, minLength]);

  const hasError = Boolean(validationError);

  const handleChange = useCallback(
    (text: string) => {
      setTouched(true);
      onChangeText(text);
    },
    [onChangeText],
  );

  const handleBlur = useCallback(() => {
    setBlurred(true);
  }, []);

  const labelColor = isAuth ? AuthTheme.textPrimary : theme.text;
  const asteriskColor = isAuth ? AuthTheme.error : theme.error;
  const inputBg = isAuth ? AuthTheme.inputBg : theme.surface;
  const inputColor = isAuth ? AuthTheme.textPrimary : theme.text;
  const borderColor = hasError
    ? (isAuth ? AuthTheme.error : theme.error)
    : isAuth
      ? AuthTheme.inputBorder
      : theme.border;
  const placeholderColor = isAuth ? AuthTheme.inputPlaceholder : theme.textSecondary;
  const errorColor = isAuth ? AuthTheme.error : theme.error;

  return (
    <View style={[styles.container, containerStyle, style]}>
      {label && (
        <Text style={[styles.label, { color: labelColor }]}>
          {label}
          {(required || validation === 'required') && <Text style={{ color: asteriskColor }}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          {
            backgroundColor: inputBg,
            color: inputColor,
            borderColor,
            borderRadius: moderateScale(14),
            minHeight: multiline ? verticalScale(80) : undefined,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={handleChange}
        onBlur={handleBlur}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        textAlignVertical={multiline ? 'top' : 'center'}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
      />
      {validationError ? (
        <Animated.Text
          entering={FadeInDown.duration(200)}
          style={[styles.error, { color: errorColor }]}
        >
          {validationError}
        </Animated.Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(14),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: verticalScale(6),
  },
  input: {
    borderWidth: 1.5,
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(14),
    fontSize: moderateScale(16),
  },
  textArea: {
    textAlignVertical: 'top',
  },
  error: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginTop: verticalScale(4),
  },
});
