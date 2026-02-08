import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pill, ShoppingCart, FileText, TrendingUp, Building2, Package, ChevronRight, MessageSquare } from 'lucide-react-native';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { useTheme } from '@/Theme/useTheme';
import { useNavigation } from '@react-navigation/native';

export const ClinicServicesGrid = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();

  const services = [
    { title: 'Products', icon: Pill, color: '#10B981', screen: 'ClinicProductsScreen', desc: 'Manage your products' },
    { title: 'Orders', icon: ShoppingCart, color: '#3B82F6', screen: 'ClinicOrdersScreen', desc: 'View all orders' },
    { title: 'Expenses & Payments', icon: TrendingUp, color: '#F59E0B', screen: 'ClinicExpensesScreen', desc: 'Track expenses' },
    { title: 'Licenses & Documents', icon: FileText, color: '#EC4899', screen: 'ClinicLicensesScreen', desc: 'Manage licenses' },
    { title: 'Factories', icon: Building2, color: '#6366F1', screen: 'ClinicFactoriesScreen', desc: 'Buy from factories' },
    { title: 'Inventory', icon: Package, color: '#F43F5E', screen: 'ClinicInventoryScreen', desc: 'Stock management' },
    { title: 'Chat with Factories', icon: MessageSquare, color: '#8B5CF6', screen: 'ClinicChatScreen', desc: 'Communicate with factories' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Management Services</Text>
      <View style={styles.grid}>
        {services.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.serviceCard, { backgroundColor: theme.surface, ...shadows }]}
            onPress={() => service.screen && navigation.navigate(service.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: service.color + '15' }]}>
              <service.icon size={moderateScale(24)} color={service.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.serviceTitle, { color: theme.text }]}>{service.title}</Text>
              <Text style={[styles.serviceDesc, { color: theme.textSecondary }]}>{service.desc}</Text>
            </View>
            <ChevronRight size={moderateScale(18)} color={theme.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(16),
    marginTop: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(16),
  },
  grid: {
    gap: verticalScale(12),
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
  },
  iconContainer: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  textContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
  serviceDesc: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
});
