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
  Checkbox,
} from 'react-native-paper';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/lib/contexts/AuthContext';
import { validateEmail, validatePassword } from '@/lib/utils/validation';

const { width } = Dimensions.get('window');

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Missing Information', 'Please enter your first and last name');
      return;
    }

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

    if (!agreedToTerms) {
      Alert.alert('Terms & Conditions', 'Please accept the terms and conditions to continue');
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
        Alert.alert('Registration Successful', 'Please check your email to verify your account.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') },
        ]);
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
        colors={[theme.colors.secondaryContainer, theme.colors.surface]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Surface style={[styles.logoContainer, { backgroundColor: theme.colors.secondary }]}>
              <IconButton icon='account-plus' size={32} iconColor={theme.colors.onSecondary} />
            </Surface>
            <Text
              variant='displaySmall'
              style={[styles.title, { color: theme.colors.onBackground }]}
            >
              Join AquaMind
            </Text>
            <Text
              variant='titleMedium'
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              Create your account to start your aquarium journey
            </Text>
          </View>

          {/* Registration Form */}
          <Surface
            style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}
            elevation={2}
          >
            <View style={styles.formContent}>
              {/* Name Fields */}
              <View style={styles.nameContainer}>
                <TextInput
                  label='First Name'
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize='words'
                  mode='outlined'
                  left={<TextInput.Icon icon='account' />}
                  style={[styles.input, styles.nameInput]}
                />
                <TextInput
                  label='Last Name'
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize='words'
                  mode='outlined'
                  style={[styles.input, styles.nameInput]}
                />
              </View>

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
                autoComplete='password-new'
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

              <TextInput
                label='Confirm Password'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoComplete='password-new'
                error={!!confirmPasswordError}
                mode='outlined'
                left={<TextInput.Icon icon='lock-check' />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                style={styles.input}
              />
              {confirmPasswordError ? (
                <Text variant='bodySmall' style={[styles.errorText, { color: theme.colors.error }]}>
                  {confirmPasswordError}
                </Text>
              ) : null}

              {/* Terms & Conditions */}
              <View style={styles.termsContainer}>
                <Checkbox
                  status={agreedToTerms ? 'checked' : 'unchecked'}
                  onPress={() => setAgreedToTerms(!agreedToTerms)}
                />
                <Text
                  variant='bodyMedium'
                  style={[styles.termsText, { color: theme.colors.onSurfaceVariant }]}
                >
                  I agree to the{' '}
                  <Text style={{ color: theme.colors.primary }}>Terms & Conditions</Text> and{' '}
                  <Text style={{ color: theme.colors.primary }}>Privacy Policy</Text>
                </Text>
              </View>

              <Button
                mode='contained'
                onPress={handleRegister}
                disabled={loading}
                style={styles.registerButton}
                contentStyle={styles.registerButtonContent}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.onPrimary} size='small' />
                ) : (
                  'Create Account'
                )}
              </Button>
            </View>
          </Surface>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
            <Text
              variant='bodySmall'
              style={[styles.dividerText, { color: theme.colors.onSurfaceVariant }]}
            >
              Already have an account?
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
          </View>

          {/* Sign In Section */}
          <View style={styles.signInContainer}>
            <Link href='/(auth)/login' asChild>
              <Button
                mode='outlined'
                style={styles.signInButton}
                contentStyle={styles.signInButtonContent}
              >
                Sign In
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    paddingLeft: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  termsText: {
    flex: 1,
    marginLeft: 8,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
  },
  registerButtonContent: {
    paddingVertical: 8,
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
  signInContainer: {
    alignItems: 'center',
  },
  signInButton: {
    borderRadius: 12,
    minWidth: width * 0.7,
  },
  signInButtonContent: {
    paddingVertical: 8,
  },
});
