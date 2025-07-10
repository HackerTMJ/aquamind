import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  TextInput, 
  Button, 
  Text, 
  ActivityIndicator,
  useTheme 
} from 'react-native-paper';
import { Link, router } from 'expo-router';
import { useAuth } from '@/lib/contexts/AuthContext';
import { validateEmail, validatePassword } from '@/lib/utils/validation';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { signUp } = useAuth();
  const theme = useTheme();

  const handleRegister = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.errors[0] || 'Invalid email');
      return;
    }

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors[0] || 'Invalid password');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
      };

      const { error } = await signUp(email, password, userData);
      
      if (error) {
        Alert.alert('Registration Failed', error.message);
      } else {
        Alert.alert(
          'Registration Successful',
          'Please check your email to verify your account.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
          Join AquaMind
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Create your account to get started
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.nameContainer}>
            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              style={[styles.input, styles.nameInput]}
            />
            <TextInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              style={[styles.input, styles.nameInput]}
            />
          </View>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={!!emailError}
            style={styles.input}
          />
          {emailError ? (
            <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
              {emailError}
            </Text>
          ) : null}

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password-new"
            error={!!passwordError}
            style={styles.input}
          />
          {passwordError ? (
            <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
              {passwordError}
            </Text>
          ) : null}

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoComplete="password-new"
            error={!!confirmPasswordError}
            style={styles.input}
          />
          {confirmPasswordError ? (
            <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
              {confirmPasswordError}
            </Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            disabled={loading}
            style={styles.registerButton}
          >
            {loading ? <ActivityIndicator color={theme.colors.onPrimary} /> : 'Create Account'}
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.loginContainer}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Already have an account?{' '}
        </Text>
        <Link href="/(auth)/login" asChild>
          <Button mode="text">Sign In</Button>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  card: {
    marginBottom: 24,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    marginTop: -12,
    marginBottom: 8,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
