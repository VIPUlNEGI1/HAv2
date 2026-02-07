import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { CreditCard, TrendingUp, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react-native';

const DoctorPaymentsScreen = () => {
  const { theme, shadows } = useTheme();

  const transactions = [
    { id: '1', patient: 'John Doe', amount: '₹500', date: 'Today, 10:30 AM', status: 'Received', type: 'in' },
    { id: '2', patient: 'Jane Smith', amount: '₹750', date: 'Yesterday', status: 'Received', type: 'in' },
    { id: '3', patient: 'Bank Transfer', amount: '₹5000', date: 'Feb 3, 2026', status: 'Withdrawn', type: 'out' },
  ];

  return (
    <ScreenWrapper title="Payments & Earnings" showBack={true}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.primary, ...shadows }]}>
          <View>
            <Text style={styles.balanceLabel}>Total Earnings</Text>
            <Text style={styles.balanceAmount}>₹45,250</Text>
          </View>
          <View style={styles.balanceIconBg}>
            <TrendingUp size={moderateScale(32)} color="#fff" opacity={0.5} />
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.miniStat, { backgroundColor: theme.surface, ...shadows }]}>
            <Text style={[styles.miniStatLabel, { color: theme.textSecondary }]}>This Month</Text>
            <Text style={[styles.miniStatValue, { color: theme.text }]}>₹12,400</Text>
          </View>
          <View style={[styles.miniStat, { backgroundColor: theme.surface, ...shadows }]}>
            <Text style={[styles.miniStatLabel, { color: theme.textSecondary }]}>Pending</Text>
            <Text style={[styles.miniStatValue, { color: theme.text }]}>₹1,500</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Transaction History</Text>
          <History size={moderateScale(20)} color={theme.textSecondary} />
        </View>

        {transactions.map((tx) => (
          <View 
            key={tx.id} 
            style={[styles.txCard, { backgroundColor: theme.surface, ...shadows }]}
          >
            <View style={styles.txLeft}>
              <View style={[styles.txIconBg, { backgroundColor: tx.type === 'in' ? '#10B98115' : '#EF444415' }]}>
                {tx.type === 'in' ? (
                  <ArrowDownLeft size={moderateScale(20)} color="#10B981" />
                ) : (
                  <ArrowUpRight size={moderateScale(20)} color="#EF4444" />
                )}
              </View>
              <View>
                <Text style={[styles.txPatient, { color: theme.text }]}>{tx.patient}</Text>
                <Text style={[styles.txDate, { color: theme.textSecondary }]}>{tx.date}</Text>
              </View>
            </View>
            <View style={styles.txRight}>
              <Text style={[styles.txAmount, { color: tx.type === 'in' ? '#10B981' : '#EF4444' }]}>
                {tx.type === 'in' ? '+' : '-'}{tx.amount}
              </Text>
              <Text style={[styles.txStatus, { color: theme.textSecondary }]}>{tx.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
  },
  balanceCard: {
    borderRadius: moderateScale(24),
    padding: moderateScale(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  balanceLabel: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '600',
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: moderateScale(32),
    fontWeight: '900',
    marginTop: verticalScale(4),
  },
  balanceIconBg: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: moderateScale(16),
    marginBottom: verticalScale(24),
  },
  miniStat: {
    flex: 1,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
  },
  miniStatLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  miniStatValue: {
    fontSize: moderateScale(18),
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
  },
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  txIconBg: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txPatient: {
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
  txDate: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: moderateScale(16),
    fontWeight: '800',
  },
  txStatus: {
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
});

export default DoctorPaymentsScreen;
