import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { History, ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { FilterBar } from '@/Components/common';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { Transaction } from '../hooks/useFactoryPayments';

interface TransactionListProps {
  transactions: Transaction[];
  selectedFilter: 'all' | 'in' | 'out';
  onFilterChange: (filter: 'all' | 'in' | 'out') => void;
}

const TRANSACTION_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'in' },
  { label: 'Out', value: 'out' },
];

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, selectedFilter, onFilterChange }) => {
  const { theme, shadows } = useTheme();

  const handleFilterChange = (value: string) => {
    if (value === 'all' || value === 'in' || value === 'out') {
      onFilterChange(value);
    }
  };

  return (
    <Animated.View entering={FadeInUp.delay(700)}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Transaction History</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Recent payments</Text>
        </View>
        <View style={[styles.iconBg, { backgroundColor: theme.primary + '15' }]}>
          <History size={moderateScale(20)} color={theme.primary} />
        </View>
      </View>

      {/* Filter Buttons */}
      <FilterBar
        filters={TRANSACTION_FILTERS}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        style={styles.filterBar}
      />

      {/* Transactions List */}
      {transactions.map((tx, index) => (
        <Animated.View key={tx.id} entering={FadeInUp.delay(800 + index * 50)}>
          <TouchableOpacity style={[styles.card, { backgroundColor: theme.surface, ...shadows }]} activeOpacity={0.8}>
            <View style={styles.left}>
              <View
                style={[
                  styles.cardIconBg,
                  {
                    backgroundColor:
                      tx.type === 'in' ? (tx.status === 'Pending' ? '#F59E0B20' : '#10B98120') : '#EF444420',
                  },
                ]}
              >
                {tx.type === 'in' ? (
                  <ArrowUpRight size={moderateScale(20)} color={tx.status === 'Pending' ? '#F59E0B' : '#10B981'} />
                ) : (
                  <ArrowDownLeft size={moderateScale(20)} color="#EF4444" />
                )}
              </View>
              <View style={styles.info}>
                <Text style={[styles.patient, { color: theme.text }]} numberOfLines={1}>
                  {tx.patient}
                </Text>
                <View style={styles.meta}>
                  <Text style={[styles.date, { color: theme.textSecondary }]} numberOfLines={1}>
                    {tx.date}
                  </Text>
                  <View style={[styles.serviceBadge, { backgroundColor: theme.primary + '10' }]}>
                    <Text style={[styles.service, { color: theme.primary }]} numberOfLines={1}>
                      {tx.serviceType}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.right}>
              <Text
                style={[
                  styles.amount,
                  {
                    color: tx.type === 'in' ? (tx.status === 'Pending' ? '#F59E0B' : '#10B981') : '#EF4444',
                  },
                ]}
                numberOfLines={1}
              >
                {tx.type === 'in' ? '+' : '-'}₹{tx.amount.toLocaleString()}
              </Text>
              <View style={styles.statusContainer}>
                {tx.status === 'Received' ? (
                  <CheckCircle2 size={moderateScale(12)} color="#10B981" />
                ) : tx.status === 'Pending' ? (
                  <Clock size={moderateScale(12)} color="#F59E0B" />
                ) : (
                  <XCircle size={moderateScale(12)} color="#EF4444" />
                )}
                <Text
                  style={[
                    styles.status,
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
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(20),
  },
  iconBg: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(2),
  },
  subtitle: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  filterBar: {
    marginBottom: verticalScale(16),
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(18),
    borderRadius: moderateScale(18),
    marginBottom: verticalScale(12),
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: moderateScale(14),
    marginRight: moderateScale(12),
  },
  cardIconBg: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  patient: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: verticalScale(6),
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    flexWrap: 'wrap',
  },
  date: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  serviceBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
  },
  service: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  right: {
    alignItems: 'flex-end',
    minWidth: moderateScale(100),
  },
  amount: {
    fontSize: moderateScale(17),
    fontWeight: '800',
    marginBottom: verticalScale(6),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
  },
  status: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
});
