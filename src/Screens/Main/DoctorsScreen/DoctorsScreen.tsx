import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { DoctorFilters } from './components/DoctorFilters';
import { useDoctors } from './hooks/useDoctors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Star, Clock, IndianRupee } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BookingModal } from './components/BookingModal';
import { useAppointmentStore } from '@/hooks/useAppointmentStore';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';
import { ScreenWrapper } from '@/Components/ScreenWrapper';

const DoctorsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const addAppointment = useAppointmentStore((state) => state.addAppointment);
  
  const [selectedDoctor, setSelectedDoctor] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const {
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    minRating,
    setMinRating,
    filteredDoctors,
    specialties,
  } = useDoctors();

  const handleBookPress = (doctor: any) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const handleConfirmBooking = (date: string, time: string) => {
    if (!selectedDoctor) return;

    const newAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorImage: selectedDoctor.image,
      specialty: selectedDoctor.specialty,
      date: date,
      time: time,
      status: 'upcoming' as const,
    };
    
    addAppointment(newAppointment);
    setModalVisible(false);
    toast.success('Appointment Booked Successfully!');
    setTimeout(() => {
      navigation.navigate('AppointmentsScreen');
    }, 1500);
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

      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctor}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No doctors found matching your criteria.</Text>
          </View>
        }
      />

      {selectedDoctor && (
        <BookingModal 
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleConfirmBooking}
          doctorName={selectedDoctor.name}
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
});

export default DoctorsScreen;
