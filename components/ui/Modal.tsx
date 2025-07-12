import React from 'react';
import { Modal as PaperModal, Portal } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../lib/contexts/ThemeContext';

export interface ModalProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  dismissable?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onDismiss,
  children,
  dismissable = true,
}) => {
  const { theme } = useTheme();

  return (
    <Portal>
      <PaperModal
        visible={visible}
        onDismiss={onDismiss}
        dismissable={dismissable}
        contentContainerStyle={[styles.container, { backgroundColor: theme.colors.surface }]}
      >
        {children}
      </PaperModal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
});

export default Modal;
