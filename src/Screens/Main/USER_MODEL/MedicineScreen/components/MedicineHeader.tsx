import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { useNavigation } from '@react-navigation/native';

export const MedicineHeader = ({ cartCount }: { cartCount: number }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.header, { backgroundColor: theme.surface }]}>
      <View style={styles.headerTop}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Medicines</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('CartScreen')}
          style={[styles.cartBtn, { backgroundColor: theme.background }]}
        >
          <ShoppingCart size={20} color={theme.text} />
          {cartCount > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '900' },
  cartBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: -4, right: -4, borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  cartBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
});
