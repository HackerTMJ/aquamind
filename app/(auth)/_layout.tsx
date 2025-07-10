import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function AuthLayout() {
  const { session, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return null; // You can replace this with a loading component
  }

  // If user is already authenticated, redirect to main app
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
