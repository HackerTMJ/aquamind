import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function CommunityScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant='headlineSmall' style={styles.title}>
                Community
              </Text>
              <Text variant='bodyMedium' style={{ marginTop: 16 }}>
                Community features coming soon! This will include:
              </Text>
              <Text variant='bodyMedium' style={{ marginTop: 8 }}>
                • Share your tank photos and progress
              </Text>
              <Text variant='bodyMedium'>• Ask questions and get advice</Text>
              <Text variant='bodyMedium'>• Follow other aquarium enthusiasts</Text>
              <Text variant='bodyMedium'>• Discover new species and techniques</Text>
              <Text variant='bodyMedium'>• Local aquarium events and meetups</Text>

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
