import { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Platform, Linking } from 'react-native';
import { toast } from '@backpackapp-io/react-native-toast';
import { shareInvoice, generateInvoiceLink, copyInvoiceLink, openInvoiceLink } from '@/utils/shareUtils';

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
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

// Dummy data
const DUMMY_ORDERS: Record<string, Order> = {
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
};

export const useFactoryOrderDetails = () => {
  const route = useRoute<any>();
  const orderId = route.params?.orderId;

  const [showShareModal, setShowShareModal] = useState(false);

  const order = DUMMY_ORDERS[orderId || '1'] || DUMMY_ORDERS['1'];

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'processing':
        return '#3B82F6';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  // Download invoice
  const handleDownloadInvoice = () => {
    toast.success('Downloading invoice...');
    // In production, implement actual PDF download
  };

  // Share invoice
  const handleShareInvoice = async () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      await shareInvoice({
        orderNumber: order.orderNumber,
        invoiceNumber: order.invoiceNumber || order.orderNumber,
        customerName: order.customerName,
        totalAmount: order.finalAmount,
        invoiceDate: order.invoiceDate || order.date,
        orderId: order.id,
      });
    } else {
      setShowShareModal(true);
    }
  };

  // Share via specific method
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

  // Copy link
  const handleCopyLink = async () => {
    await copyInvoiceLink(order.id, order.invoiceNumber || order.orderNumber);
    setShowShareModal(false);
  };

  // Open link
  const handleOpenLink = async () => {
    await openInvoiceLink(order.id, order.invoiceNumber || order.orderNumber);
    setShowShareModal(false);
  };

  // Get invoice link
  const getInvoiceLink = () => {
    return generateInvoiceLink(order.id, order.invoiceNumber || order.orderNumber);
  };

  return {
    // Data
    order,
    showShareModal,

    // Actions
    setShowShareModal,
    handleDownloadInvoice,
    handleShareInvoice,
    handleShareVia,
    handleCopyLink,
    handleOpenLink,

    // Helpers
    getStatusColor,
    getInvoiceLink,
  };
};
