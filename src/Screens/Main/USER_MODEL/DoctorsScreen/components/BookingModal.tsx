import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions, TextInput, Image, Alert } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, Upload, FileText, Image as ImageIcon, XCircle } from 'lucide-react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

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

interface PatientDetails {
  chiefComplaint: string;
  symptoms: string;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  reports: Array<{ id: string; name: string; uri: string }>;
}

export const BookingModal = ({ visible, onClose, onConfirm, doctorName }: any) => {
  const { theme, shadows } = useTheme();
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    chiefComplaint: '',
    symptoms: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    reports: [],
  });

  const handleImagePicker = () => {
    Alert.alert(
      'Select Report',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo' as MediaType, quality: 0.8 }, (response: ImagePickerResponse) => {
      if (response.assets && response.assets[0]) {
        const newReport = {
          id: Math.random().toString(36).substr(2, 9),
          name: `Report_${Date.now()}.jpg`,
          uri: response.assets[0].uri || '',
        };
        setPatientDetails({
          ...patientDetails,
          reports: [...patientDetails.reports, newReport],
        });
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' as MediaType, quality: 0.8 }, (response: ImagePickerResponse) => {
      if (response.assets && response.assets[0]) {
        const newReport = {
          id: Math.random().toString(36).substr(2, 9),
          name: response.assets[0].fileName || `Report_${Date.now()}.jpg`,
          uri: response.assets[0].uri || '',
        };
        setPatientDetails({
          ...patientDetails,
          reports: [...patientDetails.reports, newReport],
        });
      }
    });
  };

  const removeReport = (id: string) => {
    setPatientDetails({
      ...patientDetails,
      reports: patientDetails.reports.filter(r => r.id !== id),
    });
  };

  const handleConfirm = () => {
    if (!selectedTime) return;
    onConfirm(selectedDay.full, selectedTime, patientDetails);
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

            {/* Patient Details Section */}
            <View style={styles.section}>
              <TouchableOpacity 
                onPress={() => setShowPatientDetails(!showPatientDetails)}
                style={[styles.patientDetailsToggle, { backgroundColor: theme.background }]}
              >
                <View style={styles.sectionHeader}>
                  <FileText size={18} color={theme.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Patient Details (Optional)</Text>
                </View>
                <Text style={[styles.toggleText, { color: theme.textSecondary }]}>
                  {showPatientDetails ? 'Hide' : 'Add'} Details
                </Text>
              </TouchableOpacity>

              {showPatientDetails && (
                <View style={styles.patientDetailsForm}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Chief Complaint *</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                      placeholder="Describe your main concern..."
                      placeholderTextColor={theme.textSecondary}
                      value={patientDetails.chiefComplaint}
                      onChangeText={(text) => setPatientDetails({ ...patientDetails, chiefComplaint: text })}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Symptoms</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                      placeholder="List your symptoms..."
                      placeholderTextColor={theme.textSecondary}
                      value={patientDetails.symptoms}
                      onChangeText={(text) => setPatientDetails({ ...patientDetails, symptoms: text })}
                      multiline
                      numberOfLines={2}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Medical History</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                      placeholder="Any previous medical conditions..."
                      placeholderTextColor={theme.textSecondary}
                      value={patientDetails.medicalHistory}
                      onChangeText={(text) => setPatientDetails({ ...patientDetails, medicalHistory: text })}
                      multiline
                      numberOfLines={2}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Current Medications</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                      placeholder="List current medications..."
                      placeholderTextColor={theme.textSecondary}
                      value={patientDetails.currentMedications}
                      onChangeText={(text) => setPatientDetails({ ...patientDetails, currentMedications: text })}
                      multiline
                      numberOfLines={2}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Allergies</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                      placeholder="Any known allergies..."
                      placeholderTextColor={theme.textSecondary}
                      value={patientDetails.allergies}
                      onChangeText={(text) => setPatientDetails({ ...patientDetails, allergies: text })}
                      multiline
                      numberOfLines={2}
                    />
                  </View>

                  {/* Reports Upload */}
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
                </View>
              )}
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
  patientDetailsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(12),
  },
  toggleText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
  },
  patientDetailsForm: {
    marginTop: moderateScale(12),
  },
  inputGroup: {
    marginBottom: moderateScale(16),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    marginBottom: moderateScale(8),
  },
  textInput: {
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    borderWidth: 1,
    fontSize: moderateScale(14),
    minHeight: verticalScale(80),
    textAlignVertical: 'top',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    gap: moderateScale(8),
  },
  uploadBtnText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  reportsList: {
    marginTop: moderateScale(12),
    gap: moderateScale(8),
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    gap: moderateScale(10),
  },
  reportItemText: {
    flex: 1,
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
});
