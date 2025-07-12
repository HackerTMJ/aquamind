import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, FAB, useTheme } from 'react-native-paper';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function TanksScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text variant='headlineSmall' style={[styles.title, { color: theme.colors.onBackground }]}>
          My Tanks
        </Text>

        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <Text
              variant='titleMedium'
              style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
            >
              No tanks yet
            </Text>
            <Text
              variant='bodyMedium'
              style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}
            >
              Add your first tank to get started with AquaMind
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon='plus'
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          // Navigate to add tank screen
          console.log('Add tank');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
