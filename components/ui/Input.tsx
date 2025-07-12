import React from 'react';
import {
  TextInput as PaperTextInput,
  TextInputProps as PaperTextInputProps,
  HelperText,
} from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

export interface InputProps extends PaperTextInputProps {
  helperText?: string;
  error?: boolean;
  variant?: 'outlined' | 'flat';
}

export const Input: React.FC<InputProps> = ({
  helperText,
  error = false,
  variant = 'outlined',
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <PaperTextInput mode={variant} error={error} style={[styles.input, style]} {...props} />
      {helperText && (
        <HelperText type={error ? 'error' : 'info'} visible={true}>
          {helperText}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  input: {
    backgroundColor: 'transparent',
  },
});

export default Input;
