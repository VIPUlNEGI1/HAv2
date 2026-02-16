import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { User, Stethoscope, Building2, Factory, X } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { useRoleStore } from '@/hooks/useRoleStore';
import type { UserRole } from '@/types';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface RoleSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onRoleSelect: (role: UserRole) => void;
  availableRoles: UserRole[];
  /** When false, modal stays open after selecting; parent closes on success (e.g. after confirmation). Default true. */
  closeOnSelect?: boolean;
}

const roleConfig = {
  user: {
    icon: User,
    title: 'User',
    description: 'Browse services, book appointments, and purchase medicines',
    color: '#4B2A99',
  },
  doctor: {
    icon: Stethoscope,
    title: 'Doctor',
    description: 'Provide consultations, manage services, and connect with patients',
    color: '#10B981',
  },
  clinic: {
    icon: Building2,
    title: 'Clinic',
    description: 'Manage inventory, sell medicines, and serve patients',
    color: '#3B82F6',
  },
  factory: {
    icon: Factory,
    title: 'Factory',
    description: 'Supply medicines in bulk to clinics and manage orders',
    color: '#F59E0B',
  },
};

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  visible,
  onClose,
  onRoleSelect,
  availableRoles,
  closeOnSelect = true,
}) => {
  const { theme, shadows } = useTheme();
  const { currentRole } = useRoleStore();

  const handleRoleSelect = (role: UserRole) => {
    onRoleSelect(role);
    if (closeOnSelect) onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={FadeInUp}
          style={[styles.modalContent, { backgroundColor: theme.surface, ...shadows }]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Switch Role</Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: theme.background }]}
            >
              <X size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Select a role to continue
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {(['user', 'doctor', 'clinic', 'factory'] as UserRole[]).map((role, index) => {
              const config = roleConfig[role];
              const Icon = config.icon;
              const isAvailable = availableRoles.includes(role);
              const isSelected = currentRole === role;

              return (
                <Animated.View
                  key={role}
                  entering={FadeInDown.delay(index * 100)}
                >
                  <TouchableOpacity
                    style={[
                      styles.roleCard,
                      {
                        backgroundColor: isSelected
                          ? config.color + '15'
                          : theme.background,
                        borderColor: isSelected ? config.color : theme.border,
                        opacity: isAvailable ? 1 : 0.5,
                      },
                      shadows,
                    ]}
                    onPress={() => isAvailable && handleRoleSelect(role)}
                    disabled={!isAvailable}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: config.color + '20' },
                      ]}
                    >
                      <Icon size={28} color={config.color} />
                    </View>

                    <View style={styles.roleInfo}>
                      <View style={styles.roleHeader}>
                        <Text style={[styles.roleTitle, { color: theme.text }]}>
                          {config.title}
                        </Text>
                        {isSelected && (
                          <View
                            style={[
                              styles.selectedBadge,
                              { backgroundColor: config.color },
                            ]}
                          >
                            <Text style={styles.selectedText}>Active</Text>
                          </View>
                        )}
                        {!isAvailable && (
                          <View style={[styles.lockedBadge, { backgroundColor: theme.border }]}>
                            <Text style={[styles.lockedText, { color: theme.textSecondary }]}>
                              Locked
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.roleDescription, { color: theme.textSecondary }]}>
                        {config.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    fontWeight: '500',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  selectedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  selectedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  lockedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lockedText: {
    fontSize: 10,
    fontWeight: '600',
  },
  roleDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
