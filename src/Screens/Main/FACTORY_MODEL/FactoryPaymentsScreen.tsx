import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
} from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, scale, verticalScale } from '@/Helpers/Responsive';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  Wallet,
  Calendar,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Activity,
  Percent,
} from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;
const isMediumScreen = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
const isLargeScreen = SCREEN_WIDTH >= 414;

// Responsive chart dimensions
const CHART_WIDTH = SCREEN_WIDTH - moderateScale(64);
const CHART_HEIGHT = isSmallScreen ? verticalScale(180) : isMediumScreen ? verticalScale(200) : verticalScale(220);
const PIE_CHART_HEIGHT = isSmallScreen ? verticalScale(200) : isMediumScreen ? verticalScale(240) : verticalScale(280);

interface Transaction {
  id: string;
  patient: string;
  amount: number;
  date: string;
  status: 'Received' | 'Pending' | 'Withdrawn';
  type: 'in' | 'out';
  serviceType: 'Video' | 'Audio' | 'Chat' | 'Consultation';
}

interface EarningsData {
  label: string;
  amount: number;
}

interface PaymentMethodData {
  type: string;
  amount: number;
  color: string;
}

const FactoryPaymentsScreen = () => {
  const { theme, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in' | 'out'>('all');
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  const chartAnimation = useSharedValue(0);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    chartAnimation.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1, { duration: 800 })
    );
  }, []);

  // Dynamic data based on period selection
  const earningsData = useMemo(() => {
    if (selectedPeriod === 'week') {
      return [
        { label: 'Mon', amount: 1200 },
        { label: 'Tue', amount: 1800 },
        { label: 'Wed', amount: 1500 },
        { label: 'Thu', amount: 2200 },
        { label: 'Fri', amount: 1900 },
        { label: 'Sat', amount: 1600 },
        { label: 'Sun', amount: 1200 },
      ];
    } else if (selectedPeriod === 'month') {
      return [
        { label: 'W1', amount: 8500 },
        { label: 'W2', amount: 12000 },
        { label: 'W3', amount: 9800 },
        { label: 'W4', amount: 15000 },
      ];
    } else {
      return [
        { label: 'Jan', amount: 45000 },
        { label: 'Feb', amount: 52000 },
        { label: 'Mar', amount: 48000 },
        { label: 'Apr', amount: 55000 },
        { label: 'May', amount: 60000 },
        { label: 'Jun', amount: 58000 },
        { label: 'Jul', amount: 62000 },
        { label: 'Aug', amount: 65000 },
        { label: 'Sep', amount: 68000 },
        { label: 'Oct', amount: 70000 },
        { label: 'Nov', amount: 72000 },
        { label: 'Dec', amount: 75000 },
      ];
    }
  }, [selectedPeriod]);

  const maxEarnings = Math.max(...earningsData.map(d => d.amount));

  // Calculate period totals
  const periodTotals = useMemo(() => {
    const total = earningsData.reduce((sum, d) => sum + d.amount, 0);
    const avg = total / earningsData.length;
    const max = Math.max(...earningsData.map(d => d.amount));
    const min = Math.min(...earningsData.map(d => d.amount));
    const growth = ((max - min) / min) * 100;
    return { total, avg, max, min, growth };
  }, [earningsData]);

  // Mock data
  const totalEarnings = 125000;
  const availableBalance = 95000;
  const pendingAmount = 30000;
  const thisMonthEarnings = periodTotals.total;
  const withdrawnAmount = 25000;

  const paymentMethods: PaymentMethodData[] = [
    { type: 'Video Consultation', amount: 45000, color: '#00796B' },
    { type: 'Audio Call', amount: 32000, color: '#4DB6AC' },
    { type: 'Chat Consultation', amount: 28000, color: '#26A69A' },
    { type: 'In-Person', amount: 20000, color: '#00897B' },
  ];

  const transactions: Transaction[] = [
    { id: '1', patient: 'Rajesh Kumar', amount: 1500, date: 'Today', status: 'Received', type: 'in', serviceType: 'Video' },
    { id: '2', patient: 'Priya Sharma', amount: 1200, date: 'Yesterday', status: 'Pending', type: 'in', serviceType: 'Audio' },
    { id: '3', patient: 'Amit Patel', amount: 2000, date: '2 days ago', status: 'Received', type: 'in', serviceType: 'Consultation' },
    { id: '4', patient: 'Sneha Reddy', amount: 800, date: '3 days ago', status: 'Received', type: 'in', serviceType: 'Chat' },
    { id: '5', patient: 'Bank Transfer', amount: 25000, date: '1 week ago', status: 'Withdrawn', type: 'out', serviceType: 'Consultation' },
  ];

  const filteredTransactions = useMemo(() => {
    if (selectedFilter === 'all') return transactions;
    return transactions.filter(tx => tx.type === selectedFilter);
  }, [selectedFilter]);

  // Chart data for react-native-chart-kit
  const lineChartData = {
    labels: earningsData.map(d => d.label),
    datasets: [{
      data: earningsData.map(d => d.amount),
      color: (opacity = 1) => theme.primary,
      strokeWidth: 3,
    }],
  };

  const barChartData = {
    labels: earningsData.map(d => d.label),
    datasets: [{
      data: earningsData.map(d => d.amount),
    }],
  };

  const pieChartData = paymentMethods.map(method => ({
    name: method.type,
    population: method.amount,
    color: method.color,
    legendFontColor: theme.text,
    legendFontSize: moderateScale(12),
  }));

  const chartConfig = {
    backgroundColor: theme.surface,
    backgroundGradientFrom: theme.surface,
    backgroundGradientTo: theme.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.primary,
    labelColor: (opacity = 1) => theme.textSecondary,
    style: {
      borderRadius: moderateScale(16),
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.border,
      strokeWidth: 1,
      opacity: 0.2,
    },
  };

  useEffect(() => {
    chartAnimation.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1, { duration: 600 })
    );
  }, [selectedPeriod]);

  const chartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: chartAnimation.value,
  }));

  // Responsive values based on current screen size
  const currentIsSmallScreen = dimensions.width < 375;
  const currentIsMediumScreen = dimensions.width >= 375 && dimensions.width < 414;
  
  // Responsive font sizes
  const balanceAmountSize = currentIsSmallScreen ? moderateScale(26) : currentIsMediumScreen ? moderateScale(29) : moderateScale(32);
  const balanceSubTextSize = currentIsSmallScreen ? moderateScale(12) : moderateScale(14);
  const statValueSize = currentIsSmallScreen ? moderateScale(15) : currentIsMediumScreen ? moderateScale(16) : moderateScale(18);
  const statLabelSize = currentIsSmallScreen ? moderateScale(11) : moderateScale(13);
  const chartTitleSize = currentIsSmallScreen ? moderateScale(16) : moderateScale(18);
  const chartSubtitleSize = currentIsSmallScreen ? moderateScale(11) : moderateScale(12);

  // App theme gradients (medical/teal theme)
  const primaryGradient = ['#00796B', '#004D40', '#00251A'];
  const secondaryGradient = ['#4DB6AC', '#26A69A', '#00897B'];

  return (
    <ScreenWrapper title="Factory Payments" showBack={true} scrollable={false}>
      <ScrollView 
        contentContainerStyle={[
          styles.container, 
          { 
            paddingBottom: Math.max(insets.bottom, verticalScale(20)),
            padding: moderateScale(currentIsSmallScreen ? 12 : 16),
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Professional Balance Card - Clean & Responsive */}
        <View>
          <LinearGradient
            colors={primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.balanceCard, 
              shadows,
              
            ]}
          >
            <View style={styles.balanceContent}>
              <View style={styles.balanceLeft}>
                <View style={styles.balanceHeader}>
                  <Text style={[styles.balanceLabel, { fontSize: moderateScale(currentIsSmallScreen ? 14 : 16) }]}>
                    Total Earnings
                  </Text>
                  <View style={styles.balanceBadge}>
                    <TrendingUp size={moderateScale(currentIsSmallScreen ? 12 : 14)} color="#fff" />
                    <Text style={styles.balanceBadgeText}>+12.5%</Text>
                  </View>
                </View>
                <Text 
                  style={[
                    styles.balanceAmount, 
                    { 
                      fontSize: balanceAmountSize,
                      lineHeight: balanceAmountSize * 1.1,
                    }
                  ]} 
                  adjustsFontSizeToFit 
                  minimumFontScale={0.7}
                  numberOfLines={1}
                >
                  ₹{totalEarnings.toLocaleString()}
                </Text>
                <View style={styles.balanceSubInfo}>
                  <View style={styles.balanceSubItem}>
                    <Wallet size={moderateScale(currentIsSmallScreen ? 14 : 16)} color="#fff" />
                    <Text 
                      style={[
                        styles.balanceSubText, 
                        { fontSize: balanceSubTextSize }
                      ]} 
                      adjustsFontSizeToFit 
                      minimumFontScale={0.75}
                      numberOfLines={1}
                    >
                      Available: ₹{availableBalance.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.balanceSubItem}>
                    <Clock size={moderateScale(currentIsSmallScreen ? 14 : 16)} color="#fff" />
                    <Text 
                      style={[
                        styles.balanceSubText, 
                        { fontSize: balanceSubTextSize }
                      ]} 
                      adjustsFontSizeToFit 
                      minimumFontScale={0.75}
                      numberOfLines={1}
                    >
                      Pending: ₹{pendingAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.balanceIconContainer}>
                <View style={[
                  styles.balanceIconBg,
                  {
                    width: moderateScale(currentIsSmallScreen ? 56 : 68),
                    height: moderateScale(currentIsSmallScreen ? 56 : 68),
                    borderRadius: moderateScale(currentIsSmallScreen ? 18 : 22),
                  }
                ]}>
                  <TrendingUp size={moderateScale(currentIsSmallScreen ? 28 : 36)} color="#fff" />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Professional Stats Grid - Fixed Consistency */}
        <View style={[
          styles.statsGrid,
          
        ]}>
          <Animated.View entering={FadeInDown.delay(150)} style={styles.statCardWrapper}>
            <TouchableOpacity
              style={[
                styles.statCard, 
                
              ]}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10B98115', '#10B98105']}
                style={[
                  styles.statCardGradient,
                 
                ]}
              >
                <View style={styles.paddongcard}>
                <View style={[styles.statIconBg, { backgroundColor: '#10B98120' }]}>
                  <Calendar size={moderateScale(18)} color="#10B981" />
                </View>
                <Text style={[styles.statLabel, { color: theme.textSecondary,  }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                  This Period
                </Text>
                <Text style={[styles.statValue,  ]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                  ₹{thisMonthEarnings.toLocaleString()}
                </Text>
                <View style={styles.statChange}>
                  <TrendingUp size={moderateScale(14)} color="#10B981" />
                  <Text style={[styles.statChangeText, { color: '#10B981' }]} numberOfLines={1}>
                    +8.2%
                  </Text>
                </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.statCardWrapper}>
            <TouchableOpacity
              style={[
                styles.statCard, 
                
              ]}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#F59E0B15', '#F59E0B05']}
                style={[
                  styles.statCardGradient,
                   
                ]}
              >
                 <View style={styles.paddongcard}> 
                <View style={[styles.statIconBg, { backgroundColor: '#F59E0B20' }]}>
                  <Clock size={moderateScale(18)} color="#F59E0B" />
                </View>
                <Text style={[styles.statLabel, { color: theme.textSecondary,  }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                  Pending
                </Text>
                <Text style={[styles.statValue, { color: theme.text, }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                  ₹{pendingAmount.toLocaleString()}
                </Text>
                <View style={styles.statChange}>
                  <Activity size={moderateScale(14)} color="#F59E0B" />
                  <Text style={[styles.statChangeText, { color: '#F59E0B' }]} numberOfLines={1}>
                    Processing
                  </Text>
                </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250)} style={styles.statCardWrapper}>
            <TouchableOpacity
              style={[
                styles.statCard, 
                 
              ]}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#EF444415', '#EF444405']}
                style={[
                  styles.statCardGradient,
                  
                ]}
              >
                 <View style={styles.paddongcard}> 
                <View style={[styles.statIconBg, { backgroundColor: '#EF444420' }]}>
                  <ArrowDownLeft size={moderateScale(17)} color="#EF4444" />
                </View>
                <Text style={[styles.statLabel, { color: theme.textSecondary,  }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                  Withdrawn
                </Text>
                <Text style={[styles.statValue, { color: theme.text, }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                  ₹{withdrawnAmount.toLocaleString()}
                </Text>
                <View style={styles.statChange}>
                  <TrendingDown size={moderateScale(12)} color="#EF4444" />
                  <Text style={[styles.statChangeText, { color: '#EF4444' }]} numberOfLines={1}>
                    -5.1%
                  </Text>
                </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
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
          <View style={[
            styles.chartContainer, 
            { 
              backgroundColor: theme.surface, 
              ...shadows,
              borderRadius: moderateScale(currentIsSmallScreen ? 20 : 24),
              padding: moderateScale(currentIsSmallScreen ? 16 : 20),
              marginBottom: verticalScale(currentIsSmallScreen ? 16 : 20),
            }
          ]}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={[styles.chartTitle, { color: theme.text, fontSize: chartTitleSize }]}>Earnings Trend</Text>
                <Text style={[styles.chartSubtitle, { color: theme.textSecondary, fontSize: chartSubtitleSize }]}>
                  {selectedPeriod === 'week' ? 'Last 7 days' : selectedPeriod === 'month' ? 'This month' : 'Last 12 months'}
                </Text>
              </View>
            </View>
            
            <View style={styles.chartWrapper}>
              <LineChart
                data={lineChartData}
                width={dimensions.width - moderateScale(64)}
                height={currentIsSmallScreen ? verticalScale(180) : currentIsMediumScreen ? verticalScale(200) : verticalScale(220)}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={false}
                withHorizontalLabels={true}
                withVerticalLabels={true}
                withDots={true}
                withShadow={false}
                segments={4}
              />
            </View>

            {/* Chart Stats */}
            <View style={styles.chartStats}>
              <View style={styles.chartStatItem}>
                <Text style={[styles.chartStatLabel, { color: theme.textSecondary }]}>Total</Text>
                <Text style={[styles.chartStatValue, { color: theme.text }]}>₹{periodTotals.total.toLocaleString()}</Text>
              </View>
              <View style={styles.chartStatItem}>
                <Text style={[styles.chartStatLabel, { color: theme.textSecondary }]}>Average</Text>
                <Text style={[styles.chartStatValue, { color: theme.text }]}>₹{Math.round(periodTotals.avg).toLocaleString()}</Text>
              </View>
              <View style={styles.chartStatItem}>
                <Text style={[styles.chartStatLabel, { color: theme.textSecondary }]}>Growth</Text>
                <View style={styles.growthContainer}>
                  {periodTotals.growth >= 0 ? (
                    <TrendingUp size={moderateScale(14)} color="#10B981" />
                  ) : (
                    <TrendingDown size={moderateScale(14)} color="#EF4444" />
                  )}
                  <Text style={[styles.chartStatValue, { 
                    color: periodTotals.growth >= 0 ? '#10B981' : '#EF4444' 
                  }]}>
                    {periodTotals.growth >= 0 ? '+' : ''}{periodTotals.growth.toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Pie Chart */}
        <Animated.View entering={FadeInUp.delay(400)}>
          <View style={[
            styles.chartContainer, 
            { 
              backgroundColor: theme.surface, 
              ...shadows,
              // borderRadius: moderateScale(currentIsSmallScreen ? 20 : 24),
              // padding: moderateScale(currentIsSmallScreen ? 16 : 20),
              // marginBottom: verticalScale(currentIsSmallScreen ? 16 : 20),
            }
          ]}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={[styles.chartTitle, { color: theme.text, fontSize: chartTitleSize }]}>Earnings by Service</Text>
                <Text style={[styles.chartSubtitle, { color: theme.textSecondary, fontSize: chartSubtitleSize }]}>Payment methods breakdown</Text>
              </View>
            </View>
            
            <View style={[
              styles.pieChartWrapper,
              {
                paddingVertical: verticalScale(currentIsSmallScreen ? 5 : 10),
              }
            ]}>
              <PieChart
                data={pieChartData}
                width={dimensions.width - moderateScale(64)}
                height={currentIsSmallScreen ? verticalScale(140) : currentIsMediumScreen ? verticalScale(150) : verticalScale(180)}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(0, 121, 107, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft={currentIsSmallScreen ? "10" : currentIsMediumScreen ? "15" : "20"}
                absolute
                hasLegend={true}
                center={[moderateScale(currentIsSmallScreen ? 5 : currentIsMediumScreen ? 8 : 10), verticalScale(currentIsSmallScreen ? 5 : currentIsMediumScreen ? 8 : 10)]}
              />
            </View>
          </View>
        </Animated.View>

        {/* Bar Chart */}
        <Animated.View entering={FadeInUp.delay(500)} style={chartAnimatedStyle}>
          <View style={[
            styles.chartContainer, 
            { 
              backgroundColor: theme.surface, 
              ...shadows,
              borderRadius: moderateScale(currentIsSmallScreen ? 20 : 24),
              padding: moderateScale(currentIsSmallScreen ? 16 : 20),
              marginBottom: verticalScale(currentIsSmallScreen ? 16 : 20),
            }
          ]}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={[styles.chartTitle, { color: theme.text, fontSize: chartTitleSize }]}>Earnings Comparison</Text>
                <Text style={[styles.chartSubtitle, { color: theme.textSecondary, fontSize: chartSubtitleSize }]}>
                  {selectedPeriod === 'week' ? 'Daily' : selectedPeriod === 'month' ? 'Weekly' : 'Monthly'} overview
                </Text>
              </View>
            </View>
            
            <View style={styles.chartWrapper}>
              <BarChart
                data={barChartData}
                width={dimensions.width - moderateScale(64)}
                height={currentIsSmallScreen ? verticalScale(180) : currentIsMediumScreen ? verticalScale(200) : verticalScale(220)}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisLabel="₹"
                yAxisSuffix=""
                showValuesOnTopOfBars
                withInnerLines={true}
                segments={4}
                fromZero
              />
            </View>
          </View>
        </Animated.View>

        {/* Earnings Breakdown */}
        <Animated.View entering={FadeInUp.delay(600)}>
          <View style={[styles.sectionContainer, { backgroundColor: theme.surface, ...shadows }]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Earnings Breakdown</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>By payment method</Text>
              </View>
            </View>
            
            <View style={styles.breakdownContainer}>
              {paymentMethods.map((method, index) => {
                const percentage = (method.amount / totalEarnings) * 100;
                const percentageNum = Math.round(percentage);
                return (
                  <View key={index} style={styles.breakdownItem}>
                    <View style={styles.breakdownHeader}>
                      <View style={styles.breakdownLeft}>
                        <View style={[styles.breakdownDot, { backgroundColor: method.color }]} />
                        <Text style={[styles.breakdownLabel, { color: theme.text }]} numberOfLines={1}>
                          {method.type}
                        </Text>
                      </View>
                      <View style={styles.breakdownRight}>
                        <Text style={[styles.breakdownAmount, { color: theme.text }]} numberOfLines={1}>
                          ₹{method.amount.toLocaleString()}
                        </Text>
                        <View style={[styles.breakdownBadge, { backgroundColor: method.color + '20' }]}>
                          <Text style={[styles.breakdownPercentage, { color: method.color }]}>
                            {percentageNum}%
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.breakdownProgressBar, { backgroundColor: theme.border + '30' }]}>
                      <View 
                        style={[
                          styles.breakdownProgressFill, 
                          { 
                            backgroundColor: method.color,
                            width: `${percentageNum}%` as any,
                          }
                        ]} 
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Transaction History */}
        <Animated.View entering={FadeInUp.delay(700)}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Transaction History</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>Recent payments</Text>
            </View>
            <View style={[styles.sectionIconBg, { backgroundColor: theme.primary + '15' }]}>
              <History size={moderateScale(20)} color={theme.primary} />
            </View>
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
                    numberOfLines={1}
                  >
                    {filter === 'all' ? 'All' : filter === 'in' ? 'Income' : 'Out'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Transactions List */}
          {filteredTransactions.map((tx, index) => (
            <Animated.View key={tx.id} entering={FadeInUp.delay(800 + index * 50)}>
              <TouchableOpacity
                style={[styles.txCard, { backgroundColor: theme.surface, ...shadows }]}
                activeOpacity={0.8}
              >
                <View style={styles.txLeft}>
                  <View
                    style={[
                      styles.txIconBg,
                      {
                        backgroundColor:
                          tx.type === 'in'
                            ? tx.status === 'Pending'
                              ? '#F59E0B20'
                              : '#10B98120'
                            : '#EF444420',
                      },
                    ]}
                  >
                    {tx.type === 'in' ? (
                      <ArrowUpRight
                        size={moderateScale(20)}
                        color={tx.status === 'Pending' ? '#F59E0B' : '#10B981'}
                      />
                    ) : (
                      <ArrowDownLeft size={moderateScale(20)} color="#EF4444" />
                    )}
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={[styles.txPatient, { color: theme.text }]} numberOfLines={1}>
                      {tx.patient}
                    </Text>
                    <View style={styles.txMeta}>
                      <Text style={[styles.txDate, { color: theme.textSecondary }]} numberOfLines={1}>
                        {tx.date}
                      </Text>
                      <View style={[styles.txServiceBadge, { backgroundColor: theme.primary + '10' }]}>
                        <Text style={[styles.txService, { color: theme.primary }]} numberOfLines={1}>
                          {tx.serviceType}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      {
                        color:
                          tx.type === 'in'
                            ? tx.status === 'Pending'
                              ? '#F59E0B'
                              : '#10B981'
                            : '#EF4444',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {tx.type === 'in' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </Text>
                  <View style={styles.txStatusContainer}>
                    {tx.status === 'Received' ? (
                      <CheckCircle2 size={moderateScale(12)} color="#10B981" />
                    ) : tx.status === 'Pending' ? (
                      <Clock size={moderateScale(12)} color="#F59E0B" />
                    ) : (
                      <XCircle size={moderateScale(12)} color="#EF4444" />
                    )}
                    <Text
                      style={[
                        styles.txStatus,
                        {
                          color:
                            tx.status === 'Received'
                              ? '#10B981'
                              : tx.status === 'Pending'
                              ? '#F59E0B'
                              : '#EF4444',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {tx.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
 
      </ScrollView>

      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  paddongcard:{
    padding:scale(12)
  },
  container: {
    padding: moderateScale(16),
  },
  balanceCard: {
    borderRadius: moderateScale(28),
    padding: moderateScale(4),
    marginBottom: verticalScale(22),
    overflow: 'hidden',
    minHeight: verticalScale(200),
  },
  balanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: moderateScale(16),
    // width: '100%',
  },
  balanceLeft: {
    flex: 1,
    marginRight: moderateScale(14),
    minWidth: 0,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
    flexWrap: 'wrap',
    width: '100%',
  },
  balanceLabel: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#fff',
    flexShrink: 1,
    letterSpacing: 0.3,
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    gap: moderateScale(6),
    marginLeft: moderateScale(8),
  },
  balanceBadgeText: {
    fontSize: moderateScale(12),
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.2,
  },
  balanceAmount: {
    fontSize: moderateScale(32),
    fontWeight: '700',
    color: '#fff',
    marginBottom: verticalScale(16),
   
  },
  balanceSubInfo: {
    gap: verticalScale(10),
    width: '100%',
  },
  balanceSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    flex: 1,
    minWidth: 0,
  },
  balanceSubText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#fff',
    opacity: 0.95,
    flex: 1,
    flexShrink: 1,
    letterSpacing: 0.2,
  },
  balanceIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(10),
  },
  balanceIconBg: {
    width: moderateScale(68),
    height: moderateScale(68),
    borderRadius: moderateScale(22),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: moderateScale(10),
    marginBottom: verticalScale(20),
  },
  statCardWrapper: {
    flex: 1,
    minWidth: 0,
  },
  statCard: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  statCardGradient: {
    // padding: moderateScale(2),
  },
  statIconBg: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  statLabel: {
    fontSize: moderateScale(11),
   
    marginBottom: verticalScale(6),
    width: '100%',
  },
  statValue: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    marginBottom: verticalScale(8),
    width: '100%',
    // lineHeight: moderateScale(22),
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
    width: '100%',
  },
  statChangeText: {
    fontSize: moderateScale(12),
    fontWeight: '800',
  },
  periodSelector: {
    flexDirection: 'row',
    gap: moderateScale(8),
    marginBottom: verticalScale(24),
    backgroundColor: 'transparent',
    width: '100%',
  },
  periodBtnContainer: {
    flex: 1,
    minWidth: 0,
  },
  periodBtn: {
    paddingVertical: verticalScale(3),
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(20),
  },
  chartIconBg: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(4),
  },
  chartSubtitle: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chart: {
    marginVertical: verticalScale(8),
    borderRadius: moderateScale(16),
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(20),
    paddingTop: verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  chartStatItem: {
    alignItems: 'center',
  },
  chartStatLabel: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  chartStatValue: {
    fontSize: moderateScale(14),
    fontWeight: '800',
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  pieChartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
  },
  sectionContainer: {
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(20),
  },
  sectionIconBg: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(2),
  },
  sectionSubtitle: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  breakdownContainer: {
    gap: verticalScale(16),
  },
  breakdownItem: {
    gap: verticalScale(8),
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    flex: 1,
  },
  breakdownDot: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
  },
  breakdownLabel: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    flex: 1,
  },
  breakdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  breakdownAmount: {
    fontSize: moderateScale(15),
    fontWeight: '800',
  },
  breakdownBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
  },
  breakdownPercentage: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  breakdownProgressBar: {
    height: verticalScale(8),
    borderRadius: moderateScale(4),
    overflow: 'hidden',
  },
  breakdownProgressFill: {
    height: '100%',
    borderRadius: moderateScale(4),
  },
  filterContainer: {
    flexDirection: 'row',
    gap: moderateScale(8),
    marginBottom: verticalScale(16),
    backgroundColor: 'transparent',
    width: '100%',
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
    minWidth: 0,
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
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(18),
    borderRadius: moderateScale(18),
    marginBottom: verticalScale(12),
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: moderateScale(14),
    marginRight: moderateScale(12),
  },
  txIconBg: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: {
    flex: 1,
  },
  txPatient: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: verticalScale(6),
  },
  txMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    flexWrap: 'wrap',
  },
  txDate: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  txServiceBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
  },
  txService: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  txRight: {
    alignItems: 'flex-end',
    minWidth: moderateScale(100),
  },
  txAmount: {
    fontSize: moderateScale(17),
    fontWeight: '800',
    marginBottom: verticalScale(6),
  },
  txStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
  },
  txStatus: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  exportBtn: {
    borderRadius: moderateScale(18),
    borderWidth: 2,
    overflow: 'hidden',
    marginTop: verticalScale(8),
    width: '100%',
  },
  exportBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(18),
    paddingHorizontal: moderateScale(24),
    gap: moderateScale(12),
    width: '100%',
  },
  exportBtnText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '800',
    flexShrink: 1,
  },
});

export default FactoryPaymentsScreen;
