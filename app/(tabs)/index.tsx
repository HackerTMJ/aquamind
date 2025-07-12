import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const theme = useTheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text
            variant='headlineMedium'
            style={[styles.greeting, { color: theme.colors.onBackground }]}
          >
            {getGreeting()}!
          </Text>
          <Text variant='bodyLarge' style={{ color: theme.colors.onSurfaceVariant }}>
            Welcome to AquaMind
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={{ marginBottom: 8 }}>
              Getting Started
            </Text>
            <Text
              variant='bodyMedium'
              style={{ marginBottom: 16, color: theme.colors.onSurfaceVariant }}
            >
              Start your aquarium journey by adding your first tank and fish.
            </Text>
            <Button mode='contained' onPress={() => console.log('Add tank')}>
              Add Your First Tank
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={{ marginBottom: 8 }}>
              Quick Stats
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant='headlineSmall' style={{ color: theme.colors.primary }}>
                  0
                </Text>
                <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                  Tanks
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant='headlineSmall' style={{ color: theme.colors.secondary }}>
                  0
                </Text>
                <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                  Fish
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant='headlineSmall' style={{ color: theme.colors.tertiary }}>
                  0
                </Text>
                <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                  Tests
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={{ marginBottom: 8 }}>
              Recent Activity
            </Text>
            <Text variant='bodyMedium' style={{ color: theme.colors.onSurfaceVariant }}>
              No recent activity yet. Start by adding some tanks and fish!
            </Text>
          </Card.Content>
        </Card>
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
  headerContainer: {
    marginBottom: 24,
  },
  greeting: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  card: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
});
