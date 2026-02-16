import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { AuthTheme } from '@/Theme/AuthTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

interface FormInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  required?: boolean;
  style?: any;
  variant?: 'default' | 'auth' | 'stepper';
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  secureTextEntry = false,
  required = false,
  style,
  variant = 'default',
}) => {
  const { theme, borderRadius, spacing } = useTheme();
  const isAuth = variant === 'auth';
  const isStepper = variant === 'stepper';

  const labelColor = isAuth ? AuthTheme.textPrimary : theme.text;
  const asteriskColor = isAuth ? AuthTheme.error : theme.error;
  const inputBg = isAuth ? AuthTheme.inputBg : theme.surface;
  const inputColor = isAuth ? AuthTheme.textPrimary : theme.text;
  const borderColor = error ? (isAuth ? AuthTheme.error : theme.error) : isAuth ? AuthTheme.inputBorder : theme.border;
  const placeholderColor = isAuth ? AuthTheme.inputPlaceholder : theme.textSecondary;
  const errorColor = isAuth ? AuthTheme.error : theme.error;

  const inputRadius = isStepper ? borderRadius.md : moderateScale(14);
  const inputPaddingH = isStepper ? spacing.md : moderateScale(16);
  const inputPaddingV = isStepper ? spacing.sm : verticalScale(14);
  const labelSize = isStepper ? moderateScale(13) : moderateScale(14);
  const labelWeight = isStepper ? '700' : '600';

  return (
    <View style={[styles.container, isStepper && { marginBottom: spacing.md }, style]}>
      {label && (
        <Text style={[styles.label, { color: labelColor, fontSize: labelSize, fontWeight: labelWeight }]}>
          {label}
          {required && <Text style={{ color: asteriskColor }}> *</Text>}
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
            borderRadius: inputRadius,
            paddingHorizontal: inputPaddingH,
            paddingVertical: inputPaddingV,
            minHeight: multiline ? verticalScale(80) : verticalScale(48),
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error && <Text style={[styles.error, { color: errorColor }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(12),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: verticalScale(6),
  },
  input: {
    borderWidth: 1.5,
    fontSize: moderateScale(15),
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
