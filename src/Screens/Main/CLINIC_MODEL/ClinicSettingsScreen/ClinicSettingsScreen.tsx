import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { useClinicSettings } from './hooks/useClinicSettings';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

const ClinicSettingsScreen = () => {
  const { theme } = useTheme();
  const { settings, updateSettings } = useClinicSettings();

  return (
    <ScreenWrapper title="Clinic Settings" showBack={true} scrollable={true}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>

          <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Order Notifications</Text>
            <Switch
              value={settings.notifications.orders}
              onValueChange={(value) =>
                updateSettings({ notifications: { ...settings.notifications, orders: value } })
              }
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Payment Notifications</Text>
            <Switch
              value={settings.notifications.payments}
              onValueChange={(value) =>
                updateSettings({ notifications: { ...settings.notifications, payments: value } })
              }
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Inventory Alerts</Text>
            <Switch
              value={settings.notifications.inventory}
              onValueChange={(value) =>
                updateSettings({ notifications: { ...settings.notifications, inventory: value } })
              }
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: moderateScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(16),
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
});

export default ClinicSettingsScreen;
