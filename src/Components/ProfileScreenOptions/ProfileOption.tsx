import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';

export const ProfileOption = ({
  icon: Icon,
  title,
  subtitle,
  onPress,
  isDestructive = false,
}: any) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.option, { borderBottomColor: theme.border }]} 
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isDestructive ? '#FEE2E2' : theme.border },
        ]}
      >
        <Icon size={20} color={isDestructive ? '#EF4444' : theme.primary} />
      </View>
      <View style={styles.optionTextContainer}>
        <Text
          style={[
            styles.optionTitle, 
            { color: isDestructive ? '#EF4444' : theme.text }
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <ChevronRight size={18} color={theme.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  optionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
