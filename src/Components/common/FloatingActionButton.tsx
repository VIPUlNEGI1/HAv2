import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

interface FloatingActionButtonProps {
  icon: React.ComponentType<any>;
  onPress: () => void;
  bottom?: number;
  right?: number;
  size?: number;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon,
  onPress,
  bottom = 30,
  right = 20,
  size = 24,
}) => {
  const { theme, shadows } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.primary,
          bottom: verticalScale(bottom),
          right: moderateScale(right),
          ...shadows,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon size={moderateScale(size)} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
