import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Platform, Linking } from 'react-native';
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
  CheckCircle2, 
  XCircle,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  Receipt,
  Truck,
  CreditCard,
  Copy,
  ExternalLink,
  X,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { shareInvoice, generateInvoiceLink, copyInvoiceLink, openInvoiceLink } from '@/utils/shareUtils';

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: OrderItem[];
  totalAmount: number;
  tax: number;
  discount: number;
  finalAmount: number;
  date: string;
  time: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  type: 'regular' | 'bulk';
  paymentMethod: 'cash' | 'card' | 'upi' | 'online';
  companyName?: string;
  companyLicense?: string;
  companyAddress?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  legalDocuments?: string[];
  estimatedDelivery?: string;
  trackingNumber?: string;
}

const FactoryOrderDetailsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const orderId = route.params?.orderId;
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Mock order data - in real app, fetch from store/backend
  const mockOrders: Record<string, Order> = {
    '1': {
      id: '1',
      orderNumber: 'ORD-2024-001234',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+91 98765 43210',
      customerAddress: '123 Main Street, Sector 15, Noida, UP - 201301',
      items: [
        { id: '1', name: 'Paracetamol 500mg', brand: 'Dolo', quantity: 5, price: 25, total: 125 },
        { id: '2', name: 'Amoxicillin 250mg', brand: 'Cipla', quantity: 3, price: 45, total: 135 },
        { id: '3', name: 'Bandages', brand: 'Generic', quantity: 10, price: 20, total: 200 },
      ],
      totalAmount: 460,
      tax: 55.2,
      discount: 50,
      finalAmount: 465.2,
      date: '2024-02-07',
      time: '14:30',
      status: 'pending',
      type: 'regular',
      paymentMethod: 'card',
      companyName: 'City Clinic Pharmacy',
      companyLicense: 'CL-2024-001',
      companyAddress: '456 Medical Center, Sector 18, Noida, UP - 201301',
      invoiceNumber: 'INV-2024-001234',
      invoiceDate: '2024-02-07',
      legalDocuments: ['Purchase Order.pdf', 'Delivery Challan.pdf', 'Tax Invoice.pdf'],
      estimatedDelivery: '2024-02-10',
      trackingNumber: 'TRK-2024-001234',
    },
    '2': {
      id: '2',
      orderNumber: 'ORD-2024-001235',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      customerPhone: '+91 98765 43211',
      customerAddress: '456 Hospital Road, Sector 20, Noida, UP - 201301',
      items: [
        { id: '1', name: 'Insulin Glargine', brand: 'Lantus', quantity: 2, price: 850, total: 1700 },
        { id: '2', name: 'Metformin 500mg', brand: 'Glycomet', quantity: 10, price: 35, total: 350 },
        { id: '3', name: 'Glucometer Strips', brand: 'Accu-Chek', quantity: 50, price: 15, total: 750 },
        { id: '4', name: 'Syringes 1ml', brand: 'BD', quantity: 20, price: 8, total: 160 },
      ],
      totalAmount: 2960,
      tax: 355.2,
      discount: 200,
      finalAmount: 3115.2,
      date: '2024-02-06',
      time: '10:15',
      status: 'processing',
      type: 'bulk',
      paymentMethod: 'upi',
      companyName: 'MediCare Distributors',
      companyLicense: 'CL-2024-002',
      companyAddress: '789 Industrial Area, Sector 63, Noida, UP - 201301',
      invoiceNumber: 'INV-2024-001235',
      invoiceDate: '2024-02-06',
      legalDocuments: ['Bulk Order Agreement.pdf', 'GST Certificate.pdf', 'Delivery Challan.pdf', 'Tax Invoice.pdf'],
      estimatedDelivery: '2024-02-12',
      trackingNumber: 'TRK-2024-001235',
    },
    '3': {
      id: '3',
      orderNumber: 'ORD-2024-001236',
      customerName: 'ABC Hospital',
      customerEmail: 'procurement@abchospital.com',
      customerPhone: '+91 98765 43212',
      customerAddress: '789 Medical Complex, Sector 62, Noida, UP - 201301',
      items: [
        { id: '1', name: 'Surgical Gloves', brand: 'Ansell', quantity: 100, price: 12, total: 1200 },
        { id: '2', name: 'Surgical Masks', brand: '3M', quantity: 200, price: 8, total: 1600 },
        { id: '3', name: 'Disinfectant Solution', brand: 'Dettol', quantity: 50, price: 45, total: 2250 },
        { id: '4', name: 'IV Fluids', brand: 'Baxter', quantity: 30, price: 120, total: 3600 },
        { id: '5', name: 'Surgical Instruments Set', brand: 'Rudolf', quantity: 5, price: 2500, total: 12500 },
      ],
      totalAmount: 21150,
      tax: 2538,
      discount: 1000,
      finalAmount: 22688,
      date: '2024-02-05',
      time: '09:00',
      status: 'completed',
      type: 'bulk',
      paymentMethod: 'online',
      companyName: 'Healthcare Supplies Ltd.',
      companyLicense: 'CL-2024-003',
      companyAddress: '123 Business Park, Sector 65, Noida, UP - 201301',
      invoiceNumber: 'INV-2024-001236',
      invoiceDate: '2024-02-05',
      legalDocuments: ['Hospital Purchase Order.pdf', 'GST Certificate.pdf', 'Quality Certificate.pdf', 'Delivery Challan.pdf', 'Tax Invoice.pdf'],
      estimatedDelivery: '2024-02-08',
      trackingNumber: 'TRK-2024-001236',
    },
    '4': {
      id: '4',
      orderNumber: 'ORD-2024-001237',
      customerName: 'Mike Johnson',
      customerEmail: 'mike.johnson@example.com',
      customerPhone: '+91 98765 43213',
      customerAddress: '321 Residential Block, Sector 50, Noida, UP - 201301',
      items: [
        { id: '1', name: 'Cough Syrup', brand: 'Benadryl', quantity: 2, price: 150, total: 300 },
        { id: '2', name: 'Vitamin D3', brand: 'Calcirol', quantity: 1, price: 250, total: 250 },
      ],
      totalAmount: 550,
      tax: 66,
      discount: 0,
      finalAmount: 616,
      date: '2024-02-04',
      time: '16:45',
      status: 'completed',
      type: 'regular',
      paymentMethod: 'cash',
      companyName: 'City Clinic Pharmacy',
      companyLicense: 'CL-2024-001',
      companyAddress: '456 Medical Center, Sector 18, Noida, UP - 201301',
      invoiceNumber: 'INV-2024-001237',
      invoiceDate: '2024-02-04',
      legalDocuments: ['Tax Invoice.pdf'],
      estimatedDelivery: '2024-02-06',
      trackingNumber: 'TRK-2024-001237',
    },
  };

  const order = mockOrders[orderId || '1'] || mockOrders['1'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'processing': return '#3B82F6';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return theme.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'processing': return Clock;
      case 'pending': return Clock;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const handleDownloadInvoice = () => {
    toast.success('Downloading invoice...');
    // In production, implement actual PDF download
    // For now, we can generate a link or trigger download
  };

  const handleShareInvoice = async () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // Show native share sheet
      await shareInvoice({
        orderNumber: order.orderNumber,
        invoiceNumber: order.invoiceNumber || order.orderNumber,
        customerName: order.customerName,
        totalAmount: order.finalAmount,
        invoiceDate: order.invoiceDate || order.date,
        orderId: order.id,
      });
    } else {
      // For web or other platforms, show custom share modal
      setShowShareModal(true);
    }
  };

  const handleCopyLink = async () => {
    await copyInvoiceLink(order.id, order.invoiceNumber || order.orderNumber);
    setShowShareModal(false);
  };

  const handleOpenLink = async () => {
    await openInvoiceLink(order.id, order.invoiceNumber || order.orderNumber);
    setShowShareModal(false);
  };

  const handleShareVia = async (method: 'whatsapp' | 'email' | 'sms' | 'more') => {
    const invoiceLink = generateInvoiceLink(order.id, order.invoiceNumber || order.orderNumber);
    const shareText = `Invoice ${order.invoiceNumber || order.orderNumber}\n\nOrder: ${order.orderNumber}\nCustomer: ${order.customerName}\nAmount: ₹${order.finalAmount.toLocaleString()}\n\nView invoice: ${invoiceLink}`;

    try {
      if (method === 'whatsapp') {
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
        const canOpen = await Linking.canOpenURL(whatsappUrl);
        if (canOpen) {
          await Linking.openURL(whatsappUrl);
        } else {
          toast.error('WhatsApp is not installed');
        }
      } else if (method === 'email') {
        const emailUrl = `mailto:?subject=Invoice ${order.invoiceNumber || order.orderNumber}&body=${encodeURIComponent(shareText)}`;
        await Linking.openURL(emailUrl);
      } else if (method === 'sms') {
        const smsUrl = `sms:?body=${encodeURIComponent(shareText)}`;
        await Linking.openURL(smsUrl);
      } else {
        // Use native share for "more" options
        await shareInvoice({
          orderNumber: order.orderNumber,
          invoiceNumber: order.invoiceNumber || order.orderNumber,
          customerName: order.customerName,
          totalAmount: order.finalAmount,
          invoiceDate: order.invoiceDate || order.date,
          orderId: order.id,
        });
      }
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share. Please try again.');
    }
  };

  const StatusIcon = getStatusIcon(order.status);
  const statusColor = getStatusColor(order.status);

  return (
    <ScreenWrapper title="Factory Order Details" showBack={true} scrollable={false}>
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

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeInDown.delay(100)}
            style={[styles.modalContent, { backgroundColor: theme.surface, ...shadows }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Share Invoice</Text>
              <TouchableOpacity
                onPress={() => setShowShareModal(false)}
                style={[styles.closeButton, { backgroundColor: theme.background }]}
                activeOpacity={0.7}
              >
                <X size={moderateScale(20)} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.shareOptionsScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.shareOptionsContent}
            >
              <TouchableOpacity
                style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
                onPress={() => handleShareVia('whatsapp')}
                activeOpacity={0.7}
              >
                <View style={[styles.shareOptionIcon, { backgroundColor: '#25D366' }]}>
                  <Share2 size={moderateScale(24)} color="#fff" />
                </View>
                <Text style={[styles.shareOptionText, { color: theme.text }]}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
                onPress={() => handleShareVia('email')}
                activeOpacity={0.7}
              >
                <View style={[styles.shareOptionIcon, { backgroundColor: theme.primary }]}>
                  <Mail size={moderateScale(24)} color="#fff" />
                </View>
                <Text style={[styles.shareOptionText, { color: theme.text }]}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
                onPress={() => handleShareVia('sms')}
                activeOpacity={0.7}
              >
                <View style={[styles.shareOptionIcon, { backgroundColor: '#34C759' }]}>
                  <Phone size={moderateScale(24)} color="#fff" />
                </View>
                <Text style={[styles.shareOptionText, { color: theme.text }]}>SMS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
                onPress={handleCopyLink}
                activeOpacity={0.7}
              >
                <View style={[styles.shareOptionIcon, { backgroundColor: '#007AFF' }]}>
                  <Copy size={moderateScale(24)} color="#fff" />
                </View>
                <Text style={[styles.shareOptionText, { color: theme.text }]}>Copy Link</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
                onPress={handleOpenLink}
                activeOpacity={0.7}
              >
                <View style={[styles.shareOptionIcon, { backgroundColor: '#5856D6' }]}>
                  <ExternalLink size={moderateScale(24)} color="#fff" />
                </View>
                <Text style={[styles.shareOptionText, { color: theme.text }]}>Open Link</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
                onPress={() => handleShareVia('more')}
                activeOpacity={0.7}
              >
                <View style={[styles.shareOptionIcon, { backgroundColor: theme.textSecondary }]}>
                  <Share2 size={moderateScale(24)} color="#fff" />
                </View>
                <Text style={[styles.shareOptionText, { color: theme.text }]}>More Options</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={[styles.invoiceLinkContainer, { backgroundColor: theme.background }]}>
              <Text style={[styles.invoiceLinkLabel, { color: theme.textSecondary }]}>Invoice Link:</Text>
              <Text style={[styles.invoiceLinkText, { color: theme.primary }]} numberOfLines={1}>
                {generateInvoiceLink(order.id, order.invoiceNumber || order.orderNumber)}
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    padding: moderateScale(20),
    paddingBottom: verticalScale(40),
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '800',
  },
  closeButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareOptionsScroll: {
    maxHeight: verticalScale(300),
    marginBottom: verticalScale(20),
  },
  shareOptionsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(12),
    justifyContent: 'space-between',
  },
  shareOption: {
    width: '30%',
    minWidth: moderateScale(100),
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    gap: verticalScale(8),
  },
  shareOptionIcon: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareOptionText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    textAlign: 'center',
  },
  invoiceLinkContainer: {
    marginTop: verticalScale(16),
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
  },
  invoiceLinkLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: verticalScale(6),
  },
  invoiceLinkText: {
    fontSize: moderateScale(11),
    fontWeight: '500',
  },
});

export default FactoryOrderDetailsScreen;
