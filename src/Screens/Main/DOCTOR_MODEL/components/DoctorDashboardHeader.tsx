import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Clock, ChevronRight, User, Search, MapPin, Bell } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale, getStatusBarHeight } from '@/Helpers/Responsive';

export const DoctorDashboardHeader = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  
  const statusBarHeight = getStatusBarHeight();
  const headerPaddingTop = Platform.OS === 'ios' ? statusBarHeight : statusBarHeight + moderateScale(10);

  return (
    <LinearGradient 
      colors={['#4B2A99', '#6366F1']} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 0 }}
      style={[styles.headerBackground, { paddingTop: headerPaddingTop }]}
    >
      <View style={styles.headerTop}>
        <View style={styles.doctorInfo}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('DoctorProfileScreen')}
            style={styles.profileCircle}
            activeOpacity={0.8}
          >
            <User size={moderateScale(20)} color="#4B2A99" />
          </TouchableOpacity>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>Dr. Smith</Text>
            <Text style={styles.welcomeSubtitle}>Senior Cardiologist</Text>
          </View>
        </View>
        
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconBadge} activeOpacity={0.8}>
            <Bell size={moderateScale(20)} color="#fff" />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <Search size={moderateScale(18)} color="rgba(255,255,255,0.7)" />
          <Text style={styles.searchPlaceholder}>Search patients, appointments...</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerBackground: { 
    borderBottomLeftRadius: moderateScale(32), 
    borderBottomRightRadius: moderateScale(32),
    width: '100%',
    marginTop: Platform.OS === 'ios' ? -moderateScale(45) : 0,
    minHeight: verticalScale(200),
    paddingBottom: verticalScale(20),
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: verticalScale(15), 
    paddingTop: Platform.OS === 'ios' ? moderateScale(50) : moderateScale(15),
    marginHorizontal: moderateScale(16),
  },
  doctorInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  profileCircle: { 
    width: moderateScale(44), 
    height: moderateScale(44), 
    borderRadius: moderateScale(22), 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: moderateScale(12)
  },
  welcomeTextContainer: { flex: 1 },
  welcomeTitle: { fontSize: moderateScale(18), fontWeight: '800', color: '#fff' },
  welcomeSubtitle: { fontSize: moderateScale(12), fontWeight: '500', color: 'rgba(255,255,255,0.85)', marginTop: verticalScale(1) },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) },
  iconBadge: { 
    width: moderateScale(40), 
    height: moderateScale(40), 
    borderRadius: moderateScale(12), 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  dot: {
    position: 'absolute',
    top: moderateScale(8),
    right: moderateScale(8),
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#4B2A99',
  },
  searchContainer: { paddingHorizontal: moderateScale(16) },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: moderateScale(15), 
    paddingHorizontal: moderateScale(16), 
    height: verticalScale(48),
  },
  searchPlaceholder: { 
    flex: 1, 
    marginLeft: moderateScale(10), 
    fontSize: moderateScale(14), 
    fontWeight: '500', 
    color: 'rgba(255,255,255,0.7)' 
  },
});
