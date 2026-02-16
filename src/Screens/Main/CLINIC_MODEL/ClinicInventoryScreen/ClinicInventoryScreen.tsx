import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { SearchBar, FilterBar, EmptyState } from '@/Components/common';
import { useClinicInventory } from './hooks/useClinicInventory';
import { InventoryCard } from './components/InventoryCard';
import { Package } from 'lucide-react-native';

const ClinicInventoryScreen = () => {
  const { theme } = useTheme();

  const {
    inventory,
    statusFilters,
    selectedFilter,
    setSelectedFilter,
    searchQuery,
    setSearchQuery,
    getStatusColor,
    refreshing,
    handleRefresh,
  } = useClinicInventory();

  return (
    <ScreenWrapper title="Inventory" showBack={true} scrollable={false}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search inventory items..."
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

        {/* Inventory List */}
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />
          }
        >
          {inventory.length === 0 ? (
            <EmptyState icon={Package} title="No Inventory Items" message="Add items to your inventory." />
          ) : (
            inventory.map((item, index) => (
              <InventoryCard key={item.id} item={item} getStatusColor={getStatusColor} index={index} />
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

export default ClinicInventoryScreen;
