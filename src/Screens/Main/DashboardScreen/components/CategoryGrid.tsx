import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - moderateScale(32) - moderateScale(16)) / 4; // screen_width - grid_padding - total_item_spacing

export const CategoryGrid = ({ categories }: { categories: any[] }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const handlePress = (id: string) => {
    switch (id) {
      case '1': navigation.navigate('MedicineScreen'); break;
      case '2': navigation.navigate('DoctorsScreen'); break;
      case '3': navigation.navigate('LabTestsScreen'); break;
      case '4': navigation.navigate('AppointmentsScreen'); break;
      case '5': navigation.navigate('WellnessScreen'); break;
      case '6': navigation.navigate('AyurvedaScreen'); break;
      case '7': navigation.navigate('HomeCareScreen'); break;
      case '8': navigation.navigate('BabyCareScreen'); break;
    }
  };

  return (
    <View style={styles.gridContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Medical Services</Text>
      </View>
      <View style={styles.row}>
        {categories.map((item, index) => (
          <Animated.View 
            key={item.id} 
            entering={FadeInDown.delay(index * 50).springify()} 
            style={styles.gridItem}
          >
            <Pressable 
              style={({ pressed }) => [
                styles.categoryCard, 
                { 
                  backgroundColor: theme.surface, 
                  borderColor: theme.border,
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }]
                }
              ]}
              onPress={() => handlePress(item.id)}
              hitSlop={8}
            >
              <View style={[styles.categoryIconContainer, { backgroundColor: `${item.color}10` }]}>
                <item.icon size={moderateScale(20)} color={item.color} />
              </View>
              <Text style={[styles.categoryText, { color: theme.text }]} numberOfLines={2}>
                {item.title}
              </Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: { 
    paddingHorizontal: moderateScale(10), 
    marginTop: verticalScale(26),
    width: '100%',
  },
  sectionHeader: { marginBottom: verticalScale(10) },
  sectionTitle: { fontSize: moderateScale(20), fontWeight: '800', letterSpacing: -0.5 },
  row: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'flex-start',
    // marginHorizontal: moderateScale(-4), // Half of the gap between items
  },
  gridItem: { 
    width: '25%', 
    padding: moderateScale(4),
    alignItems: 'center',
  },
  categoryCard: { 
    width: '100%',
    alignItems: 'center', 
    paddingVertical: verticalScale(10), 
    borderRadius: moderateScale(20),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: verticalScale(85),
    justifyContent: 'center',
  },
  categoryIconContainer: { 
    width: moderateScale(44), 
    height: moderateScale(44), 
    borderRadius: moderateScale(10), 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: verticalScale(5) 
  },
  categoryText: { 
    fontSize: moderateScale(11), 
    fontWeight: '500', 
    textAlign: 'center', 
    lineHeight: moderateScale(14), 
    paddingHorizontal: moderateScale(2) 
  },
});
