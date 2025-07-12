import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, TextInput, Button, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/contexts/AuthContext';
import { validateEmail } from '@/lib/utils/validation';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const { resetPassword } = useAuth();
  const theme = useTheme();

  const handleResetPassword = async () => {
    // Reset errors
    setEmailError('');

    // Validate email
    const emailValidation = validateEmail(email);

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.errors[0] || 'Invalid email');
      return;
    }

    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        Alert.alert('Reset Failed', error.message);
      } else {
        setEmailSent(true);
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text variant='headlineMedium' style={[styles.title, { color: theme.colors.primary }]}>
            Check Your Email
          </Text>
          <Text
            variant='bodyLarge'
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            We&apos;ve sent a password reset link to {email}
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant='bodyMedium' style={{ textAlign: 'center', marginBottom: 16 }}>
              Please check your email and follow the link to reset your password.
            </Text>

            <Button mode='contained' onPress={() => setEmailSent(false)} style={styles.button}>
              Send Another Email
            </Button>

            <Link href='/(auth)/login' asChild>
              <Button mode='text' style={styles.button}>
                Back to Sign In
              </Button>
            </Link>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Text variant='headlineMedium' style={[styles.title, { color: theme.colors.primary }]}>
          Reset Password
        </Text>
        <Text
          variant='bodyLarge'
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Enter your email to receive a reset link
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label='Email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            autoComplete='email'
            error={!!emailError}
            style={styles.input}
          />
          {emailError ? (
            <Text variant='bodySmall' style={[styles.errorText, { color: theme.colors.error }]}>
              {emailError}
            </Text>
          ) : null}

          <Button
            mode='contained'
            onPress={handleResetPassword}
            disabled={loading}
            style={styles.button}
          >
            {loading ? <ActivityIndicator color={theme.colors.onPrimary} /> : 'Send Reset Email'}
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.linkContainer}>
        <Text variant='bodyMedium' style={{ color: theme.colors.onSurfaceVariant }}>
          Remember your password?{' '}
        </Text>
        <Link href='/(auth)/login' asChild>
          <Button mode='text'>Sign In</Button>
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
  input: {
    marginBottom: 16,
  },
  errorText: {
    marginTop: -12,
    marginBottom: 8,
  },
  button: {
    marginBottom: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
