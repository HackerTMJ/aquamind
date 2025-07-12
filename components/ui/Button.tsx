import React from 'react';
import { Button as PaperButton, ButtonProps as PaperButtonProps } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

export interface ButtonProps extends Omit<PaperButtonProps, 'mode'> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  fullWidth = false,
  style,
  contentStyle,
  labelStyle,
  children,
  ...props
}) => {
  // Map our variants to react-native-paper modes
  const getMode = (): PaperButtonProps['mode'] => {
    switch (variant) {
      case 'filled':
        return 'contained';
      case 'outlined':
        return 'outlined';
      case 'text':
        return 'text';
      case 'elevated':
        return 'elevated';
      case 'tonal':
        return 'contained-tonal';
      default:
        return 'contained';
    }
  };

  // Get button size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          contentStyle: { height: 32, paddingHorizontal: 12 },
          labelStyle: { fontSize: 12, lineHeight: 16 },
        };
      case 'large':
        return {
          contentStyle: { height: 48, paddingHorizontal: 24 },
          labelStyle: { fontSize: 16, lineHeight: 20 },
        };
      default: // medium
        return {
          contentStyle: { height: 40, paddingHorizontal: 16 },
          labelStyle: { fontSize: 14, lineHeight: 18 },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const buttonStyle: ViewStyle[] = [fullWidth && styles.fullWidth, style].filter(
    Boolean
  ) as ViewStyle[];

  return (
    <PaperButton
      mode={getMode()}
      style={buttonStyle}
      contentStyle={[sizeStyles.contentStyle, contentStyle]}
      labelStyle={[sizeStyles.labelStyle, labelStyle]}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
});

export default Button;
