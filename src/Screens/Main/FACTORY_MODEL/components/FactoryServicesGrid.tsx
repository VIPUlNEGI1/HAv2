import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Package, Users, ShoppingCart, Truck, TrendingUp, FileText, Settings, Building2, MessageSquare } from 'lucide-react-native';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { useTheme } from '@/Theme/useTheme';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const FactoryServicesGrid = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();

  const services = [
    { 
      title: 'Manage Products', 
      description: 'Add, edit, and list products', 
      icon: Package, 
      color: '#10B981',
      onPress: () => navigation.navigate('FactoryManageProductsScreen')
    },
    { 
      title: 'Client Management', 
      description: 'View and manage clients', 
      icon: Users, 
      color: '#3B82F6',
      onPress: () => navigation.navigate('FactoryClientsScreen')
    },
    { 
      title: 'Order Management', 
      description: 'Track all orders', 
      icon: ShoppingCart, 
      color: '#F59E0B',
      onPress: () => navigation.navigate('FactoryOrdersScreen')
    },
    { 
      title: 'Shipping', 
      description: 'Manage shipping', 
      icon: Truck, 
      color: '#EF4444',
      onPress: () => navigation.navigate('FactoryShippingScreen')
    },
    { 
      title: 'Payments', 
      description: 'View payments & revenue', 
      icon: TrendingUp, 
      color: '#8B5CF6',
      onPress: () => navigation.navigate('FactoryPaymentsScreen')
    },
    { 
      title: 'Invoices', 
      description: 'Generate & share invoices', 
      icon: FileText, 
      color: '#06B6D4',
      onPress: () => navigation.navigate('FactoryOrdersScreen')
    },
    { 
      title: 'Profile', 
      description: 'Factory profile & settings', 
      icon: Building2, 
      color: '#4B2A99',
      onPress: () => navigation.navigate('FactoryProfileScreen')
    },
    { 
      title: 'Settings', 
      description: 'App settings', 
      icon: Settings, 
      color: '#64748B',
      onPress: () => navigation.navigate('FactorySettingsScreen')
    },
    { 
      title: 'Chat with Clinics', 
      description: 'Communicate with clinics', 
      icon: MessageSquare, 
      color: '#8B5CF6',
      onPress: () => navigation.navigate('FactoryChatScreen')
    },
  ];

  return (
    <View style={styles.container}>
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <Animated.View
            key={service.title}
            entering={FadeInDown.delay(index * 50)}
          >
            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: theme.surface, ...shadows }]}
              onPress={service.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: service.color + '15' }]}>
                <Icon size={moderateScale(24)} color={service.color} />
              </View>
              <Text style={[styles.serviceTitle, { color: theme.text }]} numberOfLines={1}>{service.title}</Text>
              <Text style={[styles.serviceDescription, { color: theme.textSecondary }]} numberOfLines={2}>
                {service.description}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',

    // flexWrap: 'wrap',
    paddingHorizontal: moderateScale(16),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(16),
    // justifyContent: 'space-between',
  },
  serviceCard: {
    width: '100%',
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(14),
    minHeight: verticalScale(150),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  serviceTitle: {
    fontSize: moderateScale(15),
    fontWeight: '800',
    marginBottom: verticalScale(6),
    lineHeight: moderateScale(20),
  },
  serviceDescription: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    lineHeight: moderateScale(16),
    flex: 1,
  },
});
