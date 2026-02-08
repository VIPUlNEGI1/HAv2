import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Package, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const ClinicInventoryScreen = () => {
  const { theme, shadows } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  const inventory: InventoryItem[] = [
    { id: '1', name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 150, minStock: 50, unit: 'tablets', status: 'in_stock' },
    { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 30, minStock: 50, unit: 'tablets', status: 'low_stock' },
    { id: '3', name: 'Bandages', category: 'First Aid', stock: 0, minStock: 20, unit: 'pieces', status: 'out_of_stock' },
    { id: '4', name: 'Syringes 5ml', category: 'Medical Supplies', stock: 200, minStock: 100, unit: 'pieces', status: 'in_stock' },
  ];

  const filteredInventory = inventory.filter(item =>
    selectedFilter === 'all' || item.status === selectedFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return '#10B981';
      case 'low_stock': return '#F59E0B';
      case 'out_of_stock': return '#EF4444';
      default: return theme.textSecondary;
    }
  };

  return (
    <ScreenWrapper title="Inventory" showBack={true} scrollable={false}>
      <View style={styles.container}>
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {(['all', 'in_stock', 'low_stock', 'out_of_stock'] as const).map((filter) => {
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
                  {filter === 'all' ? 'All' : filter === 'in_stock' ? 'In Stock' : filter === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Inventory List */}
        <ScrollView
          contentContainerStyle={styles.inventoryList}
          showsVerticalScrollIndicator={false}
        >
          {filteredInventory.map((item, index) => {
            const statusColor = getStatusColor(item.status);
            const isLowStock = item.stock < item.minStock;
            
            return (
              <Animated.View key={item.id} entering={FadeInDown.delay(index * 50)}>
                <View style={[styles.inventoryCard, { backgroundColor: theme.surface, ...shadows }]}>
                  <View style={styles.inventoryHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                      <Package size={moderateScale(24)} color={theme.primary} />
                    </View>
                    <View style={styles.inventoryInfo}>
                      <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                      <Text style={[styles.itemCategory, { color: theme.textSecondary }]}>
                        {item.category}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                      <Text style={[styles.statusText, { color: statusColor }]}>
                        {item.status === 'in_stock' ? 'In Stock' : item.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stockInfo}>
                    <View style={styles.stockRow}>
                      <Text style={[styles.stockLabel, { color: theme.textSecondary }]}>Current Stock:</Text>
                      <Text style={[styles.stockValue, { color: theme.text }]}>
                        {item.stock} {item.unit}
                      </Text>
                    </View>
                    <View style={styles.stockRow}>
                      <Text style={[styles.stockLabel, { color: theme.textSecondary }]}>Min Stock:</Text>
                      <Text style={[styles.stockValue, { color: theme.text }]}>
                        {item.minStock} {item.unit}
                      </Text>
                    </View>
                    {isLowStock && (
                      <View style={[styles.alertBadge, { backgroundColor: '#F59E0B20' }]}>
                        <AlertCircle size={moderateScale(14)} color="#F59E0B" />
                        <Text style={[styles.alertText, { color: '#F59E0B' }]}>
                          Stock below minimum level
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
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
  },
  inventoryList: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(20),
  },
  inventoryCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
  },
  inventoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  iconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  inventoryInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  itemCategory: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  statusText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  stockInfo: {
    gap: verticalScale(8),
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockLabel: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  stockValue: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
    gap: moderateScale(6),
    marginTop: verticalScale(4),
  },
  alertText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
});

export default ClinicInventoryScreen;
