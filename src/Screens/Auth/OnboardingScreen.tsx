import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/Theme/useTheme';
import { AuthTheme } from '@/Theme/AuthTheme';
import { FormInput, ValidatedInput } from '@/Components/common';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
import { setOnboardingProfile } from '@/Helpers/AppStorage';
import type { RootStackParamList } from '@/types';
import type { UserRole, OnboardingProfile } from '@/types';
import { useRoleStore } from '@/hooks/useRoleStore';
import { AuthHeader } from './components/AuthHeader';
import { useAuthBackHandler } from './hooks/useAuthBackHandler';

type Nav = StackNavigationProp<RootStackParamList, 'OnboardingScreen'>;
type Route = RouteProp<RootStackParamList, 'OnboardingScreen'>;

const OnboardingScreen = () => {
  const { theme, shadows, borderRadius } = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { currentRole } = useRoleStore();
  const role = route.params?.role ?? currentRole ?? 'user';

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);
  useAuthBackHandler(handleBack);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience_years, setExperience_years] = useState('');
  const [license_number, setLicense_number] = useState('');
  const [qualification, setQualification] = useState('');
  const [clinic_name, setClinic_name] = useState('');
  const [clinic_address, setClinic_address] = useState('');
  const [clinic_license, setClinic_license] = useState('');
  const [factory_name, setFactory_name] = useState('');
  const [factory_address, setFactory_address] = useState('');
  const [factory_license, setFactory_license] = useState('');
  const [min_order_quantity, setMin_order_quantity] = useState('');

  const buildProfile = (): OnboardingProfile => {
    const base = { role, name, email, mobile };
    if (role === 'user') return { ...base, age, gender };
    if (role === 'doctor')
      return {
        ...base,
        specialization,
        experience_years,
        license_number,
        qualification,
      };
    if (role === 'clinic')
      return {
        ...base,
        clinic_name,
        clinic_address,
        clinic_license,
      };
    return {
      ...base,
      factory_name,
      factory_address,
      factory_license,
      min_order_quantity,
    };
  };

  const validate = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Required', 'Please enter your email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid', 'Please enter a valid email address');
      return false;
    }
    if (!mobile.trim() || mobile.length < 10) {
      Alert.alert('Required', 'Please enter a valid mobile number');
      return false;
    }
    if (role === 'user' && !age.trim()) {
      Alert.alert('Required', 'Please enter your age');
      return false;
    }
    if (role === 'doctor') {
      if (!specialization.trim()) {
        Alert.alert('Required', 'Please enter specialization');
        return false;
      }
      if (!qualification.trim()) {
        Alert.alert('Required', 'Please enter qualification');
        return false;
      }
    }
    if (role === 'clinic') {
      if (!clinic_name.trim()) {
        Alert.alert('Required', 'Please enter clinic name');
        return false;
      }
      if (!clinic_address.trim()) {
        Alert.alert('Required', 'Please enter clinic address');
        return false;
      }
    }
    if (role === 'factory') {
      if (!factory_name.trim()) {
        Alert.alert('Required', 'Please enter factory name');
        return false;
      }
      if (!factory_address.trim()) {
        Alert.alert('Required', 'Please enter factory address');
        return false;
      }
    }
    return true;
  };

  const isBaseValid = useMemo(() => {
    const tEmail = email.trim().toLowerCase();
    const digits = mobile.replace(/\D/g, '');
    return (
      name.trim().length > 0 &&
      tEmail.length > 0 &&
      EMAIL_REGEX.test(tEmail) &&
      digits.length === 10 &&
      PHONE_REGEX.test(digits)
    );
  }, [name, email, mobile]);

  const isRoleSectionValid = useMemo(() => {
    if (role === 'user') return age.trim().length > 0;
    if (role === 'doctor') return specialization.trim().length > 0 && qualification.trim().length > 0;
    if (role === 'clinic') return clinic_name.trim().length > 0 && clinic_address.trim().length > 0;
    if (role === 'factory') return factory_name.trim().length > 0 && factory_address.trim().length > 0;
    return true;
  }, [role, age, specialization, qualification, clinic_name, clinic_address, factory_name, factory_address]);

  const isFormValid = isBaseValid && isRoleSectionValid;

  const handleContinue = () => {
    if (!validate()) return;
    const profile = buildProfile();
    try {
      setOnboardingProfile(JSON.stringify(profile));
    } catch (e) {
      console.error('Save onboarding:', e);
      Alert.alert('Error', 'Could not save details. Please try again.');
      return;
    }
    navigation.navigate('StoryScreen');
  };

  const title =
    role === 'user'
      ? 'Your details'
      : role === 'doctor'
        ? 'Doctor profile'
        : role === 'clinic'
          ? 'Clinic details'
          : 'Factory details';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[...AuthTheme.gradient]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <AuthHeader title={title} onBack={handleBack} transparent />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInUp.delay(80).duration(400)}>
            <Text style={styles.screenTitle}>{title}</Text>
            <Text style={styles.subtitle}>
              We need a few details to personalize your experience.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(120).duration(400)} style={styles.card}>
            <ValidatedInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              validation="required"
              placeholder="Enter your full name"
              variant="auth"
            />
            <ValidatedInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              validation="email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="name@example.com"
              variant="auth"
            />
            <ValidatedInput
              label="Mobile Number"
              value={mobile}
              onChangeText={setMobile}
              validation="phone"
              keyboardType="phone-pad"
              placeholder="10-digit mobile number"
              variant="auth"
            />

          {role === 'user' && (
            <>
              <ValidatedInput label="Age" value={age} onChangeText={setAge} keyboardType="numeric" validation="required" placeholder="Age" variant="auth" />
              <FormInput label="Gender" value={gender} onChangeText={setGender} placeholder="e.g. Male / Female" variant="auth" />
            </>
          )}

          {role === 'doctor' && (
            <>
              <ValidatedInput label="Specialization" value={specialization} onChangeText={setSpecialization} validation="required" variant="auth" />
              <ValidatedInput label="Qualification" value={qualification} onChangeText={setQualification} validation="required" variant="auth" />
              <FormInput
                label="Experience (years)"
                value={experience_years}
                onChangeText={setExperience_years}
                keyboardType="numeric"
                variant="auth"
              />
              <FormInput label="License / Registration No." value={license_number} onChangeText={setLicense_number} variant="auth" />
            </>
          )}

          {role === 'clinic' && (
            <>
              <ValidatedInput label="Clinic Name" value={clinic_name} onChangeText={setClinic_name} validation="required" variant="auth" />
              <FormInput
                label="Clinic Address"
                value={clinic_address}
                onChangeText={setClinic_address}
                multiline
                required
                variant="auth"
              />
              <FormInput label="License Number" value={clinic_license} onChangeText={setClinic_license} variant="auth" />
            </>
          )}

          {role === 'factory' && (
            <>
              <ValidatedInput label="Factory Name" value={factory_name} onChangeText={setFactory_name} validation="required" variant="auth" />
              <FormInput
                label="Factory Address"
                value={factory_address}
                onChangeText={setFactory_address}
                multiline
                required
                variant="auth"
              />
              <FormInput label="License Number" value={factory_license} onChangeText={setFactory_license} variant="auth" />
              <FormInput
                label="Min. order quantity (optional)"
                value={min_order_quantity}
                onChangeText={setMin_order_quantity}
                keyboardType="numeric"
                variant="auth"
              />
            </>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: AuthTheme.buttonPrimaryBg,
                borderRadius: moderateScale(14),
                opacity: isFormValid ? 1 : AuthTheme.buttonDisabledOpacity,
              },
            ]}
            onPress={handleContinue}
            disabled={!isFormValid}
            activeOpacity={0.88}
          >
            <Text style={[styles.buttonText, { color: AuthTheme.buttonPrimaryText }]}>Continue</Text>
          </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboard: { flex: 1 },
  scroll: {
    padding: moderateScale(24),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(48),
  },
  card: {
    backgroundColor: AuthTheme.cardBg,
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginTop: verticalScale(8),
    borderWidth: 1,
    borderColor: AuthTheme.cardBorder,
    shadowColor: AuthTheme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  screenTitle: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    marginBottom: verticalScale(8),
    color: AuthTheme.textOnGradient,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: moderateScale(15),
    marginBottom: verticalScale(20),
    lineHeight: 22,
    color: AuthTheme.textOnGradientSecondary,
  },
  button: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    marginTop: verticalScale(24),
  },
  buttonText: { fontSize: moderateScale(16), fontWeight: '700' },
});

export default OnboardingScreen;
