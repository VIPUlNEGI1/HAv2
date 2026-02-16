import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { 
  User,
  Calendar,
  Clock,
  FileText,
  Pill,
  AlertCircle,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Search,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';

interface Patient {
  id: string;
  name: string;
  image: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  chiefComplaint: string;
  medicalHistory: Array<{
    id: string;
    condition: string;
    date: string;
    notes: string;
  }>;
  prescriptions: Array<{
    id: string;
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  reports: Array<{
    id: string;
    name: string;
    date: string;
    type: string;
  }>;
}

const DoctorPatientListScreen = () => {
  const { theme, shadows } = useTheme();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock patients - in real app, get from API
  const patients: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      image: 'https://i.pravatar.cc/150?u=john',
      age: 45,
      gender: 'Male',
      phone: '+91 9876543210',
      email: 'john.doe@email.com',
      address: '123 Main St, City',
      appointmentDate: '2026-02-10',
      appointmentTime: '10:30 AM',
      status: 'pending',
      chiefComplaint: 'Chest pain and shortness of breath',
      medicalHistory: [
        {
          id: '1',
          condition: 'Hypertension',
          date: '2020-01-15',
          notes: 'Diagnosed with high blood pressure, on medication',
        },
        {
          id: '2',
          condition: 'Diabetes Type 2',
          date: '2018-06-20',
          notes: 'Controlled with medication and diet',
        },
      ],
      prescriptions: [
        {
          id: '1',
          medicine: 'Aspirin',
          dosage: '75mg',
          frequency: 'Once daily',
          duration: '30 days',
        },
        {
          id: '2',
          medicine: 'Metoprolol',
          dosage: '50mg',
          frequency: 'Twice daily',
          duration: '30 days',
        },
      ],
      reports: [
        { id: '1', name: 'ECG Report', date: '2026-02-05', type: 'ECG' },
        { id: '2', name: 'Blood Test', date: '2026-02-04', type: 'Lab' },
      ],
    },
    {
      id: '2',
      name: 'Jane Smith',
      image: 'https://i.pravatar.cc/150?u=jane',
      age: 38,
      gender: 'Female',
      phone: '+91 9876543211',
      email: 'jane.smith@email.com',
      address: '456 Oak Ave, City',
      appointmentDate: '2026-02-11',
      appointmentTime: '11:45 AM',
      status: 'confirmed',
      chiefComplaint: 'Persistent headache and dizziness',
      medicalHistory: [
        {
          id: '1',
          condition: 'Migraine',
          date: '2022-03-10',
          notes: 'Chronic migraines, triggered by stress',
        },
      ],
      prescriptions: [
        {
          id: '1',
          medicine: 'Sumatriptan',
          dosage: '50mg',
          frequency: 'As needed',
          duration: '15 days',
        },
      ],
      reports: [
        { id: '1', name: 'CT Scan', date: '2026-02-06', type: 'Imaging' },
      ],
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#10B981';
      case 'completed': return '#6366F1';
      case 'cancelled': return '#EF4444';
      default: return theme.textSecondary;
    }
  };

  const renderPatientCard = ({ item, index }: { item: Patient; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <TouchableOpacity
        style={[styles.patientCard, { backgroundColor: theme.surface, ...shadows }]}
        onPress={() => {
          setSelectedPatient(item);
          setModalVisible(true);
        }}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.image }} style={styles.patientAvatar} />
        <View style={styles.patientInfo}>
          <View style={styles.patientHeader}>
            <Text style={[styles.patientName, { color: theme.text }]}>{item.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={[styles.patientDetails, { color: theme.textSecondary }]}>
            {item.age} years • {item.gender}
          </Text>
          <Text style={[styles.complaint, { color: theme.text }]} numberOfLines={1}>
            {item.chiefComplaint}
          </Text>
          <View style={styles.appointmentInfo}>
            <Calendar size={moderateScale(14)} color={theme.textSecondary} />
            <Text style={[styles.appointmentText, { color: theme.textSecondary }]}>
              {item.appointmentDate} at {item.appointmentTime}
            </Text>
          </View>
        </View>
        <ChevronRight size={moderateScale(20)} color={theme.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ScreenWrapper title="Patient Applications" showBack={true}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, ...shadows }]}>
          <Search size={moderateScale(18)} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search patients..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Patients List */}
      <FlatList
        data={filteredPatients}
        renderItem={renderPatientCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <User size={moderateScale(64)} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No patients found
            </Text>
          </View>
        }
      />

      {/* Patient Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedPatient(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Patient Details</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSelectedPatient(null);
                }}
                style={[styles.closeBtn, { backgroundColor: theme.surface }]}
              >
                <X size={moderateScale(20)} color={theme.text} />
              </TouchableOpacity>
            </View>

            {selectedPatient && (
              <ScrollView 
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalBodyContent}
              >
                {/* Patient Profile */}
                <View style={[styles.patientProfileCard, { backgroundColor: theme.surface, ...shadows }]}>
                  <Image source={{ uri: selectedPatient.image }} style={styles.modalPatientAvatar} />
                  <Text style={[styles.modalPatientName, { color: theme.text }]}>{selectedPatient.name}</Text>
                  <Text style={[styles.modalPatientInfo, { color: theme.textSecondary }]}>
                    {selectedPatient.age} years • {selectedPatient.gender}
                  </Text>
                </View>

                {/* Contact Info */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Contact Information</Text>
                  <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows }]}>
                    <Phone size={moderateScale(18)} color={theme.primary} />
                    <Text style={[styles.infoText, { color: theme.text }]}>{selectedPatient.phone}</Text>
                  </View>
                  <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows, marginTop: verticalScale(8) }]}>
                    <Mail size={moderateScale(18)} color={theme.primary} />
                    <Text style={[styles.infoText, { color: theme.text }]}>{selectedPatient.email}</Text>
                  </View>
                  <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows, marginTop: verticalScale(8) }]}>
                    <MapPin size={moderateScale(18)} color={theme.primary} />
                    <Text style={[styles.infoText, { color: theme.text }]}>{selectedPatient.address}</Text>
                  </View>
                </View>

                {/* Appointment Info */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Appointment</Text>
                  <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows }]}>
                    <Calendar size={moderateScale(18)} color={theme.primary} />
                    <View style={styles.appointmentDetails}>
                      <Text style={[styles.infoText, { color: theme.text }]}>
                        {selectedPatient.appointmentDate}
                      </Text>
                      <Text style={[styles.infoSubtext, { color: theme.textSecondary }]}>
                        {selectedPatient.appointmentTime}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Chief Complaint */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Chief Complaint</Text>
                  <View style={[styles.complaintCard, { backgroundColor: theme.surface, ...shadows }]}>
                    <AlertCircle size={moderateScale(20)} color={theme.primary} />
                    <Text style={[styles.complaintText, { color: theme.text }]}>
                      {selectedPatient.chiefComplaint}
                    </Text>
                  </View>
                </View>

                {/* Medical History */}
                {selectedPatient.medicalHistory.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Medical History</Text>
                    {selectedPatient.medicalHistory.map((history) => (
                      <View 
                        key={history.id} 
                        style={[styles.historyCard, { backgroundColor: theme.surface, ...shadows }]}
                      >
                        <View style={styles.historyHeader}>
                          <Text style={[styles.historyCondition, { color: theme.text }]}>
                            {history.condition}
                          </Text>
                          <Text style={[styles.historyDate, { color: theme.textSecondary }]}>
                            {history.date}
                          </Text>
                        </View>
                        <Text style={[styles.historyNotes, { color: theme.textSecondary }]}>
                          {history.notes}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Prescriptions */}
                {selectedPatient.prescriptions.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Current Prescriptions</Text>
                    {selectedPatient.prescriptions.map((prescription) => (
                      <View 
                        key={prescription.id} 
                        style={[styles.prescriptionCard, { backgroundColor: theme.surface, ...shadows }]}
                      >
                        <Pill size={moderateScale(18)} color={theme.primary} />
                        <View style={styles.prescriptionInfo}>
                          <Text style={[styles.prescriptionName, { color: theme.text }]}>
                            {prescription.medicine}
                          </Text>
                          <Text style={[styles.prescriptionDetails, { color: theme.textSecondary }]}>
                            {prescription.dosage} • {prescription.frequency} • {prescription.duration}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Reports */}
                {selectedPatient.reports.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Medical Reports</Text>
                    {selectedPatient.reports.map((report) => (
                      <View 
                        key={report.id} 
                        style={[styles.reportCard, { backgroundColor: theme.surface, ...shadows }]}
                      >
                        <FileText size={moderateScale(18)} color={theme.primary} />
                        <View style={styles.reportInfo}>
                          <Text style={[styles.reportName, { color: theme.text }]}>{report.name}</Text>
                          <Text style={[styles.reportDate, { color: theme.textSecondary }]}>
                            {report.date} • {report.type}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    padding: moderateScale(16),
    paddingBottom: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(16),
    gap: moderateScale(12),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  listContent: {
    padding: moderateScale(16),
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(12),
    gap: moderateScale(12),
  },
  patientAvatar: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
  },
  patientInfo: {
    flex: 1,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  patientName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
  },
  statusText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  patientDetails: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    marginBottom: verticalScale(4),
  },
  complaint: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  appointmentText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(60),
  },
  emptyText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginTop: verticalScale(12),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: moderateScale(28),
    borderTopRightRadius: moderateScale(28),
    maxHeight: '90%',
    paddingTop: verticalScale(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(16),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '900',
  },
  closeBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: moderateScale(20),
    paddingBottom: verticalScale(40),
  },
  patientProfileCard: {
    alignItems: 'center',
    padding: moderateScale(20),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(20),
  },
  modalPatientAvatar: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    marginBottom: verticalScale(12),
  },
  modalPatientName: {
    fontSize: moderateScale(20),
    fontWeight: '900',
    marginBottom: verticalScale(4),
  },
  modalPatientInfo: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  modalSection: {
    marginBottom: verticalScale(20),
  },
  modalSectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    marginBottom: verticalScale(12),
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    gap: moderateScale(12),
  },
  infoText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    flex: 1,
  },
  appointmentDetails: {
    flex: 1,
  },
  infoSubtext: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  complaintCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    gap: moderateScale(12),
  },
  complaintText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    flex: 1,
    lineHeight: moderateScale(20),
  },
  historyCard: {
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(8),
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  historyCondition: {
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
  historyDate: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  historyNotes: {
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
  },
  prescriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(8),
    gap: moderateScale(12),
  },
  prescriptionInfo: {
    flex: 1,
  },
  prescriptionName: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: verticalScale(2),
  },
  prescriptionDetails: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(8),
    gap: moderateScale(12),
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: verticalScale(2),
  },
  reportDate: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
});

export default DoctorPatientListScreen;
