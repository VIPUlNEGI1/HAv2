import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { CategoryHeader } from '@/Components/CategoryHeader';

const PlaceholderScreen = ({ title }: { title: string }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CategoryHeader title={title} />
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          {title} services coming soon...
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
});

export const AppointmentsScreen = () => <PlaceholderScreen title="Appointments" />;
export const AyurvedaScreen = () => <PlaceholderScreen title="Ayurveda" />;
export const HomeCareScreen = () => <PlaceholderScreen title="Home Care" />;
export const BabyCareScreen = () => <PlaceholderScreen title="Baby Care" />;

export default PlaceholderScreen;
