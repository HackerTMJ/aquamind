import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function FishDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant='headlineSmall' style={styles.title}>
                Fish Details
              </Text>
              <Text variant='bodyMedium' style={{ color: theme.colors.onSurfaceVariant }}>
                Fish ID: {id}
              </Text>
              <Text variant='bodyMedium' style={{ marginTop: 16 }}>
                Fish detail page coming soon! This will show:
              </Text>
              <Text variant='bodyMedium' style={{ marginTop: 8 }}>
                • Fish species and characteristics
              </Text>
              <Text variant='bodyMedium'>• Health records and observations</Text>
              <Text variant='bodyMedium'>• Feeding schedule and history</Text>
              <Text variant='bodyMedium'>• Photo gallery</Text>

              <Button mode='contained' onPress={() => router.back()} style={{ marginTop: 24 }}>
                Go Back
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
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
    paddingBottom: 140,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
