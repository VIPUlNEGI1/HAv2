import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { useFactoryClientDetails } from './hooks/useFactoryClientDetails';
import { ClientHeader } from './components/ClientHeader';
import { TabBar } from './components/TabBar';
import { OverviewTab } from './components/OverviewTab';
import { OrdersTab } from './components/OrdersTab';
import { PaymentsTab } from './components/PaymentsTab';
import { ShareInvoiceModal } from './components/ShareInvoiceModal';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { useNavigation } from '@react-navigation/native';

const FactoryClientDetailsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const {
    client,
    selectedTab,
    showShareModal,
    selectedInvoice,
    setSelectedTab,
    setShowShareModal,
    handleShareInvoice,
    handleShareVia,
    handleCopyLink,
    getStatusColor,
    getInvoiceLink,
  } = useFactoryClientDetails();

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('FactoryOrderDetailsScreen', { orderId });
  };

  return (
    <ScreenWrapper title="Client Details" showBack={true} scrollable={false}>
      <View style={styles.container}>
        <ClientHeader client={client} />

        <TabBar selectedTab={selectedTab} onTabChange={setSelectedTab} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {selectedTab === 'overview' && (
            <OverviewTab
              client={client}
              getStatusColor={getStatusColor}
              onSeeAllOrders={() => setSelectedTab('orders')}
              onOrderPress={handleOrderPress}
            />
          )}

          {selectedTab === 'orders' && (
            <OrdersTab
              orders={client.orders}
              getStatusColor={getStatusColor}
              onOrderPress={handleOrderPress}
              onShareInvoice={handleShareInvoice}
            />
          )}

          {selectedTab === 'payments' && (
            <PaymentsTab payments={client.payments} onShareInvoice={handleShareInvoice} />
          )}
        </ScrollView>
      </View>

      <ShareInvoiceModal
        visible={showShareModal}
        invoiceLink={getInvoiceLink()}
        onClose={() => setShowShareModal(false)}
        onShareVia={handleShareVia}
        onCopyLink={handleCopyLink}
      />

      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(30),
  },
});

export default FactoryClientDetailsScreen;
