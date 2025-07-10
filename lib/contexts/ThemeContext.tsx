import React from 'react';
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

// Create custom Material 3 themes
const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.primary,
    onPrimary: Colors.light.onPrimary,
    primaryContainer: Colors.light.primaryContainer,
    onPrimaryContainer: Colors.light.onPrimaryContainer,
    secondary: Colors.light.secondary,
    onSecondary: Colors.light.onSecondary,
    secondaryContainer: Colors.light.secondaryContainer,
    onSecondaryContainer: Colors.light.onSecondaryContainer,
    tertiary: Colors.light.tertiary,
    onTertiary: Colors.light.onTertiary,
    tertiaryContainer: Colors.light.tertiaryContainer,
    onTertiaryContainer: Colors.light.onTertiaryContainer,
    background: Colors.light.background,
    onBackground: Colors.light.onBackground,
    surface: Colors.light.surface,
    onSurface: Colors.light.onSurface,
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.primary,
    onPrimary: Colors.dark.onPrimary,
    primaryContainer: Colors.dark.primaryContainer,
    onPrimaryContainer: Colors.dark.onPrimaryContainer,
    secondary: Colors.dark.secondary,
    onSecondary: Colors.dark.onSecondary,
    secondaryContainer: Colors.dark.secondaryContainer,
    onSecondaryContainer: Colors.dark.onSecondaryContainer,
    tertiary: Colors.dark.tertiary,
    onTertiary: Colors.dark.onTertiary,
    tertiaryContainer: Colors.dark.tertiaryContainer,
    onTertiaryContainer: Colors.dark.onTertiaryContainer,
    background: Colors.dark.background,
    onBackground: Colors.dark.onBackground,
    surface: Colors.dark.surface,
    onSurface: Colors.dark.onSurface,
  },
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function AppThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? customDarkTheme : customLightTheme;

  return (
    <PaperProvider theme={theme}>
      {children}
    </PaperProvider>
  );
}
