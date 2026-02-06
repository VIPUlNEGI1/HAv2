import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { X, Check } from 'lucide-react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export const MedicineFilterModal = ({ visible, onClose, filters, setFilters }: any) => {
  const { theme, shadows } = useTheme();

  const BRANDS = ['Dolo', 'Cipla', 'Limcee', 'Okacet', 'Abbott', 'Sun Pharma'];
  const OFFERS = ['Flat 20% OFF', 'Buy 1 Get 1', 'Free Delivery'];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.flex} onPress={onClose} />
        <Animated.View entering={SlideInDown} style={[styles.container, { backgroundColor: theme.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.background }]}>
              <X size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
            {/* Price Range */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Price Range</Text>
              <View style={styles.chipRow}>
                {['Under ₹100', '₹100 - ₹500', 'Over ₹500'].map(p => (
                  <TouchableOpacity 
                    key={p} 
                    onPress={() => setFilters({ ...filters, price: p })}
                    style={[styles.chip, { backgroundColor: filters.price === p ? theme.primary : theme.background, borderColor: theme.border }]}
                  >
                    <Text style={[styles.chipText, { color: filters.price === p ? '#fff' : theme.text }]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Brands */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Brands</Text>
              <View style={styles.chipRow}>
                {BRANDS.map(b => (
                  <TouchableOpacity 
                    key={b} 
                    onPress={() => setFilters({ ...filters, brand: b })}
                    style={[styles.chip, { backgroundColor: filters.brand === b ? theme.primary : theme.background, borderColor: theme.border }]}
                  >
                    <Text style={[styles.chipText, { color: filters.brand === b ? '#fff' : theme.text }]}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Offers */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Offers</Text>
              {OFFERS.map(o => (
                <TouchableOpacity 
                  key={o} 
                  onPress={() => setFilters({ ...filters, offer: o })}
                  style={styles.checkboxRow}
                >
                  <View style={[styles.checkbox, { borderColor: theme.primary, backgroundColor: filters.offer === o ? theme.primary : 'transparent' }]}>
                    {filters.offer === o && <Check size={12} color="#fff" />}
                  </View>
                  <Text style={[styles.checkboxLabel, { color: theme.text }]}>{o}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity onPress={() => setFilters({})} style={styles.resetBtn}>
              <Text style={[styles.resetText, { color: theme.textSecondary }]}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={[styles.applyBtn, { backgroundColor: theme.primary }]}>
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  flex: { flex: 1 },
  container: { borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: height * 0.7, paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '900' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '700' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  checkboxLabel: { fontSize: 15, fontWeight: '600' },
  footer: { flexDirection: 'row', padding: 24, borderTopWidth: 1, gap: 16 },
  resetBtn: { flex: 1, height: 56, justifyContent: 'center', alignItems: 'center' },
  resetText: { fontSize: 16, fontWeight: '800' },
  applyBtn: { flex: 2, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  applyText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});
