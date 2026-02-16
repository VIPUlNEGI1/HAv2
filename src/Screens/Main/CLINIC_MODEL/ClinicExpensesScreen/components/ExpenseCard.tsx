import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Activity, CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import type { Expense } from '../hooks/useClinicExpenses';

interface ExpenseCardProps {
  expense: Expense;
}

export const ExpenseCard = ({ expense }: ExpenseCardProps) => {
  const { theme, shadows } = useTheme();

  const StatusIcon =
    expense.status === 'Paid'
      ? CheckCircle2
      : expense.status === 'Pending'
        ? Clock
        : XCircle;
  const statusColor =
    expense.status === 'Paid'
      ? '#10B981'
      : expense.status === 'Pending'
        ? '#F59E0B'
        : '#EF4444';

  return (
    <View style={[styles.expenseCard, { backgroundColor: theme.surface, ...shadows }]}>
      <View style={styles.expenseLeft}>
        <View style={[styles.expenseIconBg, { backgroundColor: theme.primary + '20' }]}>
          <Activity size={moderateScale(20)} color={theme.primary} />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={[styles.expenseCategory, { color: theme.text }]}>{expense.category}</Text>
          <Text style={[styles.expenseDescription, { color: theme.textSecondary }]}>
            {expense.description}
          </Text>
          <Text style={[styles.expenseDate, { color: theme.textSecondary }]}>{expense.date}</Text>
        </View>
      </View>
      <View style={styles.expenseRight}>
        <Text style={[styles.expenseAmount, { color: '#EF4444' }]}>
          -₹{expense.amount.toLocaleString()}
        </Text>
        <View style={styles.expenseStatusContainer}>
          <StatusIcon size={moderateScale(12)} color={statusColor} />
          <Text style={[styles.expenseStatus, { color: statusColor }]}>{expense.status}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  expenseInfo: { flex: 1 },
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
  expenseDate: { fontSize: moderateScale(11), fontWeight: '500' },
  expenseRight: { alignItems: 'flex-end' },
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
  expenseStatus: { fontSize: moderateScale(11), fontWeight: '700' },
});
