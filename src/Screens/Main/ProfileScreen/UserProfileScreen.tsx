import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {
  Settings,
  CreditCard,
  MapPin,
  Bell,
  LogOut,
  Trash2,
  ShieldCheck,
  Camera,
  ShieldCheck as VerifiedIcon,
  Info,
} from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { useNavigation } from '@react-navigation/native';
import { useRoleStore } from '@/hooks/useRoleStore';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { ProfileOption } from '@/Components/ProfileScreenOptions/ProfileOption';
import { useProfile } from '../USER_MODEL/hooks/useProfile';

const UserProfileScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const {
    user,
    displayName,
    savedAddressCount,
    savingAddress,
    handleSaveCurrentLocation,
    logout,
    handleDeleteAccount,
    profileStats,
    avatarUrl,
  } = useProfile();
  const { currentRole } = useRoleStore();

  const getRoleDisplayName = (role: string | null) => {
    if (!role) return 'Select Role';
    const roleNames: Record<string, string> = {
      user: 'User',
      doctor: 'Doctor',
      clinic: 'Clinic',
      factory: 'Factory',
    };
    return roleNames[role] || role;
  };

  return (
    <ScreenWrapper
      title="Profile"
      showBack={true}
      showProfile={false}
      scrollable={true}
    >
      {/* Enhanced Profile Header */}
      <Animated.View entering={FadeInUp} style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.profileHeaderRow}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarContainer, { borderColor: theme.primary + '44' }]}>
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            </View>
            <TouchableOpacity style={[styles.cameraBtn, { backgroundColor: theme.primary }]}>
              <Camera size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.nameContainer}>
            <View style={styles.userNameRow}>
              <Text style={[styles.userName, { color: theme.text }]}>
                {displayName || user?.name || 'User'}
              </Text>
              <VerifiedIcon size={18} color={theme.primary} style={styles.verifiedIcon} />
            </View>
            <View style={[styles.membershipBadge, { backgroundColor: theme.primary + '15' }]}>
              <Text style={[styles.membershipText, { color: theme.primary }]}>
                {getRoleDisplayName(currentRole).toUpperCase()}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.settingsBtn, { backgroundColor: theme.background }]}
            onPress={() => navigation.navigate('SettingsScreen')}
          >
            <Settings size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Stats Row - Floating Design */}
      <Animated.View entering={FadeInDown.delay(200)} style={[styles.statsRow, { backgroundColor: theme.surface, ...shadows }]}>
        {profileStats.map((stat: any, index: number) => (
          <View 
            key={stat.label} 
            style={[
              styles.statItem, 
              index !== profileStats.length - 1 && { borderRightWidth: 1, borderRightColor: theme.border }
            ]}
          >
            <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Info & Settings - single entry point */}
        <Text style={[styles.sectionHeaderTitle, { color: theme.textSecondary }]}>PROFILE</Text>
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, ...shadows }]}>
          <ProfileOption
            index={0}
            icon={Info}
            title="Info & Settings"
            subtitle="View & edit profile, documents, payment history"
            onPress={() => navigation.navigate('UserInfoScreen')}
          />
        </View>

        {/* Account Settings */}
        <Text style={[styles.sectionHeaderTitle, { color: theme.textSecondary }]}>ACCOUNT SETTINGS</Text>
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, ...shadows }]}>
          <ProfileOption
            index={1}
            icon={MapPin}
            title="Saved Addresses"
            subtitle={savedAddressCount > 0 ? `${savedAddressCount} address(es)` : 'Add home, office & others'}
          />
          <ProfileOption
            index={2}
            icon={MapPin}
            title="Save current location"
            subtitle={savingAddress ? 'Saving...' : 'Add your current location as address'}
            onPress={savingAddress ? undefined : handleSaveCurrentLocation}
          />
          <ProfileOption index={3} icon={CreditCard} title="Payments" subtitle="Cards, UPI & Wallets" />
          <ProfileOption index={4} icon={Bell} title="Notifications" subtitle="Alerts, Offers & Updates" />
        </View>

        {/* Support & Legal */}
        <Text style={[styles.sectionHeaderTitle, { color: theme.textSecondary }]}>SUPPORT & LEGAL</Text>
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, ...shadows }]}>
          <ProfileOption index={4} icon={ShieldCheck} title="Privacy Policy" />
          <ProfileOption
            index={5}
            icon={Settings}
            title="App Settings"
            subtitle="Theme, role switch, notifications"
            onPress={() => navigation.navigate('SettingsScreen')}
          />
        </View>

        {/* Danger Zone */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, ...shadows, marginTop: 24 }]}>
          <ProfileOption index={6} icon={LogOut} title="Logout" onPress={logout} />
          <ProfileOption 
            index={7}
            icon={Trash2} 
            title="Delete Account" 
            isDestructive 
            onPress={handleDeleteAccount} 
          />
        </View>

        <Text style={[styles.version, { color: theme.textSecondary }]}>Version 1.0.0 (2026) • Made with ❤️</Text>
        <View style={styles.footerSpacer} />
      </View>

    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 50,
   borderRadius: 32,
    marginHorizontal: 5,
    marginTop: 10,
   
  },
  profileHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: { position: 'relative' },
  avatarContainer: { width: 84, height: 84, borderRadius: 42, borderWidth: 4, padding: 2, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  nameContainer: { marginLeft: 16, flex: 1 },
  userNameRow: { flexDirection: 'row', alignItems: 'center' },
  userName: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  verifiedIcon: { marginLeft: 6 },
  userPhone: { fontSize: 14, marginTop: 2, fontWeight: '500' },
  membershipBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  membershipText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: -35,
    borderRadius: 24,
    paddingVertical: 20,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 12, marginTop: 4, fontWeight: '600' },
  content: { padding: 20 },
  sectionCard: { borderRadius: 24, overflow: 'hidden', marginBottom: 16 },
  sectionHeaderTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginLeft: 8, marginBottom: 12, marginTop: 8 },
  version: { textAlign: 'center', fontSize: 12, marginTop: 32, fontWeight: '600' },
  footerSpacer: { height: 20 },
});

export default UserProfileScreen;
