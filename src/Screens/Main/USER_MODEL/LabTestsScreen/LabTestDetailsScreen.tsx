import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { ChevronLeft, ShoppingCart, ShieldCheck, MapPin, Star, Clock, Info, AlertCircle, CheckCircle2, FlaskConical, Share2, Heart } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  SlideInUp, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  useSharedValue, 
  interpolate, 
  Extrapolate 
} from 'react-native-reanimated';
import { AnimatedButton } from '@/Components/AnimatedButton';
import { useCartStore } from '@/hooks/useCartStore';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import LinearGradient from 'react-native-linear-gradient';
import { LabBookingModal } from './components/LabBookingModal';
import { useAppointmentStore } from '@/hooks/useAppointmentStore';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 300;

export const LabTestDetailsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { test } = route.params;
  const addItem = useCartStore(state => state.addItem);
  const addAppointment = useAppointmentStore(state => state.addAppointment);

  const [bookingVisible, setBookingVisible] = React.useState(false);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const handleAddToCart = () => {
    addItem({
      id: test.id,
      name: test.name,
      brand: test.labName,
      price: test.price,
      image: 'https://cdn-icons-png.flaticon.com/512/3022/3022345.png',
      quantity: 1,
      category: 'Lab Test'
    });
    toast.success('Test added to cart!');
  };

  const handleConfirmBooking = (date: string, time: string) => {
    const newAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: test.id,
      doctorName: test.labName,
      doctorImage: 'https://cdn-icons-png.flaticon.com/512/3022/3022345.png',
      specialty: test.name,
      date: date,
      time: time,
      status: 'upcoming' as const,
    };
    
    addAppointment(newAppointment);
    setBookingVisible(false);
    toast.success('Lab Test Scheduled Successfully!');
    setTimeout(() => {
      navigation.navigate('AppointmentsScreen');
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Animated Header Background */}
      <Animated.View style={[styles.headerImageContainer, headerImageStyle]}>
        <LinearGradient
          colors={theme.gradientPrimary || [theme.primary, theme.primary]}
          style={styles.gradient}
        >
          <FlaskConical size={120} color="rgba(255,255,255,0.2)" style={styles.bgIcon} />
        </LinearGradient>
      </Animated.View>

      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable 
          onPress={() => navigation.goBack()} 
          style={styles.navBtn}
        >
          <ChevronLeft size={24} color="#fff" />
        </Pressable>
        <View style={styles.navRight}>
          <Pressable style={styles.navBtn}>
            <Share2 size={20} color="#fff" />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('CartScreen')} style={styles.navBtn}>
            <ShoppingCart size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      <Animated.ScrollView 
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.spacer} />
        
        {/* Main Content Card */}
        <View style={[styles.contentCard, { backgroundColor: theme.background }]}>
          <View style={styles.handle} />
          
          <View style={styles.mainInfo}>
            <View style={styles.titleRow}>
              <View style={styles.titleLeft}>
                <Text style={[styles.testName, { color: theme.text }]}>{test.name}</Text>
                <View style={styles.labRow}>
                  <Text style={[styles.labName, { color: theme.primary }]}>{test.labName}</Text>
                  <View style={[styles.dot, { backgroundColor: theme.border }]} />
                  <View style={styles.ratingRow}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={[styles.ratingText, { color: theme.text }]}>{test.rating}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.discountBadge, { backgroundColor: theme.error }]}>
                <Text style={styles.discountText}>{test.discount}</Text>
              </View>
            </View>

            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: theme.text }]}>₹{test.price}</Text>
                <Text style={[styles.oldPrice, { color: theme.textSecondary }]}>₹{test.oldPrice}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: theme.accent }]}>
                <ShieldCheck size={14} color={theme.primary} />
                <Text style={[styles.tagText, { color: theme.primary }]}>NABL ACCREDITED</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
              <Clock size={18} color={theme.primary} />
              <Text style={[styles.statValue, { color: theme.text }]}>24 Hrs</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Reports</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
              <MapPin size={18} color={theme.primary} />
              <Text style={[styles.statValue, { color: theme.text }]}>{test.distance} km</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Distance</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
              <FlaskConical size={18} color={theme.primary} />
              <Text style={[styles.statValue, { color: theme.text }]}>{test.details?.length || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Profiles</Text>
            </View>
          </View>

          {/* What's Included Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>What's Included</Text>
            <View style={styles.detailsGrid}>
              {test.details?.map((detail: any, index: number) => (
                <Animated.View 
                  key={index} 
                  entering={FadeInDown.delay(index * 100)}
                  style={[styles.detailItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.checkCircle, { backgroundColor: theme.accent }]}>
                    <CheckCircle2 size={14} color={theme.primary} />
                  </View>
                  <View style={styles.detailTextWrap}>
                    <Text style={[styles.detailTitle, { color: theme.text }]}>{detail.title}</Text>
                    <Text style={[styles.detailCount, { color: theme.textSecondary }]}>{detail.count} Parameters</Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Requirements Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Preparation</Text>
            </View>
            <View style={[styles.requirementsBox, { backgroundColor: theme.surface }]}>
              {test.requirements.map((req: string, index: number) => (
                <View key={index} style={styles.reqRow}>
                  <AlertCircle size={16} color={theme.primary} />
                  <Text style={[styles.reqText, { color: theme.text }]}>{req}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>

      {/* Floating Bottom Bar */}
      <Animated.View entering={SlideInUp} style={[styles.bottomBar, { backgroundColor: theme.surface, ...shadows ,justifyContent:'space-between', gap: 50,}]}>
        <Pressable 
          onPress={handleAddToCart}
          style={({ pressed }) => [
            styles.cartBtn, 
            { borderColor: theme.primary, opacity: pressed ? 0.7 : 1 }
          ]}
        >
          <ShoppingCart size={22} color={theme.primary} />
        </Pressable>
        <AnimatedButton 
          title="Book Appointment"
          onPress={() => setBookingVisible(true)}
          style={{ backgroundColor: theme.primary, flex: 1,   maxWidth: 250 }}
        />
      </Animated.View>

      <LabBookingModal 
        visible={bookingVisible}
        onClose={() => setBookingVisible(false)}
        onConfirm={handleConfirmBooking}
        testName={test.name}
        labName={test.labName}
        price={test.price}
      />
      <Toasts />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerImageContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_HEIGHT },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bgIcon: { opacity: 0.5 },
  navBar: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 100, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  navBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  navRight: { flexDirection: 'row', gap: 12 },
  scrollContent: { flexGrow: 1 },
  spacer: { height: HEADER_HEIGHT - 40 },
  contentCard: { flex: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 20, paddingTop: 10 },
  handle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#E0E00', alignSelf: 'center', marginBottom: 20, opacity: 0.3 },
  mainInfo: { marginBottom: 24 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleLeft: { flex: 1 },
  testName: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  labRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  labName: { fontSize: 15, fontWeight: '700' },
  dot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '800' },
  discountBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  discountText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  priceSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  price: { fontSize: 30, fontWeight: '900' },
  oldPrice: { fontSize: 18, textDecorationLine: 'line-through', opacity: 0.5 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  tagText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statItem: { flex: 1, padding: 16, borderRadius: 20, alignItems: 'center', gap: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  statValue: { fontSize: 15, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '900', marginBottom: 16 },
  detailsGrid: { gap: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1, gap: 16 },
  checkCircle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  detailTextWrap: { flex: 1 },
  detailTitle: { fontSize: 15, fontWeight: '800' },
  detailCount: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  requirementsBox: { padding: 20, borderRadius: 24, gap: 16, borderLeftWidth: 4, borderLeftColor: '#00796B', backgroundColor: '#F0F7F6' },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reqText: { fontSize: 14, fontWeight: '700' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 34, flexDirection: 'row', alignItems: 'center', borderTopLeftRadius: 28, borderTopRightRadius: 28, gap: 16, elevation: 20 },
  cartBtn: { width: 60, height: 60, borderRadius: 20, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
});

export default LabTestDetailsScreen;
