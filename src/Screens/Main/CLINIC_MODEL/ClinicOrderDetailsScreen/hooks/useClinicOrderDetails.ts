import { useState } from 'react';
import { Platform, Linking } from 'react-native';
import { toast } from '@backpackapp-io/react-native-toast';
import {
  shareInvoice,
  generateInvoiceLink,
  copyInvoiceLink,
  openInvoiceLink,
} from '@/utils/shareUtils';
import type { LucideIcon } from 'lucide-react-native';
import { CheckCircle2, Clock, XCircle } from 'lucide-react-native';

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

const MOCK_ORDERS: Record<string, Order> = {
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
    legalDocuments: [
      'Bulk Order Agreement.pdf',
      'GST Certificate.pdf',
      'Delivery Challan.pdf',
      'Tax Invoice.pdf',
    ],
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
      {
        id: '5',
        name: 'Surgical Instruments Set',
        brand: 'Rudolf',
        quantity: 5,
        price: 2500,
        total: 12500,
      },
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
    legalDocuments: [
      'Hospital Purchase Order.pdf',
      'GST Certificate.pdf',
      'Quality Certificate.pdf',
      'Delivery Challan.pdf',
      'Tax Invoice.pdf',
    ],
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

export const useClinicOrderDetails = (orderId: string | undefined) => {
  const [showShareModal, setShowShareModal] = useState(false);

  const order = MOCK_ORDERS[orderId || '1'] || MOCK_ORDERS['1'];

  const getStatusColor = (status: string, theme: { textSecondary: string }): string => {
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
        return theme.textSecondary;
    }
  };

  const getStatusIcon = (status: string): LucideIcon => {
    switch (status) {
      case 'completed':
        return CheckCircle2;
      case 'processing':
        return Clock;
      case 'pending':
        return Clock;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const handleDownloadInvoice = () => {
    toast.success('Downloading invoice...');
  };

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

  const handleCopyLink = async () => {
    await copyInvoiceLink(order.id, order.invoiceNumber || order.orderNumber);
    setShowShareModal(false);
  };

  const handleOpenLink = async () => {
    await openInvoiceLink(order.id, order.invoiceNumber || order.orderNumber);
    setShowShareModal(false);
  };

  const handleShareVia = async (method: 'whatsapp' | 'email' | 'sms' | 'more') => {
    const invoiceLink = generateInvoiceLink(
      order.id,
      order.invoiceNumber || order.orderNumber
    );
    const shareText = `Invoice ${order.invoiceNumber || order.orderNumber}\n\nOrder: ${order.orderNumber}\nCustomer: ${order.customerName}\nAmount: ₹${order.finalAmount.toLocaleString()}\n\nView invoice: ${invoiceLink}`;
    try {
      if (method === 'whatsapp') {
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
        const canOpen = await Linking.canOpenURL(whatsappUrl);
        if (canOpen) await Linking.openURL(whatsappUrl);
        else toast.error('WhatsApp is not installed');
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

  return {
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
  };
};
