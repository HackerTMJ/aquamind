import React from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Card, Text, Button, List, Divider, useTheme } from 'react-native-paper';
import { useAuth } from '@/lib/contexts/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const theme = useTheme();

  const handleSignOut = async () => {
    Alert.alert(
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
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
        Profile
      </Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            Account Information
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Email: {user?.email}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <List.Section>
            <List.Item
              title="Settings"
              description="App preferences and notifications"
              left={props => <List.Icon {...props} icon="cog" />}
              onPress={() => console.log('Settings')}
            />
            <Divider />
            <List.Item
              title="Help & Support"
              description="Get help using AquaMind"
              left={props => <List.Icon {...props} icon="help-circle" />}
              onPress={() => console.log('Help')}
            />
            <Divider />
            <List.Item
              title="About"
              description="App version and information"
              left={props => <List.Icon {...props} icon="information" />}
              onPress={() => console.log('About')}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={handleSignOut}
        style={styles.signOutButton}
        textColor={theme.colors.error}
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
