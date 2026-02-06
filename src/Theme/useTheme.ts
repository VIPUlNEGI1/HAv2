import { useThemeStore } from '@/hooks/useThemeStore';
import { ThemeConfig } from './ThemeConfig';

export const useTheme = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = isDarkMode ? ThemeConfig.colors.dark : ThemeConfig.colors.light;
  const shadows = isDarkMode ? ThemeConfig.shadows.dark : ThemeConfig.shadows.light;

  return {
    isDarkMode,
    theme: colors,
    shadows,
    spacing: ThemeConfig.spacing,
    borderRadius: ThemeConfig.borderRadius,
  };
};
