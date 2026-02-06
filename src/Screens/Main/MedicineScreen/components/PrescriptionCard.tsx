import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { useNavigation } from '@react-navigation/native';

export const PrescriptionCard = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('DoctorsScreen')}
      style={[styles.prescriptionCard, { backgroundColor: theme.accent }]}
    >
      <View style={styles.prescriptionIcon}>
        <FileText size={24} color={theme.primary} />
      </View>
      <View style={styles.prescriptionInfo}>
        <Text style={[styles.prescriptionTitle, { color: theme.text }]}>Order via Prescription</Text>
        <Text style={[styles.prescriptionSubtitle, { color: theme.textSecondary }]}>Upload image and we will add medicines</Text>
      </View>
      <ChevronRight size={20} color={theme.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  prescriptionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 20 },
  prescriptionIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  prescriptionInfo: { flex: 1, marginLeft: 16 },
  prescriptionTitle: { fontSize: 15, fontWeight: '800' },
  prescriptionSubtitle: { fontSize: 11, fontWeight: '500', marginTop: 2 },
});
