import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Building2 } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Client } from '../hooks/useFactoryClientDetails';

interface ClientHeaderProps {
  client: Client;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ client }) => {
  const { theme, shadows } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(100)}>
      <LinearGradient
        colors={[theme.primary, theme.primary + 'CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, shadows]}
      >
        <View style={styles.content}>
          <View style={[styles.icon, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
            <Building2 size={moderateScale(32)} color="#fff" />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{client.name}</Text>
            <Text style={styles.type}>{client.type.charAt(0).toUpperCase() + client.type.slice(1)}</Text>
          </View>
        </View>
        {client.licenseNumber && (
          <Text style={styles.license}>License: {client.licenseNumber}</Text>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    margin: moderateScale(16),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    gap: moderateScale(16),
  },
  icon: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: moderateScale(20),
    fontWeight: '900',
    color: '#fff',
    marginBottom: verticalScale(4),
  },
  type: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
  },
  license: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#fff',
    opacity: 0.8,
  },
});
