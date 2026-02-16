import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Heart, Stethoscope, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { setHasSeenAppOnboarding } from '@/Helpers/AppStorage';
import { AuthTheme } from '@/Theme/AuthTheme';
import type { RootStackParamList } from '@/types';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

type Nav = StackNavigationProp<RootStackParamList, 'AppOnboardingScreen'>;

const { width: WINDOW_WIDTH } = Dimensions.get('window');

const GRADIENT_COLORS: readonly string[][] = [
  [...AuthTheme.gradient],
  [...AuthTheme.gradientSoft],
  [AuthTheme.primaryDark, AuthTheme.primary, AuthTheme.primaryLight],
];

const SLIDES = [
  {
    id: '1',
    icon: Heart,
    title: 'Healthcare at your fingertips',
    description: 'Book doctor appointments, order medicines, and get lab tests—all in one app. Simple, fast, and reliable.',
    gradient: GRADIENT_COLORS[0],
  },
  {
    id: '2',
    icon: Stethoscope,
    title: 'For doctors & clinics',
    description: 'Manage appointments, consultations, and patient records. Clinics can run inventory and serve patients seamlessly.',
    gradient: GRADIENT_COLORS[1],
  },
  {
    id: '3',
    icon: ShoppingBag,
    title: 'End-to-end supply chain',
    description: 'Factories supply in bulk; clinics and users get what they need. One platform connecting the entire healthcare chain.',
    gradient: GRADIENT_COLORS[2],
  },
];

const DOT_WIDTH = 8;
const DOT_ACTIVE_WIDTH = 24;
const DOT_MARGIN = 6;

function SingleDot({ active }: { active: boolean }) {
  const width = useSharedValue(active ? DOT_ACTIVE_WIDTH : DOT_WIDTH);
  const opacity = useSharedValue(active ? 1 : 0.45);

  useEffect(() => {
    width.value = withTiming(active ? DOT_ACTIVE_WIDTH : DOT_WIDTH, { duration: 280 });
    opacity.value = withTiming(active ? 1 : 0.45, { duration: 280 });
  }, [active, width, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: AuthTheme.dotActive,
          borderRadius: DOT_WIDTH / 2,
          marginHorizontal: DOT_MARGIN / 2,
          height: DOT_WIDTH,
        },
        animatedStyle,
      ]}
    />
  );
}

function ProgressDots({ index, total }: { index: number; total: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <SingleDot key={i} active={i === index} />
      ))}
    </View>
  );
}

function SlideItem({
  item,
  index,
  slideIndex,
}: {
  item: (typeof SLIDES)[0];
  index: number;
  slideIndex: number;
}) {
  const Icon = item.icon;
  const isActive = index === slideIndex;

  return (
    <View style={[styles.slide, { width: WINDOW_WIDTH }]}>
      <Animated.View
        entering={FadeInDown.delay(150).duration(500).springify()}
        style={[styles.iconWrap]}
      >
        <View style={[styles.iconCircle, { backgroundColor: AuthTheme.iconCircleBg }]}>
          <Icon size={moderateScale(56)} color={AuthTheme.textOnGradient} strokeWidth={2} />
        </View>
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(280).duration(500).springify()}>
        <Text style={[styles.slideTitle, { color: AuthTheme.textOnGradient }]}>{item.title}</Text>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(400).duration(500)}>
        <Text style={[styles.slideDescription, { color: AuthTheme.textOnGradientSecondary }]}>{item.description}</Text>
      </Animated.View>
    </View>
  );
}

const AppOnboardingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / WINDOW_WIDTH);
    setCurrentIndex(idx);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToOffset({
        offset: (currentIndex + 1) * WINDOW_WIDTH,
        animated: true,
      });
    } else {
      setHasSeenAppOnboarding(true);
      navigation.replace('VerifyEmailScreen');
    }
  };

  const gradientColors = SLIDES[currentIndex]?.gradient ?? GRADIENT_COLORS[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={[styles.topBar, { paddingTop: insets.top + verticalScale(16) }]}>
        <ProgressDots index={currentIndex} total={SLIDES.length} />
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        bounces={false}
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <SlideItem item={item} index={index} slideIndex={currentIndex} />
        )}
      />

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + verticalScale(32),
            paddingHorizontal: moderateScale(24),
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.92}
          style={[styles.buttonWrap, { shadowColor: AuthTheme.ctaButtonShadow }]}
        >
          <View style={[styles.button, { backgroundColor: AuthTheme.ctaButtonBg, borderRadius: moderateScale(14) }]}>
            <Text style={[styles.buttonText, { color: AuthTheme.ctaButtonText }]}>
              {currentIndex === SLIDES.length - 1 ? 'Get started' : 'Next'}
            </Text>
            <ArrowRight size={moderateScale(22)} color={AuthTheme.ctaButtonText} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: moderateScale(24),
    paddingBottom: verticalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: DOT_WIDTH,
  },
  slide: {
    flex: 1,
    paddingHorizontal: moderateScale(28),
    paddingTop: verticalScale(48),
    alignItems: 'center',
  },
  iconWrap: {
    marginBottom: verticalScale(40),
  },
  iconCircle: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: moderateScale(26),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: verticalScale(16),
    paddingHorizontal: moderateScale(8),
    letterSpacing: 0.3,
  },
  slideDescription: {
    fontSize: moderateScale(16),
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: moderateScale(12),
    letterSpacing: 0.2,
  },
  footer: {
    paddingTop: verticalScale(24),
  },
  buttonWrap: {
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(18),
    gap: moderateScale(10),
  },
  buttonText: {
    fontSize: moderateScale(17),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default AppOnboardingScreen;
