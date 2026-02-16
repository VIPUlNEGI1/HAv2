import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { FileText, Download, Trash2 } from 'lucide-react-native';
import type { License } from '../hooks/useClinicLicenses';

interface LicenseCardProps {
  license: License;
  onDelete: () => void;
}

export const LicenseCard = ({ license, onDelete }: LicenseCardProps) => {
  const { theme, shadows } = useTheme();

  return (
    <View style={[styles.licenseCard, { backgroundColor: theme.surface, ...shadows }]}>
      <View style={styles.licenseHeader}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
          <FileText size={moderateScale(24)} color={theme.primary} />
        </View>
        <View style={styles.licenseInfo}>
          <Text style={[styles.licenseName, { color: theme.text }]}>{license.name}</Text>
          <Text style={[styles.licenseNumber, { color: theme.textSecondary }]}>
            {license.number}
          </Text>
          <Text style={[styles.expiryDate, { color: theme.textSecondary }]}>
            Expires: {license.expiryDate}
          </Text>
        </View>
      </View>
      <View style={styles.licenseActions}>
        {license.document && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
            activeOpacity={0.7}
          >
            <Download size={moderateScale(16)} color={theme.primary} />
            <Text style={[styles.actionText, { color: theme.primary }]}>View</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#EF444420' }]}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Trash2 size={moderateScale(16)} color="#EF4444" />
          <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  licenseCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
  },
  licenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  iconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  licenseInfo: { flex: 1 },
  licenseName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  licenseNumber: { fontSize: moderateScale(14), fontWeight: '600', marginBottom: verticalScale(2) },
  expiryDate: { fontSize: moderateScale(12), fontWeight: '500' },
  licenseActions: { flexDirection: 'row', gap: moderateScale(12) },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    gap: moderateScale(6),
  },
  actionText: { fontSize: moderateScale(13), fontWeight: '700' },
});
