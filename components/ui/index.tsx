import React from 'react';
import { View } from 'react-native';

// Material 3 UI Components for AquaMind
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export { Input } from './Input';
export type { InputProps } from './Input';

// Re-export commonly used react-native-paper components with theming
export {
  Text,
  Title,
  Paragraph,
  Headline,
  Caption,
  Subheading,
  Surface,
  Divider,
  IconButton,
  FAB,
  Chip,
  Badge,
  Avatar,
  List,
  Switch,
  Checkbox,
  RadioButton,
  ProgressBar,
  ActivityIndicator,
  Snackbar,
  Dialog,
  Portal,
  Modal,
  Menu,
  Searchbar,
  Appbar,
  BottomNavigation,
  DataTable,
} from 'react-native-paper';

// Health status indicator component
interface HealthIndicatorProps {
  status: 'excellent' | 'good' | 'warning' | 'critical' | 'unknown';
  size?: number;
}

export const HealthIndicator: React.FC<HealthIndicatorProps> = ({ status, size = 12 }) => {
  const colors = {
    excellent: '#4CAF50',
    good: '#8BC34A',
    warning: '#FF9800',
    critical: '#F44336',
    unknown: '#9E9E9E',
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors[status],
      }}
    />
  );
};

// Parameter status indicator
interface ParameterIndicatorProps {
  status: 'optimal' | 'acceptable' | 'caution' | 'danger' | 'unknown';
  size?: number;
}

export const ParameterIndicator: React.FC<ParameterIndicatorProps> = ({ status, size = 8 }) => {
  const colors = {
    optimal: '#4CAF50',
    acceptable: '#8BC34A',
    caution: '#FF9800',
    danger: '#F44336',
    unknown: '#9E9E9E',
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors[status],
      }}
    />
  );
};
