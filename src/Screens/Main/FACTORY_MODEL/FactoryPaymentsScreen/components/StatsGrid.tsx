import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock, ArrowDownLeft, TrendingUp, TrendingDown, Activity } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale, scale } from '@/Helpers/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface StatsGridProps {
  thisMonthEarnings: number;
  pendingAmount: number;
  withdrawnAmount: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ thisMonthEarnings, pendingAmount, withdrawnAmount }) => {
  const { theme } = useTheme();
  const primaryGradient = ['#00796B', '#004D40', '#00251A'];

  return (
    <View style={styles.grid}>
      <Animated.View entering={FadeInDown.delay(150)} style={styles.cardWrapper}>
        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
          <LinearGradient colors={['#10B98115', '#10B98105']} style={styles.gradient}>
            <View style={styles.padding}>
              <View style={[styles.iconBg, { backgroundColor: '#10B98120' }]}>
                <Calendar size={moderateScale(18)} color="#10B981" />
              </View>
              <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                This Period
              </Text>
              <Text style={[styles.value, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                ₹{thisMonthEarnings.toLocaleString()}
              </Text>
              <View style={styles.change}>
                <TrendingUp size={moderateScale(14)} color="#10B981" />
                <Text style={[styles.changeText, { color: '#10B981' }]} numberOfLines={1}>
                  +8.2%
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.cardWrapper}>
        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
          <LinearGradient colors={['#F59E0B15', '#F59E0B05']} style={styles.gradient}>
            <View style={styles.padding}>
              <View style={[styles.iconBg, { backgroundColor: '#F59E0B20' }]}>
                <Clock size={moderateScale(18)} color="#F59E0B" />
              </View>
              <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                Pending
              </Text>
              <Text style={[styles.value, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                ₹{pendingAmount.toLocaleString()}
              </Text>
              <View style={styles.change}>
                <Activity size={moderateScale(14)} color="#F59E0B" />
                <Text style={[styles.changeText, { color: '#F59E0B' }]} numberOfLines={1}>
                  Processing
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250)} style={styles.cardWrapper}>
        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
          <LinearGradient colors={['#EF444415', '#EF444405']} style={styles.gradient}>
            <View style={styles.padding}>
              <View style={[styles.iconBg, { backgroundColor: '#EF444420' }]}>
                <ArrowDownLeft size={moderateScale(17)} color="#EF4444" />
              </View>
              <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                Withdrawn
              </Text>
              <Text style={[styles.value, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                ₹{withdrawnAmount.toLocaleString()}
              </Text>
              <View style={styles.change}>
                <TrendingDown size={moderateScale(12)} color="#EF4444" />
                <Text style={[styles.changeText, { color: '#EF4444' }]} numberOfLines={1}>
                  -5.1%
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: moderateScale(10),
    marginBottom: verticalScale(20),
  },
  cardWrapper: {
    flex: 1,
    minWidth: 0,
  },
  card: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  gradient: {},
  padding: {
    padding: scale(12),
  },
  iconBg: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  label: {
    fontSize: moderateScale(11),
    marginBottom: verticalScale(6),
    width: '100%',
  },
  value: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    marginBottom: verticalScale(8),
    width: '100%',
  },
  change: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
    width: '100%',
  },
  changeText: {
    fontSize: moderateScale(12),
    fontWeight: '800',
  },
});
