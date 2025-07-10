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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { signIn } = useAuth();
  const theme = useTheme();

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

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

    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        Alert.alert('Login Failed', error.message);
      } else {
        router.replace('/(tabs)');
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
          Welcome to AquaMind
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Sign in to manage your aquarium
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
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
            autoComplete="password"
            error={!!passwordError}
            style={styles.input}
          />
          {passwordError ? (
            <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
              {passwordError}
            </Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={loading}
            style={styles.loginButton}
          >
            {loading ? <ActivityIndicator color={theme.colors.onPrimary} /> : 'Sign In'}
          </Button>

          <View style={styles.linkContainer}>
            <Link href="/(auth)/forgot-password" asChild>
              <Button mode="text">Forgot Password?</Button>
            </Link>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.registerContainer}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Don't have an account?{' '}
        </Text>
        <Link href="/(auth)/register" asChild>
          <Button mode="text">Sign Up</Button>
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
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  linkContainer: {
    alignItems: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
