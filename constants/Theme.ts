import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// AquaMind Material 3 Color Palette
export const aquamindColors = {
  light: {
    primary: '#006A6B', // Teal primary
    onPrimary: '#FFFFFF',
    primaryContainer: '#9CF0F0',
    onPrimaryContainer: '#002020',
    secondary: '#4A6363',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#CCE8E8',
    onSecondaryContainer: '#051F1F',
    tertiary: '#456179',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#CCE5FF',
    onTertiaryContainer: '#001E31',
    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
    onError: '#FFFFFF',
    onErrorContainer: '#410002',
    background: '#FAFDFC',
    onBackground: '#191C1C',
    surface: '#FAFDFC',
    onSurface: '#191C1C',
    surfaceVariant: '#DAE5E4',
    onSurfaceVariant: '#3F4948',
    outline: '#6F7979',
    outlineVariant: '#BEC9C8',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#2D3131',
    inverseOnSurface: '#EFF1F0',
    inversePrimary: '#70D4D4',
    elevation: {
      level0: 'transparent',
      level1: '#F1F9F9',
      level2: '#ECF7F7',
      level3: '#E6F5F5',
      level4: '#E4F4F4',
      level5: '#E0F2F2',
    },
    surfaceDisabled: 'rgba(25, 28, 28, 0.12)',
    onSurfaceDisabled: 'rgba(25, 28, 28, 0.38)',
    backdrop: 'rgba(63, 73, 72, 0.4)',
  },
  dark: {
    primary: '#70D4D4',
    onPrimary: '#003737',
    primaryContainer: '#004F4F',
    onPrimaryContainer: '#9CF0F0',
    secondary: '#B1CCCC',
    onSecondary: '#1C3535',
    secondaryContainer: '#324B4B',
    onSecondaryContainer: '#CCE8E8',
    tertiary: '#A4C9E1',
    onTertiary: '#0A344A',
    tertiaryContainer: '#254B61',
    onTertiaryContainer: '#CCE5FF',
    error: '#FFB4AB',
    errorContainer: '#93000A',
    onError: '#690005',
    onErrorContainer: '#FFDAD6',
    background: '#0F1415',
    onBackground: '#DEE4E3',
    surface: '#0F1415',
    onSurface: '#DEE4E3',
    surfaceVariant: '#3F4948',
    onSurfaceVariant: '#BEC9C8',
    outline: '#899392',
    outlineVariant: '#3F4948',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#DEE4E3',
    inverseOnSurface: '#2D3131',
    inversePrimary: '#006A6B',
    elevation: {
      level0: 'transparent',
      level1: '#1A2020',
      level2: '#212828',
      level3: '#293030',
      level4: '#2B3232',
      level5: '#2E3636',
    },
    surfaceDisabled: 'rgba(222, 228, 227, 0.12)',
    onSurfaceDisabled: 'rgba(222, 228, 227, 0.38)',
    backdrop: 'rgba(63, 73, 72, 0.4)',
  },
};

// Material 3 Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: aquamindColors.light,
};

// Material 3 Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: aquamindColors.dark,
};

// Theme type for TypeScript
export type ThemeType = typeof lightTheme;

// Status bar colors for each theme
export const statusBarColors = {
  light: aquamindColors.light.surface,
  dark: aquamindColors.dark.surface,
};

// Tank health status colors
export const healthStatusColors = {
  excellent: '#00C851', // Green
  good: '#33B679', // Light green
  warning: '#FF8A00', // Orange
  critical: '#FF4444', // Red
  unknown: '#9E9E9E', // Grey
};

// Water parameter indicator colors
export const parameterColors = {
  optimal: '#00C851',
  acceptable: '#FFBB33',
  poor: '#FF4444',
  unknown: '#9E9E9E',
};
