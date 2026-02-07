import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Clock, ChevronRight, User, Search, MapPin } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale, getStatusBarHeight } from '@/Helpers/Responsive';
import { useLocationStore } from '@/hooks/useLocationStore';

export const DashboardHeader = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { address } = useLocationStore();
  
  const statusBarHeight = getStatusBarHeight();
  const headerPaddingTop = Platform.OS === 'ios' ? statusBarHeight : statusBarHeight + moderateScale(10);

  return (
    
      <LinearGradient 
        colors={theme.gradientPrimary || [theme.primary, theme.primary]} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 0 }}
        style={[styles.headerBackground, { paddingTop: headerPaddingTop }]}
      >
        
        <View style={styles.headerTop}>
          <View style={styles.locationContainer}>
            <View style={styles.locationIconBg}>
              <MapPin size={moderateScale(18)} color="#fff" />
            </View>
            <View style={styles.locationTextContainer}>
              <View style={styles.locationRow}>
                <Text style={styles.locationTitle}>Home</Text>
                <ChevronRight size={moderateScale(14)} color="#fff" />
              </View>
              <Text style={styles.locationSubtitle} numberOfLines={1}>
                {address || 'Set your location'}
              </Text>
            </View>
          </View>
          
          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.timerBadge} activeOpacity={0.8}>
              <Clock size={moderateScale(12)} color="#fff" />
              <Text style={styles.timerText}>15 mins</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Profile')}
              style={styles.profileCircle}
              activeOpacity={0.8}
            >
              <User size={moderateScale(20)} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
            <Search size={moderateScale(18)} color={theme.textSecondary} />
            <TextInput
              placeholder="Search medicines, health products..."
              placeholderTextColor={theme.textSecondary}
              style={[styles.searchInput, { color: theme.text }]}
            />
          </View>
        </View>
      </LinearGradient>
    
  );
};

const styles = StyleSheet.create({
  container: { 
    width: '100%',
  }, 
  headerBackground: { 
    borderBottomLeftRadius: moderateScale(32), 
    borderBottomRightRadius: moderateScale(32),
    width: '100%',
    marginTop: Platform.OS === 'ios' ? -moderateScale(45) : 0,
    minHeight: verticalScale(240),
    paddingBottom: verticalScale(20),
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: verticalScale(10), 
    paddingTop: Platform.OS === 'ios' ? moderateScale(50) : moderateScale(15),
    marginHorizontal: moderateScale(16),
    paddingBottom: verticalScale(5),
  },
  locationContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationIconBg: { width: moderateScale(38), height: moderateScale(38), borderRadius: moderateScale(12), backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: moderateScale(12) },
  locationTextContainer: { flex: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(4) },
  locationTitle: { fontSize: moderateScale(18), fontWeight: '800', color: '#fff' },
  locationSubtitle: { fontSize: moderateScale(12), fontWeight: '500', color: 'rgba(255,255,255,0.85)', marginTop: verticalScale(1) },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) },
  timerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: moderateScale(10), paddingVertical: verticalScale(6), borderRadius: moderateScale(12), gap: moderateScale(4) },
  timerText: { color: '#fff', fontSize: moderateScale(11), fontWeight: '700' },
  profileCircle: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  searchContainer: {   paddingHorizontal: moderateScale(16) },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: moderateScale(15), paddingHorizontal: moderateScale(16), height: verticalScale(48), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  searchInput: { flex: 1, marginLeft: moderateScale(10), fontSize: moderateScale(14), fontWeight: '500', paddingVertical: 0 },
});
