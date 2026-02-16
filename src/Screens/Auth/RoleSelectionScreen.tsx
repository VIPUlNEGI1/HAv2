import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeIn, FadeInUp, FadeInDown, FadeOut } from 'react-native-reanimated';
import { User, Stethoscope, Building2, Factory, ChevronRight } from 'lucide-react-native';
import { AuthTheme } from '@/Theme/AuthTheme';
import { useRoleStore } from '@/hooks/useRoleStore';
import {
  setOnboardingProfile,
  getOnboardingToken,
  clearOnboardingToken,
  setPendingAuth,
} from '@/Helpers/AppStorage';
import { useAuthStore } from '@/hooks/useAuthStore';
import { AuthHeader } from './components/AuthHeader';
import { ValidatedInput } from '@/Components/common';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';
import type { RootStackParamList } from '@/types';
import type { UserRole, OnboardingProfile } from '@/types';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

type Nav = StackNavigationProp<RootStackParamList, 'RoleSelectionScreen'>;

const ROLES: { role: UserRole; icon: typeof User; title: string; subtitle: string }[] = [
  { role: 'user', icon: User, title: 'User', subtitle: 'Book appointments, order medicines & lab tests' },
  { role: 'doctor', icon: Stethoscope, title: 'Doctor', subtitle: 'Consult patients, manage services & appointments' },
  { role: 'clinic', icon: Building2, title: 'Clinic', subtitle: 'Manage inventory, sell medicines, serve patients' },
  { role: 'factory', icon: Factory, title: 'Factory', subtitle: 'Supply medicines in bulk to clinics' },
];

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'others', label: 'Others' },
] as const;

const PHONE_REGEX = /^[6-9]\d{9}$/;

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.stepIndicatorRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.stepDot,
            {
              backgroundColor: i <= current ? AuthTheme.ctaButtonBg : 'rgba(255,255,255,0.35)',
              width: i === current ? moderateScale(24) : moderateScale(8),
            },
          ]}
        />
      ))}
    </View>
  );
}

type Route = RouteProp<RootStackParamList, 'RoleSelectionScreen'>;

const RoleSelectionScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const verifiedEmail = (route.params?.email ?? '').trim().toLowerCase();
  const tokenFromStore = useAuthStore((s) => s.token);
  const updateUser = useAuthStore((s) => s.updateUser);
  const { setRole, setAvailableRoles } = useRoleStore();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSelectRole = useCallback((role: UserRole) => {
    setAvailableRoles([role]);
    setRole(role);
    setSelectedRole(role);
    setShowForm(true);
    setFormStep(0);
  }, [setAvailableRoles, setRole]);

  const handleBackToRoles = useCallback(() => {
    setShowForm(false);
    setSelectedRole(null);
    setFormStep(0);
  }, []);

  const digits = mobile.replace(/\D/g, '');
  const isMobileValid = useMemo(() => digits.length === 10 && PHONE_REGEX.test(digits), [digits]);
  const isAgeValid = useMemo(() => age.trim().length > 0 && /^\d+$/.test(age.trim()), [age]);

  const canProceedStep0 = name.trim().length >= 2;
  const canProceedStep1 = isMobileValid && isAgeValid;
  const canProceedStep2 = gender.length > 0;

  const canGoNext =
    (formStep === 0 && canProceedStep0) ||
    (formStep === 1 && canProceedStep1) ||
    (formStep === 2 && canProceedStep2);

  const handleNext = useCallback(async () => {
    if (formStep < 2) {
      setFormStep((s) => s + 1);
      return;
    }
    const profile: OnboardingProfile = {
      role: selectedRole!,
      name: name.trim(),
      email: verifiedEmail,
      mobile: digits,
      age: age.trim(),
      gender,
    };
    try {
      setOnboardingProfile(JSON.stringify(profile));
    } catch (_) {}

    const token = tokenFromStore || getOnboardingToken();
    if (!token) {
      navigation.replace('StoryScreen');
      return;
    }

    setSubmitting(true);
    const profileRes = await APICall<{ data?: { _id?: string; id?: string; name?: string; email?: string; phone_number?: string; roles?: UserRole[] } }>(
      'put',
      {
        name: name.trim(),
        phone_number: digits,
        email: verifiedEmail,
        age: age.trim() ? Number(age.trim()) : undefined,
        gender: gender || undefined,
      },
      ApiRoutes.auth.profile,
      {},
      token,
    );

    if (profileRes.status !== 200) {
      setSubmitting(false);
      const msg = (profileRes.data as { message?: string })?.message || 'Could not update profile.';
      Alert.alert('Error', msg);
      return;
    }

    if (selectedRole && selectedRole !== 'user') {
      const addRes = await APICall('post', { role: selectedRole }, ApiRoutes.roles.add, {}, token);
      if (addRes.status !== 200) {
        setSubmitting(false);
        const msg = (addRes.data as { message?: string })?.message || 'Could not add role.';
        Alert.alert('Error', msg);
        return;
      }
    }

    const switchRes = await APICall('post', { role: selectedRole! }, ApiRoutes.roles.switch, {}, token);
    if (switchRes.status !== 200) {
      setSubmitting(false);
      const msg = (switchRes.data as { message?: string })?.message || 'Could not switch role.';
      Alert.alert('Error', msg);
      return;
    }

    const userFromProfile = profileRes.data?.data as { _id?: string; id?: string; name?: string; email?: string; phone_number?: string; roles?: UserRole[]; kyc_status?: 'pending' | 'verified' | 'rejected' } | undefined;
    const normalizedUser = userFromProfile
      ? {
          id: String(userFromProfile._id || userFromProfile.id),
          name: userFromProfile.name ?? name.trim(),
          email: userFromProfile.email ?? verifiedEmail,
          phone_number: userFromProfile.phone_number ?? digits,
          roles: userFromProfile.roles ?? [selectedRole!],
          kyc_status: (userFromProfile.kyc_status as 'pending' | 'verified' | 'rejected') ?? 'pending',
        }
      : {
          id: '',
          name: name.trim(),
          email: verifiedEmail,
          phone_number: digits,
          roles: [selectedRole!] as UserRole[],
          kyc_status: 'pending' as const,
        };

    updateUser(normalizedUser as any);
    setPendingAuth(JSON.stringify({ user: normalizedUser }));
    clearOnboardingToken();
    setSubmitting(false);
    navigation.replace('StoryScreen');
  }, [formStep, selectedRole, name, verifiedEmail, digits, age, gender, navigation, tokenFromStore, updateUser]);

  const handleBack = useCallback(() => {
    if (formStep > 0) setFormStep((s) => s - 1);
    else handleBackToRoles();
  }, [formStep, handleBackToRoles]);

  const roleTitle = selectedRole ? ROLES.find((r) => r.role === selectedRole)?.title ?? 'Profile' : '';

  if (showForm && selectedRole) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[...AuthTheme.gradient]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <AuthHeader
          title={formStep === 0 ? roleTitle : 'Your details'}
          onBack={handleBack}
          transparent
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}
        >
          <ScrollView
            contentContainerStyle={styles.formScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <StepIndicator current={formStep} total={3} />

            {formStep === 0 && (
              <Animated.View
                key="step0"
                entering={FadeInDown.duration(320).springify()}
                exiting={FadeOut.duration(200)}
                style={styles.stepContent}
              >
                <Text style={styles.stepTitle}>What should we call you?</Text>
                <Text style={styles.stepSubtitle}>Your name helps us personalize your experience.</Text>
                <View style={styles.inputWrap}>
                  <ValidatedInput
                    label="Full name"
                    value={name}
                    onChangeText={setName}
                    validation="required"
                    placeholder="e.g. Alex Johnson"
                    variant="auth"
                  />
                </View>
              </Animated.View>
            )}

            {formStep === 1 && (
              <Animated.View
                key="step1"
                entering={FadeInDown.duration(320).springify()}
                exiting={FadeOut.duration(200)}
                style={styles.stepContent}
              >
                <Text style={styles.stepTitle}>Mobile & age</Text>
                <Text style={styles.stepSubtitle}>So we can reach you and tailor content.</Text>
                <View style={styles.inputWrap}>
                  <ValidatedInput
                    label="Mobile number"
                    value={mobile}
                    onChangeText={setMobile}
                    validation="phone"
                    placeholder="10-digit number"
                    keyboardType="phone-pad"
                    variant="auth"
                  />
                  <ValidatedInput
                    label="Age"
                    value={age}
                    onChangeText={setAge}
                    validation="required"
                    placeholder="Age"
                    keyboardType="numeric"
                    variant="auth"
                  />
                </View>
              </Animated.View>
            )}

            {formStep === 2 && (
              <Animated.View
                key="step2"
                entering={FadeInDown.duration(320).springify()}
                exiting={FadeOut.duration(200)}
                style={styles.stepContent}
              >
                <Text style={styles.stepTitle}>How do you identify?</Text>
                <Text style={styles.stepSubtitle}>Select one. You can change this later.</Text>
                <View style={styles.genderRow}>
                  {GENDERS.map((g) => {
                    const isSelected = gender === g.id;
                    return (
                      <TouchableOpacity
                        key={g.id}
                        activeOpacity={0.85}
                        onPress={() => setGender(g.id)}
                        style={[
                          styles.genderBtn,
                          {
                            backgroundColor: isSelected ? AuthTheme.ctaButtonBg : AuthTheme.iconCircleBg,
                            borderWidth: 2,
                            borderColor: isSelected ? AuthTheme.ctaButtonBg : 'transparent',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.genderBtnText,
                            { color: isSelected ? AuthTheme.primaryDark : AuthTheme.textOnGradient },
                          ]}
                        >
                          {g.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>
            )}

            <Animated.View entering={FadeIn.delay(200)} style={styles.footer}>
              <TouchableOpacity
                onPress={handleNext}
                disabled={!canGoNext || submitting}
                activeOpacity={0.9}
                style={[
                  styles.ctaButton,
                  {
                    backgroundColor: AuthTheme.ctaButtonBg,
                    borderRadius: moderateScale(14),
                    opacity: canGoNext && !submitting ? 1 : 0.6,
                  },
                ]}
              >
                {submitting ? (
                  <Text style={[styles.ctaButtonText, { color: AuthTheme.ctaButtonText }]}>Please wait...</Text>
                ) : (
                  <>
                    <Text style={[styles.ctaButtonText, { color: AuthTheme.ctaButtonText }]}>
                      {formStep === 2 ? 'Continue to our story' : 'Next'}
                    </Text>
                    <ChevronRight size={moderateScale(22)} color={AuthTheme.ctaButtonText} strokeWidth={2.5} />
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
      <AuthHeader showBack={false} title="Select role" transparent />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(80).duration(400)}>
          <Text style={styles.title}>How will you use this app?</Text>
          <Text style={styles.subtitle}>
            Select your role. You’ll fill a short form next—quick and easy.
          </Text>
        </Animated.View>

        {ROLES.map(({ role, icon: Icon, title, subtitle }, index) => (
          <Animated.View
            key={role}
            entering={FadeInUp.delay(120 + index * 80).duration(400)}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.card,
                {
                  backgroundColor: AuthTheme.cardBg,
                  borderRadius: moderateScale(16),
                  borderWidth: 1,
                  borderColor: AuthTheme.cardBorder,
                },
              ]}
              onPress={() => handleSelectRole(role)}
            >
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: AuthTheme.primary + '18',
                    borderRadius: moderateScale(14),
                  },
                ]}
              >
                <Icon size={moderateScale(28)} color={AuthTheme.primary} />
              </View>
              <View style={styles.textWrap}>
                <Text style={[styles.cardTitle, { color: AuthTheme.textPrimary }]}>{title}</Text>
                <Text style={[styles.cardSubtitle, { color: AuthTheme.textSecondary }]}>
                  {subtitle}
                </Text>
              </View>
              <ChevronRight size={moderateScale(20)} color={AuthTheme.textSecondary} />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboard: { flex: 1 },
  scroll: {
    padding: moderateScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(40),
  },
  title: {
    fontSize: moderateScale(26),
    fontWeight: '800',
    marginBottom: verticalScale(10),
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(20),
    marginBottom: verticalScale(12),
  },
  iconWrap: {
    width: moderateScale(56),
    height: moderateScale(56),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(18),
  },
  textWrap: { flex: 1 },
  cardTitle: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: moderateScale(13),
    lineHeight: 19,
  },
  formScroll: {
    padding: moderateScale(24),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(48),
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: verticalScale(28),
  },
  stepDot: {
    height: moderateScale(8),
    borderRadius: 4,
  },
  stepContent: {
    marginBottom: verticalScale(24),
  },
  stepTitle: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    color: AuthTheme.textOnGradient,
    marginBottom: verticalScale(8),
    letterSpacing: 0.2,
  },
  stepSubtitle: {
    fontSize: moderateScale(15),
    color: AuthTheme.textOnGradientSecondary,
    marginBottom: verticalScale(20),
    lineHeight: 22,
  },
  inputWrap: {
    backgroundColor: AuthTheme.cardBg,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    borderWidth: 1,
    borderColor: AuthTheme.cardBorder,
  },
  genderRow: {
    gap: moderateScale(14),
  },
  genderBtn: {
    paddingVertical: verticalScale(18),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderBtnText: {
    fontSize: moderateScale(17),
    fontWeight: '800',
  },
  footer: {
    marginTop: verticalScale(16),
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(18),
    gap: moderateScale(10),
    shadowColor: AuthTheme.ctaButtonShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonText: {
    fontSize: moderateScale(17),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default RoleSelectionScreen;
