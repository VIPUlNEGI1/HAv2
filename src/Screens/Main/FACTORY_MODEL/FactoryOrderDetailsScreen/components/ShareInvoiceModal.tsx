import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Share2, Mail, Phone, Copy, ExternalLink, X } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ShareInvoiceModalProps {
  visible: boolean;
  invoiceLink: string;
  onClose: () => void;
  onShareVia: (method: 'whatsapp' | 'email' | 'sms' | 'more') => void;
  onCopyLink: () => void;
  onOpenLink: () => void;
}

export const ShareInvoiceModal: React.FC<ShareInvoiceModalProps> = ({
  visible,
  invoiceLink,
  onClose,
  onShareVia,
  onCopyLink,
  onOpenLink,
}) => {
  const { theme, shadows } = useTheme();

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View entering={FadeInDown.delay(100)} style={[styles.content, { backgroundColor: theme.surface, ...shadows }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Share Invoice</Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: theme.background }]}
              activeOpacity={0.7}
            >
              <X size={moderateScale(20)} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity
              style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
              onPress={() => onShareVia('whatsapp')}
              activeOpacity={0.7}
            >
              <View style={[styles.shareOptionIcon, { backgroundColor: '#25D366' }]}>
                <Share2 size={moderateScale(24)} color="#fff" />
              </View>
              <Text style={[styles.shareOptionText, { color: theme.text }]}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
              onPress={() => onShareVia('email')}
              activeOpacity={0.7}
            >
              <View style={[styles.shareOptionIcon, { backgroundColor: theme.primary }]}>
                <Mail size={moderateScale(24)} color="#fff" />
              </View>
              <Text style={[styles.shareOptionText, { color: theme.text }]}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shareOption, { backgroundColor: theme.primary + '10' }]}
              onPress={() => onShareVia('sms')}
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
              onPress={() => onShareVia('more')}
              activeOpacity={0.7}
            >
              <View style={[styles.shareOptionIcon, { backgroundColor: theme.textSecondary }]}>
                <Share2 size={moderateScale(24)} color="#fff" />
              </View>
              <Text style={[styles.shareOptionText, { color: theme.text }]}>More Options</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={[styles.linkContainer, { backgroundColor: theme.background }]}>
            <Text style={[styles.linkLabel, { color: theme.textSecondary }]}>Invoice Link:</Text>
            <Text style={[styles.linkText, { color: theme.primary }]} numberOfLines={1}>
              {invoiceLink}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    padding: moderateScale(20),
    paddingBottom: verticalScale(40),
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  title: {
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
  scroll: {
    maxHeight: verticalScale(300),
    marginBottom: verticalScale(20),
  },
  scrollContent: {
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
  linkContainer: {
    marginTop: verticalScale(16),
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
  },
  linkLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: verticalScale(6),
  },
  linkText: {
    fontSize: moderateScale(11),
    fontWeight: '500',
  },
});
