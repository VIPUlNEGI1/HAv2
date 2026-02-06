import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { useAppointmentStore } from '@/hooks/useAppointmentStore';
import { Calendar, Clock, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenWrapper } from '@/Components/ScreenWrapper';

const AppointmentsScreen = ({ title }: { title?: string }) => {
  const { theme, shadows } = useTheme();
  const { appointments } = useAppointmentStore();

  const renderAppointment = ({ item, index }: any) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100)} 
      style={[styles.card, { backgroundColor: theme.surface, ...shadows }]}
    >
      <View style={styles.topRow}>
        <Image source={{ uri: item.doctorImage }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]}>{item.doctorName}</Text>
          <Text style={[styles.specialty, { color: theme.primary }]}>{item.specialty}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: theme.accent }]}>
          <Text style={[styles.statusText, { color: theme.primary }]}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={[styles.bottomRow, { borderTopColor: theme.border }]}>
        <View style={styles.dateTime}>
          <Calendar size={14} color={theme.textSecondary} />
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>{item.date}</Text>
          <Clock size={14} color={theme.textSecondary} style={{ marginLeft: 12 }} />
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>{item.time}</Text>
        </View>
        <TouchableOpacity style={styles.detailsBtn}>
          <Text style={{ color: theme.primary, fontWeight: '700' }}>Details</Text>
          <ChevronRight size={16} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <ScreenWrapper
      title={title || "My Appointments"}
      showBack={true}
      scrollable={false}
    >
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Calendar size={64} color={theme.border} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Appointments Yet</Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              Book your first consultation with our top specialists.
            </Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  card: { borderRadius: 20, padding: 16, marginBottom: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '800' },
  specialty: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '900' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTopWidth: 1 },
  dateTime: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyTitle: { fontSize: 20, fontWeight: '900', marginTop: 20 },
  emptyDesc: { fontSize: 14, textAlign: 'center', marginTop: 8, paddingHorizontal: 40 },
});

export default AppointmentsScreen;
