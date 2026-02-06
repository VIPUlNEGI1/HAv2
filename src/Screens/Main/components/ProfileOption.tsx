import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import Animated, { FadeInRight } from 'react-native-reanimated';

export const ProfileOption = ({
  icon: Icon,
  title,
  subtitle,
  onPress,
  isDestructive = false,
  index = 0,
}: any) => {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 50)}>
      <TouchableOpacity 
        style={[styles.option, { borderBottomColor: theme.border }]} 
        onPress={onPress}
        activeOpacity={0.7}
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '400',
  },
});
