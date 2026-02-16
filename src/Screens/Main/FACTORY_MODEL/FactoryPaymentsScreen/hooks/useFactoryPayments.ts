import { useState, useMemo, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

export interface Transaction {
  id: string;
  patient: string;
  amount: number;
  date: string;
  status: 'Received' | 'Pending' | 'Withdrawn';
  type: 'in' | 'out';
  serviceType: 'Video' | 'Audio' | 'Chat' | 'Consultation';
}

export interface EarningsData {
  label: string;
  amount: number;
}

export interface PaymentMethodData {
  type: string;
  amount: number;
  color: string;
}

// Dummy data
const DUMMY_TRANSACTIONS: Transaction[] = [
  { id: '1', patient: 'Rajesh Kumar', amount: 1500, date: 'Today', status: 'Received', type: 'in', serviceType: 'Video' },
  { id: '2', patient: 'Priya Sharma', amount: 1200, date: 'Yesterday', status: 'Pending', type: 'in', serviceType: 'Audio' },
  { id: '3', patient: 'Amit Patel', amount: 2000, date: '2 days ago', status: 'Received', type: 'in', serviceType: 'Consultation' },
  { id: '4', patient: 'Sneha Reddy', amount: 800, date: '3 days ago', status: 'Received', type: 'in', serviceType: 'Chat' },
  { id: '5', patient: 'Bank Transfer', amount: 25000, date: '1 week ago', status: 'Withdrawn', type: 'out', serviceType: 'Consultation' },
];

const DUMMY_PAYMENT_METHODS: PaymentMethodData[] = [
  { type: 'Video Consultation', amount: 45000, color: '#00796B' },
  { type: 'Audio Call', amount: 32000, color: '#4DB6AC' },
  { type: 'Chat Consultation', amount: 28000, color: '#26A69A' },
  { type: 'In-Person', amount: 20000, color: '#00897B' },
];

const TOTAL_EARNINGS = 125000;
const AVAILABLE_BALANCE = 95000;
const PENDING_AMOUNT = 30000;
const WITHDRAWN_AMOUNT = 25000;

export const useFactoryPayments = () => {
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
    chartAnimation.value = withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 800 }));
  }, [selectedPeriod]);

  // Dynamic earnings data based on period
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

  // Calculate period totals
  const periodTotals = useMemo(() => {
    const total = earningsData.reduce((sum, d) => sum + d.amount, 0);
    const avg = total / earningsData.length;
    const max = Math.max(...earningsData.map((d) => d.amount));
    const min = Math.min(...earningsData.map((d) => d.amount));
    const growth = ((max - min) / min) * 100;
    return { total, avg, max, min, growth };
  }, [earningsData]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (selectedFilter === 'all') return DUMMY_TRANSACTIONS;
    return DUMMY_TRANSACTIONS.filter((tx) => tx.type === selectedFilter);
  }, [selectedFilter]);

  // Chart data
  const lineChartData = {
    labels: earningsData.map((d) => d.label),
    datasets: [
      {
        data: earningsData.map((d) => d.amount),
        color: () => '#130160',
        strokeWidth: 3,
      },
    ],
  };

  const barChartData = {
    labels: earningsData.map((d) => d.label),
    datasets: [
      {
        data: earningsData.map((d) => d.amount),
      },
    ],
  };

  // Responsive calculations
  const isSmallScreen = dimensions.width < 375;
  const isMediumScreen = dimensions.width >= 375 && dimensions.width < 414;
  const thisMonthEarnings = periodTotals.total;

  return {
    // Data
    totalEarnings: TOTAL_EARNINGS,
    availableBalance: AVAILABLE_BALANCE,
    pendingAmount: PENDING_AMOUNT,
    withdrawnAmount: WITHDRAWN_AMOUNT,
    thisMonthEarnings,
    paymentMethods: DUMMY_PAYMENT_METHODS,
    transactions: filteredTransactions,
    earningsData,
    periodTotals,

    // Charts
    lineChartData,
    barChartData,

    // Filters
    selectedPeriod,
    setSelectedPeriod,
    selectedFilter,
    setSelectedFilter,

    // Responsive
    dimensions,
    isSmallScreen,
    isMediumScreen,
    chartAnimation,
  };
};
