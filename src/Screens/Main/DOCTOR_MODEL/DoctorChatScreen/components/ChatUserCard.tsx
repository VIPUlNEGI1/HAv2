import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import type { DoctorChatUser } from '../hooks/useDoctorChat';

interface ChatUserCardProps {
  item: DoctorChatUser;
  onPress: () => void;
}

export const ChatUserCard = ({ item, onPress }: ChatUserCardProps) => {
  const { theme, shadows } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.userCard, { backgroundColor: theme.surface, ...shadows }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={[styles.userName, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.timestamp, { color: theme.textSecondary }]}>{item.timestamp}</Text>
        </View>
        <View style={styles.userFooter}>
          <Text style={[styles.lastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userCard: { flexDirection: 'row', alignItems: 'center', padding: moderateScale(16), borderRadius: moderateScale(16), marginBottom: verticalScale(12), gap: moderateScale(12) },
  userAvatar: { width: moderateScale(50), height: moderateScale(50), borderRadius: moderateScale(25) },
  userInfo: { flex: 1 },
  userHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(4) },
  userName: { fontSize: moderateScale(16), fontWeight: '700' },
  timestamp: { fontSize: moderateScale(12), fontWeight: '500' },
  userFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { fontSize: moderateScale(13), fontWeight: '500', flex: 1 },
  unreadBadge: { minWidth: moderateScale(20), height: moderateScale(20), borderRadius: moderateScale(10), justifyContent: 'center', alignItems: 'center', paddingHorizontal: moderateScale(6), marginLeft: moderateScale(8) },
  unreadText: { color: '#fff', fontSize: moderateScale(11), fontWeight: '700' },
});
