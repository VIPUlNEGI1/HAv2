import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { SearchBar, FilterBar } from '@/Components/common';
import { useFactoryClients } from './hooks/useFactoryClients';
import { ClientCard } from './components/ClientCard';
import { useNavigation } from '@react-navigation/native';

const FactoryClientsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  
  const {
    clients,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    clientTypes,
    statusFilters,
    refreshing,
    handleRefresh,
  } = useFactoryClients();

  const handleClientPress = (clientId: string) => {
    navigation.navigate('FactoryClientDetailsScreen', { clientId });
  };

  return (
    <ScreenWrapper title="Factory Clients" showBack={true} scrollable={false}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search clients by name or location..."
            style={styles.searchBar}
          />
        </View>

        {/* Type Filters */}
        <FilterBar
          filters={clientTypes}
          selectedFilter={selectedType}
          onFilterChange={setSelectedType}
          style={styles.filterBar}
        />

        {/* Status Filters */}
        <FilterBar
          filters={statusFilters}
          selectedFilter={selectedStatus}
          onFilterChange={setSelectedStatus}
          style={styles.filterBar}
        />

        {/* Clients List */}
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />
          }
        >
          {clients.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyContent}>
                {/* Empty state can be added here */}
              </View>
            </View>
          ) : (
            clients.map((client, index) => (
              <ClientCard
                key={client.id}
                client={client}
                onPress={() => handleClientPress(client.id)}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(60),
  },
  emptyContent: {
    alignItems: 'center',
  },
});

export default FactoryClientsScreen;
