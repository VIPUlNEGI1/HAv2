import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Upload,
  FileText,
  Image as ImageIcon,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
} from 'lucide-react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { StepperFormContainer, type StepperFormStep } from '@/Components/common';
import { FormInput } from '@/Components/common';

const { width, height } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.88;

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
  { day: 'Mon', date: '24', full: 'Oct 24, 2026', dateISO: '2026-10-24' },
  { day: 'Tue', date: '25', full: 'Oct 25, 2026', dateISO: '2026-10-25' },
  { day: 'Wed', date: '26', full: 'Oct 26, 2026', dateISO: '2026-10-26' },
  { day: 'Thu', date: '27', full: 'Oct 27, 2026', dateISO: '2026-10-27' },
  { day: 'Fri', date: '28', full: 'Oct 28, 2026', dateISO: '2026-10-28' },
];

interface PatientDetails {
  chiefComplaint: string;
  symptoms: string;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  reports: Array<{ id: string; name: string; uri: string }>;
}

export interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  /** (dateISO, dateDisplay, time, patientDetails) - dateISO for API (YYYY-MM-DD), dateDisplay for UI */
  onConfirm: (dateISO: string, dateDisplay: string, time: string, patientDetails?: PatientDetails) => void;
  doctorName: string;
  loading?: boolean;
}

