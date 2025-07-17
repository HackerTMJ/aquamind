import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Card,
  Text,
  useTheme,
  Button,
  IconButton,
  Portal,
  Modal,
  Surface,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useCustomAlert } from '@/components/ui/CustomAlert';
import { tankService, waterParameterService, Tank, WaterParameter } from '@/lib/database';
import WaterParameterForm from '@/components/forms/WaterParameterForm';
import FeedingLogForm from '@/components/forms/FeedingLogForm';

export default function TankDetailScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [tank, setTank] = useState<Tank | null>(null);
  const [waterParameters, setWaterParameters] = useState<WaterParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [parameterModalVisible, setParameterModalVisible] = useState(false);
  const [feedingModalVisible, setFeedingModalVisible] = useState(false);
  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState(false);

  const loadTankDetails = useCallback(async () => {
    try {
      if (id && user?.id) {
        const tankData = await tankService.getTankById(id);
        if (tankData && tankData.userId === user.id) {
          setTank(tankData);
        } else {
          showAlert(
            t('common.error'),
            t('tanks.tankNotFound'),
            [{ text: t('common.confirm'), onPress: () => router.back() }],
            'error'
          );
        }
      }
    } catch (error) {
      console.error('Error loading tank:', error);
      showAlert(
        t('common.error'),
        t('tanks.failedToLoad'),
        [{ text: t('common.confirm') }],
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [id, user?.id, showAlert, router, t]);

  const loadWaterParameters = useCallback(async () => {
    try {
      if (id && user?.id) {
        const parameters = await waterParameterService.getParametersForTank(id);
        setWaterParameters(parameters);
      }
    } catch (error) {
      console.error('Error loading water parameters:', error);
    }
  }, [id, user?.id]);

  useEffect(() => {
    if (id && user?.id) {
      loadTankDetails();
      loadWaterParameters();
    }
  }, [id, user?.id, loadTankDetails, loadWaterParameters]);

  const getParameterStatus = (type: string, value: number) => {
    const ranges: Record<string, { min: number; max: number }> = {
      ph: { min: 6.5, max: 8.5 },
      ammonia: { min: 0, max: 0.25 },
      nitrite: { min: 0, max: 0.25 },
      nitrate: { min: 0, max: 40 },
      temperature: { min: 22, max: 28 },
    };

    const range = ranges[type.toLowerCase()];
    if (!range) return 'neutral';

    if (value < range.min || value > range.max) return 'danger';
    if (value === range.min || value === range.max) return 'warning';
    return 'success';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return theme.colors.primary;
      case 'warning':
        return theme.colors.tertiary;
      case 'danger':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const formatParameterValue = (param: WaterParameter) => {
    return `${param.value}${param.unit}`;
  };

  const handleParameterSubmit = async (success: boolean) => {
    setParameterModalVisible(false);

    if (success) {
      showAlert(
        t('common.success'),
        'Water parameter saved successfully!',
        [{ text: t('common.confirm') }],
        'success'
      );
      loadWaterParameters();
    } else {
      showAlert(
        t('common.error'),
        'Failed to save water parameter',
        [{ text: t('common.confirm') }],
        'error'
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: theme.dark ? '#000000' : theme.colors.background },
        ]}
        edges={['top']}
      >
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text variant='bodyLarge'>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!tank) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: theme.dark ? '#000000' : theme.colors.background },
        ]}
        edges={['top']}
      >
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text variant='bodyLarge'>{t('tanks.tankNotFound')}</Text>
          <Button mode='contained' onPress={() => router.back()} style={{ marginTop: 16 }}>
            {t('tanks.goBack')}
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.dark ? '#000000' : theme.colors.background },
      ]}
      edges={['top']}
    >
      {/* Modern Header with Blur */}
      <View style={styles.headerContainer}>
        <BlurView intensity={80} tint={theme.dark ? 'dark' : 'light'} style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <IconButton
                icon='arrow-left'
                iconColor={theme.colors.onSurface}
                onPress={() => router.back()}
                style={styles.backButton}
              />
              <View style={styles.headerActions}>
                <IconButton
                  icon='chart-line'
                  iconColor={theme.colors.onSurface}
                  onPress={() => router.push(`/tank/parameter-history?id=${tank.id}`)}
                  style={styles.headerActionButton}
                />
                <IconButton
                  icon='pencil'
                  iconColor={theme.colors.onSurface}
                  onPress={() => router.push(`/tank/edit?id=${tank.id}`)}
                  style={styles.headerActionButton}
                />
              </View>
            </View>

            <View style={styles.headerInfo}>
              <Text
                variant='headlineMedium'
                style={[styles.tankName, { color: theme.colors.onSurface }]}
              >
                {tank.name}
              </Text>
              <View style={styles.tankMeta}>
                <Surface
                  style={[styles.metaChip, { backgroundColor: theme.colors.surfaceVariant }]}
                >
                  <Text variant='labelMedium' style={{ color: theme.colors.onSurfaceVariant }}>
                    {tank.displaySize}
                  </Text>
                </Surface>
                <Surface
                  style={[styles.metaChip, { backgroundColor: theme.colors.surfaceVariant }]}
                >
                  <Text variant='labelMedium' style={{ color: theme.colors.onSurfaceVariant }}>
                    {tank.typeDisplayName}
                  </Text>
                </Surface>
                <Surface
                  style={[
                    styles.metaChip,
                    {
                      backgroundColor: tank.isActive
                        ? theme.colors.primaryContainer
                        : theme.colors.errorContainer,
                    },
                  ]}
                >
                  <Text
                    variant='labelMedium'
                    style={{
                      color: tank.isActive
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onErrorContainer,
                    }}
                  >
                    {tank.isActive ? t('tanks.active') : t('tanks.inactive')}
                  </Text>
                </Surface>
              </View>
            </View>
          </View>
        </BlurView>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={styles.cardTitle}>
              {t('tanks.tankInfo')}
            </Text>
            <View style={styles.infoRow}>
              <Text variant='bodyMedium' style={{ color: theme.colors.onSurfaceVariant }}>
                {t('tanks.setupDate')}:
              </Text>
              <Text variant='bodyMedium'>{tank.setupDate.toLocaleDateString()}</Text>
            </View>
            {tank.description && (
              <View style={styles.infoRow}>
                <Text variant='bodyMedium' style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('tanks.description')}:
                </Text>
                <Text variant='bodyMedium' style={{ flex: 1 }}>
                  {tank.description}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant='titleMedium' style={styles.cardTitle}>
                {t('tanks.waterParameters')}
              </Text>
              <Button mode='text' onPress={() => setParameterModalVisible(true)} compact>
                {t('tanks.addTest')}
              </Button>
            </View>

            {waterParameters.length === 0 ? (
              <View style={styles.emptyState}>
                <Text
                  variant='bodyMedium'
                  style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
                >
                  {t('tanks.noParametersRecorded')}
                </Text>
                <Button
                  mode='contained'
                  onPress={() => setParameterModalVisible(true)}
                  style={{ marginTop: 16 }}
                >
                  {t('tanks.addFirstTest')}
                </Button>
              </View>
            ) : (
              <View style={styles.parametersGrid}>
                {waterParameters.map((param, index) => (
                  <View key={index} style={styles.parameterItem}>
                    <View style={styles.parameterHeader}>
                      <Text variant='bodyMedium' style={{ fontWeight: '600' }}>
                        {param.parameterType.toUpperCase()}
                      </Text>
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor: getStatusColor(
                              getParameterStatus(param.parameterType, param.value)
                            ),
                          },
                        ]}
                      />
                    </View>
                    <Text variant='titleMedium' style={{ marginVertical: 4 }}>
                      {formatParameterValue(param)}
                    </Text>
                    <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                      {new Date(param.testedDate).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant='titleMedium' style={styles.cardTitle}>
                {t('fish.fishDetails')}
              </Text>
              <Button
                mode='text'
                onPress={() => router.push(`/fish/add?tankId=${tank.id}`)}
                compact
              >
                {t('fish.addFish')}
              </Button>
            </View>

            <View style={styles.emptyState}>
              <Text
                variant='bodyMedium'
                style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
              >
                {t('fish.noFish')}
              </Text>
              <Button
                mode='contained'
                onPress={() => router.push(`/fish/add?tankId=${tank.id}`)}
                style={{ marginTop: 16 }}
              >
                {t('fish.addFish')}
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={styles.cardTitle}>
              {t('tanks.quickActions')}
            </Text>
            <View style={styles.actionsGrid}>
              <Button
                mode='contained-tonal'
                icon='water'
                onPress={() => setMaintenanceModalVisible(true)}
                style={styles.actionButton}
              >
                {t('tanks.waterChange')}
              </Button>
              <Button
                mode='contained-tonal'
                icon='fish'
                onPress={() => setFeedingModalVisible(true)}
                style={styles.actionButton}
              >
                {t('tanks.feedFish')}
              </Button>
              <Button
                mode='contained-tonal'
                icon='flask'
                onPress={() => setParameterModalVisible(true)}
                style={styles.actionButton}
              >
                {t('tanks.testWater')}
              </Button>
              <Button
                mode='contained-tonal'
                icon='chart-line'
                onPress={() => router.push(`/tank/parameter-history?id=${tank.id}`)}
                style={styles.actionButton}
              >
                {t('waterParameters.viewHistory')}
              </Button>
              <Button
                mode='contained-tonal'
                icon='calendar'
                onPress={() => console.log('Schedule')}
                style={styles.actionButton}
              >
                {t('tanks.schedule')}
              </Button>
              <Button
                mode='contained-tonal'
                icon='pencil'
                onPress={() => router.push(`/tank/edit?id=${tank.id}`)}
                style={styles.actionButton}
              >
                {t('tanks.editTank')}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Modal
          visible={parameterModalVisible}
          onDismiss={() => setParameterModalVisible(false)}
          contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text variant='headlineSmall' style={{ color: theme.colors.onSurface }}>
              {t('waterParameters.addTest')}
            </Text>
            <IconButton icon='close' onPress={() => setParameterModalVisible(false)} />
          </View>

          {tank && user && (
            <WaterParameterForm
              tankId={tank.id}
              userId={user.id}
              onSubmit={handleParameterSubmit}
            />
          )}
        </Modal>

        <Modal
          visible={feedingModalVisible}
          onDismiss={() => setFeedingModalVisible(false)}
          contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text variant='headlineSmall' style={{ color: theme.colors.onSurface }}>
              {t('feeding.logFeeding')}
            </Text>
            <IconButton icon='close' onPress={() => setFeedingModalVisible(false)} />
          </View>

          {tank && user && (
            <FeedingLogForm
              tankId={tank.id}
              userId={user.id}
              onSubmit={() => setFeedingModalVisible(false)}
            />
          )}
        </Modal>

        <Modal
          visible={maintenanceModalVisible}
          onDismiss={() => setMaintenanceModalVisible(false)}
          contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text variant='headlineSmall' style={{ color: theme.colors.onSurface }}>
              Water Change & Maintenance
            </Text>
            <IconButton icon='close' onPress={() => setMaintenanceModalVisible(false)} />
          </View>

          <View style={{ padding: 20 }}>
            <Text variant='bodyMedium' style={{ marginBottom: 16 }}>
              Record your water change and maintenance activities.
            </Text>
            <Button
              mode='contained'
              onPress={() => setMaintenanceModalVisible(false)}
              style={{ marginTop: 16 }}
            >
              Log Maintenance (Coming Soon)
            </Button>
          </View>
        </Modal>
      </Portal>

      <AlertComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  parametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  parameterItem: {
    flex: 1,
    minWidth: 150,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  parameterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: 120,
  },
  modalContent: {
    margin: 20,
    borderRadius: 12,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  // Modern Header Styles
  headerContainer: {
    position: 'relative',
    zIndex: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  headerBlur: {
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    margin: 0,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    margin: 0,
    marginLeft: 8,
  },
  headerInfo: {
    alignItems: 'flex-start',
  },
  tankName: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tankMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
