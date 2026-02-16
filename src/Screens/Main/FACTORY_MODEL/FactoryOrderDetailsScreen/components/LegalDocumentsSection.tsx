import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, Download } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { toast } from '@backpackapp-io/react-native-toast';
import type { Order } from '../hooks/useFactoryOrderDetails';

interface LegalDocumentsSectionProps {
  order: Order;
}

export const LegalDocumentsSection: React.FC<LegalDocumentsSectionProps> = ({ order }) => {
  const { theme, shadows } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(800)}>
      <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
        <Text style={[styles.title, { color: theme.text }]}>Legal Documents</Text>

        {order.legalDocuments && order.legalDocuments.length > 0 ? (
          order.legalDocuments.map((doc, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: theme.primary + '10' }]}
              activeOpacity={0.7}
              onPress={() => toast.success(`Opening ${doc}...`)}
            >
              <FileText size={moderateScale(20)} color={theme.primary} />
              <Text style={[styles.name, { color: theme.text }]}>{doc}</Text>
              <Download size={moderateScale(18)} color={theme.primary} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <FileText size={moderateScale(32)} color={theme.textSecondary} opacity={0.5} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No legal documents available</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: {
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(16),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(8),
    gap: moderateScale(12),
  },
  name: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(32),
  },
  emptyText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    marginTop: verticalScale(8),
  },
});
