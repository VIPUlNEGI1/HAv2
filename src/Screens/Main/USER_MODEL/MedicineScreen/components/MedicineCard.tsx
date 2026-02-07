import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/native';

export const MedicineCard = ({ item, index, quantity, onUpdateCart }: any) => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <Animated.View entering={FadeInDown.delay(index * 100)} style={[styles.card, { backgroundColor: theme.surface, ...shadows }]}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('MedicineDetailsScreen', { medicine: item })}
      >
        <View style={[styles.imageContainer, { backgroundColor: theme.background }]}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={[styles.categoryTag, { backgroundColor: theme.accent }]}>
            <Text style={[styles.categoryTagText, { color: theme.primary }]}>{item.category}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={[styles.brand, { color: theme.primary }]}>{item.brand}</Text>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>{item.name}</Text>
        <Text style={[styles.weight, { color: theme.textSecondary }]}>{item.weight}</Text>
        <View style={styles.footer}>
          <Text style={[styles.price, { color: theme.text }]}>₹{item.price}</Text>
          {quantity > 0 ? (
            <View style={[styles.quantityContainer, { backgroundColor: theme.primary }]}>
              <TouchableOpacity onPress={() => onUpdateCart(item.id, -1)} style={styles.qtyBtn}>
                <Minus size={14} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity onPress={() => onUpdateCart(item.id, 1)} style={styles.qtyBtn}>
                <Plus size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => onUpdateCart(item.id, 1)} style={[styles.addBtn, { borderColor: theme.primary }]}>
              <Text style={[styles.addBtnText, { color: theme.primary }]}>ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 16, width: '48%', marginBottom: 16, overflow: 'hidden' },
  imageContainer: { width: '100%', height: 120, justifyContent: 'center', alignItems: 'center', padding: 12, position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'contain' },
  categoryTag: { position: 'absolute', bottom: 8, left: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  categoryTagText: { fontSize: 8, fontWeight: '900', textTransform: 'uppercase' },
  info: { padding: 12 },
  brand: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', marginBottom: 2 },
  name: { fontSize: 13, fontWeight: '700', height: 36, lineHeight: 16 },
  weight: { fontSize: 11, marginTop: 4, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  price: { fontSize: 15, fontWeight: '900' },
  addBtn: { borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  addBtnText: { fontWeight: '800', fontSize: 11 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 4 },
  qtyBtn: { padding: 4 },
  qtyText: { color: '#fff', marginHorizontal: 6, fontWeight: '900', fontSize: 12 },
});
