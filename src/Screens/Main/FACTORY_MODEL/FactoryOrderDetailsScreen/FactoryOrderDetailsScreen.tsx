import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { useFactoryOrderDetails } from './hooks/useFactoryOrderDetails';
import { OrderStatusHeader } from './components/OrderStatusHeader';
import { OrderInfoSection } from './components/OrderInfoSection';
import { CustomerInfoSection } from './components/CustomerInfoSection';
import { CompanyInfoSection } from './components/CompanyInfoSection';
import { OrderItemsSection } from './components/OrderItemsSection';
import { PaymentInfoSection } from './components/PaymentInfoSection';
import { InvoiceSummarySection } from './components/InvoiceSummarySection';
import { LegalDocumentsSection } from './components/LegalDocumentsSection';
import { ActionButtons } from './components/ActionButtons';
import { ShareInvoiceModal } from './components/ShareInvoiceModal';
import { Toasts } from '@backpackapp-io/react-native-toast';

const FactoryOrderDetailsScreen = () => {
  const { theme } = useTheme();

  const {
    order,
    showShareModal,
    setShowShareModal,
    handleDownloadInvoice,
    handleShareInvoice,
    handleShareVia,
    handleCopyLink,
    handleOpenLink,
    getStatusColor,
    getInvoiceLink,
  } = useFactoryOrderDetails();

  return (
    <ScreenWrapper title="Factory Order Details" showBack={true} scrollable={false}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <OrderStatusHeader order={order} getStatusColor={getStatusColor} />

        <OrderInfoSection order={order} />

        <CustomerInfoSection order={order} />

        <CompanyInfoSection order={order} />

        <OrderItemsSection order={order} />

        <PaymentInfoSection order={order} getStatusColor={getStatusColor} />

        <InvoiceSummarySection order={order} />

        <LegalDocumentsSection order={order} />

        <ActionButtons onDownload={handleDownloadInvoice} onShare={handleShareInvoice} />
      </ScrollView>

      <ShareInvoiceModal
        visible={showShareModal}
        invoiceLink={getInvoiceLink()}
        onClose={() => setShowShareModal(false)}
        onShareVia={handleShareVia}
        onCopyLink={handleCopyLink}
        onOpenLink={handleOpenLink}
      />

      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(30),
  },
});

export default FactoryOrderDetailsScreen;
