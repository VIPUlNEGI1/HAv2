import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import {
  Calendar,
  Clock,
  X,
  CheckCircle2,
  User,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { StepperFormContainer, type StepperFormStep } from '@/Components/common';
import { AnimatedButton } from '@/Components/AnimatedButton';

const { height } = Dimensions.get('window');

interface LabBookingModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
  testName: string;
  labName: string;
  price: number;
}

export const LabBookingModal: React.FC<LabBookingModalProps> = ({
  visible,
  onClose,
  onConfirm,
  testName,
  labName,
  price,
}) => {
  const { theme, shadows } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('');

  const dates = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      days.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        full: d.toDateString(),
      });
    }
    return days;
  }, []);

  const timeSlots = [
    '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
    '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM',
  ];

  const canGoNext = () => {
    if (currentStep === 0) return true;
    if (currentStep === 1) return !!selectedSlot;
    return true;
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep((s) => s + 1);
    else if (selectedSlot) onConfirm(dates[selectedDate].full, selectedSlot);
  };

  const steps: StepperFormStep[] = useMemo(
    () => [
      {
        key: 'date',
        title: 'Date',
        subtitle: 'Select day',
        content: (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
            <View style={[styles.infoBox, { backgroundColor: theme.accent + '22', borderColor: theme.accent + '44' }]}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.primary }]}>Provider</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{labName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.primary }]}>Amount</Text>
                <Text style={[styles.infoValue, { color: theme.primary, fontSize: 18 }]}>₹{price}</Text>
              </View>
            </View>
            <View style={styles.section}>
              <View style={[styles.sectionHeader, { backgroundColor: theme.primary + '12', borderLeftColor: theme.primary }]}>
                <Calendar size={18} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Date</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
                {dates.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setSelectedDate(index)}
                    style={[
                      styles.dateCard,
                      {
                        backgroundColor: selectedDate === index ? theme.primary : theme.background,
                        borderColor: selectedDate === index ? theme.primary : theme.border,
                      },
                      selectedDate === index && shadows,
                    ]}
                  >
                    <Text style={[styles.dateDay, { color: selectedDate === index ? '#fff' : theme.textSecondary }]}>
                      {item.day}
                    </Text>
                    <Text style={[styles.dateNumber, { color: selectedDate === index ? '#fff' : theme.text }]}>
                      {item.date}
                    </Text>
                    <Text style={[styles.dateMonth, { color: selectedDate === index ? '#fff' : theme.textSecondary }]}>
                      {item.month}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        ),
      },
      {
        key: 'time',
        title: 'Time',
        subtitle: 'Select slot',
        content: (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
            <View style={styles.section}>
              <View style={[styles.sectionHeader, { backgroundColor: theme.primary + '12', borderLeftColor: theme.primary }]}>
                <Clock size={18} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Time Slot</Text>
              </View>
              <View style={styles.slotGrid}>
                {timeSlots.map((slot) => (
                  <Pressable
                    key={slot}
                    onPress={() => setSelectedSlot(slot)}
                    style={[
                      styles.slotBtn,
                      {
                        backgroundColor: selectedSlot === slot ? theme.primary : theme.surface,
                        borderColor: selectedSlot === slot ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        { color: selectedSlot === slot ? '#fff' : theme.text },
                      ]}
                    >
                      {slot}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <View style={[styles.sectionHeader, { backgroundColor: theme.primary + '12', borderLeftColor: theme.primary }]}>
                <User size={18} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Available Technicians</Text>
              </View>
              <View style={[styles.techCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <View style={styles.techInfo}>
                  <View style={[styles.techAvatar, { backgroundColor: theme.border }]}>
                    <User size={20} color={theme.textSecondary} />
                  </View>
                  <View>
                    <Text style={[styles.techName, { color: theme.text }]}>Senior Lab Tech Available</Text>
                    <Text style={[styles.techSub, { color: theme.textSecondary }]}>Verified & Vaccinated</Text>
                  </View>
                </View>
                <CheckCircle2 size={20} color={theme.success} />
              </View>
            </View>
          </ScrollView>
        ),
      },
      {
        key: 'review',
        title: 'Confirm',
        subtitle: 'Review',
        content: (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
            <View style={[styles.reviewCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Test</Text>
              <Text style={[styles.reviewValue, { color: theme.text }]}>{testName}</Text>
            </View>
            <View style={[styles.reviewCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Date & Time</Text>
              <Text style={[styles.reviewValue, { color: theme.text }]}>
                {dates[selectedDate]?.full} · {selectedSlot || '—'}
              </Text>
            </View>
            <View style={[styles.reviewCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Amount</Text>
              <Text style={[styles.reviewValue, { color: theme.primary }]}>₹{price}</Text>
            </View>
          </ScrollView>
        ),
      },
    ],
    [theme, dates, selectedDate, selectedSlot, labName, price, testName, shadows]
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <Animated.View
          entering={SlideInUp}
          style={[styles.modalContent, { backgroundColor: theme.surface }]}
        >
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View>
              <Text style={[styles.headerTitle, { color: theme.text }]}>Schedule Test</Text>
              <Text style={[styles.headerSub, { color: theme.textSecondary }]}>{testName}</Text>
            </View>
            <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.background }]}>
              <X size={20} color={theme.text} />
            </Pressable>
          </View>

          <View style={styles.scrollBody}>
            <StepperFormContainer
              steps={steps}
              currentStep={currentStep}
              transitionDirection="vertical"
            />
          </View>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <View style={styles.footerRow}>
              {currentStep > 0 ? (
                <Pressable
                  onPress={() => setCurrentStep((s) => s - 1)}
                  style={[styles.secondaryBtn, { borderColor: theme.border }]}
                >
                  <ChevronLeft size={20} color={theme.primary} />
                  <Text style={[styles.secondaryBtnText, { color: theme.primary }]}>Back</Text>
                </Pressable>
              ) : (
                <View style={styles.secondaryBtn} />
              )}
              <View style={styles.confirmWrap}>
                <AnimatedButton
                  title={currentStep < 2 ? 'Next' : 'Confirm Appointment'}
                  disabled={currentStep === 1 && !selectedSlot}
                  onPress={handleNext}
                  style={{
                    backgroundColor: canGoNext() ? theme.primary : theme.border,
                    opacity: canGoNext() ? 1 : 0.6,
                  }}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  dismissArea: { flex: 1 },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: height * 0.85 },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: '900' },
  headerSub: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  scrollBody: { paddingHorizontal: 24, flex: 1, minHeight: 0 },
  stepScroll: { flex: 1, paddingBottom: 16 },
  infoBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    marginBottom: 24,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 13, fontWeight: '600' },
  infoValue: { fontSize: 15, fontWeight: '800' },
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  dateList: { gap: 12 },
  dateCard: {
    width: 70,
    height: 90,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1.5,
  },
  dateDay: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  dateNumber: { fontSize: 20, fontWeight: '900' },
  dateMonth: { fontSize: 11, fontWeight: '700' },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: '30%',
    alignItems: 'center',
  },
  slotText: { fontSize: 13, fontWeight: '700' },
  techCard: {
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  techInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  techAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  techName: { fontSize: 14, fontWeight: '800' },
  techSub: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  reviewCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  reviewLabel: { fontSize: 12, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
  reviewValue: { fontSize: 15, fontWeight: '700' },
  footer: { padding: 24, paddingBottom: 34, borderTopWidth: 1 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 8,
    minWidth: 100,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '800' },
  confirmWrap: { flex: 1 },
});
