import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Building2, Package, ChevronRight, Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Factory {
  id: string;
  name: string;
  location: string;
  rating: number;
  minOrder: number;
  productsCount: number;
}

const ClinicFactoriesScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');

  const factories: Factory[] = [
    {
      id: '1',
      name: 'MediPharm Industries',
      location: 'Mumbai, Maharashtra',
      rating: 4.5,
      minOrder: 100,
      productsCount: 250,
    },
    {
      id: '2',
      name: 'HealthCare Pharmaceuticals',
      location: 'Delhi, NCR',
      rating: 4.8,
      minOrder: 50,
      productsCount: 180,
    },
    {
      id: '3',
      name: 'BioMed Solutions',
      location: 'Bangalore, Karnataka',
      rating: 4.3,
      minOrder: 200,
      productsCount: 320,
    },
  ];

  const filteredFactories = factories.filter(factory =>
    factory.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenWrapper title="Factories" showBack={true} scrollable={false}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.surface, ...shadows }]}>
          <Search size={moderateScale(20)} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search factories..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Factories List */}
        <ScrollView
          contentContainerStyle={styles.factoriesList}
          showsVerticalScrollIndicator={false}
        >
          {filteredFactories.map((factory, index) => (
            <Animated.View key={factory.id} entering={FadeInDown.delay(index * 50)}>
              <TouchableOpacity
                style={[styles.factoryCard, { backgroundColor: theme.surface, ...shadows }]}
                onPress={() => navigation.navigate('FactoryProductsScreen', { factory: factory })}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                  <Building2 size={moderateScale(28)} color={theme.primary} />
                </View>
                <View style={styles.factoryInfo}>
                  <Text style={[styles.factoryName, { color: theme.text }]}>{factory.name}</Text>
                  <Text style={[styles.factoryLocation, { color: theme.textSecondary }]}>
                    {factory.location}
                  </Text>
                  <View style={styles.factoryMeta}>
                    <View style={styles.metaItem}>
                      <Package size={moderateScale(14)} color={theme.textSecondary} />
                      <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                        {factory.productsCount} products
                      </Text>
                    </View>
                    <Text style={[styles.minOrder, { color: theme.primary }]}>
                      Min: {factory.minOrder} units
                    </Text>
                  </View>
                </View>
                <ChevronRight size={moderateScale(20)} color={theme.textSecondary} />
              </TouchableOpacity>
            </Animated.View>
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(16),
    margin: moderateScale(16),
    gap: moderateScale(12),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  factoriesList: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(20),
  },
  factoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
  },
  iconContainer: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  factoryInfo: {
    flex: 1,
  },
  factoryName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  factoryLocation: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    marginBottom: verticalScale(8),
  },
  factoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  metaText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  minOrder: {
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
});

export default ClinicFactoriesScreen;
