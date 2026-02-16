import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { DoctorFilters } from './components/DoctorFilters';
import { useDoctors } from './hooks/useDoctors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Star, Clock, IndianRupee } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BookingModal } from './components/BookingModal';
import { useAppointmentStore } from '@/hooks/useAppointmentStore';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';

/** MongoDB ObjectIds are 24 hex characters. Only call create-appointment API when doctor_id is valid. */
const isValidObjectId = (id: string): boolean => /^[a-fA-F0-9]{24}$/.test(id ?? '');

const DoctorsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const addAppointment = useAppointmentStore((state) => state.addAppointment);
  const token = useAuthStore((state) => state.token);

  const [selectedDoctor, setSelectedDoctor] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    minRating,
    setMinRating,
    filteredDoctors,
    specialties,
    loading,
    onRefresh,
  } = useDoctors();
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh?.();
    setRefreshing(false);
  };

  const handleBookPress = (doctor: any) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const handleConfirmBooking = async (
    dateISO: string,
    dateDisplay: string,
    time: string,
    patientDetails?: { chiefComplaint?: string; symptoms?: string; medicalHistory?: string; currentMedications?: string; allergies?: string; reports?: Array<{ id: string; name: string; uri: string }> }
  ) => {
    if (!selectedDoctor) return;

    const body = {
      doctor_id: selectedDoctor.id,
      appointment_date: `${dateISO}T12:00:00.000Z`,
      appointment_time: time,
      type: 'in-person',
      reason: patientDetails?.chiefComplaint ?? '',
      patient_uploaded_details: {
        chief_complaint: patientDetails?.chiefComplaint ?? '',
        symptoms: patientDetails?.symptoms ?? '',
        medical_history: patientDetails?.medicalHistory ?? '',
        current_medications: patientDetails?.currentMedications ?? '',
        allergies: patientDetails?.allergies ?? '',
        reports: (patientDetails?.reports ?? []).map((r) => ({ name: r.name, uri: r.uri })),
      },
    };

    let createdId: string | null = null;
    if (token && isValidObjectId(selectedDoctor.id)) {
      setBookingLoading(true);
      const res = await APICall<{ data?: { _id?: string } }>(
        'post',
        body,
        ApiRoutes.appointments.create,
        {},
        token
      );
      setBookingLoading(false);
      if (res.status !== 201 && res.status !== 200) {
        const msg = (res.data as { message?: string })?.message ?? 'Could not book appointment.';
        toast.error(msg);
        return;
      }
      createdId = res.data?.data?._id ? String(res.data.data._id) : null;
    }

    const newAppointment = {
      id: createdId ?? Math.random().toString(36).substr(2, 9),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorImage: selectedDoctor.image,
      specialty: selectedDoctor.specialty,
      date: dateDisplay,
      time,
      status: 'upcoming' as const,
    };
    addAppointment(newAppointment);
    setModalVisible(false);
    setSelectedDoctor(null);
    toast.success('Appointment Booked Successfully!');
    setTimeout(() => navigation.navigate('AppointmentsScreen'), 800);
  };

  const renderDoctor = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 100)} style={[styles.card, { backgroundColor: theme.surface, ...shadows }]}>
      <View style={styles.cardTop}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
            <View style={[styles.ratingBadge, { backgroundColor: theme.accent }]}>
              <Star size={12} color="#FFD700" fill="#FFD700" />
              <Text style={[styles.ratingText, { color: theme.primary }]}>{item.rating}</Text>
            </View>
          </View>
          <Text style={[styles.specialty, { color: theme.primary }]}>{item.specialty}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Clock size={14} color={theme.textSecondary} />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>{item.exp} Exp</Text>
            </View>
            <View style={[styles.stat, { marginLeft: 16 }]}>
              <IndianRupee size={14} color={theme.textSecondary} />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>{item.price} Fee</Text>
            </View>
          </View>
        </View>
      </View>
      <AppSeparator size={20} />
      <View style={[styles.cardBottom, { borderTopColor: theme.border }]}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: theme.background }]}
          onPress={() => navigation.navigate('DoctorDetailsScreen', { doctor: item })}
        >
          <Text style={[styles.actionBtnText, { color: theme.text }]}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.bookBtn, { backgroundColor: theme.primary }]}
          onPress={() => handleBookPress(item)}
        >
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <ScreenWrapper
      title="Find Doctors"
      showBack={true}
      showSearch={false}
      scrollable={false}
    >
      <DoctorFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        specialties={specialties}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        minRating={minRating}
        setMinRating={setMinRating}
      />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctor}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[theme.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No doctors found.</Text>
            </View>
          }
        />
      )}

      {selectedDoctor && (
        <BookingModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleConfirmBooking}
          doctorName={selectedDoctor.name}
          loading={bookingLoading}
        />
      )}
      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,   }, // Added padding for persistent tabs
  list: { padding: 16 },
  card: { borderRadius: 24, marginBottom: 16, overflow: 'hidden' },
  cardTop: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  image: { width: 90, height: 90, borderRadius: 20 },
  info: { flex: 1, marginLeft: 16 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: 18, fontWeight: '900', flex: 1 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '800' },
  specialty: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, fontWeight: '600' },
  cardBottom: { flexDirection: 'row', padding: 12, borderTopWidth: 1, gap: 12 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  actionBtnText: { fontSize: 13, fontWeight: '800' },
  bookBtn: { flex: 1.5, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  bookBtnText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default DoctorsScreen;
