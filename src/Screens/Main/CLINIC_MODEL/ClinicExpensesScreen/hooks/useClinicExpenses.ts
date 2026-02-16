import { useState, useMemo, useEffect } from 'react';
import { Dimensions } from 'react-native';

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  type: 'in' | 'out';
  description: string;
}

const EXPENSES_DATA: Expense[] = [
  {
    id: '1',
    category: 'Medicine Purchase',
    amount: 25000,
    date: 'Today',
    status: 'Paid',
    type: 'out',
    description: 'Bulk order from factory',
  },
  {
    id: '2',
    category: 'Staff Salary',
    amount: 50000,
    date: 'Yesterday',
    status: 'Pending',
    type: 'out',
    description: 'Monthly salaries',
  },
  {
    id: '3',
    category: 'Rent',
    amount: 30000,
    date: '2 days ago',
    status: 'Paid',
    type: 'out',
    description: 'Clinic rent',
  },
  {
    id: '4',
    category: 'Utilities',
    amount: 5000,
    date: '3 days ago',
    status: 'Paid',
    type: 'out',
    description: 'Electricity & Water',
  },
  {
    id: '5',
    category: 'Equipment',
    amount: 15000,
    date: '1 week ago',
    status: 'Overdue',
    type: 'out',
    description: 'New equipment',
  },
];

export const useClinicExpenses = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in' | 'out'>('all');
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

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
    }
    if (selectedPeriod === 'month') {
      return [
        { label: 'W1', amount: 35000 },
        { label: 'W2', amount: 42000 },
        { label: 'W3', amount: 38000 },
        { label: 'W4', amount: 45000 },
      ];
    }
    return [
      { label: 'Jan', amount: 150000 },
      { label: 'Feb', amount: 180000 },
      { label: 'Mar', amount: 160000 },
      { label: 'Apr', amount: 200000 },
      { label: 'May', amount: 220000 },
      { label: 'Jun', amount: 210000 },
    ];
  }, [selectedPeriod]);

  const filteredExpenses = useMemo(() => {
    if (selectedFilter === 'all') return EXPENSES_DATA;
    return EXPENSES_DATA.filter((exp) => exp.type === selectedFilter);
  }, [selectedFilter]);

  const lineChartData = useMemo(
    () => ({
      labels: expensesData.map((d) => d.label),
      datasets: [
        {
          data: expensesData.map((d) => d.amount),
          color: () => '#00796B',
          strokeWidth: 3,
        },
      ],
    }),
    [expensesData]
  );

  const totalExpenses = 160000;
  const paidAmount = 120000;
  const pendingAmount = 40000;

  return {
    selectedPeriod,
    setSelectedPeriod,
    selectedFilter,
    setSelectedFilter,
    expensesData,
    filteredExpenses,
    lineChartData,
    dimensions,
    totalExpenses,
    paidAmount,
    pendingAmount,
  };
};
