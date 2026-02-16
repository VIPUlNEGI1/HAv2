# Complete Refactoring Plan - All Screens

## ✅ Completed Refactoring

### Factory Model (3/13 screens)
- ✅ FactoryClientsScreen
- ✅ FactoryManageProductsScreen  
- ✅ FactoryOrdersScreen

### Shared Components Created
- ✅ SearchBar
- ✅ StatusBadge
- ✅ FilterChip
- ✅ FilterBar
- ✅ EmptyState
- ✅ LoadingSpinner
- ✅ FloatingActionButton
- ✅ FormInput

## 📋 Remaining Screens to Refactor

### Factory Model (10 remaining)
1. FactoryOrderDetailsScreen
2. FactoryPaymentsScreen
3. FactoryShippingScreen
4. FactoryProductDetailsScreen
5. FactoryClientDetailsScreen
6. FactoryChatScreen
7. FactoryProfileScreen
8. FactorySettingsScreen
9. FactoryDashboardScreen

### Clinic Model (13 screens)
1. ClinicProductsScreen
2. ClinicOrdersScreen
3. ClinicOrderDetailsScreen
4. ClinicExpensesScreen
5. ClinicInventoryScreen
6. ClinicFactoriesScreen
7. ClinicLicensesScreen
8. ClinicChatScreen
9. ClinicProfileScreen
10. ClinicSettingsScreen
11. ClinicDashboardScreen
12. ClinicProductDetailsScreen
13. FactoryProductsScreen

### Doctor Model (11 screens)
1. DoctorAppointmentsScreen
2. DoctorDocumentsScreen
3. DoctorPaymentsScreen
4. DoctorChatScreen
5. DoctorPatientListScreen
6. DoctorManageServicesScreen
7. DoctorProfileScreen
8. DoctorSettingsScreen
9. DoctorDashboardScreen
10. DoctorVideoCallScreen
11. DoctorAudioCallScreen

## 🎯 Refactoring Pattern (Standard Structure)

Each screen follows this structure:

```
ScreenName/
├── ScreenName.tsx          # Main UI component (~80-150 lines)
├── hooks/
│   └── useScreenName.ts     # All logic, state, dummy data
└── components/
    ├── Component1.tsx       # Reusable sub-components
    └── Component2.tsx
```

### Hook File Pattern (`hooks/useScreenName.ts`)
```typescript
import { useState, useMemo } from 'react';

// 1. Export interfaces
export interface DataType {
  id: string;
  // ... fields
}

// 2. Dummy data at top
const DUMMY_DATA: DataType[] = [
  // ... data
];

// 3. Filter options
const FILTERS = [
  { label: 'All', value: 'all' },
  // ... filters
];

// 4. Hook function
export const useScreenName = () => {
  // State management
  const [data, setData] = useState<DataType[]>(DUMMY_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Computed values
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Filter logic
    });
  }, [data, searchQuery, selectedFilter]);
  
  // Helper functions
  const handleAction = () => {
    // Action logic
  };
  
  // Return everything needed by UI
  return {
    data: filteredData,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    handleAction,
    // ... etc
  };
};
```

### Component File Pattern (`components/Component.tsx`)
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

interface ComponentProps {
  data: DataType;
  onPress: () => void;
  index?: number;
}

export const Component: React.FC<ComponentProps> = ({ data, onPress, index = 0 }) => {
  const { theme, shadows } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Component UI */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles using moderateScale and verticalScale
  },
});
```

### Screen File Pattern (`ScreenName.tsx`)
```typescript
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { SearchBar, FilterBar, EmptyState } from '@/Components/common';
import { useScreenName } from './hooks/useScreenName';
import { Component } from './components/Component';

const ScreenName = () => {
  const { theme } = useTheme();
  const { data, searchQuery, setSearchQuery, selectedFilter, setSelectedFilter } = useScreenName();
  
  return (
    <ScreenWrapper title="Screen Title" showBack={true} scrollable={false}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FilterBar filters={filters} selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
        <ScrollView>
          {data.map((item, index) => (
            <Component key={item.id} data={item} onPress={handlePress} index={index} />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
```

## 🎨 Color System Integration

The Colors.ts file has been integrated into ThemeConfig.ts:
- Primary: `Colors.primary` (#130160)
- Secondary: `Colors.secondaryText` (#4A416D)
- Background: `Colors.whiteShadeFAFB` (#FAFBFC)
- Error: `Colors.redShadeFF` (#FF4C4C)
- Success: `Colors.greenshade` (#71F68E)
- And more...

All screens should use `useTheme()` hook to access colors dynamically.

## 📝 Key Principles

1. **Separation of Concerns**
   - Logic in hooks
   - UI in components
   - Main screen orchestrates

2. **Reusability**
   - Extract repeated patterns into components
   - Use shared components from `/Components/common`
   - Create screen-specific components when needed

3. **Responsiveness**
   - Always use `moderateScale()` for horizontal spacing
   - Always use `verticalScale()` for vertical spacing
   - Set `minHeight` for consistent card heights
   - Use `gap` instead of margins where possible

4. **TypeScript**
   - Export interfaces from hooks
   - Type all props
   - Use proper types for state

5. **Code Quality**
   - Keep files under 200 lines when possible
   - Extract complex logic into helper functions
   - Use meaningful variable names
   - Add comments for complex logic

## 🚀 Next Steps

1. Continue refactoring remaining Factory screens
2. Refactor all Clinic screens
3. Refactor all Doctor screens
4. Update all navigation imports
5. Test all screens for responsiveness
6. Connect to backend APIs (replace dummy data)

## 📚 Benefits Achieved

- ✅ Maintainable code structure
- ✅ Reusable components
- ✅ Consistent patterns
- ✅ Better code organization
- ✅ Easier to test
- ✅ Production-ready architecture

---

**Status**: 3/37 screens refactored (8%)
**Next**: Continue with FactoryOrderDetailsScreen, FactoryPaymentsScreen, etc.
