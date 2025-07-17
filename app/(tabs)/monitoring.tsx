import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MonitoringScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text variant='headlineSmall' style={[styles.title, { color: theme.colors.onBackground }]}>
          Water Monitoring
        </Text>

        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <Text
              variant='titleMedium'
              style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
            >
              No monitoring data yet
            </Text>
            <Text
              variant='bodyMedium'
              style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}
            >
              Start monitoring your water parameters to keep your fish healthy
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
    paddingBottom: 140, // Adjust for higher navbar position
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
});
