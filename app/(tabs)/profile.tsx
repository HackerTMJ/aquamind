import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Button, List, Divider, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/contexts/AuthContext';
import { router } from 'expo-router';
import { useCustomAlert } from '@/components/ui/CustomAlert';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const theme = useTheme();
  const { showAlert, AlertComponent } = useCustomAlert();

  const handleSignOut = async () => {
    showAlert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ],
      'warning'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text variant='headlineSmall' style={[styles.title, { color: theme.colors.onBackground }]}>
          Profile
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={{ marginBottom: 8 }}>
              Account Information
            </Text>
            <Text variant='bodyMedium' style={{ color: theme.colors.onSurfaceVariant }}>
              Email: {user?.email}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Item
                title='Settings'
                description='App preferences and notifications'
                left={props => <List.Icon {...props} icon='cog' />}
                onPress={() => console.log('Settings')}
              />
              <Divider />
              <List.Item
                title='Help & Support'
                description='Get help using AquaMind'
                left={props => <List.Icon {...props} icon='help-circle' />}
                onPress={() => console.log('Help')}
              />
              <Divider />
              <List.Item
                title='About'
                description='App version and information'
                left={props => <List.Icon {...props} icon='information' />}
                onPress={() => console.log('About')}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Button
          mode='outlined'
          onPress={handleSignOut}
          style={styles.signOutButton}
          textColor={theme.colors.error}
        >
          Sign Out
        </Button>

        {/* Custom Alert */}
        <AlertComponent />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  signOutButton: {
    marginTop: 16,
  },
});
