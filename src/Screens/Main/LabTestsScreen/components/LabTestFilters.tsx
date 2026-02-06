import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { Search, MapPin } from 'lucide-react-native';

interface LabTestFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const LabTestFilters: React.FC<LabTestFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.searchBar, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <Search size={20} color={theme.textSecondary} />
        <TextInput
          placeholder="Search tests or labs nearby..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.input, { color: theme.text }]}
          placeholderTextColor={theme.textSecondary}
        />
      </View>

      <View style={styles.locationRow}>
        <MapPin size={14} color={theme.primary} />
        <Text style={[styles.locationText, { color: theme.textSecondary }]}>Showing labs within 5km of Home</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList} style={styles.categoryScroll}>
        {categories.map((category) => (
          <Pressable
            key={category}
            onPress={() => onSelectCategory(category)}
            style={[
              styles.categoryBtn,
              { 
                backgroundColor: selectedCategory === category ? theme.primary : theme.background,
                borderColor: theme.border 
              }
            ]}
          >
            <Text style={[
              styles.categoryText,
              { color: selectedCategory === category ? '#fff' : theme.textSecondary }
            ]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginHorizontal: 16, 
    paddingHorizontal: 16, 
    paddingBottom: 16, 
    borderRadius: 24, 
    paddingTop: 16, 
    marginTop: 16 
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    height: 50, 
    borderRadius: 14, 
    borderWidth: 1,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '500' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, marginBottom: 12 },
  locationText: { fontSize: 12, fontWeight: '600' },
  categoryScroll: { marginBottom: 4 },
  categoryList: { gap: 10, paddingRight: 16 },
  categoryBtn: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 12, 
    borderWidth: 1 
  },
  categoryText: { fontSize: 13, fontWeight: '700' },
});
