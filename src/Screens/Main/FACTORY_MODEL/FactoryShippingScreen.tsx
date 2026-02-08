import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Truck, Package, MapPin, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Shipping {
  id: string;
  orderNumber: string;
  clientName: string;
  items: number;
  status: 'preparing' | 'ready' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippingDate?: string;
  estimatedDelivery?: string;
  address: string;
}

const FactoryShippingScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'preparing' | 'ready' | 'shipped' | 'delivered'>('all');

  const shipments: Shipping[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001234',
      clientName: 'City Clinic Pharmacy',
      items: 500,
      status: 'preparing',
      address: 'Sector 18, Noida, UP - 201301',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-001235',
      clientName: 'Health Plus Hospital',
      items: 1000,
      status: 'ready',
      address: 'Sector 20, Noida, UP - 201301',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-001236',
      clientName: 'MediCare Distributors',
      items: 750,
      status: 'shipped',
      trackingNumber: 'TRK-2024-001236',
      shippingDate: '2024-02-05',
      estimatedDelivery: '2024-02-08',
      address: 'Sector 63, Noida, UP - 201301',
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-001237',
      clientName: 'ABC Hospital',
      items: 200,
      status: 'delivered',
      trackingNumber: 'TRK-2024-001237',
      shippingDate: '2024-02-01',
      estimatedDelivery: '2024-02-04',
      address: 'Sector 62, Noida, UP - 201301',
    },
  ];

  const filteredShipments = shipments.filter(shipment =>
    selectedFilter === 'all' || shipment.status === selectedFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#10B981';
      case 'in_transit': return '#3B82F6';
      case 'shipped': return '#3B82F6';
      case 'ready': return '#F59E0B';
      case 'preparing': return '#64748B';
      case 'cancelled': return '#EF4444';
      default: return theme.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle2;
      case 'in_transit': return Truck;
      case 'shipped': return Truck;
      case 'ready': return Package;
      case 'preparing': return Clock;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  return (
    <ScreenWrapper title="Shipping Management" showBack={true} scrollable={false}>
      <View style={styles.container}>
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {(['all', 'preparing', 'ready', 'shipped', 'delivered'] as const).map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.filterBtn,
                  isSelected ? styles.filterBtnActive : styles.filterBtnInactive,
                  {
                    backgroundColor: isSelected ? theme.primary : 'transparent',
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    {
                      color: isSelected ? '#fff' : theme.textSecondary,
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Shipments List */}
        <ScrollView
          contentContainerStyle={styles.shipmentsList}
          showsVerticalScrollIndicator={false}
        >
          {filteredShipments.map((shipment, index) => {
            const StatusIcon = getStatusIcon(shipment.status);
            const statusColor = getStatusColor(shipment.status);
            
            return (
              <Animated.View key={shipment.id} entering={FadeInDown.delay(index * 50)}>
                <TouchableOpacity
                  style={[styles.shipmentCard, { backgroundColor: theme.surface, ...shadows }]}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('FactoryOrderDetailsScreen', { orderId: shipment.id })}
                >
                  <View style={styles.shipmentHeader}>
                    <View style={styles.shipmentLeft}>
                      <View style={[styles.shipmentIcon, { backgroundColor: theme.primary + '20' }]}>
                        <Truck size={moderateScale(20)} color={theme.primary} />
                      </View>
                      <View style={styles.shipmentInfo}>
                        <Text style={[styles.orderNumber, { color: theme.text }]}>{shipment.orderNumber}</Text>
                        <Text style={[styles.clientName, { color: theme.textSecondary }]}>{shipment.clientName}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                      <StatusIcon size={moderateScale(12)} color={statusColor} />
                      <Text style={[styles.statusText, { color: statusColor }]}>
                        {shipment.status.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.shipmentDetails}>
                    <View style={styles.detailRow}>
                      <Package size={moderateScale(14)} color={theme.textSecondary} />
                      <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                        {shipment.items} items
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MapPin size={moderateScale(14)} color={theme.textSecondary} />
                      <Text style={[styles.detailText, { color: theme.textSecondary }]} numberOfLines={1}>
                        {shipment.address}
                      </Text>
                    </View>
                    {shipment.shippingDate && (
                      <View style={styles.detailRow}>
                        <Calendar size={moderateScale(14)} color={theme.textSecondary} />
                        <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                          Shipped: {shipment.shippingDate}
                        </Text>
                      </View>
                    )}
                    {shipment.estimatedDelivery && (
                      <View style={styles.detailRow}>
                        <Calendar size={moderateScale(14)} color={theme.primary} />
                        <Text style={[styles.detailText, { color: theme.primary }]}>
                          ETA: {shipment.estimatedDelivery}
                        </Text>
                      </View>
                    )}
                  </View>

                  {shipment.trackingNumber && (
                    <View style={styles.trackingContainer}>
                      <Text style={[styles.trackingLabel, { color: theme.textSecondary }]}>Tracking:</Text>
                      <Text style={[styles.trackingNumber, { color: theme.primary }]}>
                        {shipment.trackingNumber}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(12),
    backgroundColor: 'transparent',
  },
  filterBtn: {
    flex: 1,
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(40),
    minWidth: 0,
  },
  filterBtnActive: {
    borderWidth: 0,
  },
  filterBtnInactive: {
    backgroundColor: 'transparent',
  },
  filterBtnText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    textAlign: 'center',
    numberOfLines: 1,
  },
  shipmentsList: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(20),
  },
  shipmentCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
    minHeight: verticalScale(160),
  },
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(12),
  },
  shipmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: moderateScale(12),
  },
  shipmentIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipmentInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    marginBottom: verticalScale(4),
  },
  clientName: {
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    gap: moderateScale(5),
  },
  statusText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  shipmentDetails: {
    gap: verticalScale(8),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  detailText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    flex: 1,
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  trackingLabel: {
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
  trackingNumber: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
});

export default FactoryShippingScreen;
