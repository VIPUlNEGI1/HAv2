import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { SearchBar, FilterBar, EmptyState } from '@/Components/common';
import { useFactoryShipping } from './hooks/useFactoryShipping';
import { ShippingCard } from './components/ShippingCard';
import { useNavigation } from '@react-navigation/native';
import { Truck } from 'lucide-react-native';

const FactoryShippingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const {
    shipments,
    statusFilters,
    selectedFilter,
    setSelectedFilter,
    searchQuery,
    setSearchQuery,
    getStatusColor,
    refreshing,
    handleRefresh,
  } = useFactoryShipping();

  const handleShipmentPress = (orderId: string) => {
    navigation.navigate('FactoryOrderDetailsScreen', { orderId });
  };

  return (
    <ScreenWrapper title="Shipping Management" showBack={true} scrollable={false}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by order number, client or tracking..."
            style={styles.searchBar}
          />
        </View>

        {/* Status Filters */}
        <FilterBar
          filters={statusFilters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          style={styles.filterBar}
        />

        {/* Shipments List */}
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />
          }
        >
          {shipments.length === 0 ? (
            <EmptyState
              icon={Truck}
              title="No Shipments Found"
              message="There are no shipments matching your filters."
            />
          ) : (
            shipments.map((shipment, index) => (
              <ShippingCard
                key={shipment.id}
                shipment={shipment}
                onPress={() => handleShipmentPress(shipment.id)}
                getStatusColor={getStatusColor}
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

export default FactoryShippingScreen;
