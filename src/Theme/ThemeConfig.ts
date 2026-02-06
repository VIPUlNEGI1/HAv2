import { moderateScale } from '../Helpers/Responsive';

export const ThemeConfig = {
  colors: {
    light: {
      primary: '#00796B', // Hospital Teal
      secondary: '#1976D2', // Medical Blue
      background: '#F5F7FA', // Very light medical grey/blue
      surface: '#FFFFFF',
      text: '#263238', // Blue Grey 900
      textSecondary: '#546E7A', // Blue Grey 600
      border: '#ECEFF1', // Blue Grey 50
      error: '#D32F2F',
      success: '#388E3C',
      card: '#FFFFFF',
      accent: '#E0F2F1', // Light Teal accent
      gradientPrimary: ['#00796B', '#004D40'],
      gradientSecondary: ['#1976D2', '#0D47A1'],
    },
    dark: {
      primary: '#4DB6AC',
      secondary: '#64B5F6',
      background: '#102027', // Dark medical slate
      surface: '#263238',
      text: '#ECEFF1',
      textSecondary: '#B0BEC5',
      border: '#37474F',
      error: '#EF5350',
      success: '#81C784',
      card: '#263238',
      accent: '#004D40',
      gradientPrimary: ['#4DB6AC', '#00796B'],
      gradientSecondary: ['#64B5F6', '#1976D2'],
    },
  },
  spacing: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(16),
    lg: moderateScale(24),
    xl: moderateScale(32),
  },
  borderRadius: {
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(24),
    full: 999,
  },
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: moderateScale(3),
      elevation: 2,
    },
    dark: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(12),
      elevation: 5,
    },
  }
};