export const BookingModal = ({ visible, onClose, onConfirm, doctorName, loading = false }: BookingModalProps) => {
  const { theme, shadows } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    chiefComplaint: '',
    symptoms: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    reports: [],
  });

  const handleImagePicker = () => {
    Alert.alert('Select Report', 'Choose an option', [
      { text: 'Camera', onPress: () => openCamera() },
      { text: 'Gallery', onPress: () => openGallery() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo' as MediaType, quality: 0.8 }, (response: ImagePickerResponse) => {
      if (response.assets?.[0]) {
        setPatientDetails((prev) => ({
          ...prev,
          reports: [
            ...prev.reports,
            {
              id: Math.random().toString(36).slice(2, 9),
              name: `Report_${Date.now()}.jpg`,
              uri: response.assets![0].uri || '',
            },
          ],
        }));
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' as MediaType, quality: 0.8 }, (response: ImagePickerResponse) => {
      if (response.assets?.[0]) {
        setPatientDetails((prev) => ({
          ...prev,
          reports: [
            ...prev.reports,
            {
              id: Math.random().toString(36).slice(2, 9),
              name: response.assets![0].fileName || `Report_${Date.now()}.jpg`,
              uri: response.assets![0].uri || '',
            },
          ],
        }));
      }
    });
  };

  const removeReport = (id: string) => {
    setPatientDetails((prev) => ({ ...prev, reports: prev.reports.filter((r) => r.id !== id) }));
  };

  const canGoNext = () => {
    if (currentStep === 0) return !!selectedTime;
    return true;
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep((s) => s + 1);
    else handleConfirm();
  };

  const handleConfirm = () => {
    if (!selectedTime) return;
    onConfirm(selectedDay.dateISO, selectedDay.full, selectedTime, patientDetails);
  };

  const steps: StepperFormStep[] = [
    {
      key: 'slot',
      title: 'Date & Time',
      subtitle: 'Select slot',
      content: (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
          <Animated.View entering={FadeInDown.duration(280).springify()} style={styles.section}>
            <Animated.View entering={FadeInRight.delay(80).duration(220)} style={[styles.sectionHeader, { backgroundColor: theme.primary + '12', borderLeftColor: theme.primary }]}>
              <CalendarIcon size={18} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Date</Text>
            </Animated.View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysList}>
              {DAYS.map((item, i) => (
                <Animated.View key={item.date} entering={FadeInUp.delay(120 + i * 50).duration(220).springify()}>
                  <TouchableOpacity
                    onPress={() => setSelectedDay(item)}
                    style={[
                      styles.dayCard,
                      {
                        backgroundColor: selectedDay.date === item.date ? theme.primary : theme.background,
                        borderColor: selectedDay.date === item.date ? theme.primary : theme.border,
                      },
                      selectedDay.date === item.date && shadows,
                    ]}
                  >
                    <Text style={[styles.dayText, { color: selectedDay.date === item.date ? '#fff' : theme.textSecondary }]}>
                      {item.day}
                    </Text>
                    <Text style={[styles.dateText, { color: selectedDay.date === item.date ? '#fff' : theme.text }]}>
                      {item.date}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).duration(280).springify()} style={styles.section}>
            <Animated.View entering={FadeInRight.delay(260).duration(220)} style={[styles.sectionHeader, { backgroundColor: theme.primary + '12', borderLeftColor: theme.primary }]}>
              <Clock size={18} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Time Slots</Text>
            </Animated.View>
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map((slot, i) => (
                <Animated.View key={slot.time} entering={FadeInDown.delay(320 + i * 40).duration(200)}>
                  <TouchableOpacity
                    disabled={!slot.available}
                    onPress={() => setSelectedTime(slot.time)}
                    style={[
                      styles.timeChip,
                      {
                        backgroundColor: selectedTime === slot.time ? theme.primary : theme.surface,
                        borderColor: selectedTime === slot.time ? theme.primary : theme.border,
                        opacity: slot.available ? 1 : 0.45,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        {
                          color: selectedTime === slot.time ? '#fff' : slot.available ? theme.text : theme.textSecondary,
                        },
                      ]}
                    >
                      {slot.time}
                    </Text>
                    {!slot.available && <Text style={[styles.bookedText, { color: theme.error }]}>Full</Text>}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      ),
    },
    {
      key: 'details',
      title: 'Patient Details',
      subtitle: 'Optional',
      content: (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
          <Animated.View entering={FadeInDown.duration(260).springify()} style={[styles.sectionHeader, { backgroundColor: theme.primary + '12', borderLeftColor: theme.primary, marginBottom: moderateScale(16) }]}>
            <FileText size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Medical information (optional)</Text>
          </Animated.View>
          <FormInput
            variant="stepper"
            label="Chief Complaint"
            placeholder="Describe your main concern..."
            value={patientDetails.chiefComplaint}
            onChangeText={(text) => setPatientDetails((prev) => ({ ...prev, chiefComplaint: text }))}
            multiline
            numberOfLines={3}
          />
          <FormInput
            variant="stepper"
            label="Symptoms"
            placeholder="List your symptoms..."
            value={patientDetails.symptoms}
            onChangeText={(text) => setPatientDetails((prev) => ({ ...prev, symptoms: text }))}
            multiline
            numberOfLines={2}
          />
          <FormInput
            variant="stepper"
            label="Medical History"
            placeholder="Any previous medical conditions..."
            value={patientDetails.medicalHistory}
            onChangeText={(text) => setPatientDetails((prev) => ({ ...prev, medicalHistory: text }))}
            multiline
            numberOfLines={2}
          />
          <FormInput
            variant="stepper"
            label="Current Medications"
            placeholder="List current medications..."
            value={patientDetails.currentMedications}
            onChangeText={(text) => setPatientDetails((prev) => ({ ...prev, currentMedications: text }))}
            multiline
            numberOfLines={2}
          />
          <FormInput
            variant="stepper"
            label="Allergies"
            placeholder="Any known allergies..."
            value={patientDetails.allergies}
            onChangeText={(text) => setPatientDetails((prev) => ({ ...prev, allergies: text }))}
            multiline
            numberOfLines={2}
          />
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Medical Reports</Text>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={[styles.uploadBtn, { backgroundColor: theme.primary + '15', borderColor: theme.primary }]}
            >
              <Upload size={18} color={theme.primary} />
              <Text style={[styles.uploadBtnText, { color: theme.primary }]}>Upload Report</Text>
            </TouchableOpacity>
            {patientDetails.reports.length > 0 && (
              <View style={styles.reportsList}>
                {patientDetails.reports.map((report) => (
                  <View key={report.id} style={[styles.reportItem, { backgroundColor: theme.background }]}>
                    <ImageIcon size={16} color={theme.primary} />
                    <Text style={[styles.reportItemText, { color: theme.text }]} numberOfLines={1}>
                      {report.name}
                    </Text>
                    <TouchableOpacity onPress={() => removeReport(report.id)}>
                      <XCircle size={16} color={theme.error || '#EF4444'} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      ),
    },
    {
      key: 'review',
      title: 'Review',
      subtitle: 'Confirm',
      content: (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
          <Animated.View entering={FadeInDown.duration(260).springify()} style={[styles.reviewCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.reviewRow}>
              <Stethoscope size={18} color={theme.primary} />
              <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Doctor</Text>
            </View>
            <Text style={[styles.reviewValue, { color: theme.text }]}>{doctorName}</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(80).duration(260).springify()} style={[styles.reviewCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.reviewRow}>
              <CalendarIcon size={18} color={theme.primary} />
              <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Date & Time</Text>
            </View>
            <Text style={[styles.reviewValue, { color: theme.text }]}>
              {selectedDay.full} · {selectedTime}
            </Text>
          </Animated.View>
          {(patientDetails.chiefComplaint || patientDetails.symptoms) && (
            <Animated.View entering={FadeInDown.delay(160).duration(260).springify()} style={[styles.reviewCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <View style={styles.reviewRow}>
                <FileText size={18} color={theme.primary} />
                <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Notes</Text>
              </View>
              <Text style={[styles.reviewValue, { color: theme.text }]} numberOfLines={4}>
                {patientDetails.chiefComplaint || patientDetails.symptoms || '—'}
              </Text>
            </Animated.View>
          )}
        </ScrollView>
      ),
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={[styles.backdrop, { backgroundColor: theme.backdrop || 'rgba(0,0,0,0.5)' }]}
          onPress={onClose}
          activeOpacity={1}
        />

        <View style={[styles.sheet, { backgroundColor: theme.surface, height: SHEET_HEIGHT }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.titleIconWrap, { backgroundColor: theme.primary + '18' }]}>
                <Stethoscope size={22} color={theme.primary} />
              </View>
              <View style={styles.headerTextWrap}>
                <Text style={[styles.title, { color: theme.text }]}>Book Appointment</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                  with {doctorName}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.background }]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={22} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Content + Footer */}
          <KeyboardAvoidingView
            style={styles.main}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <View style={styles.content}>
              <StepperFormContainer
                steps={steps}
                currentStep={currentStep}
                transitionDirection="vertical"
              />
            </View>

            <View style={[styles.footer, { borderTopColor: theme.border }]}>
              <View style={styles.footerRow}>
                {currentStep > 0 ? (
                  <TouchableOpacity
                    onPress={() => setCurrentStep((s) => s - 1)}
                    style={[styles.secondaryBtn, { borderColor: theme.border }]}
                    activeOpacity={0.8}
                  >
                    <ChevronLeft size={20} color={theme.primary} />
                    <Text style={[styles.secondaryBtnText, { color: theme.primary }]}>Back</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.secondaryBtnPlaceholder]} />
                )}
                <TouchableOpacity
                  onPress={handleNext}
                  disabled={(currentStep === 0 && !selectedTime) || loading}
                  style={[
                    styles.confirmBtn,
                    {
                      backgroundColor: canGoNext() && !loading ? theme.primary : theme.border,
                      opacity: canGoNext() && !loading ? 1 : 0.6,
                    },
                  ]}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : currentStep < 2 ? (
                    <>
                      <Text style={styles.confirmBtnText}>Next</Text>
                      <ChevronRight size={20} color="#fff" />
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} color="#fff" />
                      <Text style={styles.confirmBtnText}>Confirm Booking</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    width: width,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
    minWidth: 0,
  },
  titleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextWrap: { flex: 1, minWidth: 0 },
  title: { fontSize: 18, fontWeight: '900', letterSpacing: 0.2 },
  subtitle: { fontSize: 12, fontWeight: '600', marginTop: 2, opacity: 0.85 },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  main: { flex: 1, minHeight: 0 },
  content: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 20,
  },
  stepScroll: {
    flex: 1,
    paddingBottom: 24,
  },
  section: { marginBottom: 22 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 14, fontWeight: '800' },
  daysList: { gap: 10, paddingRight: 8 },
  dayCard: {
    width: 56,
    height: 64,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  dayText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  dateText: { fontSize: 16, fontWeight: '900', marginTop: 4 },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeChip: {
    width: '31%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  timeText: { fontSize: moderateScale(13), fontWeight: '800' },
  bookedText: { fontSize: 9, fontWeight: '800', marginTop: 2, textTransform: 'uppercase' },
  inputGroup: { marginBottom: moderateScale(18) },
  inputLabel: { fontSize: moderateScale(13), fontWeight: '700', marginBottom: moderateScale(8) },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: 12,
    borderWidth: 2,
    gap: moderateScale(8),
  },
  uploadBtnText: { fontSize: moderateScale(14), fontWeight: '700' },
  reportsList: { marginTop: moderateScale(12), gap: moderateScale(8) },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    borderRadius: 12,
    gap: moderateScale(10),
  },
  reportItemText: { flex: 1, fontSize: moderateScale(13), fontWeight: '600' },
  reviewCard: {
    padding: moderateScale(16),
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: moderateScale(12),
  },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  reviewLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  reviewValue: { fontSize: moderateScale(15), fontWeight: '700', lineHeight: 22 },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 2,
    gap: 8,
    minWidth: 100,
  },
  secondaryBtnPlaceholder: {
    minWidth: 100,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '800' },
  confirmBtn: {
    flex: 1,
    minHeight: 20,

    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
