import { moderateScale } from '../Helpers/Responsive';
import Colors from '../assets/Colors';

export const ThemeConfig = {
  colors: {
    light: {
      // Primary colors from Colors.ts
      primary: Colors.primary, // '#130160'
      secondary: Colors.secondaryText, // '#4A416D'
      ripplePrimary: Colors.ripplePrimary, // '#390C99'
      
      // Background & Surface
      background: Colors.whiteShadeFAFB || '#FAFBFC', // Very light background
      surface: Colors.white, // '#FFFFFF'
      card: Colors.white, // '#FFFFFF'
      
      // Text colors
      text: Colors.black, // '#0D0140'
      textSecondary: Colors.textSecondary || Colors.secondaryText, // '#524B6B' or '#4A416D'
      
      // Border & Dividers
      border: Colors.profileCardBorder || '#13016033', // Light border
      
      // Status colors
      error: Colors.redShadeFF || '#FF4C4C',
      success: Colors.greenshade || '#71F68E',
      warning: Colors.yellow || '#f0cd09',
      
      // Accent colors
      accent: Colors.skincolor || '#FCA34D',
      accentLight: Colors.liteskincolor || '#FFE1D5',
      
      // Gray shades
      gray: Colors.gray || '#A49EB5',
      grayLight: Colors.grayShadeF87 || '#F8F7FC',
      grayShade: Colors.grayShade || '#fdfbfbff',
      
      // Special colors
      profileCardBorder: Colors.profileCardBorder,
      skinShade: Colors.skinShade,
      batchshade: Colors.batchshade,
      iconShade: Colors.iconShade,
      
      // Gradients
      gradientPrimary: [Colors.primary, Colors.ripplePrimary],
      gradientSecondary: [Colors.secondaryText, Colors.primary],
      
      // Transparent & Backdrop
      transparent: Colors.transparent,
      backdrop: Colors.backdrop,
    },
    dark: {
      // Primary colors (slightly lighter for dark mode)
      primary: '#4DB6AC',
      secondary: '#64B5F6',
      ripplePrimary: '#5A3DB3',
      
      // Background & Surface
      background: '#102027', // Dark medical slate
      surface: '#263238',
      card: '#263238',
      
      // Text colors
      text: '#ECEFF1',
      textSecondary: '#B0BEC5',
      
      // Border & Dividers
      border: '#37474F',
      
      // Status colors
      error: '#EF5350',
      success: '#81C784',
      warning: Colors.yellow || '#f0cd09',
      
      // Accent colors
      accent: Colors.darkeskincolor || '#FF9228',
      accentLight: Colors.lightSkincolorI || '#FFD6AD',
      
      // Gray shades
      gray: Colors.gray || '#A49EB5',
      grayLight: '#37474F',
      grayShade: '#263238',
      
      // Special colors
      profileCardBorder: 'rgba(255,255,255,0.1)',
      skinShade: 'rgba(255,146,40,0.1)',
      batchshade: Colors.batchshade,
      iconShade: Colors.iconShade,
      
      // Gradients
      gradientPrimary: ['#4DB6AC', '#00796B'],
      gradientSecondary: ['#64B5F6', '#1976D2'],
      
      // Transparent & Backdrop
      transparent: Colors.transparent,
      backdrop: Colors.backdrop,
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
