import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { useCartStore } from '@/hooks/useCartStore';
import { Trash2, Plus, Minus, CreditCard, FileText, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import { ScreenWrapper } from '@/Components/ScreenWrapper';

const CartScreen = () => {
  const { theme, shadows } = useTheme();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    
    // Simulate Payment Gateway
    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true);
      // In real app, generate receipt here
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <ScreenWrapper title="Order Success" showBack={false} scrollable={false}>
        <View style={styles.successContainer}>
          <Animated.View entering={FadeInDown}>
            <CheckCircle2 size={80} color={theme.primary} />
          </Animated.View>
          <Text style={[styles.successTitle, { color: theme.text }]}>Order Placed Successfully!</Text>
          <Text style={[styles.successDesc, { color: theme.textSecondary }]}>Your medicines will be delivered in 15 mins.</Text>
          
          <Pressable 
            style={({ pressed }) => [styles.receiptBtn, { backgroundColor: theme.surface, ...shadows, opacity: pressed ? 0.8 : 1 }]}
          >
            <FileText size={20} color={theme.primary} />
            <Text style={[styles.receiptText, { color: theme.text }]}>Download Receipt (PDF)</Text>
          </Pressable>

          <Pressable 
            onPress={() => {
              clearCart();
              setOrderPlaced(false);
            }} 
            style={({ pressed }) => [styles.homeBtn, { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 }]}
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      title="My Cart"
      showBack={true}
      scrollable={true}
      contentStyle={styles.scrollContent}
    >
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/11329/11329060.png' }} style={styles.emptyImage} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Your cart is empty</Text>
          <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>Add some medicines to start your order.</Text>
        </View>
      ) : (
        <>
          {/* Items List */}
          <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
            {items.map((item, index) => (
              <View key={item.id} style={[styles.cartItem, index !== items.length - 1 && { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.itemBrand, { color: theme.textSecondary }]}>{item.brand}</Text>
                  <Text style={[styles.itemPrice, { color: theme.text }]}>₹{item.price}</Text>
                </View>
                <View style={styles.qtyContainer}>
                  <Pressable 
                    onPress={() => updateQuantity(item.id, -1)} 
                    style={({ pressed }) => [styles.qtyBtn, { backgroundColor: theme.background, opacity: pressed ? 0.7 : 1 }]}
                    hitSlop={8}
                  >
                    <Minus size={14} color={theme.text} />
                  </Pressable>
                  <Text style={[styles.qtyText, { color: theme.text }]}>{item.quantity}</Text>
                  <Pressable 
                    onPress={() => updateQuantity(item.id, 1)} 
                    style={({ pressed }) => [styles.qtyBtn, { backgroundColor: theme.primary, opacity: pressed ? 0.7 : 1 }]}
                    hitSlop={8}
                  >
                    <Plus size={14} color="#fff" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          {/* Bill Summary */}
          <View style={[styles.section, { backgroundColor: theme.surface, ...shadows, marginTop: 20 }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Bill Summary</Text>
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: theme.textSecondary }]}>Item Total</Text>
              <Text style={[styles.billValue, { color: theme.text }]}>₹{subtotal}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: theme.textSecondary }]}>Delivery Fee</Text>
              <Text style={[styles.billValue, { color: theme.primary }]}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</Text>
            </View>
            <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
              <Text style={[styles.totalLabel, { color: theme.text }]}>Grand Total</Text>
              <Text style={[styles.totalValue, { color: theme.text }]}>₹{total}</Text>
            </View>
          </View>

          {/* Payment Method */}
          <Pressable 
            style={({ pressed }) => [styles.section, styles.paymentRow, { backgroundColor: theme.surface, ...shadows, marginTop: 20, opacity: pressed ? 0.9 : 1 }]}
          >
            <View style={styles.paymentLeft}>
              <CreditCard size={20} color={theme.primary} />
              <Text style={[styles.paymentText, { color: theme.text }]}>Pay via UPI / Card</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </Pressable>
        </>
      )}
      <View style={{ height: 120 }} />

      {items.length > 0 && (
        <Animated.View entering={SlideInUp} style={[styles.footer, { backgroundColor: theme.surface, ...shadows }]}>
          <View>
            <Text style={[styles.footerTotal, { color: theme.text }]}>₹{total}</Text>
            <Text style={[styles.footerSub, { color: theme.primary }]}>VIEW DETAILED BILL</Text>
          </View>
          <Pressable 
            onPress={handleCheckout}
            disabled={isProcessing}
            style={({ pressed }) => [styles.checkoutBtn, { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 }]}
          >
            <Text style={styles.checkoutBtnText}>{isProcessing ? 'Processing...' : 'Place Order'}</Text>
          </Pressable>
        </Animated.View>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  section: { borderRadius: 24, padding: 16, overflow: 'hidden' },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 16 },
  cartItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  itemImage: { width: 60, height: 60, borderRadius: 12, resizeMode: 'contain' },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: '700' },
  itemBrand: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  itemPrice: { fontSize: 15, fontWeight: '900', marginTop: 4 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 14, fontWeight: '900' },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  billLabel: { fontSize: 13, fontWeight: '600' },
  billValue: { fontSize: 13, fontWeight: '700' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 16, borderTopWidth: 1 },
  totalLabel: { fontSize: 16, fontWeight: '900' },
  totalValue: { fontSize: 16, fontWeight: '900' },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  paymentLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  paymentText: { fontSize: 15, fontWeight: '700' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 34, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  footerTotal: { fontSize: 20, fontWeight: '900' },
  footerSub: { fontSize: 11, fontWeight: '800', marginTop: 2 },
  checkoutBtn: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16 },
  checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyImage: { width: 200, height: 200, resizeMode: 'contain' },
  emptyTitle: { fontSize: 20, fontWeight: '900', marginTop: 24 },
  emptyDesc: { fontSize: 14, textAlign: 'center', marginTop: 8, paddingHorizontal: 40 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successTitle: { fontSize: 24, fontWeight: '900', marginTop: 24 },
  successDesc: { fontSize: 15, textAlign: 'center', marginTop: 8, fontWeight: '500' },
  receiptBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, marginTop: 40, width: '100%', justifyContent: 'center' },
  receiptText: { fontSize: 14, fontWeight: '700' },
  homeBtn: { marginTop: 16, width: '100%', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  homeBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});

export default CartScreen;
