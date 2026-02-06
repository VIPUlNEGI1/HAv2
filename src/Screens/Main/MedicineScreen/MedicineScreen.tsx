import React from 'react';
import { useTheme } from '@/Theme/useTheme';
import { useMedicine } from './hooks/useMedicine';
import { CategoryFilters } from './components/CategoryFilters';
import { PrescriptionCard } from './components/PrescriptionCard';
import { MedicineCard } from './components/MedicineCard';
import { MedicineFilterModal } from './components/MedicineFilterModal';
import { View, StyleSheet, FlatList } from 'react-native';
import { CustomRefresh } from '@/Components/CustomRefresh';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';
import { ScreenWrapper } from '@/Components/ScreenWrapper';

const MedicineScreen = () => {
  const { theme } = useTheme();
  const { 
    refreshing, 
    onRefresh, 
    searchQuery,
    setSearchQuery,
    filteredMedicines, 
    activeFilter, 
    setActiveFilter, 
    advancedFilters,
    setAdvancedFilters,
    filterModalVisible,
    setFilterModalVisible,
    filters,
    cart,
    updateCart 
  } = useMedicine();

  const cartCount = Number(Object.values(cart).reduce((acc: number, curr) => acc + (curr as number), 0));

  return (
    <ScreenWrapper
      title="Medicines"
      showBack={true}
      showCart={true}
      cartCount={cartCount}
      scrollable={false}
    >
      <CategoryFilters 
        filters={filters} 
        activeFilter={activeFilter} 
        onSelect={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilterPress={() => setFilterModalVisible(true)}
      />

      <FlatList
        data={filteredMedicines}
        renderItem={({ item, index }) => (
          <MedicineCard 
            item={item} 
            index={index} 
            quantity={cart[item.id] || 0} 
            onUpdateCart={updateCart} 
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        refreshControl={<CustomRefresh refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={<PrescriptionCard />}
        ListFooterComponent={<View style={styles.footerSpacer} />}
      />

      <MedicineFilterModal 
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={advancedFilters}
        setFilters={setAdvancedFilters}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,   }, // Added padding for persistent tabs
  list: { padding: 16 },
  columnWrapper: { justifyContent: 'space-between' },
  footerSpacer: { height: 40 },
});

export default MedicineScreen;
