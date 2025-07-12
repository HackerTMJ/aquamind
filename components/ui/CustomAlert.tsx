import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import { Animated, Easing } from 'react-native';
import { Button, Text, Surface, IconButton } from 'react-native-paper';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'destructive' | 'cancel';
  }>;
  type?: 'info' | 'success' | 'warning' | 'error';
  onDismiss?: () => void;
}

const { width } = Dimensions.get('window');

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  type = 'info',
  onDismiss,
}) => {
  const { theme, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);

      // Start entrance animation
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Start exit animation
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  const getIconForType = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'alert';
      case 'error':
        return 'alert-circle';
      default:
        return 'information';
    }
  };

  const getColorForType = () => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const handleButtonPress = (button: (typeof buttons)[0]) => {
    button.onPress?.();
    onDismiss?.();
  };

  const handleBackdropPress = () => {
    onDismiss?.();
  };

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType='none'>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.container,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Surface
                style={[
                  styles.alertContainer,
                  {
                    backgroundColor: theme.colors.surface,
                    shadowColor: isDark ? '#FFFFFF' : '#000000',
                  },
                ]}
                elevation={5}
              >
                {/* Header with icon */}
                <View style={styles.headerContainer}>
                  <View
                    style={[styles.iconContainer, { backgroundColor: getColorForType() + '20' }]}
                  >
                    <IconButton icon={getIconForType()} size={32} iconColor={getColorForType()} />
                  </View>
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                  <Text
                    variant='headlineSmall'
                    style={[styles.title, { color: theme.colors.onSurface, textAlign: 'center' }]}
                  >
                    {title}
                  </Text>
                  <Text
                    variant='bodyMedium'
                    style={[
                      styles.message,
                      { color: theme.colors.onSurfaceVariant, textAlign: 'center' },
                    ]}
                  >
                    {message}
                  </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  {buttons.map((button, index) => (
                    <Button
                      key={index}
                      mode={button.style === 'cancel' ? 'outlined' : 'contained'}
                      onPress={() => handleButtonPress(button)}
                      style={[
                        styles.button,
                        buttons.length === 1 && styles.singleButton,
                        button.style === 'destructive' && {
                          backgroundColor: theme.colors.error,
                        },
                      ]}
                      buttonColor={
                        button.style === 'destructive'
                          ? theme.colors.error
                          : button.style === 'cancel'
                            ? 'transparent'
                            : theme.colors.primary
                      }
                      textColor={
                        button.style === 'cancel' ? theme.colors.primary : theme.colors.onPrimary
                      }
                    >
                      {button.text}
                    </Button>
                  ))}
                </View>
              </Surface>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Hook for easier usage
export const useCustomAlert = () => {
  const [alertState, setAlertState] = React.useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons?: CustomAlertProps['buttons'];
    type?: CustomAlertProps['type'];
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = (
    title: string,
    message: string,
    buttons?: CustomAlertProps['buttons'],
    type?: CustomAlertProps['type']
  ) => {
    setAlertState({
      visible: true,
      title,
      message,
      buttons,
      type,
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, visible: false }));
  };

  const AlertComponent = () => (
    <CustomAlert
      visible={alertState.visible}
      title={alertState.title}
      message={alertState.message}
      buttons={alertState.buttons}
      type={alertState.type}
      onDismiss={hideAlert}
    />
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    maxWidth: 400,
  },
  alertContainer: {
    borderRadius: 24,
    padding: 0,
    overflow: 'hidden',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
  },
  singleButton: {
    marginHorizontal: 48,
  },
});
