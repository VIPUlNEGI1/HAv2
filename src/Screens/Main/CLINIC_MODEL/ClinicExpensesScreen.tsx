import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, scale, verticalScale } from '@/Helpers/Responsive';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import { TrendingUp, TrendingDown, Download, Calendar, Clock, CheckCircle2, XCircle, Activity } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - moderateScale(64);
const CHART_HEIGHT = verticalScale(220);

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  type: 'in' | 'out';
  description: string;
}

const ClinicExpensesScreen = () => {
  const { theme, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in' | 'out'>('all');
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  const chartAnimation = useSharedValue(0);

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  React.useEffect(() => {
    chartAnimation.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1, { duration: 600 })
    );
  }, [selectedPeriod]);

  const expensesData = useMemo(() => {
    if (selectedPeriod === 'week') {
      return [
        { label: 'Mon', amount: 5000 },
        { label: 'Tue', amount: 8000 },
        { label: 'Wed', amount: 6000 },
        { label: 'Thu', amount: 12000 },
        { label: 'Fri', amount: 9000 },
        { label: 'Sat', amount: 7000 },
        { label: 'Sun', amount: 5000 },
      ];
    } else if (selectedPeriod === 'month') {
      return [
        { label: 'W1', amount: 35000 },
        { label: 'W2', amount: 42000 },
        { label: 'W3', amount: 38000 },
        { label: 'W4', amount: 45000 },
      ];
    } else {
      return [
        { label: 'Jan', amount: 150000 },
        { label: 'Feb', amount: 180000 },
        { label: 'Mar', amount: 160000 },
        { label: 'Apr', amount: 200000 },
        { label: 'May', amount: 220000 },
        { label: 'Jun', amount: 210000 },
      ];
    }
  }, [selectedPeriod]);

  const periodTotals = useMemo(() => {
    const total = expensesData.reduce((sum, d) => sum + d.amount, 0);
    const avg = total / expensesData.length;
    const max = Math.max(...expensesData.map(d => d.amount));
    const min = Math.min(...expensesData.map(d => d.amount));
    const growth = ((max - min) / min) * 100;
    return { total, avg, max, min, growth };
  }, [expensesData]);

  const totalExpenses = 160000;
  const paidAmount = 120000;
  const pendingAmount = 40000;

  const expenses: Expense[] = [
    { id: '1', category: 'Medicine Purchase', amount: 25000, date: 'Today', status: 'Paid', type: 'out', description: 'Bulk order from factory' },
    { id: '2', category: 'Staff Salary', amount: 50000, date: 'Yesterday', status: 'Pending', type: 'out', description: 'Monthly salaries' },
    { id: '3', category: 'Rent', amount: 30000, date: '2 days ago', status: 'Paid', type: 'out', description: 'Clinic rent' },
    { id: '4', category: 'Utilities', amount: 5000, date: '3 days ago', status: 'Paid', type: 'out', description: 'Electricity & Water' },
    { id: '5', category: 'Equipment', amount: 15000, date: '1 week ago', status: 'Overdue', type: 'out', description: 'New equipment' },
  ];

  const filteredExpenses = useMemo(() => {
    if (selectedFilter === 'all') return expenses;
    return expenses.filter(exp => exp.type === selectedFilter);
  }, [selectedFilter]);

  const lineChartData = {
    labels: expensesData.map(d => d.label),
    datasets: [{
      data: expensesData.map(d => d.amount),
      color: (opacity = 1) => theme.primary,
      strokeWidth: 3,
    }],
  };

  const chartConfig = {
    backgroundColor: theme.surface,
    backgroundGradientFrom: theme.surface,
    backgroundGradientTo: theme.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.primary,
    labelColor: (opacity = 1) => theme.textSecondary,
    style: { borderRadius: moderateScale(16) },
    propsForDots: { r: '6', strokeWidth: '2', stroke: theme.primary },
    propsForBackgroundLines: { strokeDasharray: '', stroke: theme.border, strokeWidth: 1, opacity: 0.2 },
  };

  const chartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: chartAnimation.value,
  }));

  const currentIsSmallScreen = dimensions.width < 375;
  const currentIsMediumScreen = dimensions.width >= 375 && dimensions.width < 414;
  const primaryGradient = ['#00796B', '#004D40', '#00251A'];

  return (
    <ScreenWrapper title="Expenses & Payments" showBack={true} scrollable={false}>
      <ScrollView 
        contentContainerStyle={[styles.container, { paddingBottom: Math.max(insets.bottom, verticalScale(20)) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
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
                <Text style={styles.balanceAmount}>
                  ₹{totalExpenses.toLocaleString()}
                </Text>
                <View style={styles.balanceSubInfo}>
                  <View style={styles.balanceSubItem}>
                    <CheckCircle2 size={moderateScale(16)} color="#fff" />
                    <Text style={styles.balanceSubText}>
                      Paid: ₹{paidAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.balanceSubItem}>
                    <Clock size={moderateScale(16)} color="#fff" />
                    <Text style={styles.balanceSubText}>
                      Pending: ₹{pendingAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Period Selector */}
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
                  <View style={[styles.periodBtn, styles.periodBtnInactive, { borderColor: theme.border }]}>
                    <Text style={[styles.periodBtnText, { color: theme.textSecondary }]}>
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Line Chart */}
        <Animated.View entering={FadeInUp.delay(300)} style={chartAnimatedStyle}>
          <View style={[styles.chartContainer, { backgroundColor: theme.surface, ...shadows }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Expenses Trend</Text>
            <LineChart
              data={lineChartData}
              width={dimensions.width - moderateScale(64)}
              height={currentIsSmallScreen ? verticalScale(180) : verticalScale(220)}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={true}
              withVerticalLines={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              withDots={true}
              segments={4}
            />
          </View>
        </Animated.View>

        {/* Expenses List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Expenses</Text>
          </View>

          {/* Filter Buttons */}
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
              <View style={[styles.expenseCard, { backgroundColor: theme.surface, ...shadows }]}>
                <View style={styles.expenseLeft}>
                  <View style={[styles.expenseIconBg, { backgroundColor: theme.primary + '20' }]}>
                    <Activity size={moderateScale(20)} color={theme.primary} />
                  </View>
                  <View style={styles.expenseInfo}>
                    <Text style={[styles.expenseCategory, { color: theme.text }]}>{expense.category}</Text>
                    <Text style={[styles.expenseDescription, { color: theme.textSecondary }]}>{expense.description}</Text>
                    <Text style={[styles.expenseDate, { color: theme.textSecondary }]}>{expense.date}</Text>
                  </View>
                </View>
                <View style={styles.expenseRight}>
                  <Text style={[styles.expenseAmount, { color: '#EF4444' }]}>
                    -₹{expense.amount.toLocaleString()}
                  </Text>
                  <View style={styles.expenseStatusContainer}>
                    {expense.status === 'Paid' ? (
                      <CheckCircle2 size={moderateScale(12)} color="#10B981" />
                    ) : expense.status === 'Pending' ? (
                      <Clock size={moderateScale(12)} color="#F59E0B" />
                    ) : (
                      <XCircle size={moderateScale(12)} color="#EF4444" />
                    )}
                    <Text
                      style={[
                        styles.expenseStatus,
                        {
                          color:
                            expense.status === 'Paid'
                              ? '#10B981'
                              : expense.status === 'Pending'
                              ? '#F59E0B'
                              : '#EF4444',
                        },
                      ]}
                    >
                      {expense.status}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Export Button */}
     
      </ScrollView>

      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
  },
  balanceCard: {
    borderRadius: moderateScale(28),
    marginBottom: verticalScale(22),
    overflow: 'hidden',
    minHeight: verticalScale(170),
  },
  balanceContent: {
    width: '100%',
    padding:scale(12)
  },
  balanceLeft: {
    flex: 1,
  },
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
  balanceSubInfo: {
    gap: verticalScale(10),
  },
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
  periodBtnContainer: {
    flex: 1,
    minWidth: 0,
  },
  periodBtn: {
    paddingHorizontal: moderateScale(4),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: verticalScale(44),
    width: '100%',
  },
  periodBtnActive: {
    borderWidth: 0,
  },
  periodBtnInactive: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  periodBtnText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    textAlign: 'center',
  },
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
  chart: {
    marginVertical: verticalScale(8),
    borderRadius: moderateScale(16),
  },
  section: {
    marginBottom: verticalScale(20),
  },
  sectionHeader: {
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
  },
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
  filterBtnActive: {
    borderWidth: 0,
  },
  filterBtnInactive: {
    backgroundColor: 'transparent',
  },
  filterBtnText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    textAlign: 'center',
  },
  expenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(18),
    borderRadius: moderateScale(18),
    marginBottom: verticalScale(12),
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: moderateScale(14),
    marginRight: moderateScale(12),
  },
  expenseIconBg: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  expenseDescription: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginBottom: verticalScale(4),
  },
  expenseDate: {
    fontSize: moderateScale(11),
    fontWeight: '500',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: moderateScale(17),
    fontWeight: '800',
    marginBottom: verticalScale(6),
  },
  expenseStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
  },
  expenseStatus: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  exportBtn: {
    borderRadius: moderateScale(18),
    borderWidth: 2,
    overflow: 'hidden',
    marginTop: verticalScale(8),
  },
  exportBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(18),
    paddingHorizontal: moderateScale(24),
    gap: moderateScale(12),
  },
  exportBtnText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '800',
  },
});

export default ClinicExpensesScreen;
