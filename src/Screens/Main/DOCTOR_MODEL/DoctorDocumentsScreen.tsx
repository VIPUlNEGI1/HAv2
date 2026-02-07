import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { FileText, Download, Eye, User } from 'lucide-react-native';

const DoctorDocumentsScreen = () => {
  const { theme, shadows } = useTheme();

  const documents = [
    { id: '1', patient: 'John Doe', name: 'Blood Report.pdf', date: 'Feb 5, 2026', size: '1.2 MB' },
    { id: '2', patient: 'Jane Smith', name: 'X-Ray Chest.jpg', date: 'Feb 4, 2026', size: '2.5 MB' },
    { id: '3', patient: 'Mike Johnson', name: 'Prescription_Old.pdf', date: 'Jan 28, 2026', size: '0.5 MB' },
  ];

  return (
    <ScreenWrapper title="Patient Documents" showBack={true}>
      <ScrollView contentContainerStyle={styles.container}>
        {documents.map((doc) => (
          <View 
            key={doc.id} 
            style={[styles.docCard, { backgroundColor: theme.surface, ...shadows }]}
          >
            <View style={styles.docHeader}>
              <View style={[styles.docIconBg, { backgroundColor: theme.primary + '10' }]}>
                <FileText size={moderateScale(24)} color={theme.primary} />
              </View>
              <View style={styles.docInfo}>
                <Text style={[styles.docName, { color: theme.text }]} numberOfLines={1}>{doc.name}</Text>
                <View style={styles.patientRow}>
                  <User size={moderateScale(12)} color={theme.textSecondary} />
                  <Text style={[styles.patientName, { color: theme.textSecondary }]}>{doc.patient}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.docFooter}>
              <View>
                <Text style={[styles.docMeta, { color: theme.textSecondary }]}>{doc.date} • {doc.size}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Eye size={moderateScale(20)} color={theme.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Download size={moderateScale(20)} color={theme.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
  },
  docCard: {
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(16),
  },
  docIconBg: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  patientName: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: verticalScale(12),
  },
  docFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docMeta: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: moderateScale(16),
  },
  actionBtn: {
    padding: moderateScale(4),
  },
});

export default DoctorDocumentsScreen;
