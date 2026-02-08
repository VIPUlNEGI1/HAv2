import { Share, Platform, Linking } from 'react-native';
import { toast } from '@backpackapp-io/react-native-toast';

interface ShareInvoiceOptions {
  orderNumber: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  invoiceDate: string;
  orderId: string;
}

/**
 * Generate a shareable invoice link
 * In production, this would be a real backend URL
 */
export const generateInvoiceLink = (orderId: string, invoiceNumber: string): string => {
  // In production, replace with your actual backend URL
  const baseUrl = 'https://your-app.com/invoice'; // Replace with actual domain
  return `${baseUrl}/${orderId}?inv=${invoiceNumber}`;
};

/**
 * Generate invoice text content for sharing
 */
export const generateInvoiceText = (options: ShareInvoiceOptions): string => {
  const { orderNumber, invoiceNumber, customerName, totalAmount, invoiceDate } = options;
  
  return `Invoice Details

Order Number: ${orderNumber}
Invoice Number: ${invoiceNumber}
Customer: ${customerName}
Amount: ₹${totalAmount.toLocaleString()}
Date: ${invoiceDate}

View full invoice: ${generateInvoiceLink(options.orderId, invoiceNumber)}`;
};

/**
 * Share invoice via native share sheet
 */
export const shareInvoice = async (options: ShareInvoiceOptions): Promise<void> => {
  try {
    const invoiceLink = generateInvoiceLink(options.orderId, options.invoiceNumber);
    const invoiceText = generateInvoiceText(options);

    const shareOptions = {
      message: invoiceText,
      title: `Invoice ${options.invoiceNumber}`,
      url: invoiceLink, // iOS will use this, Android will include in message
    };

    const result = await Share.share(shareOptions, {
      dialogTitle: `Share Invoice ${options.invoiceNumber}`,
      subject: `Invoice ${options.invoiceNumber} - ${options.customerName}`, // iOS only
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared with activity type of result.activityType
        toast.success('Invoice shared successfully!');
      } else {
        // Shared
        toast.success('Invoice shared successfully!');
      }
    } else if (result.action === Share.dismissedAction) {
      // User dismissed the share sheet
      // Don't show error, user just cancelled
    }
  } catch (error: any) {
    console.error('Error sharing invoice:', error);
    toast.error('Failed to share invoice. Please try again.');
  }
};

/**
 * Copy invoice link to clipboard
 * Note: For native apps, you may want to install @react-native-clipboard/clipboard
 * For now, we use Share API which works on both platforms
 */
export const copyInvoiceLink = async (orderId: string, invoiceNumber: string): Promise<void> => {
  try {
    const invoiceLink = generateInvoiceLink(orderId, invoiceNumber);
    
    if (Platform.OS === 'web') {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(invoiceLink);
        toast.success('Invoice link copied to clipboard!');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = invoiceLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Invoice link copied to clipboard!');
      }
    } else {
      // For native, use Share API with copy-friendly message
      await Share.share({
        message: invoiceLink,
        title: 'Copy Invoice Link',
      });
      toast.success('Invoice link ready to copy!');
    }
  } catch (error: any) {
    console.error('Error copying invoice link:', error);
    toast.error('Failed to copy link. Please try again.');
  }
};

/**
 * Open invoice link in browser
 */
export const openInvoiceLink = async (orderId: string, invoiceNumber: string): Promise<void> => {
  try {
    const invoiceLink = generateInvoiceLink(orderId, invoiceNumber);
    const canOpen = await Linking.canOpenURL(invoiceLink);
    
    if (canOpen) {
      await Linking.openURL(invoiceLink);
    } else {
      toast.error('Cannot open invoice link. Invalid URL.');
    }
  } catch (error: any) {
    console.error('Error opening invoice link:', error);
    toast.error('Failed to open invoice link.');
  }
};
