import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFactoryPayments } from './hooks/useFactoryPayments';
import { BalanceCard } from './components/BalanceCard';
import { StatsGrid } from './components/StatsGrid';
import { PeriodSelector } from './components/PeriodSelector';
import { EarningsCharts } from './components/EarningsCharts';
import { EarningsBreakdown } from './components/EarningsBreakdown';
import { TransactionList } from './components/TransactionList';
import { Toasts } from '@backpackapp-io/react-native-toast';

const FactoryPaymentsScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    totalEarnings,
    availableBalance,
    pendingAmount,
    withdrawnAmount,
    thisMonthEarnings,
    paymentMethods,
    transactions,
    earningsData,
    periodTotals,
    lineChartData,
    barChartData,
    selectedPeriod,
    setSelectedPeriod,
    selectedFilter,
    setSelectedFilter,
    dimensions,
    isSmallScreen,
    isMediumScreen,
    chartAnimation,
  } = useFactoryPayments();

  return (
    <ScreenWrapper title="Factory Payments" showBack={true} scrollable={false}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: Math.max(insets.bottom, verticalScale(20)),
            padding: moderateScale(isSmallScreen ? 12 : 16),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <BalanceCard
          totalEarnings={totalEarnings}
          availableBalance={availableBalance}
          pendingAmount={pendingAmount}
          isSmallScreen={isSmallScreen}
          isMediumScreen={isMediumScreen}
        />

        <StatsGrid
          thisMonthEarnings={thisMonthEarnings}
          pendingAmount={pendingAmount}
          withdrawnAmount={withdrawnAmount}
        />

        <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

        <EarningsCharts
          selectedPeriod={selectedPeriod}
          earningsData={earningsData}
          periodTotals={periodTotals}
          paymentMethods={paymentMethods}
          totalEarnings={totalEarnings}
          lineChartData={lineChartData}
          barChartData={barChartData}
          chartAnimation={chartAnimation}
          dimensions={dimensions}
          isSmallScreen={isSmallScreen}
          isMediumScreen={isMediumScreen}
        />

        <EarningsBreakdown paymentMethods={paymentMethods} totalEarnings={totalEarnings} />

        <TransactionList
          transactions={transactions}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      </ScrollView>
      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
  },
});

export default FactoryPaymentsScreen;
