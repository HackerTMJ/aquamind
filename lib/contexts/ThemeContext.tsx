import React, { createContext, useContext, useEffect, useState } from 'react';
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, HealthColors, ParameterColors, CategoryColors } from '../../constants/Colors';

type ThemeMode = 'light' | 'dark' | 'system';

// Create comprehensive Material 3 themes
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
    error: Colors.light.error,
    onError: Colors.light.onError,
    errorContainer: Colors.light.errorContainer,
    onErrorContainer: Colors.light.onErrorContainer,
    background: Colors.light.background,
    onBackground: Colors.light.onBackground,
    surface: Colors.light.surface,
    onSurface: Colors.light.onSurface,
    surfaceVariant: Colors.light.surfaceVariant,
    onSurfaceVariant: Colors.light.onSurfaceVariant,
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
    error: Colors.dark.error,
    onError: Colors.dark.onError,
    errorContainer: Colors.dark.errorContainer,
    onErrorContainer: Colors.dark.onErrorContainer,
    background: Colors.dark.background,
    onBackground: Colors.dark.onBackground,
    surface: Colors.dark.surface,
    onSurface: Colors.dark.onSurface,
    surfaceVariant: Colors.dark.surfaceVariant,
    onSurfaceVariant: Colors.dark.onSurfaceVariant,
  },
};

export type AppTheme = typeof customLightTheme;

interface ThemeContextType {
  theme: AppTheme;
  themeMode: ThemeMode;
  isDark: boolean;
  colors: typeof Colors.light | typeof Colors.dark;
  healthColors: typeof HealthColors;
  parameterColors: typeof ParameterColors;
  categoryColors: typeof CategoryColors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

const THEME_STORAGE_KEY = 'aquamind_theme_mode';

export function AppThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine the actual theme based on mode and system preference
  const isDark = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

  const theme = isDark ? customDarkTheme : customLightTheme;
  const colors = isDark ? Colors.dark : Colors.light;

  // Load theme preference from storage
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          setThemeModeState(stored as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme mode:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadThemeMode();
  }, []);

  // Save theme preference to storage
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  };

  // Toggle between light and dark modes
  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const value: ThemeContextType = {
    theme,
    themeMode,
    isDark,
    colors,
    healthColors: HealthColors,
    parameterColors: ParameterColors,
    categoryColors: CategoryColors,
    setThemeMode,
    toggleTheme,
  };

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within an AppThemeProvider');
  }
  return context;
};

// Hook to get theme colors easily
export const useThemeColors = () => {
  const { colors } = useTheme();
  return colors;
};

// Hook to get app-specific colors
export const useAppColors = () => {
  const { healthColors, parameterColors, categoryColors } = useTheme();
  return { healthColors, parameterColors, categoryColors };
};
