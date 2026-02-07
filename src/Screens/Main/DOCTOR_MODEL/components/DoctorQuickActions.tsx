import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, Phone, MessageSquare, Calendar } from 'lucide-react-native';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { useTheme } from '@/Theme/useTheme';
import { useNavigation } from '@react-navigation/native';

export const DoctorQuickActions = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();

  const actions = [
    { title: 'Video', icon: Video, color: '#10B981', onPress: () => {} },
    { title: 'Audio', icon: Phone, color: '#3B82F6', onPress: () => {} },
    { title: 'Chat', icon: MessageSquare, color: '#F59E0B', onPress: () => {} },
    { title: 'Schedule', icon: Calendar, color: '#4B2A99', onPress: () => navigation.navigate('DoctorAppointmentsScreen') },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.actionItem, { backgroundColor: theme.surface, ...shadows }]}
          onPress={action.onPress}
        >
          <View style={[styles.iconContainer, { backgroundColor: action.color + '15' }]}>
            <action.icon size={moderateScale(22)} color={action.color} />
          </View>
          <Text style={[styles.actionTitle, { color: theme.text }]}>{action.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    marginTop: verticalScale(20),
  },
  actionItem: {
    width: '22%',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  actionTitle: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
});
