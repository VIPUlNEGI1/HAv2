import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { ChevronLeft, ShoppingCart, User, Search } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale, getStatusBarHeight } from '@/Helpers/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import AppContainer from './AppContainer';
import AppSeparator from './AppSeparator/AppSeparator';
import { Colors } from '@/Theme';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  cartCount?: number;
  showProfile?: boolean;
  showSearch?: boolean;
  onSearchPress?: () => void;
  rightComponent?: React.ReactNode;
  isGradient?: boolean;
}

export const AppHeader = ({
  title,
  showBack = true,
  showCart = false,
  cartCount = 0,
  showProfile = false,
  showSearch = false,
  onSearchPress,
  rightComponent,
  isGradient = false,
}: AppHeaderProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const statusBarHeight = getStatusBarHeight();
  const headerPaddingTop = Platform.OS === 'ios' ? statusBarHeight : statusBarHeight + moderateScale(10);

  const renderContent = () => (
    <AppContainer style={[styles.headerTop, { paddingTop: headerPaddingTop }]}>
 
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity 
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }  
            }} 
            style={styles.iconBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={moderateScale(24)} color={isGradient ? '#fff' : theme.text} />
          </TouchableOpacity>
        )}
        {title && (
          <Text style={[styles.title, { color: isGradient ? '#fff' : theme.text, marginLeft: showBack ? moderateScale(8) : 0 }]}>
            {title}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {showSearch && (
          <TouchableOpacity onPress={onSearchPress} style={styles.iconBtn}>
            <Search size={moderateScale(20)} color={isGradient ? '#fff' : theme.text} />
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.iconBtn}>
            <ShoppingCart size={moderateScale(20)} color={isGradient ? '#fff' : theme.text} />
            {cartCount > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: isGradient ? theme.accent : theme.primary }]}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        {showProfile && (
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileCircle}>
            <User size={moderateScale(20)} color={theme.primary} />
          </TouchableOpacity>
        )}
        {rightComponent}
      </View>
    </AppContainer>
  );

  if (isGradient) {
    return (
      <LinearGradient
        colors={theme.gradientPrimary || [theme.primary, theme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        {renderContent()}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      {/* <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" /> */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
      //  backgroundColor:Colors.primary,
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
    paddingBottom: verticalScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  headerGradient: {
    borderBottomLeftRadius: moderateScale(32),
    borderBottomRightRadius: moderateScale(32),
    paddingBottom: verticalScale(20),
    shadowColor: '#000',
  
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    marginTop: verticalScale(40),
    marginBottom:verticalScale(20),
   

  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '900',
  },
  iconBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCircle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: moderateScale(4),
    right: moderateScale(4),
    borderRadius: moderateScale(9),
    width: moderateScale(18),
    height: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: moderateScale(9),
    fontWeight: 'bold',
  },
});
