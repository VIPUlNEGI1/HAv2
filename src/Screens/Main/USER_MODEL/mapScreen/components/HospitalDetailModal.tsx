import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, Dimensions, Image } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { X, MapPin, Star, Navigation, Phone, Clock, ShieldCheck } from 'lucide-react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { AnimatedButton } from '@/Components/AnimatedButton';

const { height } = Dimensions.get('window');

interface HospitalDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onTrackPress: (place: any) => void;
  place: any;
  distance: string;
}

export const HospitalDetailModal: React.FC<HospitalDetailModalProps> = ({
  visible,
  onClose,
  onTrackPress,
  place,
  distance,
}) => {
  const { theme, shadows } = useTheme();

  if (!place) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <Animated.View 
          entering={SlideInUp} 
          style={[styles.modalContent, { backgroundColor: theme.surface }]}
        >
          <View style={styles.header}>
            <View style={[styles.typeTag, { backgroundColor: theme.accent }]}>
              <Text style={[styles.typeText, { color: theme.primary }]}>{place.type.toUpperCase()}</Text>
            </View>
            <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.background }]}>
              <X size={20} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            <View style={styles.mainInfo}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: theme.text }]}>{place.name}</Text>
                  <View style={styles.ratingRow}>
                    <Star size={16} color="#F59E0B" fill="#F59E0B" />
                    <Text style={[styles.ratingText, { color: theme.text }]}>{place.rating}</Text>
                    <View style={[styles.dot, { backgroundColor: theme.border }]} />
                    <Text style={[styles.distanceText, { color: theme.primary }]}>{distance} km away</Text>
                  </View>
                </View>
                <Image source={{ uri: place.image }} style={styles.placeImage} />
              </View>
            </View>

            <View style={[styles.addressCard, { backgroundColor: theme.background }]}>
              <MapPin size={18} color={theme.textSecondary} />
              <Text style={[styles.addressText, { color: theme.textSecondary }]}>{place.address}</Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Services Provided</Text>
              <View style={styles.servicesGrid}>
                {place.services.map((service: string, index: number) => (
                  <View key={index} style={[styles.serviceTag, { borderColor: theme.border }]}>
                    <ShieldCheck size={14} color={theme.primary} />
                    <Text style={[styles.serviceText, { color: theme.text }]}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.quickInfoRow}>
              <View style={styles.infoItem}>
                <Clock size={18} color={theme.primary} />
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Open 24/7</Text>
              </View>
              <View style={styles.infoItem}>
                <Phone size={18} color={theme.primary} />
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Call Lab</Text>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <AnimatedButton
              title="Track Distance"
              icon={<Navigation size={20} color="#fff" fill="#fff" />}
              onPress={() => onTrackPress(place)}
              style={{ backgroundColor: theme.primary }}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  dismissArea: { flex: 1 },
  modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: height * 0.7 },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  typeText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  scrollBody: { paddingHorizontal: 20, paddingBottom: 30 },
  mainInfo: { marginBottom: 20 },
  titleRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  placeImage: { width: 80, height: 80, borderRadius: 16 },
  name: { fontSize: 22, fontWeight: '900', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingText: { fontSize: 15, fontWeight: '700' },
  dot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 4 },
  distanceText: { fontSize: 15, fontWeight: '800' },
  addressCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: 16, marginBottom: 24 },
  addressText: { flex: 1, fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceTag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  serviceText: { fontSize: 13, fontWeight: '600' },
  quickInfoRow: { flexDirection: 'row', gap: 20, marginTop: 10 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoLabel: { fontSize: 14, fontWeight: '700' },
  footer: { padding: 20, paddingBottom: 34, borderTopWidth: 1 },
});
