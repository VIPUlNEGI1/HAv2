import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { Building2, ChevronRight, Search, Bell, Settings } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale, getStatusBarHeight } from '@/Helpers/Responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '@/hooks/useAuthStore';

export const ClinicDashboardHeader = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  
  const statusBarHeight = getStatusBarHeight();
  const headerPaddingTop = Platform.OS === 'ios' 
    ? Math.max(insets.top, statusBarHeight) + moderateScale(8)
    : statusBarHeight + moderateScale(12);

  const loc = user?.location;
  const locationStr = loc?.address
    ?? (loc?.latitude != null ? `${loc.latitude.toFixed(4)}, ${loc.longitude?.toFixed(4)}` : null)
    ?? 'Downtown Medical Center';
  const clinicData = {
    name: user?.name ?? 'City Clinic',
    location: locationStr,
    image: user?.avatar_url ?? null,
  };

  return (
    <LinearGradient 
      colors={['#00796B', '#004D40', '#00251A']} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 1 }}
      style={[styles.headerBackground, { paddingTop: headerPaddingTop }]}
    >
      <Animated.View entering={FadeInDown.delay(100)} style={styles.headerTop}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('ClinicProfileScreen')}
          style={styles.clinicInfo}
          activeOpacity={0.8}
        >
          <View style={styles.profileCircle}>
            {clinicData.image ? (
              <Image source={{ uri: clinicData.image }} style={styles.profileImage} />
            ) : (
              <Building2 size={moderateScale(22)} color="#00796B" />
            )}
          </View>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle} numberOfLines={1}>{clinicData.name}</Text>
            <Text style={styles.welcomeSubtitle} numberOfLines={1}>{clinicData.location}</Text>
          </View>
          <ChevronRight size={moderateScale(16)} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
        
        <View style={styles.rightActions}>
          <TouchableOpacity 
            style={styles.iconBadge} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ClinicSettingsScreen')}
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
          <Text style={styles.searchPlaceholder}>Search products, orders...</Text>
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
    minHeight: verticalScale(300),
    paddingBottom: verticalScale(20),
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
    marginBottom: verticalScale(16), 
    marginHorizontal: moderateScale(16),
  },
  clinicInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1,
    gap: moderateScale(12),
  },
  profileCircle: { 
    width: moderateScale(50), 
    height: moderateScale(50), 
    borderRadius: moderateScale(25), 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
  },
  welcomeTextContainer: { flex: 1 },
  welcomeTitle: { 
    fontSize: moderateScale(18), 
    fontWeight: '900', 
    color: '#fff',
    letterSpacing: 0.3,
  },
  welcomeSubtitle: { 
    fontSize: moderateScale(13), 
    fontWeight: '600', 
    color: 'rgba(255,255,255,0.9)', 
    marginTop: verticalScale(2),
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
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: moderateScale(16), 
    paddingHorizontal: moderateScale(16), 
    height: verticalScale(52),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchPlaceholder: { 
    flex: 1, 
    marginLeft: moderateScale(12), 
    fontSize: moderateScale(14), 
    fontWeight: '500', 
    color: 'rgba(255,255,255,0.85)',
  },
});
