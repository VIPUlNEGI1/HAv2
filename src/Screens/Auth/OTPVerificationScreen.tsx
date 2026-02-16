import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AuthTheme } from '@/Theme/AuthTheme';
import { supabase } from '@/hooks/superbase';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useRoleStore } from '@/hooks/useRoleStore';
import { getOnboardingProfile } from '@/Helpers/AppStorage';
import { AuthHeader } from './components/AuthHeader';
import { OTPInput } from './components/OTPInput';
import { useAuthBackHandler } from './hooks/useAuthBackHandler';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';
import type { RootStackParamList } from '@/types';
import type { UserRole, OnboardingProfile } from '@/types';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

type Nav = StackNavigationProp<RootStackParamList, 'OTPVerificationScreen'>;
type Route = RouteProp<RootStackParamList, 'OTPVerificationScreen'>;

const OTPVerificationScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const email = route.params?.email?.trim().toLowerCase() || '';
  const fromOnboarding = route.params?.fromOnboarding === true;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const { setAvailableRoles, setRole, currentRole } = useRoleStore();

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);
  useAuthBackHandler(handleBack);

  const applyRoleFromProfile = () => {
    let profile: OnboardingProfile | null = null;
    try {
      const saved = getOnboardingProfile();
      if (saved) profile = JSON.parse(saved) as OnboardingProfile;
    } catch (_) {}
    const role: UserRole = profile?.role ?? currentRole ?? 'user';
    setAvailableRoles([role]);
    setRole(role);
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      if (fromOnboarding) {
        const res = await APICall<{ data?: { user?: { id?: string; name?: string; email?: string; phone_number?: string; avatar_url?: string; kyc_status?: string; roles?: string[] }; token?: string }; message?: string }>(
          'post',
          { email: email.trim().toLowerCase(), otp },
          ApiRoutes.auth.onboarding.verifyOtp,
        );
        setLoading(false);
        if (res.status === 200 && res.data?.data?.token) {
          const { user: apiUser, token: apiToken } = res.data.data;
          const normalizedUser = {
            id: String(apiUser?.id ?? (apiUser as any) ?? ''),
            name: apiUser?.name ?? email.split('@')[0],
            email: apiUser?.email ?? email,
            phone_number: apiUser?.phone_number ?? '',
            avatar_url: apiUser?.avatar_url,
            kyc_status: (apiUser?.kyc_status as 'pending' | 'verified' | 'rejected') ?? 'pending',
            roles: (apiUser?.roles as ('user' | 'doctor' | 'clinic' | 'factory')[]) ?? ['user'],
          };
          setAuth(normalizedUser as any, apiToken);
          if (normalizedUser.kyc_status === 'verified' && normalizedUser.roles?.length) {
            setAvailableRoles(normalizedUser.roles);
            setRole(normalizedUser.roles[0] as any);
            return;
          }
          setAvailableRoles(normalizedUser.roles?.length ? normalizedUser.roles : ['user']);
          setRole((normalizedUser.roles?.[0] as any) ?? 'user');
          return;
        }
        const msg = (res.data as { message?: string })?.message || 'Invalid or expired code. Try again.';
        Alert.alert('Verification failed', msg);
        return;
      }
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      if (error) throw error;
      if (data?.session?.user) {
        const u = data.session.user;
        const user = {
          id: u.id,
          name: u.user_metadata?.name || u.email?.split('@')[0] || 'User',
          email: u.email,
          phone_number: u.phone || '',
          roles: (currentRole ? [currentRole] : ['user']) as UserRole[],
        };
        setAuth(user as any, data.session.access_token || '');
        applyRoleFromProfile();
        return;
      }
      throw new Error('Verification failed');
    } catch (err: any) {
      const msg = err?.message || 'Invalid or expired code. Try again.';
      if (msg.includes('email') || msg.includes('OTP') || msg.includes('token')) {
        Alert.alert('Verification failed', msg);
      } else {
        try {
          const byEmail = await supabase.from('login').select('*').eq('email', email).maybeSingle();
          if (byEmail.data) {
            setAuth(byEmail.data, 'dummy-token');
            applyRoleFromProfile();
            return;
          }
          let profile: OnboardingProfile | null = null;
          try {
            const saved = getOnboardingProfile();
            if (saved) profile = JSON.parse(saved) as OnboardingProfile;
          } catch (_) {}
          const name = profile?.name?.trim() || email.split('@')[0];
          const { data: newUser, error: insertErr } = await supabase
            .from('login')
            .insert({ email, phone_number: email, name })
            .select()
            .single();
          if (insertErr) throw insertErr;
          setAuth(newUser, 'dummy-token');
          const role: UserRole = profile?.role ?? currentRole ?? 'user';
          setAvailableRoles([role]);
          setRole(role);
        } catch (fallbackErr: any) {
          Alert.alert('Verification failed', fallbackErr?.message || msg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = otp.length === 6;

  if (!email) {
    return (
      <View style={[styles.container, { backgroundColor: AuthTheme.cardBg }]}>
        <AuthHeader title="Verify" onBack={handleBack} />
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: AuthTheme.textSecondary }]}>
            No email provided. Go back and enter your email.
          </Text>
        </View>
      </View>
    );
  }

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
            <Text style={styles.title}>Enter verification code</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit code to{'\n'}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(160).duration(400)} style={styles.otpWrap}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              onFulfill={(code) => setOtp(code)}
            />
            {otp.length > 0 && otp.length < 6 && (
              <Text style={styles.hint}>Enter all 6 digits</Text>
            )}
          </Animated.View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: AuthTheme.buttonPrimaryBg,
                borderRadius: moderateScale(14),
                opacity: isOtpComplete && !loading ? 1 : AuthTheme.buttonDisabledOpacity,
              },
            ]}
            onPress={handleVerify}
            disabled={loading || !isOtpComplete}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color={AuthTheme.buttonPrimaryText} />
            ) : (
              <Text style={[styles.buttonText, { color: AuthTheme.buttonPrimaryText }]}>Verify</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resend}
            onPress={handleBack}
            disabled={loading}
          >
            <Text style={styles.resendText}>Use a different email</Text>
          </TouchableOpacity>
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
  center: { flex: 1, justifyContent: 'center', padding: 24 },
  errorText: { fontSize: moderateScale(15), textAlign: 'center' },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    marginBottom: verticalScale(8),
    color: AuthTheme.textOnGradient,
  },
  subtitle: {
    fontSize: moderateScale(15),
    lineHeight: 22,
    marginBottom: verticalScale(24),
    color: AuthTheme.textOnGradientSecondary,
  },
  emailHighlight: {
    fontWeight: '700',
    color: AuthTheme.textOnGradient,
  },
  otpWrap: { marginBottom: verticalScale(20) },
  hint: {
    fontSize: moderateScale(12),
    color: AuthTheme.textOnGradientSecondary,
    marginTop: verticalScale(8),
    textAlign: 'center',
  },
  button: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
  },
  buttonText: { fontSize: moderateScale(17), fontWeight: '700' },
  resend: { marginTop: verticalScale(24), alignItems: 'center' },
  resendText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: AuthTheme.textOnGradientSecondary,
  },
});

export default OTPVerificationScreen;
