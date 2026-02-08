import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pill, ShoppingCart, Building2, TrendingUp } from 'lucide-react-native';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { useTheme } from '@/Theme/useTheme';
import { useNavigation } from '@react-navigation/native';

export const ClinicQuickActions = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();

  const actions = [
    { title: 'Products', icon: Pill, color: '#10B981', onPress: () => navigation.navigate('ClinicProductsScreen') },
    { title: 'Orders', icon: ShoppingCart, color: '#3B82F6', onPress: () => navigation.navigate('ClinicOrdersScreen') },
    { title: 'Factories', icon: Building2, color: '#F59E0B', onPress: () => navigation.navigate('ClinicFactoriesScreen') },
    { title: 'Expenses', icon: TrendingUp, color: '#EF4444', onPress: () => navigation.navigate('ClinicExpensesScreen') },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.actionItem, { backgroundColor: theme.surface, ...shadows }]}
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: action.color + '15' }]}>
            <action.icon size={moderateScale(22)} color={action.color} />
          </View>
          <Text style={[styles.actionTitle, { color: theme.text }]}>{action.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    marginTop: verticalScale(20),
  },
  actionItem: {
    width: '22%',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  actionTitle: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
});
