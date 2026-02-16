import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

interface TabBarProps {
  selectedTab: 'overview' | 'orders' | 'payments';
  onTabChange: (tab: 'overview' | 'orders' | 'payments') => void;
}

export const TabBar: React.FC<TabBarProps> = ({ selectedTab, onTabChange }) => {
  const { theme } = useTheme();

  const tabs: Array<'overview' | 'orders' | 'payments'> = ['overview', 'orders', 'payments'];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            {
              backgroundColor: selectedTab === tab ? theme.primary : 'transparent',
              borderBottomColor: selectedTab === tab ? theme.primary : 'transparent',
            },
          ]}
          onPress={() => onTabChange(tab)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: selectedTab === tab ? '#fff' : theme.textSecondary,
                fontWeight: selectedTab === tab ? '800' : '600',
              },
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(16),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(12),
    gap: moderateScale(8),
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    minHeight: verticalScale(44),
  },
  tabText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
});
