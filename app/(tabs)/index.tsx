import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Button, useTheme, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greeting.morning');
    if (hour < 18) return t('home.greeting.afternoon');
    return t('home.greeting.evening');
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Greeting */}
        <View style={styles.headerContainer}>
          <Text
            variant='headlineLarge'
            style={[styles.greeting, { color: theme.colors.onBackground }]}
          >
            {getGreeting()}
          </Text>
          <Text variant='bodyLarge' style={{ color: theme.colors.onSurfaceVariant, opacity: 0.8 }}>
            {getCurrentDate()}
          </Text>
        </View>

        {/* Large Feature Widget - Recent Activity */}
        <Card style={[styles.largeWidget, { backgroundColor: theme.colors.primaryContainer }]}>
          <LinearGradient
            colors={[theme.colors.primary + '20', theme.colors.primaryContainer]}
            style={styles.gradientCard}
          >
            <Card.Content style={styles.largeWidgetContent}>
              <View style={styles.widgetHeader}>
                <Text
                  variant='titleLarge'
                  style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}
                >
                  {t('home.welcome')}
                </Text>
                <Avatar.Icon
                  size={40}
                  icon='water'
                  style={{ backgroundColor: theme.colors.primary }}
                />
              </View>
              <Text
                variant='bodyLarge'
                style={{
                  color: theme.colors.onPrimaryContainer,
                  marginVertical: 8,
                  opacity: 0.8,
                }}
              >
                {t('home.gettingStartedDesc')}
              </Text>
              <Button
                mode='contained'
                onPress={() => console.log('Add tank')}
                style={{
                  marginTop: 8,
                  backgroundColor: theme.colors.primary,
                }}
                contentStyle={{ paddingVertical: 4 }}
              >
                {t('home.addFirstTank')}
              </Button>
            </Card.Content>
          </LinearGradient>
        </Card>

        {/* Two Column Layout */}
        <View style={styles.twoColumnContainer}>
          {/* Quick Stats Widget */}
          <Card style={[styles.mediumWidget, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Content style={styles.compactContent}>
              <View style={styles.iconRow}>
                <Avatar.Icon
                  size={32}
                  icon='chart-line'
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <Text
                  variant='titleMedium'
                  style={{ color: theme.colors.onSurfaceVariant, fontWeight: 'bold' }}
                >
                  Stats
                </Text>
              </View>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text
                    variant='headlineSmall'
                    style={{ color: theme.colors.primary, fontWeight: 'bold' }}
                  >
                    0
                  </Text>
                  <Text variant='labelSmall' style={{ color: theme.colors.onSurfaceVariant }}>
                    {t('home.tanks')}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text
                    variant='headlineSmall'
                    style={{ color: theme.colors.secondary, fontWeight: 'bold' }}
                  >
                    0
                  </Text>
                  <Text variant='labelSmall' style={{ color: theme.colors.onSurfaceVariant }}>
                    {t('navigation.fish')}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Water Quality Widget */}
          <Card style={[styles.mediumWidget, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Card.Content style={styles.compactContent}>
              <View style={styles.iconRow}>
                <Avatar.Icon
                  size={32}
                  icon='water-check'
                  style={{ backgroundColor: theme.colors.tertiary }}
                />
                <Text
                  variant='titleMedium'
                  style={{ color: theme.colors.onTertiaryContainer, fontWeight: 'bold' }}
                >
                  Water
                </Text>
              </View>
              <Text
                variant='bodySmall'
                style={{ color: theme.colors.onTertiaryContainer, opacity: 0.8, marginTop: 8 }}
              >
                No tests yet
              </Text>
              <Text
                variant='labelSmall'
                style={{ color: theme.colors.onTertiaryContainer, opacity: 0.6, marginTop: 4 }}
              >
                Add your first tank to start monitoring
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Activity Chart Widget */}
        <Card style={[styles.chartWidget, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <View>
                <Text
                  variant='titleMedium'
                  style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}
                >
                  Activity
                </Text>
                <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                  Last 7 days
                </Text>
              </View>
              <Avatar.Icon
                size={36}
                icon='chart-bar'
                style={{ backgroundColor: theme.colors.primaryContainer }}
              />
            </View>

            {/* Mock Chart Bars */}
            <View style={styles.chartContainer}>
              {[0.2, 0.6, 0.3, 0.8, 0.4, 0.7, 0.5].map((height, index) => (
                <View key={index} style={styles.chartColumn}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: `${height * 100}%`,
                        backgroundColor: theme.colors.primary + '60',
                      },
                    ]}
                  />
                  <Text
                    variant='labelSmall'
                    style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                  >
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Bottom Grid - Small Widgets */}
        <View style={styles.bottomGrid}>
          <Card style={[styles.smallWidget, { backgroundColor: theme.colors.errorContainer }]}>
            <Card.Content style={styles.smallContent}>
              <Avatar.Icon
                size={28}
                icon='alert-circle'
                style={{ backgroundColor: theme.colors.error, marginBottom: 8 }}
              />
              <Text
                variant='labelMedium'
                style={{ color: theme.colors.onErrorContainer, fontWeight: 'bold' }}
              >
                Alerts
              </Text>
              <Text
                variant='labelSmall'
                style={{ color: theme.colors.onErrorContainer, opacity: 0.8 }}
              >
                0 active
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.smallWidget, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Card.Content style={styles.smallContent}>
              <Avatar.Icon
                size={28}
                icon='calendar-clock'
                style={{ backgroundColor: theme.colors.secondary, marginBottom: 8 }}
              />
              <Text
                variant='labelMedium'
                style={{ color: theme.colors.onSecondaryContainer, fontWeight: 'bold' }}
              >
                Tasks
              </Text>
              <Text
                variant='labelSmall'
                style={{ color: theme.colors.onSecondaryContainer, opacity: 0.8 }}
              >
                0 pending
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.smallWidget, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Content style={styles.smallContent}>
              <Avatar.Icon
                size={28}
                icon='fish'
                style={{ backgroundColor: theme.colors.tertiary, marginBottom: 8 }}
              />
              <Text
                variant='labelMedium'
                style={{ color: theme.colors.onSurfaceVariant, fontWeight: 'bold' }}
              >
                Health
              </Text>
              <Text
                variant='labelSmall'
                style={{ color: theme.colors.onSurfaceVariant, opacity: 0.8 }}
              >
                All good
              </Text>
            </Card.Content>
          </Card>
        </View>
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
  headerContainer: {
    marginBottom: 24,
  },
  greeting: {
    fontWeight: 'bold',
    marginBottom: 4,
  },

  // Widget Styles
  largeWidget: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gradientCard: {
    borderRadius: 20,
  },
  largeWidgetContent: {
    padding: 20,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  // Two Column Layout
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  mediumWidget: {
    flex: 1,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  compactContent: {
    padding: 16,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },

  // Chart Widget
  chartWidget: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    paddingHorizontal: 8,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '60%',
    borderRadius: 4,
    minHeight: 8,
  },

  // Bottom Grid
  bottomGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  smallWidget: {
    flex: 1,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  smallContent: {
    padding: 12,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
});
