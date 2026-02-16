import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Share2, Mail, Phone, Copy, ExternalLink, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
interface ShareInvoiceModalProps {
  visible: boolean;
  invoiceLink: string;
  onClose: () => void;
  onShareWhatsApp: () => void;
  onShareEmail: () => void;
  onShareSms: () => void;
  onCopyLink: () => void;
  onOpenLink: () => void;
  onShareMore: () => void;
}

export const ShareInvoiceModal = ({
  visible,
  invoiceLink,
  onClose,
  onShareWhatsApp,
  onShareEmail,
  onShareSms,
  onCopyLink,
  onOpenLink,
  onShareMore,
}: ShareInvoiceModalProps) => {
  const { theme, shadows } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={[styles.modalContent, { backgroundColor: theme.surface, ...shadows }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Share Invoice</Text>
            <TouchableOpacity
              onPress={onClose}
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
              onPress={onShareWhatsApp}
              activeOpacity={0.7}
            >
              <View style={[styles.shareOptionIcon, { backgroundColor: '#25D366' }]}>
                <Share2 size={moderateScale(24)} color="#fff" />
              </View>
              <Text style={[styles.shareOptionText, { color: theme.text }]}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
              onPress={onShareEmail}
              activeOpacity={0.7}
            >
              <View style={[styles.shareOptionIcon, { backgroundColor: theme.primary }]}>
                <Mail size={moderateScale(24)} color="#fff" />
              </View>
              <Text style={[styles.shareOptionText, { color: theme.text }]}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
              onPress={onShareSms}
              activeOpacity={0.7}
            >
              <View style={[styles.shareOptionIcon, { backgroundColor: '#34C759' }]}>
                <Phone size={moderateScale(24)} color="#fff" />
              </View>
              <Text style={[styles.shareOptionText, { color: theme.text }]}>SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
              onPress={onCopyLink}
              activeOpacity={0.7}
            >
              <View style={[styles.shareOptionIcon, { backgroundColor: '#007AFF' }]}>
                <Copy size={moderateScale(24)} color="#fff" />
              </View>
              <Text style={[styles.shareOptionText, { color: theme.text }]}>Copy Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
              onPress={onOpenLink}
              activeOpacity={0.7}
            >
              <View style={[styles.shareOptionIcon, { backgroundColor: '#5856D6' }]}>
                <ExternalLink size={moderateScale(24)} color="#fff" />
              </View>
              <Text style={[styles.shareOptionText, { color: theme.text }]}>Open Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
              onPress={onShareMore}
              activeOpacity={0.7}
            >
              <View style={[styles.shareOptionIcon, { backgroundColor: theme.textSecondary }]}>
                <Share2 size={moderateScale(24)} color="#fff" />
              </View>
              <Text style={[styles.shareOptionText, { color: theme.text }]}>More Options</Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={[styles.invoiceLinkContainer, { backgroundColor: theme.background }]}>
            <Text style={[styles.invoiceLinkLabel, { color: theme.textSecondary }]}>
              Invoice Link:
            </Text>
            <Text style={[styles.invoiceLinkText, { color: theme.primary }]} numberOfLines={1}>
              {invoiceLink}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  modalTitle: { fontSize: moderateScale(20), fontWeight: '800' },
  closeButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareOptionsScroll: { maxHeight: verticalScale(300), marginBottom: verticalScale(20) },
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
  shareOptionText: { fontSize: moderateScale(12), fontWeight: '700', textAlign: 'center' },
  invoiceLinkContainer: {
    marginTop: verticalScale(16),
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
  },
  invoiceLinkLabel: { fontSize: moderateScale(12), fontWeight: '600', marginBottom: verticalScale(6) },
  invoiceLinkText: { fontSize: moderateScale(11), fontWeight: '500' },
});
