import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

export default function MonitoringScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
        Water Monitoring
      </Text>
      
      <Card style={styles.emptyCard}>
        <Card.Content style={styles.emptyContent}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
            No monitoring data yet
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}>
            Start monitoring your water parameters to keep your fish healthy
          </Text>
        </Card.Content>
      </Card>
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
  emptyCard: {
    marginTop: 32,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
});
