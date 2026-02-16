import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AuthTheme } from '@/Theme/AuthTheme';
import { supabase } from '@/hooks/superbase';
import { ValidatedInput } from '@/Components/common';
import { AuthHeader } from './components/AuthHeader';
import { useAuthBackHandler } from './hooks/useAuthBackHandler';
import type { RootStackParamList } from '@/types';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Nav = StackNavigationProp<RootStackParamList, 'LoginScreen'>;

const LoginScreen = () => {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);
  useAuthBackHandler(handleBack);

  const trimmedEmail = email.trim().toLowerCase();
  const isEmailValid = useMemo(
    () => trimmedEmail.length > 0 && EMAIL_REGEX.test(trimmedEmail),
    [trimmedEmail],
  );

  const handleSendOTP = async () => {
    if (!isEmailValid) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      navigation.navigate('OTPVerificationScreen', { email: trimmedEmail });
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes('rate limit') || err?.message?.toLowerCase().includes('email')) {
        navigation.navigate('OTPVerificationScreen', { email: trimmedEmail });
        return;
      }
      Alert.alert('Could not send code', err?.message || 'Try again or use a different email.');
    } finally {
      setLoading(false);
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
      <AuthHeader title="Sign in" onBack={handleBack} transparent />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={styles.title}>Email verification</Text>
            <Text style={styles.subtitle}>
              Enter your email. We’ll send you a 6-digit code to verify and sign in.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <View style={styles.card}>
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
                onPress={handleSendOTP}
                disabled={loading || !isEmailValid}
                activeOpacity={0.88}
              >
                {loading ? (
                  <ActivityIndicator color={AuthTheme.buttonPrimaryText} />
                ) : (
                  <Text style={styles.buttonText}>Send verification code</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboard: { flex: 1 },
  scroll: {
    flexGrow: 1,
    padding: moderateScale(24),
    paddingTop: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(26),
    fontWeight: '800',
    marginBottom: verticalScale(8),
    color: AuthTheme.textOnGradient,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: moderateScale(15),
    marginBottom: verticalScale(24),
    lineHeight: 22,
    color: AuthTheme.textOnGradientSecondary,
  },
  card: {
    backgroundColor: AuthTheme.cardBg,
    borderRadius: moderateScale(20),
    padding: moderateScale(24),
    marginTop: verticalScale(8),
    borderWidth: 1,
    borderColor: AuthTheme.cardBorder,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  button: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    marginTop: verticalScale(12),
  },
  buttonText: {
    color: AuthTheme.buttonPrimaryText,
    fontSize: moderateScale(17),
    fontWeight: '700',
  },
});
