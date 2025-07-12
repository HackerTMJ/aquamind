import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  useTheme,
  Surface,
  IconButton,
} from 'react-native-paper';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/lib/contexts/AuthContext';
import { validateEmail, validatePassword } from '@/lib/utils/validation';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    } catch {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primaryContainer, theme.colors.surface]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Surface style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
              <IconButton icon='fish' size={32} iconColor={theme.colors.onPrimary} />
            </Surface>
            <Text
              variant='displaySmall'
              style={[styles.title, { color: theme.colors.onBackground }]}
            >
              Welcome Back
            </Text>
            <Text
              variant='titleMedium'
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              Sign in to continue your aquarium journey
            </Text>
          </View>

          {/* Login Form */}
          <Surface
            style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}
            elevation={2}
          >
            <View style={styles.formContent}>
              <TextInput
                label='Email Address'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
                autoComplete='email'
                error={!!emailError}
                mode='outlined'
                left={<TextInput.Icon icon='email' />}
                style={styles.input}
              />
              {emailError ? (
                <Text variant='bodySmall' style={[styles.errorText, { color: theme.colors.error }]}>
                  {emailError}
                </Text>
              ) : null}

              <TextInput
                label='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete='password'
                error={!!passwordError}
                mode='outlined'
                left={<TextInput.Icon icon='lock' />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
              />
              {passwordError ? (
                <Text variant='bodySmall' style={[styles.errorText, { color: theme.colors.error }]}>
                  {passwordError}
                </Text>
              ) : null}

              <Button
                mode='contained'
                onPress={handleLogin}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.onPrimary} size='small' />
                ) : (
                  'Sign In'
                )}
              </Button>

              <View style={styles.forgotPasswordContainer}>
                <Link href='/(auth)/forgot-password' asChild>
                  <Button mode='text' textColor={theme.colors.primary}>
                    Forgot your password?
                  </Button>
                </Link>
              </View>
            </View>
          </Surface>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
            <Text
              variant='bodySmall'
              style={[styles.dividerText, { color: theme.colors.onSurfaceVariant }]}
            >
              New to AquaMind?
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
          </View>

          {/* Sign Up Section */}
          <View style={styles.signUpContainer}>
            <Link href='/(auth)/register' asChild>
              <Button
                mode='outlined'
                style={styles.signUpButton}
                contentStyle={styles.signUpButtonContent}
              >
                Create Account
              </Button>
            </Link>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    borderRadius: 24,
    marginBottom: 32,
    overflow: 'hidden',
  },
  formContent: {
    padding: 24,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    marginTop: -12,
    marginBottom: 8,
    paddingLeft: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  signUpContainer: {
    alignItems: 'center',
  },
  signUpButton: {
    borderRadius: 12,
    minWidth: width * 0.7,
  },
  signUpButtonContent: {
    paddingVertical: 8,
  },
});
