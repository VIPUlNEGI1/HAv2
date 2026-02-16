import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Building2 } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { ChatUser } from '../hooks/useFactoryChat';

interface ChatUserCardProps {
  user: ChatUser;
  onPress: () => void;
  index?: number;
}

export const ChatUserCard: React.FC<ChatUserCardProps> = ({ user, onPress, index = 0 }) => {
  const { theme, shadows } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.surface, ...shadows }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.avatarContainer, { backgroundColor: theme.primary + '20' }]}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Building2 size={moderateScale(24)} color={theme.primary} />
          )}
        </View>
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={[styles.timestamp, { color: theme.textSecondary }]}>{user.timestamp}</Text>
          </View>
          <View style={styles.footer}>
            <Text style={[styles.lastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
              {user.lastMessage}
            </Text>
            {user.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.unreadText}>{user.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
    gap: moderateScale(12),
  },
  avatarContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    flex: 1,
  },
  timestamp: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    flex: 1,
  },
  unreadBadge: {
    minWidth: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(6),
    marginLeft: moderateScale(8),
  },
  unreadText: {
    color: '#fff',
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
});
