import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Calendar, Clock, User, ChevronRight } from 'lucide-react-native';

const DoctorAppointmentsScreen = () => {
  const { theme, shadows } = useTheme();

  const appointments = [
    { id: '1', patient: 'John Doe', time: '10:30 AM', date: 'Today', type: 'Video' },
    { id: '2', patient: 'Jane Smith', time: '11:45 AM', date: 'Today', type: 'Audio' },
    { id: '3', patient: 'Mike Johnson', time: '02:00 PM', date: 'Today', type: 'Chat' },
  ];

  return (
    <ScreenWrapper title="Scheduled Appointments" showBack={true}>
      <ScrollView contentContainerStyle={styles.container}>
        {appointments.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.appointmentCard, { backgroundColor: theme.surface, ...shadows }]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.patientInfo}>
                <View style={[styles.iconBg, { backgroundColor: theme.primary + '15' }]}>
                  <User size={moderateScale(20)} color={theme.primary} />
                </View>
                <View>
                  <Text style={[styles.patientName, { color: theme.text }]}>{item.patient}</Text>
                  <Text style={[styles.appointmentType, { color: theme.textSecondary }]}>{item.type} Consultation</Text>
                </View>
              </View>
              <ChevronRight size={moderateScale(20)} color={theme.textSecondary} />
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Calendar size={moderateScale(16)} color={theme.textSecondary} />
                <Text style={[styles.footerText, { color: theme.textSecondary }]}>{item.date}</Text>
              </View>
              <View style={styles.footerItem}>
                <Clock size={moderateScale(16)} color={theme.textSecondary} />
                <Text style={[styles.footerText, { color: theme.textSecondary }]}>{item.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
  },
  appointmentCard: {
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  iconBg: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  appointmentType: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: verticalScale(12),
  },
  cardFooter: {
    flexDirection: 'row',
    gap: moderateScale(20),
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  footerText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
});

export default DoctorAppointmentsScreen;
