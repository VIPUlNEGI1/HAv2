import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Switch,
} from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { 
  Stethoscope,
  DollarSign,
  Clock,
  Video,
  Phone,
  MessageSquare,
  Save,
  Plus,
  X,
  Calendar,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';

interface Service {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'chat';
  price: number;
  duration: number; // in minutes
  enabled: boolean;
  description: string;
}

const DoctorManageServicesScreen = () => {
  const { theme, shadows } = useTheme();
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Video Consultation',
      type: 'video',
      price: 1000,
      duration: 30,
      enabled: true,
      description: 'Face-to-face video consultation',
    },
    {
      id: '2',
      name: 'Audio Consultation',
      type: 'audio',
      price: 800,
      duration: 30,
      enabled: true,
      description: 'Voice call consultation',
    },
    {
      id: '3',
      name: 'Chat Consultation',
      type: 'chat',
      price: 500,
      duration: 0,
      enabled: true,
      description: 'Text-based consultation',
    },
  ]);

  const [availableSlots, setAvailableSlots] = useState([
    { id: '1', day: 'Monday', startTime: '09:00', endTime: '17:00', enabled: true },
    { id: '2', day: 'Tuesday', startTime: '09:00', endTime: '17:00', enabled: true },
    { id: '3', day: 'Wednesday', startTime: '09:00', endTime: '17:00', enabled: true },
    { id: '4', day: 'Thursday', startTime: '09:00', endTime: '17:00', enabled: true },
    { id: '5', day: 'Friday', startTime: '09:00', endTime: '17:00', enabled: true },
    { id: '6', day: 'Saturday', startTime: '10:00', endTime: '14:00', enabled: true },
    { id: '7', day: 'Sunday', startTime: '10:00', endTime: '14:00', enabled: false },
  ]);

  const handleSave = () => {
    toast.success('Services updated successfully!');
  };

  const handleAddService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: '',
      type: 'video',
      price: 0,
      duration: 30,
      enabled: true,
      description: '',
    };
    setServices([...services, newService]);
  };

  const handleDeleteService = (id: string) => {
    if (services.length > 1) {
      setServices(services.filter(s => s.id !== id));
      toast.success('Service removed');
    } else {
      toast.error('At least one service is required');
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Phone;
      default: return MessageSquare;
    }
  };

  const updateService = (id: string, field: keyof Service, value: any) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateSlot = (id: string, field: string, value: any) => {
    setAvailableSlots(availableSlots.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <ScreenWrapper title="Manage Services" showBack={true} scrollable={true}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Services Section */}
        <Animated.View entering={FadeInDown.delay(0)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Consultation Services</Text>
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: theme.primary }]}
                onPress={handleAddService}
              >
                <Plus size={moderateScale(16)} color="#fff" />
              </TouchableOpacity>
            </View>

            {services.map((service, index) => {
              const ServiceIcon = getServiceIcon(service.type);
              return (
                <Animated.View
                  key={service.id}
                  entering={FadeInDown.delay(index * 50)}
                >
                  <View style={[styles.serviceCard, { backgroundColor: theme.surface, ...shadows }]}>
                    <View style={styles.serviceHeader}>
                      <View style={[styles.serviceIconBg, { backgroundColor: theme.primary + '15' }]}>
                        <ServiceIcon size={moderateScale(20)} color={theme.primary} />
                      </View>
                      <View style={styles.serviceInfo}>
                        <TextInput
                          style={[styles.serviceNameInput, { color: theme.text }]}
                          value={service.name}
                          onChangeText={(text) => updateService(service.id, 'name', text)}
                          placeholder="Service Name"
                          placeholderTextColor={theme.textSecondary}
                        />
                        <TextInput
                          style={[styles.serviceDescInput, { color: theme.textSecondary }]}
                          value={service.description}
                          onChangeText={(text) => updateService(service.id, 'description', text)}
                          placeholder="Description"
                          placeholderTextColor={theme.textSecondary}
                          multiline
                        />
                      </View>
                      {services.length > 1 && (
                        <TouchableOpacity
                          onPress={() => handleDeleteService(service.id)}
                          style={styles.deleteBtn}
                        >
                          <X size={moderateScale(18)} color={theme.error || '#EF4444'} />
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    <View style={styles.serviceDetails}>
                      <View style={styles.detailRow}>
                        <DollarSign size={moderateScale(18)} color={theme.textSecondary} />
                        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Price (₹)</Text>
                        <TextInput
                          style={[styles.priceInput, { color: theme.text, borderColor: theme.border }]}
                          value={service.price.toString()}
                          onChangeText={(text) => updateService(service.id, 'price', parseInt(text) || 0)}
                          keyboardType="numeric"
                          placeholder="0"
                        />
                      </View>

                      <View style={styles.detailRow}>
                        <Clock size={moderateScale(18)} color={theme.textSecondary} />
                        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Duration (min)</Text>
                        <TextInput
                          style={[styles.durationInput, { color: theme.text, borderColor: theme.border }]}
                          value={service.duration.toString()}
                          onChangeText={(text) => updateService(service.id, 'duration', parseInt(text) || 0)}
                          keyboardType="numeric"
                          placeholder="30"
                        />
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Enable Service</Text>
                        <Switch
                          value={service.enabled}
                          onValueChange={(value) => updateService(service.id, 'enabled', value)}
                          trackColor={{ false: theme.border, true: theme.primary }}
                          thumbColor="#fff"
                        />
                      </View>
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Schedule Section */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Available Schedule</Text>
            {availableSlots.map((slot, index) => (
              <Animated.View
                key={slot.id}
                entering={FadeInDown.delay(350 + index * 50)}
              >
                <View style={[styles.slotCard, { backgroundColor: theme.surface, ...shadows }]}>
                  <View style={styles.slotHeader}>
                    <View style={styles.slotDay}>
                      <Calendar size={moderateScale(18)} color={theme.primary} />
                      <Text style={[styles.slotDayText, { color: theme.text }]}>{slot.day}</Text>
                    </View>
                    <Switch
                      value={slot.enabled}
                      onValueChange={(value) => updateSlot(slot.id, 'enabled', value)}
                      trackColor={{ false: theme.border, true: theme.primary }}
                      thumbColor="#fff"
                    />
                  </View>
                  {slot.enabled && (
                    <View style={styles.slotTimeRow}>
                      <View style={styles.timeInputContainer}>
                        <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Start</Text>
                        <TextInput
                          style={[styles.timeInput, { color: theme.text, borderColor: theme.border }]}
                          value={slot.startTime}
                          onChangeText={(text) => updateSlot(slot.id, 'startTime', text)}
                          placeholder="09:00"
                        />
                      </View>
                      <Text style={[styles.timeSeparator, { color: theme.textSecondary }]}>-</Text>
                      <View style={styles.timeInputContainer}>
                        <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>End</Text>
                        <TextInput
                          style={[styles.timeInput, { color: theme.text, borderColor: theme.border }]}
                          value={slot.endTime}
                          onChangeText={(text) => updateSlot(slot.id, 'endTime', text)}
                          placeholder="17:00"
                        />
                      </View>
                    </View>
                  )}
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Save Button */}
        <Animated.View entering={FadeInDown.delay(600)}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleSave}
          >
            <Save size={moderateScale(20)} color="#fff" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: verticalScale(30) }} />
      </ScrollView>
      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
  },
  addBtn: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCard: {
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(12),
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: moderateScale(12),
  },
  serviceIconBg: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceNameInput: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  serviceDescInput: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  deleteBtn: {
    padding: moderateScale(4),
  },
  divider: {
    height: 1,
    marginVertical: verticalScale(12),
  },
  serviceDetails: {
    gap: verticalScale(12),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  detailLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    flex: 1,
  },
  priceInput: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    fontSize: moderateScale(14),
    fontWeight: '700',
    minWidth: moderateScale(80),
    textAlign: 'center',
  },
  durationInput: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    fontSize: moderateScale(14),
    fontWeight: '700',
    minWidth: moderateScale(80),
    textAlign: 'center',
  },
  slotCard: {
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotDay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  slotDayText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
  slotTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(12),
    gap: moderateScale(12),
  },
  timeInputContainer: {
    flex: 1,
  },
  timeLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  timeSeparator: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    marginTop: verticalScale(20),
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(16),
    gap: moderateScale(8),
    marginTop: verticalScale(8),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '900',
  },
});

export default DoctorManageServicesScreen;
