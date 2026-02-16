import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, scale, verticalScale } from '@/Helpers/Responsive';
import {
  Calendar,
  Clock,
  Building2,
  FileText,
  Download,
  Share2,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  Receipt,
  Truck,
  CreditCard,
} from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useClinicOrderDetails } from './hooks/useClinicOrderDetails';
import { ShareInvoiceModal } from './components/ShareInvoiceModal';

const ClinicOrderDetailsScreen = () => {
  const { theme, shadows } = useTheme();
  const route = useRoute<any>();
  const orderId = route.params?.orderId;
  const {
    order,
    showShareModal,
    setShowShareModal,
    getStatusColor,
    getStatusIcon,
    handleDownloadInvoice,
    handleShareInvoice,
    handleCopyLink,
    handleOpenLink,
    handleShareVia,
    generateInvoiceLink,
  } = useClinicOrderDetails(orderId);

  const StatusIcon = getStatusIcon(order.status);
  const statusColor = getStatusColor(order.status, theme);

  return (
    <ScreenWrapper title="Order Details" showBack={true} scrollable={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Status Header */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <LinearGradient
            colors={[statusColor, statusColor + 'CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.statusHeader, shadows]}
          >
            <View style={styles.paddongcard}> 
            <View style={styles.statusContent}>
              <View style={[styles.statusIconBg, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                <StatusIcon size={moderateScale(22)} color="#fff" />
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>Order {order.status.toUpperCase()}</Text>
                <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
              </View>
            </View>
            <View style={styles.headerBottom}>
              {order.type === 'bulk' && (
                <View style={styles.typeBadge}>
                  <Package size={moderateScale(14)} color="#fff" />
                  <Text style={styles.typeBadgeText}>BULK ORDER</Text>
                </View>
              )}
              {order.trackingNumber && (
                <View style={styles.trackingContainer}>
                  <Truck size={moderateScale(16)} color="#fff" />
                  <Text style={styles.trackingText}>Tracking: {order.trackingNumber}</Text>
                </View>
              )}
            </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Order Information */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Order Information</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Calendar size={moderateScale(16)} color={theme.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Order Date</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{order.date}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Clock size={moderateScale(16)} color={theme.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Order Time</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{order.time}</Text>
                </View>
              </View>
            </View>

            {order.estimatedDelivery && (
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Truck size={moderateScale(16)} color={theme.primary} />
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Estimated Delivery</Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>{order.estimatedDelivery}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Customer Information */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Customer Information</Text>
            
            <View style={styles.customerCard}>
              <View style={[styles.customerIcon, { backgroundColor: theme.primary + '20' }]}>
                <User size={moderateScale(24)} color={theme.primary} />
              </View>
              <View style={styles.customerDetails}>
                <Text style={[styles.customerName, { color: theme.text }]}>{order.customerName}</Text>
                {order.customerPhone && (
                  <View style={styles.contactRow}>
                    <Phone size={moderateScale(14)} color={theme.textSecondary} />
                    <Text style={[styles.contactText, { color: theme.textSecondary }]}>
                      {order.customerPhone}
                    </Text>
                  </View>
                )}
                {order.customerEmail && (
                  <View style={styles.contactRow}>
                    <Mail size={moderateScale(14)} color={theme.textSecondary} />
                    <Text style={[styles.contactText, { color: theme.textSecondary }]}>
                      {order.customerEmail}
                    </Text>
                  </View>
                )}
                {order.customerAddress && (
                  <View style={styles.contactRow}>
                    <MapPin size={moderateScale(14)} color={theme.textSecondary} />
                    <Text style={[styles.contactText, { color: theme.textSecondary }]} numberOfLines={2}>
                      {order.customerAddress}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Company Information */}
        {order.companyName && (
          <Animated.View entering={FadeInDown.delay(400)}>
            <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Company Information</Text>
              
              <View style={styles.companyCard}>
                <View style={[styles.companyIcon, { backgroundColor: theme.primary + '20' }]}>
                  <Building2 size={moderateScale(24)} color={theme.primary} />
                </View>
                <View style={styles.companyDetails}>
                  <Text style={[styles.companyName, { color: theme.text }]}>{order.companyName}</Text>
                  {order.companyLicense && (
                    <View style={styles.companyRow}>
                      <FileText size={moderateScale(14)} color={theme.textSecondary} />
                      <Text style={[styles.companyText, { color: theme.textSecondary }]}>
                        License: {order.companyLicense}
                      </Text>
                    </View>
                  )}
                  {order.companyAddress && (
                    <View style={styles.companyRow}>
                      <MapPin size={moderateScale(14)} color={theme.textSecondary} />
                      <Text style={[styles.companyText, { color: theme.textSecondary }]} numberOfLines={2}>
                        {order.companyAddress}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Order Items */}
        <Animated.View entering={FadeInDown.delay(500)}>
          <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Order Items</Text>
            
            {order.items.map((item, index) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.itemLeft}>
                  <View style={[styles.itemNumber, { backgroundColor: theme.primary + '20' }]}>
                    <Text style={[styles.itemNumberText, { color: theme.primary }]}>{index + 1}</Text>
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.itemBrand, { color: theme.textSecondary }]}>{item.brand}</Text>
                    <Text style={[styles.itemQuantity, { color: theme.textSecondary }]}>
                      Qty: {item.quantity} × ₹{item.price}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.itemTotal, { color: theme.text }]}>
                  ₹{item.total.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Payment Information */}
        <Animated.View entering={FadeInDown.delay(600)}>
          <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Payment Information</Text>
            
            <View style={styles.paymentCard}>
              <View style={[styles.paymentIcon, { backgroundColor: theme.primary + '20' }]}>
                <CreditCard size={moderateScale(24)} color={theme.primary} />
              </View>
              <View style={styles.paymentDetails}>
                <Text style={[styles.paymentMethod, { color: theme.text }]}>
                  {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)} Payment
                </Text>
                <Text style={[styles.paymentStatus, { color: statusColor }]}>
                  {order.status === 'completed' ? 'Paid' : order.status === 'pending' ? 'Pending' : 'Processing'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Invoice Summary */}
        <Animated.View entering={FadeInDown.delay(700)}>
          <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
            <View style={styles.invoiceHeader}>
              <View style={styles.invoiceTitleRow}>
                <Receipt size={moderateScale(20)} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: moderateScale(8) }]}>
                  Invoice Summary
                </Text>
              </View>
              {order.invoiceNumber && (
                <Text style={[styles.invoiceNumber, { color: theme.textSecondary }]}>
                  #{order.invoiceNumber}
                </Text>
              )}
            </View>

            <View style={styles.invoiceDetails}>
              <View style={styles.invoiceRow}>
                <Text style={[styles.invoiceLabel, { color: theme.textSecondary }]}>Subtotal:</Text>
                <Text style={[styles.invoiceValue, { color: theme.text }]}>
                  ₹{order.totalAmount.toLocaleString()}
                </Text>
              </View>
              {order.tax > 0 && (
                <View style={styles.invoiceRow}>
                  <Text style={[styles.invoiceLabel, { color: theme.textSecondary }]}>Tax (12%):</Text>
                  <Text style={[styles.invoiceValue, { color: theme.text }]}>
                    ₹{order.tax.toLocaleString()}
                  </Text>
                </View>
              )}
              {order.discount > 0 && (
                <View style={styles.invoiceRow}>
                  <Text style={[styles.invoiceLabel, { color: '#10B981' }]}>Discount:</Text>
                  <Text style={[styles.invoiceValue, { color: '#10B981' }]}>
                    -₹{order.discount.toLocaleString()}
                  </Text>
                </View>
              )}
              <View style={[styles.invoiceRow, styles.totalRow]}>
                <Text style={[styles.totalLabel, { color: theme.text }]}>Total Amount:</Text>
                <Text style={[styles.totalValue, { color: theme.primary }]}>
                  ₹{order.finalAmount.toLocaleString()}
                </Text>
              </View>
            </View>

            {order.invoiceDate && (
              <View style={styles.invoiceFooter}>
                <Text style={[styles.invoiceDate, { color: theme.textSecondary }]}>
                  Invoice Date: {order.invoiceDate}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Legal Documents */}
        <Animated.View entering={FadeInDown.delay(800)}>
          <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Legal Documents</Text>
            
            {order.legalDocuments && order.legalDocuments.length > 0 ? (
              order.legalDocuments.map((doc, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.documentCard, { backgroundColor: theme.primary + '10' }]}
                  activeOpacity={0.7}
                  onPress={() => toast.success(`Opening ${doc}...`)}
                >
                  <FileText size={moderateScale(20)} color={theme.primary} />
                  <Text style={[styles.documentName, { color: theme.text }]}>{doc}</Text>
                  <Download size={moderateScale(18)} color={theme.primary} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noDocumentsContainer}>
                <FileText size={moderateScale(32)} color={theme.textSecondary} opacity={0.5} />
                <Text style={[styles.noDocumentsText, { color: theme.textSecondary }]}>
                  No legal documents available
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(900)}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.downloadButton, { backgroundColor: theme.primary, ...shadows }]}
              onPress={handleDownloadInvoice}
              activeOpacity={0.8}
            >
              <Download size={moderateScale(20)} color="#fff" />
              <Text style={styles.actionButtonText}>Download Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton, { backgroundColor: theme.surface, borderColor: theme.primary, ...shadows }]}
              onPress={handleShareInvoice}
              activeOpacity={0.8}
            >
              <Share2 size={moderateScale(20)} color={theme.primary} />
              <Text style={[styles.shareButtonText, { color: theme.primary }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      <ShareInvoiceModal
        visible={showShareModal}
        invoiceLink={generateInvoiceLink(order.id, order.invoiceNumber || order.orderNumber)}
        onClose={() => setShowShareModal(false)}
        onShareWhatsApp={() => handleShareVia('whatsapp')}
        onShareEmail={() => handleShareVia('email')}
        onShareSms={() => handleShareVia('sms')}
        onCopyLink={handleCopyLink}
        onOpenLink={handleOpenLink}
        onShareMore={() => handleShareVia('more')}
      />

      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  paddongcard:{
    padding:scale(10)
  },
  scrollContent: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(30),
  },
  statusHeader: {
    borderRadius: moderateScale(10),
    // padding: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  statusIconBg: {
    width: moderateScale(54),
    height: moderateScale(54),
    borderRadius: moderateScale(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: moderateScale(20),
    fontWeight: '900',
    color: '#fff',
    marginBottom: verticalScale(4),
  },
  orderNumber: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
    alignSelf: 'flex-start',
  },
  trackingText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#fff',
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
    flexWrap: 'wrap',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(12),
    gap: moderateScale(6),
  },
  typeBadgeText: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  section: {
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(16),
  },
  infoRow: {
    flexDirection: 'row',
    gap: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  infoValue: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  customerCard: {
    flexDirection: 'row',
    gap: moderateScale(16),
  },
  customerIcon: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    marginBottom: verticalScale(6),
  },
  contactText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    flex: 1,
  },
  companyCard: {
    flexDirection: 'row',
    gap: moderateScale(16),
  },
  companyIcon: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    marginBottom: verticalScale(6),
  },
  companyText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: moderateScale(12),
  },
  itemNumber: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemNumberText: {
    fontSize: moderateScale(14),
    fontWeight: '800',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  itemBrand: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  itemQuantity: {
    fontSize: moderateScale(11),
    fontWeight: '500',
  },
  itemTotal: {
    fontSize: moderateScale(16),
    fontWeight: '800',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(16),
  },
  paymentIcon: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentMethod: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  paymentStatus: {
    fontSize: moderateScale(13),
    fontWeight: '700',
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  invoiceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invoiceNumber: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  invoiceDetails: {
    gap: verticalScale(10),
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  invoiceValue: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  totalRow: {
    marginTop: verticalScale(8),
    paddingTop: verticalScale(12),
    borderTopWidth: 2,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalLabel: {
    fontSize: moderateScale(18),
    fontWeight: '800',
  },
  totalValue: {
    fontSize: moderateScale(22),
    fontWeight: '900',
  },
  invoiceFooter: {
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  invoiceDate: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    textAlign: 'center',
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(8),
    gap: moderateScale(12),
  },
  documentName: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  noDocumentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(32),
  },
  noDocumentsText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    marginTop: verticalScale(8),
  },
  actionButtons: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginTop: verticalScale(8),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(16),
    gap: moderateScale(8),
  },
  downloadButton: {},
  shareButton: {
    borderWidth: 2,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  shareButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});

export default ClinicOrderDetailsScreen;
