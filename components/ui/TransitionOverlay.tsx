import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Animated, Easing } from 'react-native';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface TransitionOverlayProps {
  visible: boolean;
  onAnimationComplete?: () => void;
  duration?: number;
}

const { width, height } = Dimensions.get('window');

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({
  visible,
  onAnimationComplete,
  duration = 600, // Faster animation - reduced from typical 800-1000ms
}) => {
  const { isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);

      // Start transition animation
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: duration * 0.3, // Fade in faster
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: duration,
          easing: Easing.out(Easing.exp), // More dramatic easing
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Keep overlay visible for a short moment, then fade out
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: duration * 0.4, // Fade out duration
          delay: 200, // Brief pause at full scale
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }).start(() => {
          onAnimationComplete?.();
        });
      });
    }
  }, [visible, scaleAnim, opacityAnim, duration, onAnimationComplete]);

  if (!visible) {
    return null;
  }

  // Calculate scale transform - starts from center and expands to cover entire screen
  const scale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, Math.max(width, height) * 0.01], // Scale to cover screen
  });

  return (
    <View style={styles.container} pointerEvents='none'>
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
            opacity: opacityAnim,
            transform: [{ scale }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: 100, // Initial size - will be scaled up
    height: 100,
    borderRadius: 50, // Creates perfect circle initially
  },
});
