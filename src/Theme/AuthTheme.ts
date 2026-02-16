/**
 * Professional auth flow palette – healthcare-friendly teal/cyan + neutrals.
 * Use for onboarding, login, role selection, OTP, story, and registration screens.
 */
export const AuthTheme = {
  // Primary brand (teal – trust, health)
  primary: '#0D9488',
  primaryDark: '#0F766E',
  primaryLight: '#14B8A6',

  // Gradients (top → bottom or start → end)
  gradient: ['#0D9488', '#0F766E', '#134E4A'] as const,
  gradientSoft: ['#06B6D4', '#0D9488', '#0F766E'] as const,

  // Cards & surfaces
  cardBg: '#FFFFFF',
  cardBorder: '#E2E8F0',
  inputBg: '#F8FAFC',
  inputBorder: '#E2E8F0',
  inputBorderFocus: '#0D9488',
  inputPlaceholder: '#94A3B8',

  // Text on gradient
  textOnGradient: '#FFFFFF',
  textOnGradientSecondary: 'rgba(255,255,255,0.9)',

  // Text on light (cards)
  textPrimary: '#0F172A',
  textSecondary: '#64748B',

  // Buttons
  buttonPrimaryBg: '#0D9488',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondaryBg: '#FFFFFF',
  buttonSecondaryText: '#0D9488',
  buttonDisabledOpacity: 0.5,

  // Next / Get started on onboarding (stands out on gradient)
  ctaButtonBg: '#FFFFFF',
  ctaButtonText: '#0F766E',
  ctaButtonShadow: 'rgba(13,148,136,0.35)',

  // Dots / progress
  dotActive: '#FFFFFF',
  dotInactive: 'rgba(255,255,255,0.45)',

  // Error
  error: '#DC2626',

  // Icon circles on gradient
  iconCircleBg: 'rgba(255,255,255,0.2)',
};
