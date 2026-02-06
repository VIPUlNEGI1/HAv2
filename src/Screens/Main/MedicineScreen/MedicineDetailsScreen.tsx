import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Dimensions, FlatList } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { ChevronLeft, ShoppingCart, Info, ShieldCheck, ArrowRight, Plus, Minus, Zap, Tag } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInUp, FadeInDown, SlideInUp } from 'react-native-reanimated';
import { useCartStore } from '@/hooks/useCartStore';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import { AnimatedButton } from '@/Components/AnimatedButton';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';

const { width } = Dimensions.get('window');

// Extended dummy data for better similarity matching
const ALL_MEDICINES = [
  { id: '1', name: 'Paracetamol 500mg', brand: 'Dolo', price: 30, image: 'https://5.imimg.com/data5/SELLER/Default/2021/10/XF/XN/XH/139369974/dolo-650-tablet-500x500.jpg', weight: '15 Tablets', category: 'Pain Relief' },
  { id: '2', name: 'Amoxicillin 250mg', brand: 'Cipla', price: 120, image: 'https://5.imimg.com/data5/ANDROID/Default/2021/6/YQ/YF/YF/131495932/product-500x500.jpg', weight: '10 Capsules', category: 'Antibiotics' },
  { id: '3', name: 'Vitamin C 500mg', brand: 'Limcee', price: 45, image: 'https://5.imimg.com/data5/SELLER/Default/2021/3/XQ/XQ/XQ/12345678/limcee-500mg-tablet-500x500.jpg', weight: '15 Tablets', category: 'Vitamins' },
  { id: '4', name: 'Cetirizine 10mg', brand: 'Okacet', price: 25, image: 'https://5.imimg.com/data5/SELLER/Default/2022/1/XQ/XQ/XQ/12345678/okacet-tablet-500x500.jpg', weight: '10 Tablets', category: 'Allergy' },
  { id: '5', name: 'Digene Gel Mint', brand: 'Abbott', price: 150, image: 'https://5.imimg.com/data5/SELLER/Default/2021/8/XF/XN/XH/139369974/digene-gel-500x500.jpg', weight: '200ml Liquid', category: 'Stomach' },
  { id: '6', name: 'Volini Gel', brand: 'Sun Pharma', price: 95, image: 'https://5.imimg.com/data5/SELLER/Default/2021/10/XF/XN/XH/139369974/volini-gel-500x500.jpg', weight: '30g Tube', category: 'Pain Relief' },
  { id: 'alt1', name: 'Paracetamol 650', brand: 'Calpol', price: 25, image: 'https://5.imimg.com/data5/SELLER/Default/2021/10/XF/XN/XH/139369974/dolo-650-tablet-500x500.jpg', weight: '15 Tablets', category: 'Pain Relief' },
  { id: 'alt2', name: 'Acetaminophen', brand: 'Tylenol', price: 180, image: 'https://5.imimg.com/data5/ANDROID/Default/2021/6/YQ/YF/YF/131495932/product-500x500.jpg', weight: '10 Capsules', category: 'Pain Relief' },
];

const MedicineDetailsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { medicine } = route.params;
  const { addItem, updateQuantity, items } = useCartStore();
  
  const cartItem = items.find(i => i.id === medicine.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const images = [
    medicine.image,
    'https://5.imimg.com/data5/SELLER/Default/2021/10/XF/XN/XH/139369974/dolo-650-tablet-500x500.jpg',
    'https://5.imimg.com/data5/ANDROID/Default/2021/6/YQ/YF/YF/131495932/product-500x500.jpg'
  ];

  // Dynamic similarity logic based on category and price range
  const similarMedicines = useMemo(() => {
    return ALL_MEDICINES.filter(m => 
      m.category === medicine.category && m.id !== medicine.id
    ).sort((a, b) => a.price - b.price); // Sort by price for comparison
  }, [medicine]);

  const handleBuyNow = () => {
    if (quantity === 0) addItem(medicine);
    navigation.navigate('CartScreen');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => navigation.goBack()} 
          style={({ pressed }) => [styles.iconBtn, { backgroundColor: theme.surface, opacity: pressed ? 0.7 : 1 }]}
          hitSlop={12}
        >
          <ChevronLeft size={24} color={theme.text} />
        </Pressable>
        <Pressable 
          onPress={() => navigation.navigate('CartScreen')} 
          style={({ pressed }) => [styles.iconBtn, { backgroundColor: theme.surface, opacity: pressed ? 0.7 : 1 }]}
          hitSlop={12}
        >
          <ShoppingCart size={22} color={theme.text} />
          {items.length > 0 && <View style={[styles.badge, { backgroundColor: theme.primary }]} />}
        </Pressable>
      </View>
<AppSeparator size={20} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item }} style={styles.mainImage} />
              </View>
            )}
          />
        </View>

        {/* Product Info Card */}
        <Animated.View entering={FadeInUp.springify()} style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows }]}>
          <View style={styles.infoTop}>
            <View>
              <Text style={[styles.brand, { color: theme.primary }]}>{medicine.brand}</Text>
              <Text style={[styles.name, { color: theme.text }]}>{medicine.name}</Text>
              <Text style={[styles.weight, { color: theme.textSecondary }]}>{medicine.weight}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: theme.accent }]}>
              <ShieldCheck size={14} color={theme.primary} />
              <Text style={[styles.tagText, { color: theme.primary }]}>100% GENUINE</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <View>
              <Text style={[styles.price, { color: theme.text }]}>₹{medicine.price}</Text>
              <Text style={[styles.taxText, { color: theme.textSecondary }]}>Inclusive of all taxes</Text>
            </View>
            
            {quantity > 0 ? (
              <View style={[styles.qtyContainer, { backgroundColor: theme.primary }]}>
                <Pressable 
                  onPress={() => updateQuantity(medicine.id, -1)} 
                  style={({ pressed }) => [styles.qtyBtn, { opacity: pressed ? 0.7 : 1 }]}
                  hitSlop={8}
                >
                  <Minus size={18} color="#fff" />
                </Pressable>
                <Text style={styles.qtyText}>{quantity}</Text>
                <Pressable 
                  onPress={() => updateQuantity(medicine.id, 1)} 
                  style={({ pressed }) => [styles.qtyBtn, { opacity: pressed ? 0.7 : 1 }]}
                  hitSlop={8}
                >
                  <Plus size={18} color="#fff" />
                </Pressable>
              </View>
            ) : (
              <AnimatedButton 
                title="Add to Cart"
                onPress={() => {
                  addItem(medicine);
                  toast.success('Added to Cart');
                }}
                style={{ backgroundColor: theme.primary, maxWidth:160 }}
              />
            )}
          </View>
        </Animated.View>

        {/* Medication Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Medication Info</Text>
          <View style={[styles.detailBox, { backgroundColor: theme.surface, ...shadows }]}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Composition</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>Paracetamol IP 500mg, Caffeine 30mg</Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Usage</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>Pain relief, Fever reduction, Headache</Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Side Effects</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>Nausea, Dizziness (Consult doctor if persistent)</Text>
          </View>
        </View>

        {/* Similar Alternatives Section (Price Comparison) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithIcon}>
              <Tag size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 8, marginBottom: 0 }]}>Similar in {medicine.category}</Text>
            </View>
            <Pressable 
              onPress={() => navigation.navigate('MedicineScreen')} 
              style={({ pressed }) => [styles.seeAll, { opacity: pressed ? 0.7 : 1 }]}
              hitSlop={10}
            >
              <Text style={{ color: theme.primary, fontWeight: '700' }}>See All</Text>
              <ArrowRight size={16} color={theme.primary} />
            </Pressable>
          </View>
          
          <Text style={[styles.comparisonText, { color: theme.textSecondary }]}>Compare prices and brands for similar effectiveness.</Text>

          <FlatList
            data={similarMedicines}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.altList}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Pressable 
                onPress={() => navigation.push('MedicineDetailsScreen', { medicine: item })}
                style={({ pressed }) => [
                  styles.altCard, 
                  { backgroundColor: theme.surface, ...shadows, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
                ]}
              >
                <View style={styles.altImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.altImage} />
                  {item.price < medicine.price && (
                    <View style={[styles.cheaperBadge, { backgroundColor: theme.success }]}>
                      <Text style={styles.cheaperText}>SAVINGS</Text>
                    </View>
                  )}
                </View>
                <View style={styles.altInfo}>
                  <Text style={[styles.altName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                  <Text style={[styles.altBrand, { color: theme.primary }]}>{item.brand}</Text>
                  <View style={styles.altPriceRow}>
                    <Text style={[styles.altPrice, { color: theme.text }]}>₹{item.price}</Text>
                    <Pressable 
                      onPress={() => {
                        addItem(item);
                        toast.success('Added to Cart');
                      }}
                      style={({ pressed }) => [styles.altAddBtn, { borderColor: theme.primary, opacity: pressed ? 0.6 : 1 }]}
                      hitSlop={8}
                    >
                      <Plus size={14} color={theme.primary} />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <Animated.View entering={SlideInUp} style={[styles.bottomBar, { backgroundColor: theme.surface, ...shadows }]}>
        <AnimatedButton 
          title="Buy Now"
          icon={<Zap size={20} color="#fff" fill="#fff" />}
          onPress={handleBuyNow}
          style={{ backgroundColor: theme.primary, flex: 1 }}
        />
      </Animated.View>
      
      <Toasts />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  badge: { position: 'absolute', top: 10, right: 10, width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: '#fff' },
  scrollContent: { paddingTop: 100, paddingBottom: 120 },
  carouselContainer: { height: 320, alignItems: 'center', justifyContent: 'center' },
  imageWrapper: { width: width, alignItems: 'center', justifyContent: 'center' },
  mainImage: { width: 250, height: 250, resizeMode: 'contain' },
  infoCard: { margin: 20, borderRadius: 28, padding: 24 },
  infoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  name: { fontSize: 22, fontWeight: '900', marginTop: 4 },
  weight: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 10, fontWeight: '900' },
  priceRow: { flexDirection: 'row', gap:70, justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
  price: { fontSize: 26, fontWeight: '900' },
  taxText: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 6 },
  qtyBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  qtyText: { color: '#fff', fontSize: 18, fontWeight: '900', marginHorizontal: 12 },
  section: { paddingHorizontal: 20, marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 16 },
  detailBox: { padding: 20, borderRadius: 20 },
  detailLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: '600', marginBottom: 16 },
  divider: { height: 1, width: '100%', marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  titleWithIcon: { flexDirection: 'row', alignItems: 'center' },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  comparisonText: { fontSize: 13, fontWeight: '500', marginBottom: 16 },
  altList: { paddingRight: 20 },
  altCard: { width: 160, borderRadius: 24, padding: 12, marginRight: 16, marginBottom: 8 },
  altImageContainer: { width: '100%', height: 100, backgroundColor: '#f8f8f8', borderRadius: 16, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  altImage: { width: '80%', height: '80%', resizeMode: 'contain' },
  cheaperBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  cheaperText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  altInfo: { marginTop: 12 },
  altName: { fontSize: 14, fontWeight: '800' },
  altBrand: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  altPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  altPrice: { fontSize: 16, fontWeight: '900' },
  altAddBtn: { width: 32, height: 32, borderRadius: 10, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 34, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
});

export default MedicineDetailsScreen;
