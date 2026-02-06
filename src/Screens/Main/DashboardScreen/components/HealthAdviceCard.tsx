import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { ArrowRight, Zap } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

export const HealthAdviceCard = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          {
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.95 : 1,
          },
        ]}
      >
        <LinearGradient
          colors={theme.gradientSecondary || [theme.secondary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.adviceCard}
        >
          {/* Content */}
          <View style={styles.adviceInfo}>
            <View style={styles.badge}>
              <Zap size={moderateScale(11)} color="#fff" />
              <Text style={styles.badgeText}>INSTANT CONSULT</Text>
            </View>

            <Text style={styles.adviceTitle}>
              Talk to a Doctor in{'\n'}2 Minutes
            </Text>

            <Text style={styles.adviceSubtitle}>
              Consult with top specialists for free today.
            </Text>

            <View style={styles.adviceAction}>
              <Text style={styles.adviceActionText}>Consult Now</Text>
              <View style={styles.arrowCircle}>
                <ArrowRight size={moderateScale(14)} color={theme.secondary} />
              </View>
            </View>
          </View>

          {/* Illustration */}
          <Image
            source={{
              uri: 'https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg',
            }}
            style={styles.adviceImage}
            resizeMode="contain"
          />
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    marginBottom: verticalScale(30),
  },

  pressable: {
    borderRadius: moderateScale(28),
  },

  adviceCard: {
    borderRadius: moderateScale(28),
    padding: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: verticalScale(250),
    overflow: 'hidden',

    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  adviceInfo: {
    flex: 1,
    zIndex: 2,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(14),
    gap: moderateScale(6),
  },

  badgeText: {
    color: '#fff',
    fontSize: moderateScale(10),
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  adviceTitle: {
    fontSize: moderateScale(20),
    fontWeight: '900',
    color: '#fff',
    lineHeight: moderateScale(26),
  },

  adviceSubtitle: {
    fontSize: moderateScale(13),
    color: 'rgba(255,255,255,0.85)',
    marginTop: verticalScale(8),
    fontWeight: '500',
    maxWidth: '85%',
  },

  adviceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(22),
    gap: moderateScale(10),
  },

  adviceActionText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '900',
  },

  arrowCircle: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  adviceImage: {
    position: 'absolute',
    right: moderateScale(-6),
    bottom: verticalScale(-6),
    width: moderateScale(130),
    height: moderateScale(130),
    opacity: 0.9,
  },
});