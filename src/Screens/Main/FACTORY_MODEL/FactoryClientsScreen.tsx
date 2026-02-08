import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Building2, Search, ChevronRight, TrendingUp, ShoppingCart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Client {
  id: string;
  name: string;
  type: 'clinic' | 'hospital' | 'pharmacy';
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}

const FactoryClientsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');

  const clients: Client[] = [
    {
      id: '1',
      name: 'City Clinic Pharmacy',
      type: 'clinic',
      location: 'Sector 18, Noida',
      totalOrders: 45,
      totalSpent: 1250000,
      lastOrderDate: '2024-02-05',
      status: 'active',
    },
    {
      id: '2',
      name: 'Health Plus Hospital',
      type: 'hospital',
      location: 'Sector 20, Noida',
      totalOrders: 120,
      totalSpent: 3500000,
      lastOrderDate: '2024-02-06',
      status: 'active',
    },
    {
      id: '3',
      name: 'MediCare Distributors',
      type: 'pharmacy',
      location: 'Sector 63, Noida',
      totalOrders: 28,
      totalSpent: 850000,
      lastOrderDate: '2024-01-28',
      status: 'active',
    },
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenWrapper title="Factory Clients" showBack={true} scrollable={false}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: theme.surface, ...shadows }]}>
          <Search size={moderateScale(18)} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search clients..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Clients List */}
        <ScrollView
          contentContainerStyle={styles.clientsList}
          showsVerticalScrollIndicator={false}
        >
          {filteredClients.map((client, index) => (
            <Animated.View key={client.id} entering={FadeInDown.delay(index * 50)}>
              <TouchableOpacity
                style={[styles.clientCard, { backgroundColor: theme.surface, ...shadows }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('FactoryClientDetailsScreen', { clientId: client.id })}
              >
                <View style={styles.clientHeader}>
                  <View style={[styles.clientIcon, { backgroundColor: theme.primary + '20' }]}>
                    <Building2 size={moderateScale(24)} color={theme.primary} />
                  </View>
                  <View style={styles.clientInfo}>
                    <View style={styles.clientNameRow}>
                      <Text style={[styles.clientName, { color: theme.text }]}>{client.name}</Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: client.status === 'active' ? '#10B98120' : '#EF444420' }
                      ]}>
                        <Text style={[
                          styles.statusText,
                          { color: client.status === 'active' ? '#10B981' : '#EF4444' }
                        ]}>
                          {client.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.clientType, { color: theme.textSecondary }]}>
                      {client.type.charAt(0).toUpperCase() + client.type.slice(1)}
                    </Text>
                    <Text style={[styles.clientLocation, { color: theme.textSecondary }]}>
                      {client.location}
                    </Text>
                  </View>
                  <ChevronRight size={moderateScale(20)} color={theme.textSecondary} />
                </View>

                <View style={styles.clientStats}>
                  <View style={styles.statItem}>
                    <ShoppingCart size={moderateScale(16)} color={theme.primary} />
                    <View style={styles.statContent}>
                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Orders</Text>
                      <Text style={[styles.statValue, { color: theme.text }]}>
                        {client.totalOrders}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.statItem}>
                    <TrendingUp size={moderateScale(16)} color={theme.primary} />
                    <View style={styles.statContent}>
                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Spent</Text>
                      <Text style={[styles.statValue, { color: theme.text }]}>
                        ₹{(client.totalSpent / 100000).toFixed(1)}L
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.lastOrderRow}>
                  <Text style={[styles.lastOrderLabel, { color: theme.textSecondary }]}>Last Order:</Text>
                  <Text style={[styles.lastOrderDate, { color: theme.text }]}>
                    {client.lastOrderDate}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(16),
    height: verticalScale(48),
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
    marginBottom: moderateScale(12),
    gap: moderateScale(12),
    minHeight: verticalScale(48),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  clientsList: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(20),
  },
  clientCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
    minHeight: verticalScale(140),
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
    gap: moderateScale(12),
  },
  clientIcon: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientInfo: {
    flex: 1,
  },
  clientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(4),
  },
  clientName: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
  },
  statusText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  clientType: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  clientLocation: {
    fontSize: moderateScale(11),
    fontWeight: '500',
  },
  clientStats: {
    flexDirection: 'row',
    gap: moderateScale(16),
    marginBottom: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
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
  lastOrderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  lastOrderLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  lastOrderDate: {
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
});

export default FactoryClientsScreen;
