import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, scale, verticalScale } from '@/Helpers/Responsive';
import { LineChart } from 'react-native-chart-kit';
import { Toasts } from '@backpackapp-io/react-native-toast';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useClinicExpenses } from './hooks/useClinicExpenses';
import { ExpenseCard } from './components/ExpenseCard';

const primaryGradient = ['#00796B', '#004D40', '#00251A'];

const ClinicExpensesScreen = () => {
  const { theme, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    selectedPeriod,
    setSelectedPeriod,
    selectedFilter,
    setSelectedFilter,
    filteredExpenses,
    lineChartData,
    dimensions,
    totalExpenses,
    paidAmount,
    pendingAmount,
  } = useClinicExpenses();

  const chartConfig = {
    backgroundColor: theme.surface,
    backgroundGradientFrom: theme.surface,
    backgroundGradientTo: theme.surface,
    decimalPlaces: 0,
    color: () => theme.primary,
    labelColor: () => theme.textSecondary,
    style: { borderRadius: moderateScale(16) },
    propsForDots: { r: '6', strokeWidth: '2', stroke: theme.primary },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.border,
      strokeWidth: 1,
      opacity: 0.2,
    },
  };

  const currentIsSmallScreen = dimensions.width < 375;
  const chartHeight = currentIsSmallScreen ? verticalScale(180) : verticalScale(220);

  return (
    <ScreenWrapper title="Expenses & Payments" showBack={true} scrollable={false}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, verticalScale(20)) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <LinearGradient
            colors={primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.balanceCard, shadows]}
          >
            <View style={styles.balanceContent}>
              <View style={styles.balanceLeft}>
                <Text style={styles.balanceLabel}>Total Expenses</Text>
                <Text style={styles.balanceAmount}>₹{totalExpenses.toLocaleString()}</Text>
                <View style={styles.balanceSubInfo}>
                  <View style={styles.balanceSubItem}>
                    <Text style={styles.balanceSubText}>Paid: ₹{paidAmount.toLocaleString()}</Text>
                  </View>
                  <View style={styles.balanceSubItem}>
                    <Text style={styles.balanceSubText}>
                      Pending: ₹{pendingAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as const).map((period) => {
            const isSelected = selectedPeriod === period;
            return (
              <TouchableOpacity
                key={period}
                onPress={() => setSelectedPeriod(period)}
                activeOpacity={0.7}
                style={styles.periodBtnContainer}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.periodBtn, styles.periodBtnActive]}
                  >
                    <Text style={styles.periodBtnTextActive}>
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View
                    style={[
                      styles.periodBtn,
                      styles.periodBtnInactive,
                      { borderColor: theme.border },
                    ]}
                  >
                    <Text style={[styles.periodBtnText, { color: theme.textSecondary }]}>
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Animated.View entering={FadeInUp.delay(300)}>
          <View style={[styles.chartContainer, { backgroundColor: theme.surface, ...shadows }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Expenses Trend</Text>
            <LineChart
              data={lineChartData}
              width={dimensions.width - moderateScale(64)}
              height={chartHeight}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines
              withOuterLines
              withVerticalLines={false}
              withHorizontalLabels
              withVerticalLabels
              withDots
              segments={4}
            />
          </View>
        </Animated.View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Expenses</Text>
          </View>
          <View style={styles.filterContainer}>
            {(['all', 'in', 'out'] as const).map((filter) => {
              const isSelected = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  style={[
                    styles.filterBtn,
                    isSelected ? styles.filterBtnActive : styles.filterBtnInactive,
                    {
                      backgroundColor: isSelected ? theme.primary : 'transparent',
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterBtnText,
                      {
                        color: isSelected ? '#fff' : theme.textSecondary,
                        fontWeight: isSelected ? '700' : '600',
                      },
                    ]}
                  >
                    {filter === 'all' ? 'All' : filter === 'in' ? 'Income' : 'Expenses'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {filteredExpenses.map((expense, index) => (
            <Animated.View key={expense.id} entering={FadeInDown.delay(index * 50)}>
              <ExpenseCard expense={expense} />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { padding: moderateScale(16) },
  balanceCard: {
    borderRadius: moderateScale(28),
    marginBottom: verticalScale(22),
    overflow: 'hidden',
    minHeight: verticalScale(170),
  },
  balanceContent: { width: '100%', padding: scale(12) },
  balanceLeft: { flex: 1 },
  balanceLabel: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#fff',
    marginBottom: verticalScale(12),
  },
  balanceAmount: {
    fontSize: moderateScale(32),
    fontWeight: '900',
    color: '#fff',
    marginBottom: verticalScale(16),
  },
  balanceSubInfo: { gap: verticalScale(10) },
  balanceSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  balanceSubText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#fff',
    opacity: 0.95,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: moderateScale(8),
    marginBottom: verticalScale(24),
  },
  periodBtnContainer: { flex: 1, minWidth: 0 },
  periodBtn: {
    paddingHorizontal: moderateScale(4),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: verticalScale(44),
    width: '100%',
  },
  periodBtnActive: { borderWidth: 0 },
  periodBtnInactive: { borderWidth: 1.5, backgroundColor: 'transparent' },
  periodBtnText: { fontSize: moderateScale(14), fontWeight: '700', textAlign: 'center' },
  periodBtnTextActive: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  chartContainer: {
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
  },
  chartTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(16),
  },
  chart: { marginVertical: verticalScale(8), borderRadius: moderateScale(16) },
  section: { marginBottom: verticalScale(20) },
  sectionHeader: { marginBottom: verticalScale(16) },
  sectionTitle: { fontSize: moderateScale(18), fontWeight: '800' },
  filterContainer: {
    flexDirection: 'row',
    gap: moderateScale(8),
    marginBottom: verticalScale(16),
  },
  filterBtn: {
    flex: 1,
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(40),
  },
  filterBtnActive: { borderWidth: 0 },
  filterBtnInactive: { backgroundColor: 'transparent' },
  filterBtnText: { fontSize: moderateScale(13), fontWeight: '600', textAlign: 'center' },
});

export default ClinicExpensesScreen;
