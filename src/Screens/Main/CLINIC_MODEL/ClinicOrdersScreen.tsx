import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { ShoppingCart, Package, Filter, CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Order {
  id: string;
  customerName: string;
  items: number;
  amount: number;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  type: 'regular' | 'bulk';
}

const ClinicOrdersScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');

  const orders: Order[] = [
    { id: '1', customerName: 'John Doe', items: 5, amount: 1250, date: 'Today', status: 'pending', type: 'regular' },
    { id: '2', customerName: 'Jane Smith', items: 12, amount: 3200, date: 'Yesterday', status: 'processing', type: 'bulk' },
    { id: '3', customerName: 'ABC Hospital', items: 50, amount: 15000, date: '2 days ago', status: 'completed', type: 'bulk' },
    { id: '4', customerName: 'Mike Johnson', items: 3, amount: 750, date: '3 days ago', status: 'completed', type: 'regular' },
  ];

  const filteredOrders = orders.filter(order => 
    selectedFilter === 'all' || order.status === selectedFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'processing': return '#3B82F6';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return theme.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'processing': return Clock;
      case 'pending': return Clock;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  return (
    <ScreenWrapper title="Orders" showBack={true} scrollable={false}>
      <View style={styles.container}>
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {(['all', 'pending', 'processing', 'completed'] as const).map((filter) => {
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
            
            return (
              <Animated.View key={order.id} entering={FadeInDown.delay(index * 50)}>
                <TouchableOpacity
                  style={[styles.orderCard, { backgroundColor: theme.surface, ...shadows }]}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('ClinicOrderDetailsScreen', { orderId: order.id })}
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
                        <Text style={[styles.customerName, { color: theme.text }]}>{order.customerName}</Text>
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
                    <View style={[styles.bulkBadge, { backgroundColor: theme.primary + '10' }]}>
                      <Text style={[styles.bulkText, { color: theme.primary }]}>Bulk Order</Text>
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
    padding: moderateScale(16),
    backgroundColor: 'transparent',
  },
  filterBtn: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(40),
  },
  filterBtnActive: {
    borderWidth: 0,
  },
  filterBtnInactive: {
    backgroundColor: 'transparent',
  },
  filterBtnText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    textAlign: 'center',
  },
  ordersList: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(20),
  },
  orderCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
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
  customerName: {
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
  bulkBadge: {
    marginTop: verticalScale(12),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    alignSelf: 'flex-start',
  },
  bulkText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
});

export default ClinicOrdersScreen;
