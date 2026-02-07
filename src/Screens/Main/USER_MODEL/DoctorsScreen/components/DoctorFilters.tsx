import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Search, Filter, Star } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';

export const DoctorFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  specialties, 
  selectedSpecialty, 
  setSelectedSpecialty,
  minRating,
  setMinRating
}: any) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.searchRow}>
        <View style={[styles.searchBar, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Search size={18} color={theme.textSecondary} />
          <TextInput
            placeholder="Search doctors by name..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {specialties.map((spec: string) => (
          <TouchableOpacity 
            key={spec} 
            onPress={() => setSelectedSpecialty(spec)}
            style={[
              styles.filterChip, 
              { backgroundColor: selectedSpecialty === spec ? theme.primary : theme.background, borderColor: theme.border }
            ]}
          >
            <Text style={[styles.filterChipText, { color: selectedSpecialty === spec ? '#fff' : theme.text }]}>{spec}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.ratingRow}>
        <Text style={[styles.ratingLabel, { color: theme.textSecondary }]}>Minimum Rating:</Text>
        {[4, 4.5, 4.8].map(rating => (
          <TouchableOpacity 
            key={rating} 
            onPress={() => setMinRating(minRating === rating ? 0 : rating)}
            style={[styles.ratingChip, { backgroundColor: minRating === rating ? '#FFD70022' : theme.background, borderColor: minRating === rating ? '#FFD700' : theme.border }]}
          >
            <Star size={12} color="#FFD700" fill={minRating === rating ? "#FFD700" : "none"} />
            <Text style={[styles.ratingText, { color: theme.text }]}>{rating}+</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginHorizontal: 16, 
    paddingHorizontal: 16, 
    paddingBottom: 12, 
    borderRadius: 24, 
    paddingTop: 16, 
    marginTop: 16 
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, height: 44, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '500' },
  filterScroll: { marginBottom: 12 },
  filterContent: { gap: 8, paddingRight: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterChipText: { fontSize: 12, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ratingLabel: { fontSize: 12, fontWeight: '700' },
  ratingChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, gap: 4 },
  ratingText: { fontSize: 11, fontWeight: '800' },
});
