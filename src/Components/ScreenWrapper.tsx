import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { AppHeader } from './AppHeader';
import AppContainer from './AppContainer';

interface ScreenWrapperProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  cartCount?: number;
  showProfile?: boolean;
  showSearch?: boolean;
  onSearchPress?: () => void;
  headerRight?: React.ReactNode;
  isGradientHeader?: boolean;
  scrollable?: boolean;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  customHeader?: React.ReactNode;
}

export const ScreenWrapper = ({
  children,
  title,
  showBack,
  showCart,
  cartCount,
  showProfile,
  showSearch,
  onSearchPress,
  headerRight,
  isGradientHeader = false,
  scrollable = true,
  containerStyle,
  contentStyle,
  customHeader,
}: ScreenWrapperProps) => {
  const { theme } = useTheme();

  const Content = scrollable ? ScrollView : View;

  return (
    <AppContainer
      style={[styles.container, { backgroundColor: theme.background }, containerStyle]}
      isSafeArea={true}
      removeTopInset={true}
    >
      {customHeader ? (
        customHeader
      ) : (
        <AppHeader
          title={title}
          showBack={showBack}
          showCart={showCart}
          cartCount={cartCount}
          showProfile={showProfile}
          showSearch={showSearch}
          onSearchPress={onSearchPress}
          rightComponent={headerRight}
          isGradient={isGradientHeader}
        />
      )}
      <Content
        style={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
      >
        {children}
      </Content>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
