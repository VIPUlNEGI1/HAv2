import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';

export const CategoryFilters = ({ filters, activeFilter, onSelect, searchQuery, setSearchQuery, onFilterPress }: any) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.searchRow}>
        <View style={[styles.searchBar, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Search size={18} color={theme.textSecondary} />
          <TextInput 
            placeholder="Search medicines..." 
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.text }]} 
          />
        </View>
        <TouchableOpacity 
          onPress={onFilterPress}
          style={[styles.filterBtn, { backgroundColor: theme.background, borderColor: theme.border }]}
        >
          <Filter size={18} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {filters.map((filter: string) => (
          <TouchableOpacity 
            key={filter} 
            onPress={() => onSelect(filter)}
            style={[
              styles.filterChip, 
              { backgroundColor: activeFilter === filter ? theme.primary : theme.background, borderColor: theme.border }
            ]}
          >
            <Text style={[styles.filterChipText, { color: activeFilter === filter ? '#fff' : theme.text }]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingHorizontal: 12, height: 44, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '500' },
  filterBtn: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 12, borderWidth: 1 },
  filterScroll: { marginBottom: 8 },
  filterContent: { gap: 8, paddingRight: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterChipText: { fontSize: 12, fontWeight: '700' },
});
