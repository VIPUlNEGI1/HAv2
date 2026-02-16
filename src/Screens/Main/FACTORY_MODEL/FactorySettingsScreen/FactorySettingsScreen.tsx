import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { useFactorySettings } from './hooks/useFactorySettings';
import { NotificationSettings } from './components/NotificationSettings';

const FactorySettingsScreen = () => {
  const { theme } = useTheme();
  const { settings, updateSettings } = useFactorySettings();

  return (
    <ScreenWrapper title="Factory Settings" showBack={true} scrollable={true}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <NotificationSettings
          orders={settings.notifications.orders}
          payments={settings.notifications.payments}
          shipping={settings.notifications.shipping}
          onOrdersChange={(value) =>
            updateSettings({ notifications: { ...settings.notifications, orders: value } })
          }
          onPaymentsChange={(value) =>
            updateSettings({ notifications: { ...settings.notifications, payments: value } })
          }
          onShippingChange={(value) =>
            updateSettings({ notifications: { ...settings.notifications, shipping: value } })
          }
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FactorySettingsScreen;
