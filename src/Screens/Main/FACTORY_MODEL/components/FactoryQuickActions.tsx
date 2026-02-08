import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Package, Users, ShoppingCart, Truck } from 'lucide-react-native';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { useTheme } from '@/Theme/useTheme';
import { useNavigation } from '@react-navigation/native';

export const FactoryQuickActions = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();

  const actions = [
    { title: 'Products', icon: Package, color: '#10B981', onPress: () => navigation.navigate('FactoryManageProductsScreen') },
    { title: 'Clients', icon: Users, color: '#3B82F6', onPress: () => navigation.navigate('FactoryClientsScreen') },
    { title: 'Orders', icon: ShoppingCart, color: '#F59E0B', onPress: () => navigation.navigate('FactoryOrdersScreen') },
    { title: 'Shipping', icon: Truck, color: '#EF4444', onPress: () => navigation.navigate('FactoryShippingScreen') },
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
          <Text style={[styles.actionTitle, { color: theme.text }]} numberOfLines={1}>{action.title}</Text>
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
    marginTop: verticalScale(24),
    marginBottom: verticalScale(16),
    gap: moderateScale(10),
  },
  actionItem: {
    flex: 1,
    minWidth: 0,
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(6),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(100),
  },
  iconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  actionTitle: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: moderateScale(16),
  },
});
