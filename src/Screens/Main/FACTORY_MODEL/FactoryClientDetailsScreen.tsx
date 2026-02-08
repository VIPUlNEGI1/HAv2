import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform, Linking } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { 
  Building2, Phone, Mail, MapPin, TrendingUp, ShoppingCart, FileText, 
  Share2, Download, ChevronRight, CheckCircle2, Clock, XCircle, Truck,
  Copy, ExternalLink, X, Receipt, CreditCard
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { shareInvoice, generateInvoiceLink, copyInvoiceLink, openInvoiceLink } from '@/utils/shareUtils';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  items: number;
  invoiceNumber?: string;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'cash' | 'card' | 'upi' | 'online';
  status: 'completed' | 'pending';
  invoiceNumber?: string;
}

interface Client {
  id: string;
  name: string;
  type: 'clinic' | 'hospital' | 'pharmacy';
  email?: string;
  phone?: string;
  address?: string;
  licenseNumber?: string;
  totalOrders: number;
  totalSpent: number;
  orders: Order[];
  payments: Payment[];
}

const FactoryClientDetailsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const clientId = route.params?.clientId;
  const [selectedTab, setSelectedTab] = useState<'overview' | 'orders' | 'payments'>('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  // Mock client data
  const client: Client = {
    id: clientId || '1',
    name: 'City Clinic Pharmacy',
    type: 'clinic',
    email: 'contact@cityclinic.com',
    phone: '+91 98765 43210',
    address: 'Sector 18, Noida, UP - 201301',
    licenseNumber: 'CL-2024-001',
    totalOrders: 45,
    totalSpent: 1250000,
    orders: [
      {
        id: '1',
        orderNumber: 'ORD-2024-001234',
        date: '2024-02-05',
        amount: 25000,
        status: 'completed',
        items: 500,
        invoiceNumber: 'INV-2024-001234',
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-001235',
        date: '2024-02-01',
        amount: 18000,
        status: 'shipped',
        items: 350,
        invoiceNumber: 'INV-2024-001235',
      },
      {
        id: '3',
        orderNumber: 'ORD-2024-001236',
        date: '2024-01-28',
        amount: 32000,
        status: 'processing',
        items: 750,
      },
    ],
    payments: [
      {
        id: '1',
        date: '2024-02-05',
        amount: 25000,
        method: 'online',
        status: 'completed',
        invoiceNumber: 'INV-2024-001234',
      },
      {
        id: '2',
        date: '2024-02-01',
        amount: 18000,
        method: 'card',
        status: 'completed',
        invoiceNumber: 'INV-2024-001235',
      },
      {
        id: '3',
        date: '2024-01-28',
        amount: 32000,
        method: 'upi',
        status: 'pending',
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'shipped': return '#3B82F6';
      case 'processing': return '#F59E0B';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return theme.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      case 'pending': return Clock;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const handleShareInvoice = async (invoiceNumber: string) => {
    setSelectedInvoice(invoiceNumber);
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      await shareInvoice({
        orderNumber: client.orders.find(o => o.invoiceNumber === invoiceNumber)?.orderNumber || '',
        invoiceNumber,
        customerName: client.name,
        totalAmount: client.orders.find(o => o.invoiceNumber === invoiceNumber)?.amount || 0,
        invoiceDate: client.orders.find(o => o.invoiceNumber === invoiceNumber)?.date || '',
        orderId: client.orders.find(o => o.invoiceNumber === invoiceNumber)?.id || '',
      });
    } else {
      setShowShareModal(true);
    }
  };

  const handleShareVia = async (method: 'whatsapp' | 'email' | 'sms' | 'more') => {
    if (!selectedInvoice) return;
    const order = client.orders.find(o => o.invoiceNumber === selectedInvoice);
    if (!order) return;

    const invoiceLink = generateInvoiceLink(order.id, selectedInvoice);
    const shareText = `Invoice ${selectedInvoice}\n\nOrder: ${order.orderNumber}\nClient: ${client.name}\nAmount: ₹${order.amount.toLocaleString()}\n\nView invoice: ${invoiceLink}`;

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
        const emailUrl = `mailto:?subject=Invoice ${selectedInvoice}&body=${encodeURIComponent(shareText)}`;
        await Linking.openURL(emailUrl);
      } else if (method === 'sms') {
        const smsUrl = `sms:?body=${encodeURIComponent(shareText)}`;
        await Linking.openURL(smsUrl);
      } else {
        await shareInvoice({
          orderNumber: order.orderNumber,
          invoiceNumber: selectedInvoice,
          customerName: client.name,
          totalAmount: order.amount,
          invoiceDate: order.date,
          orderId: order.id,
        });
      }
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share. Please try again.');
    }
  };

  return (
    <ScreenWrapper title="Client Details" showBack={true} scrollable={false}>
      <View style={styles.container}>
        {/* Client Info Header */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <LinearGradient
            colors={[theme.primary, theme.primary + 'CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.clientHeader, shadows]}
          >
            <View style={styles.clientHeaderContent}>
              <View style={[styles.clientIcon, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                <Building2 size={moderateScale(32)} color="#fff" />
              </View>
              <View style={styles.clientHeaderInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientType}>
                  {client.type.charAt(0).toUpperCase() + client.type.slice(1)}
                </Text>
              </View>
            </View>
            {client.licenseNumber && (
              <Text style={styles.licenseText}>License: {client.licenseNumber}</Text>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['overview', 'orders', 'payments'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                {
                  backgroundColor: selectedTab === tab ? theme.primary : 'transparent',
                  borderBottomColor: selectedTab === tab ? theme.primary : 'transparent',
                },
              ]}
              onPress={() => setSelectedTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: selectedTab === tab ? '#fff' : theme.textSecondary,
                    fontWeight: selectedTab === tab ? '800' : '600',
                  },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {selectedTab === 'overview' && (
            <>
              {/* Contact Info */}
              <Animated.View entering={FadeInDown.delay(200)}>
                <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Information</Text>
                  {client.phone && (
                    <View style={styles.contactRow}>
                      <Phone size={moderateScale(16)} color={theme.primary} />
                      <Text style={[styles.contactText, { color: theme.text }]}>{client.phone}</Text>
                    </View>
                  )}
                  {client.email && (
                    <View style={styles.contactRow}>
                      <Mail size={moderateScale(16)} color={theme.primary} />
                      <Text style={[styles.contactText, { color: theme.text }]}>{client.email}</Text>
                    </View>
                  )}
                  {client.address && (
                    <View style={styles.contactRow}>
                      <MapPin size={moderateScale(16)} color={theme.primary} />
                      <Text style={[styles.contactText, { color: theme.text }]}>{client.address}</Text>
                    </View>
                  )}
                </View>
              </Animated.View>

              {/* Stats */}
              <Animated.View entering={FadeInDown.delay(300)}>
                <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Statistics</Text>
                  <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                      <ShoppingCart size={moderateScale(24)} color={theme.primary} />
                      <Text style={[styles.statValue, { color: theme.text }]}>{client.totalOrders}</Text>
                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Orders</Text>
                    </View>
                    <View style={styles.statCard}>
                      <TrendingUp size={moderateScale(24)} color={theme.primary} />
                      <Text style={[styles.statValue, { color: theme.text }]}>
                        ₹{(client.totalSpent / 100000).toFixed(1)}L
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Spent</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>

              {/* Recent Orders */}
              <Animated.View entering={FadeInDown.delay(400)}>
                <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Orders</Text>
                    <TouchableOpacity onPress={() => setSelectedTab('orders')}>
                      <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  {client.orders.slice(0, 3).map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    const statusColor = getStatusColor(order.status);
                    return (
                      <TouchableOpacity
                        key={order.id}
                        style={styles.orderRow}
                        onPress={() => navigation.navigate('FactoryOrderDetailsScreen', { orderId: order.id })}
                      >
                        <View style={styles.orderRowLeft}>
                          <Text style={[styles.orderNumber, { color: theme.text }]}>{order.orderNumber}</Text>
                          <Text style={[styles.orderDate, { color: theme.textSecondary }]}>{order.date}</Text>
                        </View>
                        <View style={styles.orderRowRight}>
                          <Text style={[styles.orderAmount, { color: theme.text }]}>
                            ₹{order.amount.toLocaleString()}
                          </Text>
                          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                            <StatusIcon size={moderateScale(12)} color={statusColor} />
                            <Text style={[styles.statusText, { color: statusColor }]}>
                              {order.status}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>
            </>
          )}

          {selectedTab === 'orders' && (
            <>
              {client.orders.map((order, index) => {
                const StatusIcon = getStatusIcon(order.status);
                const statusColor = getStatusColor(order.status);
                return (
                  <Animated.View key={order.id} entering={FadeInDown.delay(index * 50)}>
                    <TouchableOpacity
                      style={[styles.orderCard, { backgroundColor: theme.surface, ...shadows }]}
                      onPress={() => navigation.navigate('FactoryOrderDetailsScreen', { orderId: order.id })}
                      activeOpacity={0.8}
                    >
                      <View style={styles.orderCardHeader}>
                        <View>
                          <Text style={[styles.orderCardNumber, { color: theme.text }]}>{order.orderNumber}</Text>
                          <Text style={[styles.orderCardDate, { color: theme.textSecondary }]}>{order.date}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                          <StatusIcon size={moderateScale(14)} color={statusColor} />
                          <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
                        </View>
                      </View>
                      <View style={styles.orderCardDetails}>
                        <View style={styles.orderDetailRow}>
                          <Text style={[styles.orderDetailLabel, { color: theme.textSecondary }]}>Items:</Text>
                          <Text style={[styles.orderDetailValue, { color: theme.text }]}>{order.items}</Text>
                        </View>
                        <View style={styles.orderDetailRow}>
                          <Text style={[styles.orderDetailLabel, { color: theme.textSecondary }]}>Amount:</Text>
                          <Text style={[styles.orderDetailValue, { color: theme.text }]}>
                            ₹{order.amount.toLocaleString()}
                          </Text>
                        </View>
                        {order.invoiceNumber && (
                          <View style={styles.invoiceRow}>
                            <FileText size={moderateScale(14)} color={theme.primary} />
                            <Text style={[styles.invoiceText, { color: theme.primary }]}>
                              {order.invoiceNumber}
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleShareInvoice(order.invoiceNumber!)}
                              style={styles.shareButton}
                            >
                              <Share2 size={moderateScale(14)} color={theme.primary} />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </>
          )}

          {selectedTab === 'payments' && (
            <>
              {client.payments.map((payment, index) => (
                <Animated.View key={payment.id} entering={FadeInDown.delay(index * 50)}>
                  <View style={[styles.paymentCard, { backgroundColor: theme.surface, ...shadows }]}>
                    <View style={styles.paymentHeader}>
                      <View style={[styles.paymentIcon, { backgroundColor: theme.primary + '20' }]}>
                        <CreditCard size={moderateScale(20)} color={theme.primary} />
                      </View>
                      <View style={styles.paymentInfo}>
                        <Text style={[styles.paymentAmount, { color: theme.text }]}>
                          ₹{payment.amount.toLocaleString()}
                        </Text>
                        <Text style={[styles.paymentDate, { color: theme.textSecondary }]}>{payment.date}</Text>
                      </View>
                      <View style={[
                        styles.paymentStatusBadge,
                        { backgroundColor: payment.status === 'completed' ? '#10B98120' : '#F59E0B20' }
                      ]}>
                        <Text style={[
                          styles.paymentStatusText,
                          { color: payment.status === 'completed' ? '#10B981' : '#F59E0B' }
                        ]}>
                          {payment.status}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.paymentDetails}>
                      <Text style={[styles.paymentMethod, { color: theme.textSecondary }]}>
                        {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)} Payment
                      </Text>
                      {payment.invoiceNumber && (
                        <TouchableOpacity
                          style={styles.invoiceLink}
                          onPress={() => handleShareInvoice(payment.invoiceNumber!)}
                        >
                          <Receipt size={moderateScale(14)} color={theme.primary} />
                          <Text style={[styles.invoiceLinkText, { color: theme.primary }]}>
                            Invoice {payment.invoiceNumber}
                          </Text>
                          <Share2 size={moderateScale(14)} color={theme.primary} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Animated.View>
              ))}
            </>
          )}
        </ScrollView>
      </View>

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
                onPress={async () => {
                  if (selectedInvoice) {
                    const order = client.orders.find(o => o.invoiceNumber === selectedInvoice);
                    if (order) {
                      await copyInvoiceLink(order.id, selectedInvoice);
                      setShowShareModal(false);
                    }
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.shareOptionIcon, { backgroundColor: '#007AFF' }]}>
                  <Copy size={moderateScale(24)} color="#fff" />
                </View>
                <Text style={[styles.shareOptionText, { color: theme.text }]}>Copy Link</Text>
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

            {selectedInvoice && (
              <View style={[styles.invoiceLinkContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.invoiceLinkLabel, { color: theme.textSecondary }]}>Invoice Link:</Text>
                <Text style={[styles.invoiceLinkText, { color: theme.primary }]} numberOfLines={1}>
                  {selectedInvoice ? generateInvoiceLink(
                    client.orders.find(o => o.invoiceNumber === selectedInvoice)?.id || '',
                    selectedInvoice
                  ) : ''}
                </Text>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>

      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  clientHeader: {
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    margin: moderateScale(16),
  },
  clientHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    gap: moderateScale(16),
  },
  clientIcon: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientHeaderInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: moderateScale(20),
    fontWeight: '900',
    color: '#fff',
    marginBottom: verticalScale(4),
  },
  clientType: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
  },
  licenseText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#fff',
    opacity: 0.8,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(16),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(12),
    gap: moderateScale(8),
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    minHeight: verticalScale(44),
  },
  tabText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    numberOfLines: 1,
  },
  scrollContent: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(30),
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  seeAll: {
    fontSize: moderateScale(13),
    fontWeight: '700',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    marginBottom: verticalScale(10),
  },
  contactText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: moderateScale(16),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  statValue: {
    fontSize: moderateScale(20),
    fontWeight: '900',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  orderRowLeft: {
    flex: 1,
  },
  orderNumber: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    marginBottom: verticalScale(2),
  },
  orderDate: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  orderRowRight: {
    alignItems: 'flex-end',
    gap: verticalScale(4),
  },
  orderAmount: {
    fontSize: moderateScale(14),
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
    gap: moderateScale(4),
  },
  statusText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  orderCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
    minHeight: verticalScale(140),
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  orderCardNumber: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    marginBottom: verticalScale(4),
  },
  orderCardDate: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  orderCardDetails: {
    gap: verticalScale(8),
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetailLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  orderDetailValue: {
    fontSize: moderateScale(13),
    fontWeight: '700',
  },
  invoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  invoiceText: {
    flex: 1,
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
  shareButton: {
    padding: moderateScale(4),
  },
  paymentCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
    minHeight: verticalScale(120),
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    gap: moderateScale(12),
  },
  paymentIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(2),
  },
  paymentDate: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  paymentStatusBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  paymentStatusText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  paymentDetails: {
    gap: verticalScale(6),
  },
  paymentMethod: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  invoiceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    marginTop: verticalScale(4),
  },
  invoiceLinkText: {
    flex: 1,
    fontSize: moderateScale(12),
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
    maxHeight: '80%',
    padding: moderateScale(20),
    paddingBottom: verticalScale(40),
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

export default FactoryClientDetailsScreen;
