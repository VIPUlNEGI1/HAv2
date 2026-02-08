import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { Factory, ChevronRight, Search, Bell, Settings } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale, getStatusBarHeight } from '@/Helpers/Responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const FactoryDashboardHeader = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const statusBarHeight = getStatusBarHeight();
  const headerPaddingTop = Platform.OS === 'ios' 
    ? Math.max(insets.top, statusBarHeight) + moderateScale(8)
    : statusBarHeight + moderateScale(12);

  // Mock factory data - in real app, get from store/context
  const factoryData = {
    name: 'Pharma Factory Ltd.',
    location: 'Industrial Area, Sector 63',
    image: null,
  };

  return (
    <LinearGradient 
      colors={['#4B2A99', '#6B46C1', '#8B5CF6']} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 1 }}
      style={[styles.headerBackground, { paddingTop: headerPaddingTop }]}
    >
      <Animated.View entering={FadeInDown.delay(100)} style={styles.headerTop}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('FactoryProfileScreen')}
          style={styles.factoryInfo}
          activeOpacity={0.8}
        >
          <View style={styles.profileCircle}>
            {factoryData.image ? (
              <Image source={{ uri: factoryData.image }} style={styles.profileImage} />
            ) : (
              <Factory size={moderateScale(22)} color="#4B2A99" />
            )}
          </View>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle} numberOfLines={1}>{factoryData.name}</Text>
            <Text style={styles.welcomeSubtitle} numberOfLines={1}>{factoryData.location}</Text>
          </View>
          <ChevronRight size={moderateScale(16)} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
        
        <View style={styles.rightActions}>
          <TouchableOpacity 
            style={styles.iconBadge} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('FactorySettingsScreen')}
          >
            <Settings size={moderateScale(20)} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconBadge} 
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Bell size={moderateScale(20)} color="#fff" />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.searchContainer}>
        <TouchableOpacity 
          style={[styles.searchBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          activeOpacity={0.8}
        >
          <Search size={moderateScale(18)} color="rgba(255,255,255,0.9)" />
          <Text style={styles.searchPlaceholder}>Search products, clients, orders...</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerBackground: { 
    borderBottomLeftRadius: moderateScale(32), 
    borderBottomRightRadius: moderateScale(32),
    width: '100%',
    marginTop: Platform.OS === 'ios' ? -moderateScale(75) : 0,
    minHeight: verticalScale(320),
    paddingBottom: verticalScale(28),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: verticalScale(20), 
    marginHorizontal: moderateScale(16),
    minHeight: verticalScale(60),
  },
  factoryInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1,
    gap: moderateScale(12),
  },
  profileCircle: { 
    width: moderateScale(52), 
    height: moderateScale(52), 
    borderRadius: moderateScale(26), 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileImage: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
  },
  welcomeTextContainer: { 
    flex: 1,
    justifyContent: 'center',
  },
  welcomeTitle: { 
    fontSize: moderateScale(18), 
    fontWeight: '900', 
    color: '#fff',
    letterSpacing: 0.3,
    lineHeight: moderateScale(24),
  },
  welcomeSubtitle: { 
    fontSize: moderateScale(13), 
    fontWeight: '600', 
    color: 'rgba(255,255,255,0.9)', 
    marginTop: verticalScale(4),
    lineHeight: moderateScale(18),
  },
  rightActions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: moderateScale(10),
    marginLeft: moderateScale(8),
  },
  iconBadge: { 
    width: moderateScale(44), 
    height: moderateScale(44), 
    borderRadius: moderateScale(14), 
    backgroundColor: 'rgba(255,255,255,0.25)', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    minWidth: moderateScale(44),
    minHeight: moderateScale(44),
  },
  dot: {
    position: 'absolute',
    top: moderateScale(6),
    right: moderateScale(6),
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  searchContainer: { 
    paddingHorizontal: moderateScale(16),
    marginTop: verticalScale(4),
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: moderateScale(16), 
    paddingHorizontal: moderateScale(16), 
    height: verticalScale(52),
    minHeight: verticalScale(52),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    gap: moderateScale(12),
  },
  searchPlaceholder: { 
    flex: 1, 
    fontSize: moderateScale(14), 
    fontWeight: '500', 
    color: 'rgba(255,255,255,0.85)',
    lineHeight: moderateScale(20),
  },
});
