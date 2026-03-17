import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Wallet, Clock } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import LinearGradient from 'react-native-linear-gradient';

interface BalanceCardProps {
  totalEarnings: number;
  availableBalance: number;
  pendingAmount: number;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  totalEarnings,
  availableBalance,
  pendingAmount,
  isSmallScreen,
  isMediumScreen,
}) => {
  const { theme, shadows } = useTheme();
  const primaryGradient = ['#00796B', '#004D40', '#00251A'];
  const balanceAmountSize = isSmallScreen ? moderateScale(26) : isMediumScreen ? moderateScale(29) : moderateScale(32);
  const balanceSubTextSize = isSmallScreen ? moderateScale(12) : moderateScale(14);

  return (
    <View style={[styles.cardShadow, shadows]}>
      <LinearGradient colors={primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.left}>
          <View style={styles.header}>
            <Text style={[styles.label, { fontSize: moderateScale(isSmallScreen ? 14 : 16) }]}>Total Earnings</Text>
            <View style={styles.badge}>
              <TrendingUp size={moderateScale(isSmallScreen ? 12 : 14)} color="#fff" />
              <Text style={styles.badgeText}>+12.5%</Text>
            </View>
          </View>
          <Text
            style={[styles.amount, { fontSize: balanceAmountSize, lineHeight: balanceAmountSize * 1.1 }]}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            numberOfLines={1}
          >
            ₹{totalEarnings.toLocaleString()}
          </Text>
          <View style={styles.subInfo}>
            <View style={styles.subItem}>
              <Wallet size={moderateScale(isSmallScreen ? 14 : 16)} color="#fff" />
              <Text style={[styles.subText, { fontSize: balanceSubTextSize }]} adjustsFontSizeToFit minimumFontScale={0.75} numberOfLines={1}>
                Available: ₹{availableBalance.toLocaleString()}
              </Text>
            </View>
            <View style={styles.subItem}>
              <Clock size={moderateScale(isSmallScreen ? 14 : 16)} color="#fff" />
              <Text style={[styles.subText, { fontSize: balanceSubTextSize }]} adjustsFontSizeToFit minimumFontScale={0.75} numberOfLines={1}>
                Pending: ₹{pendingAmount.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconBg,
              {
                width: moderateScale(isSmallScreen ? 56 : 68),
                height: moderateScale(isSmallScreen ? 56 : 68),
                borderRadius: moderateScale(isSmallScreen ? 18 : 22),
              },
            ]}
          >
            <TrendingUp size={moderateScale(isSmallScreen ? 28 : 36)} color="#fff" />
          </View>
        </View>
      </View>
    </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    borderRadius: moderateScale(28),
    marginBottom: verticalScale(22),
    backgroundColor: 'transparent',
  },
  card: {
    borderRadius: moderateScale(28),
    padding: moderateScale(4),
    overflow: 'hidden',
    minHeight: verticalScale(200),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: moderateScale(16),
  },
  left: {
    flex: 1,
    marginRight: moderateScale(14),
    minWidth: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
    flexWrap: 'wrap',
    width: '100%',
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#fff',
    flexShrink: 1,
    letterSpacing: 0.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    gap: moderateScale(6),
    marginLeft: moderateScale(8),
  },
  badgeText: {
    fontSize: moderateScale(12),
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.2,
  },
  amount: {
    fontSize: moderateScale(32),
    fontWeight: '700',
    color: '#fff',
    marginBottom: verticalScale(16),
  },
  subInfo: {
    gap: verticalScale(10),
    width: '100%',
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    flex: 1,
    minWidth: 0,
  },
  subText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#fff',
    opacity: 0.95,
    flex: 1,
    flexShrink: 1,
    letterSpacing: 0.2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(10),
  },
  iconBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
