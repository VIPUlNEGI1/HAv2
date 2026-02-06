import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#2E7D32',
  secondary: '#4B2A99',
  background: '#F9FAFB',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9CA3AF',
  lightGray: '#F3F4F6',
  error: '#EF4444',
  success: '#10B981',
};

export const CommonStyle = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
