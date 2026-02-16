import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { FilterChip } from './FilterChip';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  horizontal?: boolean;
  style?: any;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  selectedFilter,
  onFilterChange,
  horizontal = true,
  style,
}) => {
  const content = (
    <View style={[styles.container, style]}>
      {filters.map((filter) => (
        <FilterChip
          key={filter.value}
          label={filter.label}
          isSelected={selectedFilter === filter.value}
          onPress={() => onFilterChange(filter.value)}
        />
      ))}
    </View>
  );

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {content}
      </ScrollView>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: verticalScale(8),
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
  },
});
