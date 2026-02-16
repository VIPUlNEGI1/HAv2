import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Heart, Target, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { AuthTheme } from '@/Theme/AuthTheme';
import { setHasSeenStory, getOnboardingProfile, getPendingAuth, clearPendingAuth } from '@/Helpers/AppStorage';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { AuthHeader } from './components/AuthHeader';
import { useAuthBackHandler } from './hooks/useAuthBackHandler';
import type { RootStackParamList } from '@/types';
import type { OnboardingProfile } from '@/types';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

type Nav = StackNavigationProp<RootStackParamList, 'StoryScreen'>;

const StoryScreen = () => {
  const { theme, shadows, borderRadius } = useTheme();
  const navigation = useNavigation<Nav>();
  const updateUser = useAuthStore((s) => s.updateUser);
  const setStoryCompleted = useOnboardingStore((s) => s.setStoryCompleted);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);
  useAuthBackHandler(handleBack);

  const handleContinue = () => {
    const pending = getPendingAuth();
    if (pending) {
      try {
        const parsed = JSON.parse(pending) as { user?: Record<string, unknown> };
        if (parsed.user) {
          updateUser(parsed.user as any);
        }
        clearPendingAuth();
      } catch (_) {}
    } else {
      let profile: OnboardingProfile | null = null;
      try {
        const saved = getOnboardingProfile();
        if (saved) profile = JSON.parse(saved) as OnboardingProfile;
      } catch (_) {}
      if (profile) {
        updateUser({
          name: profile.name,
          email: profile.email,
          phone_number: profile.mobile,
          roles: [profile.role],
        } as any);
      }
    }
    setHasSeenStory(true);
    setStoryCompleted(true);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[...AuthTheme.gradient]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <AuthHeader title="Our story" onBack={handleBack} transparent />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.delay(80).duration(400)}
          style={[
            styles.iconWrap,
            {
              backgroundColor: AuthTheme.iconCircleBg,
              borderRadius: moderateScale(24),
            },
          ]}
        >
          <Heart size={moderateScale(48)} color={AuthTheme.textOnGradient} />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(120).duration(400)}>
          <Text style={[styles.title, { color: AuthTheme.textOnGradient }]}>Why we built this app</Text>
          <Text style={[styles.paragraph, { color: AuthTheme.textOnGradientSecondary }]}>
            Healthcare should be simple and accessible for everyone—patients, doctors, clinics, and suppliers. We saw gaps between finding the right doctor, ordering medicines, getting lab tests, and managing inventory. So we created one place where users can book consultations and order medicines, doctors can manage appointments and services, clinics can run their pharmacy and inventory, and factories can supply in bulk.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={[
            styles.goalCard,
            {
              backgroundColor: AuthTheme.iconCircleBg,
              borderRadius: moderateScale(16),
              ...shadows,
            },
          ]}
        >
          <Target size={moderateScale(24)} color={AuthTheme.textOnGradient} />
          <Text style={[styles.goalTitle, { color: AuthTheme.textOnGradient }]}>Our goal</Text>
          <Text style={[styles.goalText, { color: AuthTheme.textOnGradientSecondary }]}>
            To connect the entire healthcare chain in one app: better for patients, more efficient for doctors and clinics, and simpler for factories—so quality care and medicines reach more people, easily.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(280).duration(400)}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: AuthTheme.ctaButtonBg,
                borderRadius: moderateScale(14),
              },
            ]}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={[styles.buttonText, { color: AuthTheme.ctaButtonText }]}>Go to dashboard</Text>
            <ArrowRight size={moderateScale(20)} color={AuthTheme.ctaButtonText} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: moderateScale(24),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(48),
  },
  iconWrap: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: verticalScale(24),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    marginBottom: verticalScale(16),
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  paragraph: {
    fontSize: moderateScale(15),
    lineHeight: 24,
    marginBottom: verticalScale(24),
  },
  goalCard: {
    padding: moderateScale(20),
    marginBottom: verticalScale(32),
  },
  goalTitle: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    marginTop: verticalScale(12),
    marginBottom: verticalScale(8),
  },
  goalText: {
    fontSize: moderateScale(14),
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    gap: moderateScale(8),
  },
  buttonText: { fontSize: moderateScale(16), fontWeight: '700' },
});

export default StoryScreen;
