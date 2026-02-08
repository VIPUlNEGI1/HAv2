import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { ShoppingCart, Package, Filter, CheckCircle2, Clock, XCircle, Truck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Order {
  id: string;
  clientName: string;
  items: number;
  amount: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  type: 'regular' | 'bulk';
  shippingStatus?: 'not_shipped' | 'preparing' | 'shipped' | 'delivered';
  trackingNumber?: string;
}

const FactoryOrdersScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'completed'>('all');

  const orders: Order[] = [
    { 
      id: '1', 
      clientName: 'City Clinic Pharmacy', 
      items: 500, 
      amount: 25000, 
      date: 'Today', 
      status: 'processing', 
      type: 'bulk',
      shippingStatus: 'preparing',
    },
    { 
      id: '2', 
      clientName: 'Health Plus Hospital', 
      items: 1000, 
      amount: 50000, 
      date: 'Yesterday', 
      status: 'shipped', 
      type: 'bulk',
      shippingStatus: 'shipped',
      trackingNumber: 'TRK-2024-001234',
    },
    { 
      id: '3', 
      clientName: 'MediCare Distributors', 
      items: 750, 
      amount: 37500, 
      date: '2 days ago', 
      status: 'completed', 
      type: 'bulk',
      shippingStatus: 'delivered',
    },
    { 
      id: '4', 
      clientName: 'ABC Hospital', 
      items: 200, 
      amount: 10000, 
      date: '3 days ago', 
      status: 'pending', 
      type: 'regular',
      shippingStatus: 'not_shipped',
    },
  ];

  const filteredOrders = orders.filter(order => 
    selectedFilter === 'all' || order.status === selectedFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'shipped': return '#3B82F6';
      case 'processing': return '#F59E0B';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return theme.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      case 'pending': return Clock;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const getShippingColor = (status?: string) => {
    switch (status) {
      case 'delivered': return '#10B981';
      case 'shipped': return '#3B82F6';
      case 'preparing': return '#F59E0B';
      case 'not_shipped': return '#64748B';
      default: return theme.textSecondary;
    }
  };

  return (
    <ScreenWrapper title="Factory Orders" showBack={true} scrollable={false}>
      <View style={styles.container}>
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {(['all', 'pending', 'processing', 'shipped', 'completed'] as const).map((filter) => {
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

        {/* Orders List */}
        <ScrollView
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        >
          {filteredOrders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status);
            const statusColor = getStatusColor(order.status);
            const shippingColor = getShippingColor(order.shippingStatus);
            
            return (
              <Animated.View key={order.id} entering={FadeInDown.delay(index * 50)}>
                <TouchableOpacity
                  style={[styles.orderCard, { backgroundColor: theme.surface, ...shadows }]}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('FactoryOrderDetailsScreen', { orderId: order.id })}
                >
                  <View style={styles.orderHeader}>
                    <View style={styles.orderLeft}>
                      <View style={[styles.orderIconBg, { backgroundColor: theme.primary + '20' }]}>
                        {order.type === 'bulk' ? (
                          <Package size={moderateScale(20)} color={theme.primary} />
                        ) : (
                          <ShoppingCart size={moderateScale(20)} color={theme.primary} />
                        )}
                      </View>
                      <View style={styles.orderInfo}>
                        <Text style={[styles.clientName, { color: theme.text }]}>{order.clientName}</Text>
                        <Text style={[styles.orderDetails, { color: theme.textSecondary }]}>
                          {order.items} items • {order.date}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.orderRight}>
                      <Text style={[styles.orderAmount, { color: theme.primary }]}>
                        ₹{order.amount.toLocaleString()}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                        <StatusIcon size={moderateScale(12)} color={statusColor} />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                          {order.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {order.type === 'bulk' && (
                    <View style={styles.bulkBadgeContainer}>
                      <View style={[styles.bulkBadge, { backgroundColor: theme.primary + '10' }]}>
                        <Text style={[styles.bulkText, { color: theme.primary }]}>Bulk Order</Text>
                      </View>
                      {order.shippingStatus && (
                        <View style={[styles.shippingBadge, { backgroundColor: shippingColor + '20' }]}>
                          <Truck size={moderateScale(12)} color={shippingColor} />
                          <Text style={[styles.shippingText, { color: shippingColor }]}>
                            {order.shippingStatus.replace('_', ' ')}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                  {order.trackingNumber && (
                    <View style={styles.trackingContainer}>
                      <Text style={[styles.trackingLabel, { color: theme.textSecondary }]}>Tracking:</Text>
                      <Text style={[styles.trackingNumber, { color: theme.primary }]}>
                        {order.trackingNumber}
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
  ordersList: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(20),
  },
  orderCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
    minHeight: verticalScale(120),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: moderateScale(12),
  },
  orderIconBg: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  orderDetails: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(8),
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
  bulkBadgeContainer: {
    flexDirection: 'row',
    gap: moderateScale(8),
    marginTop: verticalScale(12),
    flexWrap: 'wrap',
  },
  bulkBadge: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    alignSelf: 'flex-start',
  },
  bulkText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  shippingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    gap: moderateScale(5),
    alignSelf: 'flex-start',
  },
  shippingText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
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

export default FactoryOrdersScreen;
