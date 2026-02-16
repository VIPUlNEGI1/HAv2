import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AuthTheme } from '@/Theme/AuthTheme';
import { ValidatedInput } from '@/Components/common';
import { AuthHeader } from './components/AuthHeader';
import { useAuthBackHandler } from './hooks/useAuthBackHandler';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';
import type { RootStackParamList } from '@/types';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

type Nav = StackNavigationProp<RootStackParamList, 'VerifyEmailScreen'>;

const VerifyEmailScreen = () => {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);
  useAuthBackHandler(handleBack);

  // Warm server on mount (Render free tier sleeps; GET /health wakes it while user types)
  useEffect(() => {
    APICall('get', null, '/health').then(() => {});
  }, []);

  const trimmedEmail = email.trim().toLowerCase();
  const isEmailValid = useMemo(() => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return trimmedEmail.length > 0 && re.test(trimmedEmail);
  }, [trimmedEmail]);

  const handleSendCode = async () => {
    if (!isEmailValid || loading) return;
    setLoading(true);
    const res = await APICall<{ message?: string; error?: string }>(
      'post',
      { email: trimmedEmail },
      ApiRoutes.auth.onboarding.sendOtp,
    );
    setLoading(false);
    if (res.status === 200) {
      navigation.navigate('OTPVerificationScreen', {
        email: trimmedEmail,
        fromOnboarding: true,
      });
    } else {
      const data = res.data as { message?: string; error?: string };
      const msg = data?.message || 'Could not send code. Please try again.';
      const detail = data?.error ? `\n\n${data.error}` : '';
      const isTimeout = typeof msg === 'string' && (msg.includes('timed out') || msg.includes('starting'));
      if (isTimeout) {
        Alert.alert(
          'Server is starting',
          'The server is waking up (common on free hosting). Wait about a minute, then tap "Send verification code" again. You can also open the API in your browser first to wake it.',
          [{ text: 'OK' }],
        );
      } else {
        Alert.alert('Error', detail ? `${msg}${detail}` : msg);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[...AuthTheme.gradient]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <AuthHeader title="Verify email" onBack={handleBack} transparent />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(80).duration(400)}>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              We’ll send you a 6-digit code to verify and continue.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(160).duration(400)} style={styles.card}>
            <ValidatedInput
              label="Email address"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              validation="email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              variant="auth"
            />
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: AuthTheme.buttonPrimaryBg,
                  borderRadius: moderateScale(14),
                  opacity: isEmailValid && !loading ? 1 : AuthTheme.buttonDisabledOpacity,
                },
              ]}
              onPress={handleSendCode}
              disabled={!isEmailValid || loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <ActivityIndicator color={AuthTheme.buttonPrimaryText} />
              ) : (
                <Text style={[styles.buttonText, { color: AuthTheme.buttonPrimaryText }]}>
                  Send verification code
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboard: { flex: 1 },
  content: {
    padding: moderateScale(24),
    paddingTop: verticalScale(24),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    marginBottom: verticalScale(8),
    color: AuthTheme.textOnGradient,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: moderateScale(15),
    lineHeight: 22,
    marginBottom: verticalScale(24),
    color: AuthTheme.textOnGradientSecondary,
  },
  card: {
    backgroundColor: AuthTheme.cardBg,
    borderRadius: moderateScale(20),
    padding: moderateScale(24),
    marginTop: verticalScale(8),
    borderWidth: 1,
    borderColor: AuthTheme.cardBorder,
    shadowColor: AuthTheme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  button: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    marginTop: verticalScale(16),
  },
  buttonText: { fontSize: moderateScale(17), fontWeight: '700' },
});

export default VerifyEmailScreen;
