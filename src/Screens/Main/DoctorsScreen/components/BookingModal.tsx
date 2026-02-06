import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const TIME_SLOTS = [
  { time: '09:00 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '12:00 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '03:00 PM', available: false },
  { time: '04:00 PM', available: true },
  { time: '05:00 PM', available: true },
];

const DAYS = [
  { day: 'Mon', date: '24', full: 'Oct 24, 2026' },
  { day: 'Tue', date: '25', full: 'Oct 25, 2026' },
  { day: 'Wed', date: '26', full: 'Oct 26, 2026' },
  { day: 'Thu', date: '27', full: 'Oct 27, 2026' },
  { day: 'Fri', date: '28', full: 'Oct 28, 2026' },
];

export const BookingModal = ({ visible, onClose, onConfirm, doctorName }: any) => {
  const { theme, shadows } = useTheme();
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [selectedTime, setSelectedTime] = useState('');

  const handleConfirm = () => {
    if (!selectedTime) return;
    onConfirm(selectedDay.full, selectedTime);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View entering={FadeIn} style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <TouchableOpacity style={styles.flex} onPress={onClose} />
        </Animated.View>
        
        <Animated.View entering={SlideInUp} style={[styles.modalContainer, { backgroundColor: theme.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Select Slot</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.background }]}>
              <X size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Consultation with {doctorName}</Text>

            {/* Date Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <CalendarIcon size={18} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Date</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysList}>
                {DAYS.map((item) => (
                  <TouchableOpacity 
                    key={item.date}
                    onPress={() => setSelectedDay(item)}
                    style={[
                      styles.dayCard, 
                      { backgroundColor: selectedDay.date === item.date ? theme.primary : theme.background },
                      selectedDay.date === item.date && shadows
                    ]}
                  >
                    <Text style={[styles.dayText, { color: selectedDay.date === item.date ? '#fff' : theme.textSecondary }]}>{item.day}</Text>
                    <Text style={[styles.dateText, { color: selectedDay.date === item.date ? '#fff' : theme.text }]}>{item.date}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Time Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={18} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Available Time Slots</Text>
              </View>
              <View style={styles.timeGrid}>
                {TIME_SLOTS.map((slot) => (
                  <TouchableOpacity 
                    key={slot.time}
                    disabled={!slot.available}
                    onPress={() => setSelectedTime(slot.time)}
                    style={[
                      styles.timeChip,
                      { 
                        backgroundColor: selectedTime === slot.time ? theme.primary : theme.background,
                        opacity: slot.available ? 1 : 0.4,
                        borderColor: selectedTime === slot.time ? theme.primary : theme.border
                      }
                    ]}
                  >
                    <Text style={[
                      styles.timeText, 
                      { color: selectedTime === slot.time ? '#fff' : (slot.available ? theme.text : theme.textSecondary) }
                    ]}>
                      {slot.time}
                    </Text>
                    {!slot.available && <Text style={styles.bookedText}>Full</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity 
              disabled={!selectedTime}
              onPress={handleConfirm}
              style={[styles.confirmBtn, { backgroundColor: selectedTime ? theme.primary : theme.border }]}
            >
              <CheckCircle2 size={20} color="#fff" />
              <Text style={styles.confirmBtnText}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  flex: { flex: 1 },
  modalContainer: { borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: height * 0.8, paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: '900' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 24 },
  subtitle: { fontSize: 14, fontWeight: '600', marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  daysList: { gap: 12, paddingRight: 24 },
  dayCard: { width: 60, height: 70, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  dayText: { fontSize: 12, fontWeight: '700' },
  dateText: { fontSize: 18, fontWeight: '900', marginTop: 2 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeChip: { width: '31%', paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  timeText: { fontSize: 13, fontWeight: '800' },
  bookedText: { fontSize: 9, fontWeight: '900', color: '#EF4444', marginTop: 2, textTransform: 'uppercase' },
  footer: { padding: 24, borderTopWidth: 1 },
  confirmBtn: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});
