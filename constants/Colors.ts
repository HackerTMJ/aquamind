/**
 * AquaMind Color Scheme - Material Design 3
 * Based on aquarium/ocean theme with accessibility in mind
 */

export const Colors = {
  light: {
    // Primary - Teal/Aqua theme
    primary: '#006A6B',
    onPrimary: '#FFFFFF',
    primaryContainer: '#9CF0F0',
    onPrimaryContainer: '#002020',

    // Secondary - Complementary aqua tones
    secondary: '#4A6363',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#CCE8E8',
    onSecondaryContainer: '#051F1F',

    // Tertiary - Blue accent for water elements
    tertiary: '#456179',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#CCE5FF',
    onTertiaryContainer: '#001E31',

    // Error states
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',

    // Surface and background
    background: '#FAFDFC',
    onBackground: '#191C1C',
    surface: '#FAFDFC',
    onSurface: '#191C1C',
    surfaceVariant: '#DAE5E4',
    onSurfaceVariant: '#3F4948',

    // Legacy support for existing components
    text: '#191C1C',
    tint: '#006A6B',
    tabIconDefault: '#6F7979',
    tabIconSelected: '#006A6B',
  },

  dark: {
    // Primary
    primary: '#70D4D4',
    onPrimary: '#003737',
    primaryContainer: '#004F4F',
    onPrimaryContainer: '#9CF0F0',

    // Secondary
    secondary: '#B1CCCC',
    onSecondary: '#1C3535',
    secondaryContainer: '#324B4B',
    onSecondaryContainer: '#CCE8E8',

    // Tertiary
    tertiary: '#A4C9E1',
    onTertiary: '#0A344A',
    tertiaryContainer: '#254B61',
    onTertiaryContainer: '#CCE5FF',

    // Error states
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',

    // Surface and background
    background: '#0F1415',
    onBackground: '#DEE4E3',
    surface: '#0F1415',
    onSurface: '#DEE4E3',
    surfaceVariant: '#3F4948',
    onSurfaceVariant: '#BEC9C8',

    // Legacy support for existing components
    text: '#DEE4E3',
    tint: '#70D4D4',
    tabIconDefault: '#899392',
    tabIconSelected: '#70D4D4',
  },
};

/**
 * Health status colors for tanks and fish
 */
export const HealthColors = {
  excellent: '#4CAF50', // Green
  good: '#8BC34A', // Light Green
  warning: '#FF9800', // Orange
  critical: '#F44336', // Red
  unknown: '#9E9E9E', // Grey
};

/**
 * Water parameter status colors
 */
export const ParameterColors = {
  optimal: '#4CAF50',
  acceptable: '#8BC34A',
  caution: '#FF9800',
  danger: '#F44336',
  unknown: '#9E9E9E',
};

/**
 * Fish category colors
 */
export const CategoryColors = {
  freshwater: '#2196F3', // Blue
  saltwater: '#00BCD4', // Cyan
  brackish: '#795548', // Brown
  pond: '#4CAF50', // Green
};

// Default export for legacy compatibility
export default Colors;
