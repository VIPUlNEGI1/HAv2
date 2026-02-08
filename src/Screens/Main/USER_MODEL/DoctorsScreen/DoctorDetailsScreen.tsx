import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { ChevronLeft, Star, MessageSquare, Calendar, Award, Activity, Users, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

import { useAppointmentStore } from '@/hooks/useAppointmentStore';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import { BookingModal } from './components/BookingModal';

const DoctorDetailsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { doctor } = route.params;
  const addAppointment = useAppointmentStore((state) => state.addAppointment);
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleConfirmBooking = (date: string, time: string, patientDetails?: any) => {
    const newAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorImage: doctor.image,
      specialty: doctor.specialty,
      date: date,
      time: time,
      status: 'upcoming' as const,
      patientDetails: patientDetails || null, // Store patient details for doctor to view
    };
    
    addAppointment(newAppointment);
    setModalVisible(false);
    toast.success('Appointment Booked Successfully!');
    setTimeout(() => {
      navigation.navigate('AppointmentsScreen');
    }, 1500);
  };

  const stats = [
    { id: '1', label: 'Operations', value: '500+', icon: Activity, color: '#E3F2FD', iconColor: '#1565C0' },
    { id: '2', label: 'Patients', value: '2K+', icon: Users, color: '#E8F5E9', iconColor: '#2E7D32' },
    { id: '3', label: 'Experience', value: doctor.exp, icon: Award, color: '#FFF3E0', iconColor: '#EF6C00' },
  ];

  const alternatives = [
    { id: '10', name: 'Dr. Sarah', specialty: doctor.specialty, rating: '4.8', price: 600, image: 'https://i.pravatar.cc/150?u=10' },
    { id: '11', name: 'Dr. Mike', specialty: doctor.specialty, rating: '4.7', price: 1200, image: 'https://i.pravatar.cc/150?u=11' },
    { id: '12', name: 'Dr. Elena', specialty: doctor.specialty, rating: '4.9', price: 750, image: 'https://i.pravatar.cc/150?u=12' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.surface }]}>
          <ChevronLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Doctor Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Profile Card */}
        <Animated.View 
          entering={FadeInUp.springify().damping(15).stiffness(100)} 
          style={[styles.profileCard, { backgroundColor: theme.surface, ...shadows }]}
        >
          <View style={styles.profileTop}>
            <View style={[styles.avatarWrapper, { borderColor: theme.primary + '22' }]}>
              <Image source={{ uri: doctor.image }} style={styles.avatar} />
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: theme.text }]}>{doctor.name}</Text>
                <ShieldCheck size={18} color={theme.primary} />
              </View>
              <Text style={[styles.specialty, { color: theme.primary }]}>{doctor.specialty}</Text>
              <View style={styles.ratingRow}>
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text style={[styles.ratingText, { color: theme.text }]}>{doctor.rating} (120+ Reviews)</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsGrid}>
            {stats.map(stat => (
              <View key={stat.id} style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <stat.icon size={20} color={stat.iconColor} />
                </View>
                <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Expertise Description */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Expertise & Biography</Text>
          <Text style={[styles.bioText, { color: theme.textSecondary }]}>
            {doctor.name} is a highly skilled {doctor.specialty} with over {doctor.exp} of experience. 
            Specializing in advanced surgical procedures and patient-centric care. Known for 
            precision in complex operations and a holistic approach to recovery.
          </Text>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.chatBtn, { borderColor: theme.primary }]}
            onPress={() => navigation.navigate('ChatScreen', { receiver: doctor })}
          >
            <MessageSquare size={20} color={theme.primary} />
            <Text style={[styles.chatBtnText, { color: theme.primary }]}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.bookBtn, { backgroundColor: theme.primary }]}
            onPress={() => setModalVisible(true)}
          >
            <Calendar size={20} color="#fff" />
            <Text style={styles.bookBtnText}>Book Appointment</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Alternatives Section (Medicine Style Card UI) */}
        <View style={styles.alternativesSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Similar Specialists</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DoctorsScreen')} style={styles.seeAll}>
              <Text style={{ color: theme.primary, fontWeight: '700' }}>See All</Text>
              <ArrowRight size={16} color={theme.primary} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={alternatives}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.altList}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => navigation.push('DoctorDetailsScreen', { doctor: item })}
                style={[styles.altCard, { backgroundColor: theme.surface, ...shadows }]}
              >
                <View style={styles.altImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.altAvatar} />
                  {item.price < doctor.price && (
                    <View style={[styles.cheaperBadge, { backgroundColor: theme.success }]}>
                      <Text style={styles.cheaperText}>SAVINGS</Text>
                    </View>
                  )}
                </View>
                <View style={styles.altInfo}>
                  <Text style={[styles.altName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                  <Text style={[styles.altSpec, { color: theme.primary }]} numberOfLines={1}>{item.specialty}</Text>
                  <View style={styles.altFooter}>
                    <View style={styles.altRating}>
                      <Star size={10} color="#FFD700" fill="#FFD700" />
                      <Text style={[styles.altRatingText, { color: theme.textSecondary }]}>{item.rating}</Text>
                    </View>
                    <Text style={[styles.altPrice, { color: theme.text }]}>₹{item.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <BookingModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmBooking}
        doctorName={doctor.name}
      />
      <Toasts />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: '900', marginLeft: 16 },
  scrollContent: { padding: 16 },
  profileCard: { borderRadius: 28, padding: 20, marginBottom: 24 },
  profileTop: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: { width: 94, height: 94, borderRadius: 28, borderWidth: 4, padding: 2, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 22 },
  profileInfo: { flex: 1, marginLeft: 16 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 20, fontWeight: '900' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  ratingText: { fontSize: 12, fontWeight: '700' },
  specialty: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  statsGrid: { flexDirection: 'row', marginTop: 24, justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 16, fontWeight: '900' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 12 },
  bioText: { fontSize: 14, lineHeight: 22, fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  chatBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16, borderWidth: 2, gap: 8 },
  chatBtnText: { fontSize: 16, fontWeight: '800' },
  bookBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16, gap: 8 },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  alternativesSection: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  altList: { paddingRight: 16 },
  altCard: { width: 160, borderRadius: 24, padding: 12, marginRight: 16, marginBottom: 8 },
  altImageContainer: { width: '100%', height: 100, backgroundColor: '#f8f8f8', borderRadius: 16, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  altAvatar: { width: '100%', height: '100%', resizeMode: 'cover' },
  cheaperBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  cheaperText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  altInfo: { marginTop: 12 },
  altName: { fontSize: 14, fontWeight: '900' },
  altSpec: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  altFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  altRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  altRatingText: { fontSize: 11, fontWeight: '800' },
  altPrice: { fontSize: 15, fontWeight: '900' },
});

export default DoctorDetailsScreen;
