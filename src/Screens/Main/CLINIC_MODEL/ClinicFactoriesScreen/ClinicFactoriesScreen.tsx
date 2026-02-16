import React from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useClinicFactories } from './hooks/useClinicFactories';
import { FactoryCard } from './components/FactoryCard';

const ClinicFactoriesScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const { filteredFactories, searchQuery, setSearchQuery } = useClinicFactories();

  return (
    <ScreenWrapper title="Factories" showBack={true} scrollable={false}>
      <View style={styles.container}>
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
        <ScrollView
          contentContainerStyle={styles.factoriesList}
          showsVerticalScrollIndicator={false}
        >
          {filteredFactories.map((factory, index) => (
            <Animated.View key={factory.id} entering={FadeInDown.delay(index * 50)}>
              <FactoryCard
                factory={factory}
                onPress={() => navigation.navigate('FactoryProductsScreen', { factory })}
              />
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
});

export default ClinicFactoriesScreen;
