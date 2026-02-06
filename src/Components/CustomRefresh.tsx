import React from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';
import { useTheme } from '@/Theme/useTheme';

interface CustomRefreshProps extends RefreshControlProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export const CustomRefresh: React.FC<CustomRefreshProps> = ({
  onRefresh,
  refreshing,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.primary} // iOS
      colors={[theme.primary]} // Android
      progressBackgroundColor={theme.surface} // Android
      {...props}
    />
  );
};
