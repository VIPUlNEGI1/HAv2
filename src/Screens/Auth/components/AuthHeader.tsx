import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

interface AuthHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  /** Use on gradient screens: no background, light text/icon */
  transparent?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  showBack = true,
  onBack,
  transparent = false,
}) => {
  const { theme, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();

  const bgColor = transparent ? 'transparent' : theme.background;
  const borderColor = transparent ? 'transparent' : theme.border;
  const titleColor = transparent ? '#FFFFFF' : theme.text;
  const backBg = transparent ? 'rgba(255,255,255,0.2)' : theme.surface;
  const backIconColor = transparent ? '#FFFFFF' : theme.primary;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + verticalScale(14),
          paddingBottom: verticalScale(14),
          paddingHorizontal: moderateScale(20),
          backgroundColor: bgColor,
          borderBottomColor: borderColor,
        },
      ]}
    >
      <View style={styles.row}>
        {showBack && onBack ? (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            style={[
              styles.backBtn,
              {
                backgroundColor: backBg,
                borderRadius: borderRadius?.md ?? moderateScale(12),
              },
            ]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowLeft size={moderateScale(22)} color={backIconColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        {title ? (
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        <View style={styles.backPlaceholder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: moderateScale(44),
    height: moderateScale(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backPlaceholder: {
    width: moderateScale(44),
    height: moderateScale(44),
  },
  title: {
    flex: 1,
    fontSize: moderateScale(18),
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 10,
  },
});
