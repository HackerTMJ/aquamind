import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, FAB, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FishScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Text
            variant='headlineSmall'
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            My Fish
          </Text>

          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text
                variant='titleMedium'
                style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
              >
                No fish recorded yet
              </Text>
              <Text
                variant='bodyMedium'
                style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}
              >
                Add fish to track their health and care
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>

        <FAB
          icon='plus'
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            // Navigate to add fish screen
            console.log('Add fish');
          }}
        />
      </View>
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
  scrollView: {
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 120, // Adjust for higher navbar position
  },
});
