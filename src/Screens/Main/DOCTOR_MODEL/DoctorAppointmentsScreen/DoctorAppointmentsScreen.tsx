import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { 
  Calendar, 
  Clock, 
  User, 
  ChevronRight,
  X,
  FileText,
  Pill,
  AlertCircle,
  Phone,
  Video,
  MessageSquare,
  CheckCircle,
  XCircle,
  Mail,
  Download,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Share2,
  Star,
  Sparkles,
} from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface Prescription {
  id: string;
  medicine: string;
  dosage: string;
  frequency: string;
}

interface PatientUploadedDetails {
  chiefComplaint: string;
  symptoms: string;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  reports: Array<{ id: string; name: string; uri: string }>;
}

interface PatientDetail {
  id: string;
  patient: string;
  patientImage: string;
  time: string;
  date: string;
  type: 'Video' | 'Audio' | 'Chat';
  illness: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  prescriptions: Prescription[];
  reports: Array<{ id: string; name: string; date: string; imageUrl?: string }>;
  notes: string;
  patientUploadedDetails?: PatientUploadedDetails; // Details uploaded by patient during booking
}

const DoctorAppointmentsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportPreviewVisible, setReportPreviewVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{ id: string; name: string; date: string; imageUrl?: string } | null>(null);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [viewerImageUrl, setViewerImageUrl] = useState<string>('');
  const translateX = useSharedValue(0);
  const [swipeAction, setSwipeAction] = useState<'confirm' | 'cancel' | null>(null);

  // In real app, this would come from backend/API
  // For now, using dummy data that simulates patient-uploaded details
  const appointments: PatientDetail[] = [
    { 
      id: '1', 
      patient: 'John Doe', 
      patientImage: 'https://i.pravatar.cc/150?u=john',
      time: '10:30 AM', 
      date: 'Today',
      type: 'Video',
      illness: 'Cardiac Arrhythmia', // This would come from patientDetails.chiefComplaint
      age: 45,
      gender: 'Male',
      phone: '+91 9876543210',
      email: 'john.doe@email.com',
      prescriptions: [
        { id: '1', medicine: 'Aspirin', dosage: '75mg', frequency: 'Once daily' },
        { id: '2', medicine: 'Metoprolol', dosage: '50mg', frequency: 'Twice daily' },
      ],
      reports: [
        { 
          id: '1', 
          name: 'ECG Report', 
          date: 'Feb 5, 2026',
          imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=1000&fit=crop'
        },
        { 
          id: '2', 
          name: 'Blood Test', 
          date: 'Feb 4, 2026',
          imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=1000&fit=crop'
        },
      ],
      notes: 'Patient has been experiencing irregular heartbeat. Monitor closely.',
      // Patient uploaded details (from booking form)
      patientUploadedDetails: {
        chiefComplaint: 'Chest pain and irregular heartbeat for the past week',
        symptoms: 'Chest pain, shortness of breath, dizziness',
        medicalHistory: 'Hypertension, previous heart surgery in 2020',
        currentMedications: 'Aspirin 75mg daily, Metoprolol 50mg twice daily',
        allergies: 'Penicillin',
        reports: [
          { id: '1', name: 'ECG_Report.jpg', uri: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=1000&fit=crop' },
          { id: '2', name: 'Blood_Test.pdf', uri: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=1000&fit=crop' },
        ],
      },
    },
    { 
      id: '2', 
      patient: 'Jane Smith', 
      patientImage: 'https://i.pravatar.cc/150?u=jane',
      time: '11:45 AM', 
      date: 'Today',
      type: 'Audio',
      illness: 'Hypertension',
      age: 38,
      gender: 'Female',
      phone: '+91 9876543211',
      email: 'jane.smith@email.com',
      prescriptions: [
        { id: '1', medicine: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      ],
      reports: [
        { 
          id: '1', 
          name: 'BP Monitoring', 
          date: 'Feb 6, 2026',
          imageUrl: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=1000&fit=crop'
        },
      ],
      notes: 'Blood pressure is under control with current medication.',
    },
    { 
      id: '3', 
      patient: 'Mike Johnson', 
      patientImage: 'https://i.pravatar.cc/150?u=mike',
      time: '02:00 PM', 
      date: 'Today',
      type: 'Chat',
      illness: 'Chest Pain',
      age: 52,
      gender: 'Male',
      phone: '+91 9876543212',
      email: 'mike.johnson@email.com',
      prescriptions: [],
      reports: [
        { 
          id: '1', 
          name: 'X-Ray Chest', 
          date: 'Feb 7, 2026',
          imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=1000&fit=crop'
        },
        { 
          id: '2', 
          name: 'ECG', 
          date: 'Feb 7, 2026',
          imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=1000&fit=crop'
        },
      ],
      notes: 'Follow-up consultation required.',
    },
  ];

  const translateY = useSharedValue(0);
  const modalOpacity = useSharedValue(1);

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPatient(null);
    translateX.value = 0;
    translateY.value = 0;
    modalOpacity.value = 1;
    setSwipeAction(null);
  };

  const handleAppointmentAction = (action: 'confirm' | 'cancel', appointmentId: string) => {
    if (action === 'confirm') {
      toast.success('Appointment confirmed!');
    } else {
      toast.error('Appointment cancelled');
    }
    translateY.value = withTiming(1000, { duration: 200 });
    modalOpacity.value = withTiming(0, { duration: 200 });
    // Use setTimeout on JS thread, not in worklet
    setTimeout(() => {
      closeModal();
    }, 200);
  };

  const updateSwipeAction = (action: 'confirm' | 'cancel' | null) => {
    setSwipeAction(action);
  };

  // Vertical pan gesture for dismissing modal (only on header/drag indicator)
  const verticalPanGesture = Gesture.Pan()
    .activeOffsetY([10, Infinity])
    .failOffsetX([-10, 10])
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
        modalOpacity.value = Math.max(0.3, 1 - (e.translationY / 500));
      }
    })
    .onEnd((e) => {
      if (e.translationY > 150 || e.velocityY > 500) {
        translateY.value = withTiming(1000, { duration: 200 });
        modalOpacity.value = withTiming(0, { duration: 200 });
        runOnJS(closeModal)();
      } else {
        translateY.value = withSpring(0);
        modalOpacity.value = withSpring(1);
      }
    });

  // Horizontal pan gesture for confirm/cancel (only on swipe card)
  const panGesture = Gesture.Pan()
    .activeOffsetX([-Infinity, -10])
    .activeOffsetX([10, Infinity])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      translateX.value = e.translationX;
      if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(updateSwipeAction)('confirm');
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(updateSwipeAction)('cancel');
      } else {
        runOnJS(updateSwipeAction)(null);
      }
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
        const action = e.translationX > 0 ? 'confirm' : 'cancel';
        translateX.value = withSpring(0);
        runOnJS(handleAppointmentAction)(action, selectedPatient?.id || '');
      } else {
        translateX.value = withSpring(0);
        runOnJS(updateSwipeAction)(null);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const opacity = Math.abs(translateX.value) / SWIPE_THRESHOLD;
    return {
      transform: [{ translateX: translateX.value }],
      opacity: 1 - opacity * 0.3,
    };
  });

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: modalOpacity.value,
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: modalOpacity.value,
    };
  });

  const animatedConfirmStyle = useAnimatedStyle(() => {
    const opacity = translateX.value > SWIPE_THRESHOLD ? 1 : 0;
    return {
      opacity: withTiming(opacity),
      transform: [{ scale: withSpring(translateX.value > SWIPE_THRESHOLD ? 1 : 0.8) }],
    };
  });

  const animatedCancelStyle = useAnimatedStyle(() => {
    const opacity = translateX.value < -SWIPE_THRESHOLD ? 1 : 0;
    return {
      opacity: withTiming(opacity),
      transform: [{ scale: withSpring(translateX.value < -SWIPE_THRESHOLD ? 1 : 0.8) }],
    };
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video': return Video;
      case 'Audio': return Phone;
      default: return MessageSquare;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Video': return '#10B981';
      case 'Audio': return '#3B82F6';
      default: return '#F59E0B';
    }
  };

  return (
    <ScreenWrapper 
      title="Scheduled Appointments" 
      showBack={true}
      headerRight={
        <TouchableOpacity
          onPress={() => navigation.navigate('DoctorPatientListScreen')}
          style={styles.viewAllBtn}
        >
          <Text style={[styles.viewAllText, { color: theme.primary }]}>All Patients</Text>
        </TouchableOpacity>
      }
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {appointments.map((item, index) => {
          const TypeIcon = getTypeIcon(item.type);
          const typeColor = getTypeColor(item.type);
          
          return (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <TouchableOpacity 
                style={[styles.appointmentCard, { backgroundColor: theme.surface, ...shadows }]}
                onPress={() => {
                  setSelectedPatient(item);
                  setModalVisible(true);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.patientInfo}>
                    <Image source={{ uri: item.patientImage }} style={styles.patientAvatar} />
                    <View style={styles.patientDetails}>
                      <Text style={[styles.patientName, { color: theme.text }]}>{item.patient}</Text>
                      <View style={styles.typeRow}>
                        <View style={[styles.typeBadge, { backgroundColor: typeColor + '15' }]}>
                          <TypeIcon size={moderateScale(12)} color={typeColor} />
                          <Text style={[styles.appointmentType, { color: typeColor }]}>
                            {item.type} Consultation
                          </Text>
                        </View>
                      </View>
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
                  <View style={styles.footerItem}>
                    <AlertCircle size={moderateScale(16)} color={theme.textSecondary} />
                    <Text style={[styles.footerText, { color: theme.textSecondary }]} numberOfLines={1}>
                      {item.illness}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Patient Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalBackdrop,
              animatedBackdropStyle
            ]}
          >
            <TouchableOpacity 
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => {
                translateY.value = withTiming(1000, { duration: 200 });
                modalOpacity.value = withTiming(0, { duration: 200 });
                setTimeout(() => {
                  closeModal();
                }, 200);
              }}
            />
          </Animated.View>
          <Animated.View 
            style={[
              styles.modalContent, 
              { 
                backgroundColor: theme.background,
                paddingBottom: Math.max(insets.bottom, verticalScale(20)),
              },
              animatedModalStyle
            ]}
          >
            {/* Drag Indicator - Gesture Handler */}
            <GestureDetector gesture={verticalPanGesture}>
              <View style={styles.dragIndicatorContainer}>
                <View style={[styles.dragIndicator, { backgroundColor: theme.border }]} />
              </View>
            </GestureDetector>
            
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Patient Details</Text>
              <TouchableOpacity
                onPress={() => {
                  translateY.value = withTiming(1000, { duration: 200 });
                  modalOpacity.value = withTiming(0, { duration: 200 });
                  setTimeout(() => {
                    closeModal();
                  }, 200);
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
                nestedScrollEnabled={true}
              >
                {/* Patient Profile - Enhanced UI */}
              
                    <View style={styles.patientProfileContent}>
                      <View style={[styles.modalPatientAvatarContainer, { borderColor: getTypeColor(selectedPatient.type) + '50' }]}>
                        <Image source={{ uri: selectedPatient.patientImage }} style={styles.modalPatientAvatar} />
                        <View style={[styles.patientStatusIndicator, { backgroundColor: '#10B981' }]} />
                      </View>
                      <View style={styles.patientInfoContainer}>
                        <Text style={[styles.modalPatientName, { color: theme.text }]}>{selectedPatient.patient}</Text>
                        <Text style={[styles.modalPatientInfo, { color: theme.textSecondary }]}>
                          {selectedPatient.age} years • {selectedPatient.gender}
                        </Text>
                        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(selectedPatient.type) + '25', marginTop: verticalScale(10) }]}>
                          {React.createElement(getTypeIcon(selectedPatient.type), { 
                            size: moderateScale(16), 
                            color: getTypeColor(selectedPatient.type) 
                          })}
                          <Text style={[styles.appointmentType, { color: getTypeColor(selectedPatient.type) }]}>
                            {selectedPatient.type} Consultation
                          </Text>
                        </View>
                      </View>
                    </View>
             <AppSeparator size={30}/>
             
             

                {/* Appointment Info */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Appointment Info</Text>
                  <View style={[styles.infoRow, { backgroundColor: theme.surface, ...shadows }]}>
                    <Calendar size={moderateScale(18)} color={theme.primary} />
                    <View style={styles.infoRowContent}>
                      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Date & Time</Text>
                      <Text style={[styles.infoValue, { color: theme.text }]}>
                        {selectedPatient.date} at {selectedPatient.time}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Patient Uploaded Details */}
                {selectedPatient.patientUploadedDetails && (
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Patient Provided Information</Text>
                    
                    {/* Chief Complaint */}
                    {selectedPatient.patientUploadedDetails.chiefComplaint && (
                      <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows, marginBottom: verticalScale(12) }]}>
                        <AlertCircle size={moderateScale(20)} color={theme.primary} />
                        <View style={styles.infoCardContent}>
                          <Text style={[styles.infoCardLabel, { color: theme.textSecondary }]}>Chief Complaint</Text>
                          <Text style={[styles.illnessText, { color: theme.text }]}>{selectedPatient.patientUploadedDetails.chiefComplaint}</Text>
                        </View>
                      </View>
                    )}

                    {/* Symptoms */}
                    {selectedPatient.patientUploadedDetails.symptoms && (
                      <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows, marginBottom: verticalScale(12) }]}>
                        <AlertCircle size={moderateScale(20)} color={theme.primary} />
                        <View style={styles.infoCardContent}>
                          <Text style={[styles.infoCardLabel, { color: theme.textSecondary }]}>Symptoms</Text>
                          <Text style={[styles.illnessText, { color: theme.text }]}>{selectedPatient.patientUploadedDetails.symptoms}</Text>
                        </View>
                      </View>
                    )}

                    {/* Medical History */}
                    {selectedPatient.patientUploadedDetails.medicalHistory && (
                      <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows, marginBottom: verticalScale(12) }]}>
                        <FileText size={moderateScale(20)} color={theme.primary} />
                        <View style={styles.infoCardContent}>
                          <Text style={[styles.infoCardLabel, { color: theme.textSecondary }]}>Medical History</Text>
                          <Text style={[styles.illnessText, { color: theme.text }]}>{selectedPatient.patientUploadedDetails.medicalHistory}</Text>
                        </View>
                      </View>
                    )}

                    {/* Current Medications */}
                    {selectedPatient.patientUploadedDetails.currentMedications && (
                      <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows, marginBottom: verticalScale(12) }]}>
                        <Pill size={moderateScale(20)} color={theme.primary} />
                        <View style={styles.infoCardContent}>
                          <Text style={[styles.infoCardLabel, { color: theme.textSecondary }]}>Current Medications</Text>
                          <Text style={[styles.illnessText, { color: theme.text }]}>{selectedPatient.patientUploadedDetails.currentMedications}</Text>
                        </View>
                      </View>
                    )}

                    {/* Allergies */}
                    {selectedPatient.patientUploadedDetails.allergies && (
                      <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows, marginBottom: verticalScale(12) }]}>
                        <AlertCircle size={moderateScale(20)} color="#EF4444" />
                        <View style={styles.infoCardContent}>
                          <Text style={[styles.infoCardLabel, { color: theme.textSecondary }]}>Allergies</Text>
                          <Text style={[styles.illnessText, { color: theme.text }]}>{selectedPatient.patientUploadedDetails.allergies}</Text>
                        </View>
                      </View>
                    )}

                    {/* Patient Uploaded Reports */}
                    {selectedPatient.patientUploadedDetails.reports && selectedPatient.patientUploadedDetails.reports.length > 0 && (
                      <View style={styles.modalSection}>
                        <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Patient Uploaded Reports</Text>
                        {selectedPatient.patientUploadedDetails.reports.map((report) => (
                          <TouchableOpacity
                            key={report.id}
                            style={[styles.reportCard, { backgroundColor: theme.surface, ...shadows, marginBottom: verticalScale(8) }]}
                            onPress={() => {
                              setSelectedReport({ id: report.id, name: report.name, date: new Date().toLocaleDateString(), imageUrl: report.uri });
                              setReportPreviewVisible(true);
                            }}
                            activeOpacity={0.7}
                          >
                            <FileText size={moderateScale(18)} color={theme.primary} />
                            <View style={styles.reportInfo}>
                              <Text style={[styles.reportName, { color: theme.text }]}>{report.name}</Text>
                              <Text style={[styles.reportDate, { color: theme.textSecondary }]}>Uploaded by patient</Text>
                            </View>
                            <Eye size={moderateScale(18)} color={theme.primary} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* Illness (Fallback if no patient details) */}
                {!selectedPatient.patientUploadedDetails && (
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Illness</Text>
                    <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows }]}>
                      <AlertCircle size={moderateScale(20)} color={theme.primary} />
                      <Text style={[styles.illnessText, { color: theme.text }]}>{selectedPatient.illness}</Text>
                    </View>
                  </View>
                )}

                {/* Prescriptions */}
                {selectedPatient.prescriptions.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Prescriptions</Text>
                    {selectedPatient.prescriptions.map((prescription) => (
                      <View 
                        key={prescription.id} 
                        style={[styles.prescriptionCard, { backgroundColor: theme.surface, ...shadows }]}
                      >
                        <Pill size={moderateScale(18)} color={theme.primary} />
                        <View style={styles.prescriptionInfo}>
                          <Text style={[styles.prescriptionName, { color: theme.text }]}>{prescription.medicine}</Text>
                          <Text style={[styles.prescriptionDetails, { color: theme.textSecondary }]}>
                            {prescription.dosage} • {prescription.frequency}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Reports */}
                {selectedPatient.reports.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Reports</Text>
                    {selectedPatient.reports.map((report) => (
                      <TouchableOpacity
                        key={report.id} 
                        style={[styles.reportCard, { backgroundColor: theme.surface, ...shadows }]}
                        onPress={() => {
                          // Navigate to report viewer or open report
                          navigation.navigate('DoctorDocumentsScreen', { 
                            reportId: report.id,
                            patientId: selectedPatient.id 
                          });
                        }}
                        activeOpacity={0.7}
                      >
                        <FileText size={moderateScale(18)} color={theme.primary} />
                        <View style={styles.reportInfo}>
                          <Text style={[styles.reportName, { color: theme.text }]}>{report.name}</Text>
                          <Text style={[styles.reportDate, { color: theme.textSecondary }]}>{report.date}</Text>
                        </View>
                        <View style={styles.reportActions}>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              setSelectedReport(report);
                              setReportPreviewVisible(true);
                            }}
                            style={[styles.reportActionBtn, { backgroundColor: theme.primary + '20' }]}
                            activeOpacity={0.7}
                          >
                            <Eye size={moderateScale(18)} color={theme.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              toast.success(`Downloading ${report.name}...`);
                            }}
                            style={[styles.reportActionBtn, { backgroundColor: theme.primary + '20', marginLeft: moderateScale(10) }]}
                            activeOpacity={0.7}
                          >
                            <Download size={moderateScale(18)} color={theme.primary} />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Notes */}
                {selectedPatient.notes && (
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Notes</Text>
                    <View style={[styles.notesCard, { backgroundColor: theme.surface, ...shadows }]}>
                      <Text style={[styles.notesText, { color: theme.text }]}>{selectedPatient.notes}</Text>
                    </View>
                  </View>
                )}

                {/* Contact Info */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Contact</Text>
                  <View style={[styles.contactCard, { backgroundColor: theme.surface, ...shadows }]}>
                    <Phone size={moderateScale(18)} color={theme.primary} />
                    <Text style={[styles.contactText, { color: theme.text }]}>{selectedPatient.phone}</Text>
                  </View>
                  <View style={[styles.contactCard, { backgroundColor: theme.surface, ...shadows, marginTop: verticalScale(8) }]}>
                    <Mail size={moderateScale(18)} color={theme.primary} />
                    <Text style={[styles.contactText, { color: theme.text }]}>{selectedPatient.email}</Text>
                  </View>
                </View>

            

                {/* Swipe Actions (Alternative) */}
                <View style={styles.swipeContainer}>
                  <Animated.View style={[styles.swipeConfirm, animatedConfirmStyle]}>
                    <CheckCircle size={moderateScale(24)} color="#fff" />
                    <Text style={styles.swipeText}>Confirm</Text>
                  </Animated.View>
                  
                  <GestureDetector gesture={panGesture}>
                    <Animated.View 
                      style={[
                        styles.swipeableCard, 
                        { backgroundColor: theme.primary, ...shadows },
                        animatedCardStyle
                      ]}
                    >
                      <Text style={[styles.swipeHint, { color: '#fff' }]}>
                        Swipe right to confirm • Swipe left to cancel
                      </Text>
                    </Animated.View>
                  </GestureDetector>
                  
                  <Animated.View style={[styles.swipeCancel, animatedCancelStyle]}>
                    <XCircle size={moderateScale(24)} color="#fff" />
                    <Text style={styles.swipeText}>Cancel</Text>
                  </Animated.View>
                </View>
              </ScrollView>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* Report Preview Modal */}
      <Modal
        visible={reportPreviewVisible}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setReportPreviewVisible(false);
          setSelectedReport(null);
        }}
      >
        <View style={styles.reportPreviewOverlay}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => {
              setReportPreviewVisible(false);
              setSelectedReport(null);
            }}
          />
          <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Animated.View 
              entering={FadeInUp.duration(300)}
              style={[styles.reportPreviewContainer, { backgroundColor: theme.background }]}
            >
            {/* Report Preview Header */}
            <View style={[styles.reportPreviewHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
              <View style={styles.reportPreviewHeaderLeft}>
                <View style={[styles.reportPreviewIcon, { backgroundColor: theme.primary + '15' }]}>
                  <FileText size={moderateScale(24)} color={theme.primary} />
                </View>
                <View style={styles.reportPreviewHeaderText}>
                  <Text style={[styles.reportPreviewTitle, { color: theme.text }]} numberOfLines={1}>
                    {selectedReport?.name || 'Report Preview'}
                  </Text>
                  <Text style={[styles.reportPreviewDate, { color: theme.textSecondary }]}>
                    {selectedReport?.date || ''}
                  </Text>
                  {selectedPatient && (
                    <Text style={[styles.reportPreviewPatientName, { color: theme.textSecondary }]} numberOfLines={1}>
                      Patient: {selectedPatient.patient}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setReportPreviewVisible(false);
                  setSelectedReport(null);
                }}
                style={[styles.reportPreviewCloseBtn, { backgroundColor: theme.surface }]}
                activeOpacity={0.7}
              >
                <X size={moderateScale(20)} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Report Preview Content */}
            <ScrollView 
              style={styles.reportPreviewContent}
              contentContainerStyle={styles.reportPreviewContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Mock Report Content - In real app, this would be the actual report */}
              <View style={[styles.reportPreviewCard, { backgroundColor: theme.surface, ...shadows }]}>
                <View style={styles.reportPreviewCardHeader}>
                  <View style={[styles.reportPreviewBadge, { backgroundColor: theme.primary + '15' }]}>
                    <Star size={moderateScale(14)} color={theme.primary} />
                    <Text style={[styles.reportPreviewBadgeText, { color: theme.primary }]}>Verified</Text>
                  </View>
                  <Text style={[styles.reportPreviewStatus, { color: theme.textSecondary }]}>Completed</Text>
                </View>
                
                <View style={styles.reportPreviewSection}>
                  <Text style={[styles.reportPreviewSectionTitle, { color: theme.text }]}>Patient Information</Text>
                  <View style={styles.reportPreviewInfoRow}>
                    <Text style={[styles.reportPreviewInfoLabel, { color: theme.textSecondary }]}>Patient Name:</Text>
                    <Text style={[styles.reportPreviewInfoValue, { color: theme.text }]}>{selectedPatient?.patient || 'N/A'}</Text>
                  </View>
                  <View style={styles.reportPreviewInfoRow}>
                    <Text style={[styles.reportPreviewInfoLabel, { color: theme.textSecondary }]}>Age:</Text>
                    <Text style={[styles.reportPreviewInfoValue, { color: theme.text }]}>{selectedPatient?.age || 'N/A'} years</Text>
                  </View>
                  <View style={styles.reportPreviewInfoRow}>
                    <Text style={[styles.reportPreviewInfoLabel, { color: theme.textSecondary }]}>Gender:</Text>
                    <Text style={[styles.reportPreviewInfoValue, { color: theme.text }]}>{selectedPatient?.gender || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.reportPreviewSection}>
                  <Text style={[styles.reportPreviewSectionTitle, { color: theme.text }]}>Test Results</Text>
                  <View style={[styles.reportPreviewResultCard, { backgroundColor: theme.background }]}>
                    <View style={styles.reportPreviewResultRow}>
                      <Text style={[styles.reportPreviewResultLabel, { color: theme.textSecondary }]}>Test Name</Text>
                      <Text style={[styles.reportPreviewResultValue, { color: theme.text }]}>Result</Text>
                      <Text style={[styles.reportPreviewResultStatus, { color: '#10B981' }]}>Normal</Text>
                    </View>
                    <View style={styles.reportPreviewResultRow}>
                      <Text style={[styles.reportPreviewResultLabel, { color: theme.textSecondary }]}>Blood Pressure</Text>
                      <Text style={[styles.reportPreviewResultValue, { color: theme.text }]}>120/80</Text>
                      <Text style={[styles.reportPreviewResultStatus, { color: '#10B981' }]}>Normal</Text>
                    </View>
                    <View style={styles.reportPreviewResultRow}>
                      <Text style={[styles.reportPreviewResultLabel, { color: theme.textSecondary }]}>Heart Rate</Text>
                      <Text style={[styles.reportPreviewResultValue, { color: theme.text }]}>72 bpm</Text>
                      <Text style={[styles.reportPreviewResultStatus, { color: '#10B981' }]}>Normal</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.reportPreviewSection}>
                  <Text style={[styles.reportPreviewSectionTitle, { color: theme.text }]}>Doctor's Notes</Text>
                  <View style={[styles.reportPreviewNotesCard, { backgroundColor: theme.background }]}>
                    <Text style={[styles.reportPreviewNotesText, { color: theme.text }]}>
                      Patient shows normal vital signs. All test results are within normal range. 
                      Continue current medication regimen and schedule follow-up in 3 months.
                    </Text>
                  </View>
                </View>

                {/* Report Preview Image */}
                {selectedReport?.imageUrl ? (
                  <View style={styles.reportPreviewSection}>
                    <Text style={[styles.reportPreviewSectionTitle, { color: theme.text }]}>Report Document</Text>
                    <TouchableOpacity
                      style={[styles.reportPreviewImageContainer, { backgroundColor: theme.background }]}
                      onPress={() => {
                        if (selectedReport.imageUrl) {
                          setViewerImageUrl(selectedReport.imageUrl);
                          setImageViewerVisible(true);
                        }
                      }}
                      activeOpacity={0.9}
                    >
                      <Image
                        source={{ uri: selectedReport.imageUrl }}
                        style={styles.reportPreviewImage}
                        resizeMode="contain"
                      />
                      <View style={styles.reportImageOverlay}>
                        <View style={[styles.reportImageOverlayContent, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                          <ZoomIn size={moderateScale(24)} color="#fff" />
                          <Text style={styles.reportImageOverlayText}>Tap to view full screen</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.reportPreviewSection}>
                    <Text style={[styles.reportPreviewSectionTitle, { color: theme.text }]}>Report Document</Text>
                    <View style={[styles.reportPreviewImageContainer, { backgroundColor: theme.background }]}>
                      <View style={[styles.reportPreviewImagePlaceholder, { backgroundColor: theme.surface }]}>
                        <FileText size={moderateScale(40)} color={theme.textSecondary} />
                        <Text style={[styles.reportPreviewImageText, { color: theme.textSecondary }]}>
                          No image available
                        </Text>
                        <Text style={[styles.reportPreviewImageSubtext, { color: theme.textSecondary }]}>
                          Report image will appear here when uploaded
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Report Preview Actions */}
            <View style={[styles.reportPreviewActions, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
              <TouchableOpacity
                style={[styles.reportPreviewActionBtn, { backgroundColor: theme.primary + '15' }]}
                onPress={() => {
                  toast.success('Sharing report...');
                }}
              >
                <Share2 size={moderateScale(18)} color={theme.primary} />
                <Text style={[styles.reportPreviewActionText, { color: theme.primary }]}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.reportPreviewActionBtn, { backgroundColor: theme.primary + '15' }]}
                onPress={() => {
                  if (selectedReport) {
                    toast.success(`Downloading ${selectedReport.name}...`);
                    // In real app, implement actual download logic here
                  }
                }}
                activeOpacity={0.7}
              >
                <Download size={moderateScale(18)} color={theme.primary} />
                <Text style={[styles.reportPreviewActionText, { color: theme.primary }]}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.reportPreviewActionBtn, styles.reportPreviewPrimaryBtn, { backgroundColor: theme.primary }]}
                onPress={() => {
                  setReportPreviewVisible(false);
                  setSelectedReport(null);
                }}
                activeOpacity={0.8}
              >
                <CheckCircle size={moderateScale(18)} color="#fff" />
                <Text style={styles.reportPreviewPrimaryText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Full Screen Image Viewer */}
      <Modal
        visible={imageViewerVisible}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <View style={styles.imageViewerOverlay}>
          <TouchableOpacity
            style={styles.imageViewerCloseBtn}
            onPress={() => setImageViewerVisible(false)}
            activeOpacity={0.8}
          >
            <X size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>
          <ScrollView
            contentContainerStyle={styles.imageViewerContent}
            maximumZoomScale={5}
            minimumZoomScale={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={{ uri: viewerImageUrl }}
              style={styles.imageViewerImage}
              resizeMode="contain"
            />
          </ScrollView>
          <View style={styles.imageViewerActions}>
            <TouchableOpacity
              style={[styles.imageViewerActionBtn, { backgroundColor: theme.primary }]}
              onPress={() => {
                if (viewerImageUrl) {
                  toast.success('Downloading image...');
                  // In real app, implement actual download logic here
                }
              }}
              activeOpacity={0.8}
            >
              <Download size={moderateScale(20)} color="#fff" />
              <Text style={styles.imageViewerActionText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.imageViewerActionBtn, { backgroundColor: theme.primary + '15' }]}
              onPress={() => {
                toast.success('Sharing image...');
              }}
              activeOpacity={0.8}
            >
              <Share2 size={moderateScale(20)} color={theme.primary} />
              <Text style={[styles.imageViewerActionText, { color: theme.primary }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
  },
  appointmentCard: {
    borderRadius: moderateScale(20),
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
    flex: 1,
    gap: moderateScale(12),
  },
  patientAvatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    gap: moderateScale(4),
  },
  appointmentType: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: verticalScale(12),
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(16),
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1,
  },
  modalContent: {
    borderTopLeftRadius: moderateScale(28),
    borderTopRightRadius: moderateScale(28),
    maxHeight: '92%',
    minHeight: '60%',
    paddingTop: verticalScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
    width: '100%',
    zIndex: 2,
    position: 'relative',
  },
  dragIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingBottom: verticalScale(16),
  },
  dragIndicator: {
    width: moderateScale(40),
    height: moderateScale(4),
    borderRadius: moderateScale(2),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(16),
    paddingTop: verticalScale(4),
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
    flexGrow: 1,
  },
  modalBodyContent: {
    padding: moderateScale(20),
    paddingBottom: verticalScale(40),
    flexGrow: 1,
  },
  patientProfileCard: {
    borderRadius: moderateScale(24),
    marginBottom: verticalScale(24),
    overflow: 'hidden',
    borderWidth: 1,
  },
  patientProfileGradient: {
    width: '100%',
    padding: moderateScale(24),
  },
  patientProfileContent: {
    alignItems: 'center',
  },
  patientInfoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  modalPatientAvatarContainer: {
    position: 'relative',
    marginBottom: verticalScale(16),
    borderWidth: 4,
    borderRadius: moderateScale(50),
    padding: moderateScale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalPatientAvatar: {
    width: moderateScale(92),
    height: moderateScale(92),
    borderRadius: moderateScale(46),
  },
  patientStatusIndicator: {
    position: 'absolute',
    bottom: moderateScale(4),
    right: moderateScale(4),
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    gap: moderateScale(12),
  },
  infoRowContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  infoValue: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    gap: moderateScale(12),
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  illnessText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    flex: 1,
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
    padding: moderateScale(18),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(10),
    gap: moderateScale(14),
    borderWidth: 1,
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  reportDate: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  reportActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportActionBtn: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notesCard: {
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
  },
  notesText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontWeight: '500',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    gap: moderateScale(12),
  },
  contactText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    flex: 1,
  },
  swipeContainer: {
    position: 'relative',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  swipeableCard: {
    padding: moderateScale(20),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    zIndex: 2,
  },
  swipeHint: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    textAlign: 'center',
  },
  swipeConfirm: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#10B981',
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  swipeCancel: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#EF4444',
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  swipeText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '900',
    marginTop: verticalScale(8),
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginTop: verticalScale(24),
    marginBottom: verticalScale(20),
    paddingHorizontal: moderateScale(4),
  },
  actionButton: {
    flex: 1,
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    minHeight: verticalScale(56),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(16),
    gap: moderateScale(10),
  },
  cancelButton: {
    shadowColor: '#EF4444',
    shadowOpacity: 0.4,
  },
  confirmButton: {
    shadowColor: '#10B981',
    shadowOpacity: 0.5,
  },
  actionButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  reportPreviewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  reportPreviewContainer: {
    width: '100%',
    maxWidth: SCREEN_WIDTH - moderateScale(40),
    maxHeight: '90%',
    borderRadius: moderateScale(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  reportPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(20),
    borderBottomWidth: 1,
  },
  reportPreviewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: moderateScale(12),
  },
  reportPreviewIcon: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportPreviewHeaderText: {
    flex: 1,
    marginLeft: moderateScale(4),
  },
  reportPreviewTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(2),
  },
  reportPreviewDate: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    marginBottom: verticalScale(2),
  },
  reportPreviewPatientName: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginTop: verticalScale(2),
  },
  reportPreviewCloseBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportPreviewContent: {
    flex: 1,
  },
  reportPreviewContentContainer: {
    padding: moderateScale(20),
  },
  reportPreviewCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
  },
  reportPreviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  reportPreviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
    gap: moderateScale(6),
  },
  reportPreviewBadgeText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
  reportPreviewStatus: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  reportPreviewSection: {
    marginBottom: verticalScale(24),
  },
  reportPreviewSectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    marginBottom: verticalScale(12),
  },
  reportPreviewInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  reportPreviewInfoLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    flex: 1,
  },
  reportPreviewInfoValue: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  reportPreviewResultCard: {
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginTop: verticalScale(8),
  },
  reportPreviewResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  reportPreviewResultLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    flex: 2,
  },
  reportPreviewResultValue: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  reportPreviewResultStatus: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  reportPreviewNotesCard: {
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginTop: verticalScale(8),
  },
  reportPreviewNotesText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    fontWeight: '500',
  },
  reportPreviewImageContainer: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    marginTop: verticalScale(8),
    position: 'relative',
    backgroundColor: '#000',
    minHeight: verticalScale(400),
    maxHeight: verticalScale(600),
  },
  reportPreviewImage: {
    width: '100%',
    height: verticalScale(500),
    borderRadius: moderateScale(16),
  },
  reportImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: moderateScale(16),
  },
  reportImageOverlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
  },
  reportImageOverlayText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  reportPreviewImagePlaceholder: {
    height: verticalScale(300),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(16),
  },
  reportPreviewImageText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginTop: verticalScale(12),
  },
  reportPreviewImageSubtext: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    marginTop: verticalScale(4),
  },
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerCloseBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? moderateScale(50) : moderateScale(30),
    right: moderateScale(20),
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imageViewerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  imageViewerImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  imageViewerActions: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? moderateScale(40) : moderateScale(20),
    left: moderateScale(20),
    right: moderateScale(20),
    flexDirection: 'row',
    gap: moderateScale(12),
  },
  imageViewerActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
  },
  imageViewerActionText: {
    color: '#fff',
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
  reportPreviewActions: {
    flexDirection: 'row',
    padding: moderateScale(16),
    borderTopWidth: 1,
    gap: moderateScale(10),
  },
  reportPreviewActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
  },
  reportPreviewPrimaryBtn: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  reportPreviewActionText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  reportPreviewPrimaryText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  viewAllBtn: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
  },
  viewAllText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});

export default DoctorAppointmentsScreen;
