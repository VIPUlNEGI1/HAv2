import { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Platform, Linking } from 'react-native';
import { toast } from '@backpackapp-io/react-native-toast';
import { shareInvoice, generateInvoiceLink, copyInvoiceLink } from '@/utils/shareUtils';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  items: number;
  invoiceNumber?: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'cash' | 'card' | 'upi' | 'online';
  status: 'completed' | 'pending';
  invoiceNumber?: string;
}

export interface Client {
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

// Dummy data
const DUMMY_CLIENT: Client = {
  id: '1',
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

export const useFactoryClientDetails = () => {
  const route = useRoute<any>();
  const clientId = route.params?.clientId;

  const [client] = useState<Client>({ ...DUMMY_CLIENT, id: clientId || '1' });
  const [selectedTab, setSelectedTab] = useState<'overview' | 'orders' | 'payments'>('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'shipped':
        return '#3B82F6';
      case 'processing':
        return '#F59E0B';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  // Share invoice handler
  const handleShareInvoice = async (invoiceNumber: string) => {
    setSelectedInvoice(invoiceNumber);
    const order = client.orders.find((o) => o.invoiceNumber === invoiceNumber);
    if (!order) return;

    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      await shareInvoice({
        orderNumber: order.orderNumber,
        invoiceNumber,
        customerName: client.name,
        totalAmount: order.amount,
        invoiceDate: order.date,
        orderId: order.id,
      });
    } else {
      setShowShareModal(true);
    }
  };

  // Share via specific method
  const handleShareVia = async (method: 'whatsapp' | 'email' | 'sms' | 'more') => {
    if (!selectedInvoice) return;
    const order = client.orders.find((o) => o.invoiceNumber === selectedInvoice);
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

  // Copy invoice link
  const handleCopyLink = async () => {
    if (!selectedInvoice) return;
    const order = client.orders.find((o) => o.invoiceNumber === selectedInvoice);
    if (order) {
      await copyInvoiceLink(order.id, selectedInvoice);
      setShowShareModal(false);
    }
  };

  // Get invoice link
  const getInvoiceLink = () => {
    if (!selectedInvoice) return '';
    const order = client.orders.find((o) => o.invoiceNumber === selectedInvoice);
    return order ? generateInvoiceLink(order.id, selectedInvoice) : '';
  };

  return {
    // Data
    client,
    selectedTab,
    showShareModal,
    selectedInvoice,

    // Actions
    setSelectedTab,
    setShowShareModal,
    handleShareInvoice,
    handleShareVia,
    handleCopyLink,

    // Helpers
    getStatusColor,
    getInvoiceLink,
  };
};
