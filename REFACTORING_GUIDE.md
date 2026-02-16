# Code Refactoring Guide - Production-Ready Structure

## 📁 New Folder Structure Pattern

Each screen should follow this structure:

```
ScreenName/
├── ScreenName.tsx          # Main UI component (UI only)
├── hooks/
│   └── useScreenName.ts    # All logic, state, dummy data
└── components/
    ├── Component1.tsx      # Reusable sub-components
    └── Component2.tsx
```

## ✅ Example: FactoryClientsScreen (Completed)

**Before:**
- Single file: `FactoryClientsScreen.tsx` (278 lines, everything mixed)

**After:**
- `FactoryClientsScreen.tsx` (UI only, ~80 lines)
- `hooks/useFactoryClients.ts` (Logic + dummy data)
- `components/ClientCard.tsx` (Reusable card component)

## 🎯 Reusable Components Created

Located in `/src/Components/common/`:

1. **SearchBar** - Standardized search input
2. **StatusBadge** - Status indicators with variants
3. **FilterChip** - Individual filter button
4. **FilterBar** - Horizontal/vertical filter bar

## 📋 Refactoring Checklist

### Factory Model Screens (Priority)
- [x] FactoryClientsScreen ✅
- [ ] FactoryManageProductsScreen
- [ ] FactoryOrdersScreen
- [ ] FactoryOrderDetailsScreen
- [ ] FactoryPaymentsScreen
- [ ] FactoryShippingScreen
- [ ] FactoryProductDetailsScreen
- [ ] FactoryClientDetailsScreen
- [ ] FactoryChatScreen
- [ ] FactoryProfileScreen
- [ ] FactorySettingsScreen
- [ ] FactoryDashboardScreen

### Clinic Model Screens
- [ ] ClinicProductsScreen
- [ ] ClinicOrdersScreen
- [ ] ClinicOrderDetailsScreen
- [ ] ClinicExpensesScreen
- [ ] ClinicInventoryScreen
- [ ] ClinicFactoriesScreen
- [ ] ClinicLicensesScreen
- [ ] ClinicChatScreen
- [ ] ClinicProfileScreen
- [ ] ClinicSettingsScreen
- [ ] ClinicDashboardScreen
- [ ] ClinicProductDetailsScreen
- [ ] FactoryProductsScreen

### Doctor Model Screens
- [ ] DoctorAppointmentsScreen
- [ ] DoctorDocumentsScreen
- [ ] DoctorPaymentsScreen
- [ ] DoctorChatScreen
- [ ] DoctorPatientListScreen
- [ ] DoctorManageServicesScreen
- [ ] DoctorProfileScreen
- [ ] DoctorSettingsScreen
- [ ] DoctorDashboardScreen
- [ ] DoctorVideoCallScreen
- [ ] DoctorAudioCallScreen

## 🔧 Refactoring Steps

### Step 1: Create Folder Structure
```bash
mkdir -p ScreenName/hooks ScreenName/components
```

### Step 2: Extract Hook
Create `hooks/useScreenName.ts`:
```typescript
import { useState, useMemo } from 'react';

// Move all dummy data here
const DUMMY_DATA = [...];

// Move all state management here
export const useScreenName = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // ... all state
  
  // Move all filtering logic here
  const filteredData = useMemo(() => {
    // ... filtering logic
  }, [dependencies]);
  
  return {
    // Return all state and computed values
    data: filteredData,
    searchQuery,
    setSearchQuery,
    // ... etc
  };
};
```

### Step 3: Extract Components
Create reusable components in `components/`:
- Extract repeated UI patterns
- Make components accept props
- Use proper TypeScript interfaces

### Step 4: Refactor Main Screen
Update `ScreenName.tsx`:
- Import hook: `import { useScreenName } from './hooks/useScreenName'`
- Import components: `import { Component1 } from './components/Component1'`
- Use hook: `const { data, searchQuery, setSearchQuery } = useScreenName()`
- Render components: `<Component1 data={item} />`

### Step 5: Update Navigation
Update import in `HomeStackNavigator.tsx`:
```typescript
// Old
import ScreenName from '@/Screens/Main/MODEL/ScreenName';

// New
import ScreenName from '@/Screens/Main/MODEL/ScreenName/ScreenName';
```

## 🎨 UI Improvements Applied

1. **Responsive Design**
   - Use `moderateScale()` and `verticalScale()` consistently
   - Add `minHeight` for consistent card heights
   - Use `gap` instead of margins where possible

2. **Filter Improvements**
   - Standardized FilterBar component
   - Multiple filter types (type, status, etc.)
   - Clear visual feedback for selected filters

3. **Search Improvements**
   - Standardized SearchBar with clear button
   - Debounced search (can be added)
   - Better placeholder text

4. **Status Indicators**
   - Reusable StatusBadge component
   - Consistent color coding
   - Proper variants

## 📝 Code Quality Standards

### Hook File (`hooks/useScreenName.ts`)
- ✅ All dummy data at top
- ✅ All state management
- ✅ All filtering/search logic
- ✅ Memoized computed values
- ✅ Helper functions
- ✅ TypeScript interfaces exported

### Component Files (`components/Component.tsx`)
- ✅ Single responsibility
- ✅ Props interface defined
- ✅ Reusable across screens
- ✅ Proper TypeScript types
- ✅ Responsive styling

### Screen File (`ScreenName.tsx`)
- ✅ UI only (no business logic)
- ✅ Uses hook for data/logic
- ✅ Uses components for UI
- ✅ Clean and readable
- ✅ Proper error/empty states

## 🚀 Next Steps

1. Apply pattern to remaining Factory screens
2. Apply pattern to Clinic screens
3. Apply pattern to Doctor screens
4. Create more shared components as needed
5. Add loading states and error handling
6. Connect to backend APIs

## 📚 Benefits

- ✅ **Maintainable**: Easy to find and update code
- ✅ **Reusable**: Components can be used across screens
- ✅ **Testable**: Logic separated from UI
- ✅ **Scalable**: Easy to add new features
- ✅ **Readable**: Clear structure and organization
- ✅ **Production-Ready**: Industry-standard patterns
