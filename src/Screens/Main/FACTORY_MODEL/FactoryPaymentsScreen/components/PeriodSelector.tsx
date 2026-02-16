import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import LinearGradient from 'react-native-linear-gradient';

interface PeriodSelectorProps {
  selectedPeriod: 'week' | 'month' | 'year';
  onPeriodChange: (period: 'week' | 'month' | 'year') => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {
  const { theme } = useTheme();
  const primaryGradient = ['#00796B', '#004D40', '#00251A'];
  const periods: Array<'week' | 'month' | 'year'> = ['week', 'month', 'year'];

  return (
    <View style={styles.container}>
      {periods.map((period) => {
        const isSelected = selectedPeriod === period;
        return (
          <TouchableOpacity key={period} onPress={() => onPeriodChange(period)} activeOpacity={0.7} style={styles.btnContainer}>
            {isSelected ? (
              <LinearGradient colors={primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.btn, styles.btnActive]}>
                <Text style={styles.btnTextActive}>{period.charAt(0).toUpperCase() + period.slice(1)}</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.btn, styles.btnInactive, { borderColor: theme.border }]}>
                <Text style={[styles.btnText, { color: theme.textSecondary }]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: moderateScale(8),
    marginBottom: verticalScale(24),
    backgroundColor: 'transparent',
    width: '100%',
  },
  btnContainer: {
    flex: 1,
    minWidth: 0,
  },
  btn: {
    paddingVertical: verticalScale(3),
    paddingHorizontal: moderateScale(4),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: verticalScale(44),
    width: '100%',
  },
  btnActive: {
    borderWidth: 0,
  },
  btnInactive: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  btnText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    textAlign: 'center',
  },
  btnTextActive: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
});
