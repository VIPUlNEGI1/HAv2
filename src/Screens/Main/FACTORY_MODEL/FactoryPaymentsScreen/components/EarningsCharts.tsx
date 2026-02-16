import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import Animated, { FadeInUp, useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import type { EarningsData, PaymentMethodData } from '../hooks/useFactoryPayments';

interface EarningsChartsProps {
  selectedPeriod: 'week' | 'month' | 'year';
  earningsData: EarningsData[];
  periodTotals: { total: number; avg: number; max: number; min: number; growth: number };
  paymentMethods: PaymentMethodData[];
  totalEarnings: number;
  lineChartData: any;
  barChartData: any;
  chartAnimation: SharedValue<number>;
  dimensions: { width: number; height: number };
  isSmallScreen: boolean;
  isMediumScreen: boolean;
}

export const EarningsCharts: React.FC<EarningsChartsProps> = ({
  selectedPeriod,
  earningsData,
  periodTotals,
  paymentMethods,
  totalEarnings,
  lineChartData,
  barChartData,
  chartAnimation,
  dimensions,
  isSmallScreen,
  isMediumScreen,
}) => {
  const { theme, shadows } = useTheme();
  const chartTitleSize = isSmallScreen ? moderateScale(16) : moderateScale(18);
  const chartSubtitleSize = isSmallScreen ? moderateScale(11) : moderateScale(12);
  const chartHeight = isSmallScreen ? verticalScale(180) : isMediumScreen ? verticalScale(200) : verticalScale(220);
  const pieChartHeight = isSmallScreen ? verticalScale(140) : isMediumScreen ? verticalScale(150) : verticalScale(180);

  const chartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: chartAnimation.value,
  }));

  const chartConfig = {
    backgroundColor: theme.surface,
    backgroundGradientFrom: theme.surface,
    backgroundGradientTo: theme.surface,
    decimalPlaces: 0,
    color: () => theme.primary,
    labelColor: () => theme.textSecondary,
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

  const pieChartData = paymentMethods.map((method) => ({
    name: method.type,
    population: method.amount,
    color: method.color,
    legendFontColor: theme.text,
    legendFontSize: moderateScale(12),
  }));

  return (
    <>
      {/* Line Chart */}
      <Animated.View entering={FadeInUp.delay(300)} style={chartAnimatedStyle}>
        <View
          style={[
            styles.chartContainer,
            {
              backgroundColor: theme.surface,
              ...shadows,
              borderRadius: moderateScale(isSmallScreen ? 20 : 24),
              padding: moderateScale(isSmallScreen ? 16 : 20),
              marginBottom: verticalScale(isSmallScreen ? 16 : 20),
            },
          ]}
        >
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
              height={chartHeight}
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
                <Text style={[styles.chartStatValue, { color: periodTotals.growth >= 0 ? '#10B981' : '#EF4444' }]}>
                  {periodTotals.growth >= 0 ? '+' : ''}
                  {periodTotals.growth.toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Pie Chart */}
      <Animated.View entering={FadeInUp.delay(400)}>
        <View style={[styles.chartContainer, { backgroundColor: theme.surface, ...shadows }]}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={[styles.chartTitle, { color: theme.text, fontSize: chartTitleSize }]}>Earnings by Service</Text>
              <Text style={[styles.chartSubtitle, { color: theme.textSecondary, fontSize: chartSubtitleSize }]}>
                Payment methods breakdown
              </Text>
            </View>
          </View>

          <View style={[styles.pieChartWrapper, { paddingVertical: verticalScale(isSmallScreen ? 5 : 10) }]}>
            <PieChart
              data={pieChartData}
              width={dimensions.width - moderateScale(64)}
              height={pieChartHeight}
              chartConfig={{
                ...chartConfig,
                color: () => theme.primary,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft={isSmallScreen ? '10' : isMediumScreen ? '15' : '20'}
              absolute
              hasLegend={true}
              center={[moderateScale(isSmallScreen ? 5 : isMediumScreen ? 8 : 10), verticalScale(isSmallScreen ? 5 : isMediumScreen ? 8 : 10)]}
            />
          </View>
        </View>
      </Animated.View>

      {/* Bar Chart */}
      <Animated.View entering={FadeInUp.delay(500)} style={chartAnimatedStyle}>
        <View
          style={[
            styles.chartContainer,
            {
              backgroundColor: theme.surface,
              ...shadows,
              borderRadius: moderateScale(isSmallScreen ? 20 : 24),
              padding: moderateScale(isSmallScreen ? 16 : 20),
              marginBottom: verticalScale(isSmallScreen ? 16 : 20),
            },
          ]}
        >
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
              height={chartHeight}
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
    </>
  );
};

const styles = StyleSheet.create({
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
});
