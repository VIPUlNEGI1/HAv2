import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, Search } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { useNavigation } from '@react-navigation/native';

export const CategoryHeader = ({ title }: { title: string }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.header, { backgroundColor: theme.surface }]}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Search size={20} color={theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '900', flex: 1, marginLeft: 8 },
  searchBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
