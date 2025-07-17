import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, View, FlatList } from 'react-native';
import { Card, Text, FAB, useTheme, Button, Portal, Modal, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useCustomAlert } from '@/components/ui/CustomAlert';
import { tankService, Tank } from '@/lib/database';

export default function TanksScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showAlert, AlertComponent } = useCustomAlert();
  const router = useRouter();

  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newTank, setNewTank] = useState({
    name: '',
    sizeliters: '',
    tankType: 'freshwater',
    description: '',
  });

  const loadTanks = useCallback(async () => {
    try {
      if (user?.id) {
        const userTanks = await tankService.getAllTanks(user.id);
        setTanks(userTanks);
      }
    } catch (error) {
      console.error('Error loading tanks:', error);
      showAlert('Error', 'Failed to load tanks', [{ text: 'OK' }], 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.id, showAlert]);

  // Load tanks on component mount
  useEffect(() => {
    loadTanks();
  }, [loadTanks]);

  const handleAddTank = async () => {
    if (!newTank.name.trim() || !newTank.sizeliters.trim()) {
      showAlert('Error', t('tanks.fillRequired'), [{ text: 'OK' }], 'error');
      return;
    }

    try {
      if (user?.id) {
        await tankService.createTank({
          name: newTank.name.trim(),
          sizeliters: parseFloat(newTank.sizeliters),
          tankType: newTank.tankType,
          description: newTank.description.trim(),
          setupDate: new Date(),
          userId: user.id,
        });

        // Reset form and close modal
        setNewTank({ name: '', sizeliters: '', tankType: 'freshwater', description: '' });
        setAddModalVisible(false);

        // Reload tanks
        loadTanks();

        showAlert('Success', t('tanks.tankAdded'), [{ text: 'OK' }], 'success');
      }
    } catch (error) {
      console.error('Error adding tank:', error);
      showAlert('Error', 'Failed to add tank', [{ text: 'OK' }], 'error');
    }
  };

  const renderTankCard = ({ item: tank }: { item: Tank }) => (
    <Card
      style={styles.tankCard}
      onPress={() =>
        router.push({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pathname: '/tank/[id]' as any,
          params: { id: tank.id },
        })
      }
    >
      <Card.Content>
        <Text variant='titleLarge' style={{ marginBottom: 8 }}>
          {tank.name}
        </Text>
        <Text variant='bodyMedium' style={{ color: theme.colors.onSurfaceVariant }}>
          {tank.displaySize} • {tank.typeDisplayName}
        </Text>
        {tank.description && (
          <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
            {tank.description}
          </Text>
        )}
        <Text variant='bodySmall' style={{ color: theme.colors.primary, marginTop: 8 }}>
          Setup:{' '}
          {tank.setupDate instanceof Date && !isNaN(tank.setupDate.getTime())
            ? tank.setupDate.toLocaleDateString()
            : 'Unknown'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Text
            variant='headlineSmall'
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            {t('tanks.myTanks')}
          </Text>

          {loading ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text variant='bodyMedium' style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('tanks.loadingTanks')}
                </Text>
              </Card.Content>
            </Card>
          ) : tanks.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text
                  variant='titleMedium'
                  style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
                >
                  {t('tanks.noTanks')}
                </Text>
                <Text
                  variant='bodyMedium'
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    textAlign: 'center',
                    marginTop: 8,
                  }}
                >
                  {t('tanks.noTanksDesc')}
                </Text>
              </Card.Content>
            </Card>
          ) : (
            <FlatList
              data={tanks}
              renderItem={renderTankCard}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </ScrollView>

        <FAB
          icon='plus'
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => setAddModalVisible(true)}
        />

        {/* Add Tank Modal */}
        <Portal>
          <Modal
            visible={addModalVisible}
            onDismiss={() => setAddModalVisible(false)}
            contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
          >
            <Text
              variant='titleLarge'
              style={[styles.modalTitle, { color: theme.colors.onSurface }]}
            >
              {t('tanks.addNewTank')}
            </Text>

            <TextInput
              label={t('tanks.tankName')}
              value={newTank.name}
              onChangeText={text => setNewTank({ ...newTank, name: text })}
              style={styles.input}
              mode='outlined'
            />

            <TextInput
              label={t('tanks.tankSize')}
              value={newTank.sizeliters}
              onChangeText={text => setNewTank({ ...newTank, sizeliters: text })}
              style={styles.input}
              mode='outlined'
              keyboardType='numeric'
            />

            <TextInput
              label={t('tanks.descriptionOptional')}
              value={newTank.description}
              onChangeText={text => setNewTank({ ...newTank, description: text })}
              style={styles.input}
              mode='outlined'
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <Button
                mode='text'
                onPress={() => setAddModalVisible(false)}
                style={styles.modalButton}
              >
                {t('common.cancel')}
              </Button>
              <Button mode='contained' onPress={handleAddTank} style={styles.modalButton}>
                {t('tanks.addTank')}
              </Button>
            </View>
          </Modal>
        </Portal>

        {/* Custom Alert */}
        <AlertComponent />
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
  tankCard: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 120, // Adjust for higher navbar position
  },
  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
