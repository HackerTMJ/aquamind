import React from 'react';
import { Card as PaperCard, CardProps as PaperCardProps } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../lib/contexts/ThemeContext';

export interface CardProps extends PaperCardProps {
  variant?: 'elevated' | 'filled' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'medium',
  style,
  contentStyle,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  // Remove elevation from props to avoid conflicts
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { elevation: _elevation, ...safeProps } = props;

  // Get variant styles
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: theme.colors.surfaceVariant,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.outline,
        };
      default: // elevated
        return {
          backgroundColor: theme.colors.surface,
        };
    }
  };

  // Get padding styles
  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'small':
        return { padding: 8 };
      case 'large':
        return { padding: 24 };
      default: // medium
        return { padding: 16 };
    }
  };

  const cardStyle: ViewStyle[] = [styles.card, getVariantStyle(), style].filter(
    Boolean
  ) as ViewStyle[];

  const cardContentStyle: ViewStyle[] = [getPaddingStyle(), contentStyle].filter(
    Boolean
  ) as ViewStyle[];

  return (
    <PaperCard style={cardStyle} contentStyle={cardContentStyle} {...safeProps}>
      {children}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    margin: 4,
  },
});

export default Card;
