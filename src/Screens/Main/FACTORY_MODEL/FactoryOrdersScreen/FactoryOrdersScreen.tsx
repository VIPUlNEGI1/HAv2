import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { SearchBar, FilterBar, EmptyState } from '@/Components/common';
import { useFactoryOrders } from './hooks/useFactoryOrders';
import { OrderCard } from './components/OrderCard';
import { useNavigation } from '@react-navigation/native';
import { Package } from 'lucide-react-native';

const FactoryOrdersScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const {
    orders,
    statusFilters,
    selectedFilter,
    setSelectedFilter,
    searchQuery,
    setSearchQuery,
    getStatusColor,
    getShippingColor,
    refreshing,
    handleRefresh,
  } = useFactoryOrders();

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('FactoryOrderDetailsScreen', { orderId });
  };

  const handleFilterChange = (value: string) => {
    if (value === 'all' || value === 'pending' || value === 'processing' || value === 'shipped' || value === 'completed') {
      setSelectedFilter(value);
    }
  };

  return (
    <ScreenWrapper title="Factory Orders" showBack={true} scrollable={false}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search orders by client or tracking..."
            style={styles.searchBar}
          />
        </View>

        {/* Status Filters */}
        <FilterBar
          filters={statusFilters}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
          style={styles.filterBar}
        />

        {/* Orders List */}
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />
          }
        >
          {orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No Orders Found"
              message="There are no orders matching your filters."
            />
          ) : (
            orders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={() => handleOrderPress(order.id)}
                getStatusColor={getStatusColor}
                getShippingColor={getShippingColor}
                index={index}
              />
            ))
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(8),
  },
  searchBar: {
    marginHorizontal: 0,
  },
  filterBar: {
    paddingHorizontal: moderateScale(16),
  },
  list: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(20),
  },
});

export default FactoryOrdersScreen;
