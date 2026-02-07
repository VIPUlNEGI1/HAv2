import React from 'react';
import { View, StyleSheet, FlatList, Text, Pressable, ActivityIndicator } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ShieldCheck, MapPin, Star, Clock, Lock } from 'lucide-react-native';
import { useLabTests } from './hooks/useLabTests';
import { LabTestFilters } from './components/LabTestFilters';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';

const LabTestsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedSpecialty,
    categories,
    filteredTests,
    loadingLocation,
    userLocation
  } = useLabTests();

  const renderTest = ({ item, index }: any) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()} 
      style={[styles.card, { backgroundColor: theme.surface, ...shadows }]}
    >
      <Pressable 
        onPress={() => navigation.navigate('LabTestDetailsScreen', { test: item })}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
      >
        <View style={styles.cardTop}>
          <View style={[styles.iconBox, { backgroundColor: item.color || theme.accent }]}>
            <item.icon size={28} color={theme.primary} />
          </View>
          <View style={styles.mainInfo}>
            <View style={styles.tagRow}>
              <View style={[styles.discountTag, { backgroundColor: theme.error }]}>
                <Text style={styles.discountText}>{item.discount}</Text>
              </View>
              <View style={styles.ratingRow}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={[styles.ratingText, { color: theme.textSecondary }]}>{item.rating}</Text>
              </View>
            </View>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
            <View style={styles.labRow}>
              <Text style={[styles.labName, { color: theme.primary }]}>{item.labName}</Text>
              <View style={[styles.dot, { backgroundColor: theme.border }]} />
              <Text style={[styles.distance, { color: theme.textSecondary }]}>{item.distance} km</Text>
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.cardBottom}>
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: theme.text }]}>₹{item.price}</Text>
              <Text style={[styles.oldPrice, { color: theme.textSecondary }]}>₹{item.oldPrice}</Text>
            </View>
            <Text style={[styles.testCount, { color: theme.textSecondary }]}>{item.tests}</Text>
          </View>
          
          <Pressable 
            onPress={() => navigation.navigate('LabTestDetailsScreen', { test: item })}
            style={({ pressed }) => [
              styles.addBtn, 
              { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] }
            ]}
          >
            <Text style={styles.addBtnText}>VIEW DETAILS</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );

  if (loadingLocation) {
    return (
      <ScreenWrapper title="Lab Tests" scrollable={false}>
        <View style={[styles.center, { flex: 1 }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Finding labs near you...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!userLocation) {
    return (
      <ScreenWrapper title="Lab Tests" scrollable={false}>
        <View style={[styles.center, { flex: 1 }]}>
          <Lock size={60} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text, marginTop: 20 }]}>Location Access Required</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary, paddingHorizontal: 40 }]}>Please allow location access to see lab tests and clinics available in your area.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      title="Lab Tests"
      showBack={true}
      showSearch={true}
      scrollable={false}
    >
      <LabTestFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedSpecialty}
      />
      <FlatList
        data={filteredTests}
        renderItem={renderTest}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No tests found matching your search nearby.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, fontWeight: '600' },
  emptyTitle: { fontSize: 20, fontWeight: '900' },
  list: { padding: 16, paddingBottom: 100 },
  card: { borderRadius: 24, marginBottom: 16, overflow: 'hidden', padding: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 64, height: 64, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  mainInfo: { flex: 1, marginLeft: 16 },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  discountTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  discountText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '900' },
  labRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  labName: { fontSize: 13, fontWeight: '700' },
  dot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 8 },
  distance: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, width: '100%', marginVertical: 16, opacity: 0.5 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceContainer: { flex: 1 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontSize: 20, fontWeight: '900' },
  oldPrice: { fontSize: 14, textDecorationLine: 'line-through', opacity: 0.6 },
  testCount: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  addBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  addBtnText: { color: '#fff', fontWeight: '900', fontSize: 12 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});

export default LabTestsScreen;
