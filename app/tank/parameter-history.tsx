import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { Appbar, Text, useTheme, Card, SegmentedButtons, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { waterParameterService, WaterParameter } from '@/lib/database';
import WaterParameterChart from '@/components/charts/WaterParameterChart';

type TimeRange = 'week' | 'month' | '3months';

export default function ParameterHistory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [parameters, setParameters] = useState<WaterParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [selectedParameter, setSelectedParameter] = useState('ph');

  const parameterTypes = [
    { value: 'ph', label: t('waterParameters.ph') },
    { value: 'ammonia', label: t('waterParameters.ammonia') },
    { value: 'nitrite', label: t('waterParameters.nitrite') },
    { value: 'nitrate', label: t('waterParameters.nitrate') },
    { value: 'temperature', label: t('waterParameters.temperature') },
    { value: 'oxygen', label: t('waterParameters.oxygen') },
    { value: 'hardness', label: t('waterParameters.hardness') },
    { value: 'alkalinity', label: t('waterParameters.alkalinity') },
  ];

  const loadParameters = useCallback(async () => {
    if (!id) return;
    try {
      const tankParameters = await waterParameterService.getParametersForTank(id);
      setParameters(tankParameters);
    } catch (error) {
      console.error('Error loading parameters:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadParameters();
  }, [id, loadParameters]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadParameters();
  };

  const getParameterStats = (paramType: string) => {
    const typeParams = parameters.filter(p => p.parameterType === paramType);

    if (typeParams.length === 0) {
      return {
        count: 0,
        latest: null,
        average: null,
        trend: null,
      };
    }

    const latest = typeParams.sort((a, b) => b.testedDate.getTime() - a.testedDate.getTime())[0];

    const average = typeParams.reduce((sum, p) => sum + p.value, 0) / typeParams.length;

    // Simple trend calculation (last vs first)
    const first = typeParams.sort((a, b) => a.testedDate.getTime() - b.testedDate.getTime())[0];
    const trend =
      latest.value > first.value ? 'up' : latest.value < first.value ? 'down' : 'stable';

    return {
      count: typeParams.length,
      latest,
      average: Math.round(average * 100) / 100,
      trend,
    };
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={t('waterParameters.parameterHistory')} />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('waterParameters.parameterHistory')} />
      </Appbar.Header>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Parameter selector */}
        <Card style={styles.selectorCard}>
          <Card.Content>
            <Text
              variant='titleMedium'
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              {t('waterParameters.selectParameter')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.parameterSelector}
            >
              {parameterTypes.map(param => (
                <View key={param.value} style={styles.parameterButton}>
                  <SegmentedButtons
                    value={selectedParameter}
                    onValueChange={setSelectedParameter}
                    buttons={[param]}
                  />
                </View>
              ))}
            </ScrollView>
          </Card.Content>
        </Card>

        {/* Parameter stats summary */}
        {(() => {
          const stats = getParameterStats(selectedParameter);
          if (stats.count > 0) {
            return (
              <Card style={styles.statsCard}>
                <Card.Content>
                  <Text
                    variant='titleMedium'
                    style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
                  >
                    {t('waterParameters.statistics')}
                  </Text>

                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                        {t('waterParameters.totalTests')}
                      </Text>
                      <Text variant='titleLarge' style={{ color: theme.colors.primary }}>
                        {stats.count}
                      </Text>
                    </View>

                    <View style={styles.statItem}>
                      <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                        {t('waterParameters.latestValue')}
                      </Text>
                      <Text
                        variant='titleLarge'
                        style={{ color: stats.latest?.statusColor || theme.colors.primary }}
                      >
                        {stats.latest?.value}
                      </Text>
                    </View>

                    <View style={styles.statItem}>
                      <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                        {t('waterParameters.average')}
                      </Text>
                      <Text variant='titleLarge' style={{ color: theme.colors.primary }}>
                        {stats.average}
                      </Text>
                    </View>

                    <View style={styles.statItem}>
                      <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                        {t('waterParameters.trend')}
                      </Text>
                      <Text
                        variant='titleLarge'
                        style={{
                          color:
                            stats.trend === 'up'
                              ? theme.colors.error
                              : stats.trend === 'down'
                                ? theme.colors.primary
                                : theme.colors.onSurfaceVariant,
                        }}
                      >
                        {stats.trend === 'up' ? '↗' : stats.trend === 'down' ? '↘' : '→'}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          }
          return null;
        })()}

        {/* Chart */}
        <WaterParameterChart
          parameters={parameters}
          parameterType={selectedParameter}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />

        {/* All parameter overview */}
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Text
              variant='titleMedium'
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              {t('waterParameters.allParameters')}
            </Text>

            {parameterTypes.map((param, index) => {
              const stats = getParameterStats(param.value);
              return (
                <View key={param.value}>
                  <View style={styles.parameterRow}>
                    <View style={styles.parameterInfo}>
                      <Text variant='bodyLarge' style={{ color: theme.colors.onSurface }}>
                        {param.label}
                      </Text>
                      <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                        {stats.count} {t('waterParameters.tests')}
                      </Text>
                    </View>

                    {stats.latest && (
                      <View style={styles.parameterValue}>
                        <Text variant='titleMedium' style={{ color: stats.latest.statusColor }}>
                          {stats.latest.value}
                        </Text>
                        <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                          {new Date(stats.latest.testedDate).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>

                  {index < parameterTypes.length - 1 && <Divider style={styles.divider} />}
                </View>
              );
            })}
          </Card.Content>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  parameterSelector: {
    flexDirection: 'row',
  },
  parameterButton: {
    marginRight: 8,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewCard: {
    marginBottom: 16,
  },
  parameterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  parameterInfo: {
    flex: 1,
  },
  parameterValue: {
    alignItems: 'flex-end',
  },
  divider: {
    marginVertical: 4,
  },
  bottomPadding: {
    height: 32,
  },
});
