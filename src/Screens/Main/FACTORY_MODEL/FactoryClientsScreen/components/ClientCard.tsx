import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Building2, ChevronRight, ShoppingCart, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { StatusBadge } from '@/Components/common';
import type { Client } from '../hooks/useFactoryClients';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ClientCardProps {
  client: Client;
  onPress: () => void;
  index?: number;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onPress, index = 0 }) => {
  const { theme, shadows } = useTheme();

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `₹${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.surface, ...shadows }]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
            <Building2 size={moderateScale(24)} color={theme.primary} />
          </View>
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                {client.name}
              </Text>
              <StatusBadge status={client.status} variant={client.status === 'active' ? 'active' : 'inactive'} />
            </View>
            <Text style={[styles.type, { color: theme.textSecondary }]}>
              {client.type.charAt(0).toUpperCase() + client.type.slice(1)}
            </Text>
            <Text style={[styles.location, { color: theme.textSecondary }]} numberOfLines={1}>
              {client.location}
            </Text>
          </View>
          <ChevronRight size={moderateScale(20)} color={theme.textSecondary} />
        </View>

        <View style={[styles.stats, { borderTopColor: theme.border }]}>
          <View style={styles.statItem}>
            <ShoppingCart size={moderateScale(16)} color={theme.primary} />
            <View style={styles.statContent}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Orders</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{client.totalOrders}</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <TrendingUp size={moderateScale(16)} color={theme.primary} />
            <View style={styles.statContent}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Spent</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{formatAmount(client.totalSpent)}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <Text style={[styles.footerLabel, { color: theme.textSecondary }]}>Last Order:</Text>
          <Text style={[styles.footerDate, { color: theme.text }]}>{client.lastOrderDate}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
    minHeight: verticalScale(140),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
    gap: moderateScale(12),
  },
  iconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(4),
    gap: moderateScale(8),
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    flex: 1,
  },
  type: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  location: {
    fontSize: moderateScale(11),
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    gap: moderateScale(16),
    marginBottom: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    flex: 1,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  statValue: {
    fontSize: moderateScale(14),
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
  },
  footerLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  footerDate: {
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
});
