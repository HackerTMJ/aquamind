import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Appbar, Text, useTheme, Card, Button, TextInput } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tankService, Tank } from '@/lib/database';
import { CustomAlert } from '@/components/ui/CustomAlert';

export default function EditTank() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [tank, setTank] = useState<Tank | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [tankType, setTankType] = useState('');
  const [sizeliters, setSizeliters] = useState('');
  const [description, setDescription] = useState('');

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    loadTank();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTank = async () => {
    if (!id) return;
    try {
      const tankData = await tankService.getTankById(id);
      if (tankData) {
        setTank(tankData);
        setName(tankData.name);
        setTankType(tankData.tankType);
        setSizeliters(tankData.sizeliters.toString());
        setDescription(tankData.description || '');
      }
    } catch (error) {
      console.error('Error loading tank:', error);
      showAlert('error', t('common.error'), t('tanks.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const validateForm = () => {
    if (!name.trim()) {
      showAlert('error', t('common.error'), t('tanks.nameRequired'));
      return false;
    }
    if (!tankType.trim()) {
      showAlert('error', t('common.error'), t('tanks.typeRequired'));
      return false;
    }
    if (!sizeliters.trim() || isNaN(Number(sizeliters)) || Number(sizeliters) <= 0) {
      showAlert('error', t('common.error'), t('tanks.volumeRequired'));
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !tank) return;

    setSaving(true);
    try {
      const updates: Partial<Tank> = {
        name: name.trim(),
        tankType: tankType.trim(),
        sizeliters: Number(sizeliters),
        description: description.trim() || undefined,
        updatedAt: new Date(),
      };

      await tankService.updateTank(tank, updates);
      showAlert('success', t('common.success'), t('tanks.updateSuccess'));

      // Navigate back after a short delay
      router.back();
    } catch (error) {
      console.error('Error updating tank:', error);
      showAlert('error', t('common.error'), t('tanks.updateError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(t('tanks.deleteTank'), t('tanks.deleteConfirmation'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: confirmDelete,
      },
    ]);
  };

  const confirmDelete = async () => {
    if (!tank) return;

    setDeleting(true);
    try {
      await tankService.deleteTank(tank);
      showAlert('success', t('common.success'), t('tanks.deleteSuccess'));

      // Navigate to tanks list after a short delay
      router.replace('/(tabs)/tanks');
    } catch (error) {
      console.error('Error deleting tank:', error);
      showAlert('error', t('common.error'), t('tanks.deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={t('tanks.editTank')} />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (!tank) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={t('tanks.editTank')} />
        </Appbar.Header>
        <View style={styles.errorContainer}>
          <Text variant='titleMedium' style={{ color: theme.colors.error }}>
            {t('tanks.tankNotFound')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('tanks.editTank')} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.formCard}>
          <Card.Content>
            <Text
              variant='titleMedium'
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              {t('tanks.tankDetails')}
            </Text>

            <TextInput
              label={t('tanks.name')}
              value={name}
              onChangeText={setName}
              mode='outlined'
              style={styles.input}
            />

            <TextInput
              label={t('tanks.type')}
              value={tankType}
              onChangeText={setTankType}
              mode='outlined'
              style={styles.input}
              placeholder={t('tanks.typePlaceholder')}
            />

            <TextInput
              label={t('tanks.volume')}
              value={sizeliters}
              onChangeText={setSizeliters}
              mode='outlined'
              style={styles.input}
              keyboardType='numeric'
              right={<TextInput.Affix text='L' />}
            />

            <TextInput
              label={t('tanks.description')}
              value={description}
              onChangeText={setDescription}
              mode='outlined'
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder={t('tanks.descriptionPlaceholder')}
            />
          </Card.Content>
        </Card>

        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text
              variant='titleMedium'
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              {t('common.actions')}
            </Text>

            <Button
              mode='contained'
              onPress={handleSave}
              loading={saving}
              disabled={saving || deleting}
              style={styles.saveButton}
            >
              {t('common.save')}
            </Button>

            <Button
              mode='outlined'
              onPress={handleDelete}
              loading={deleting}
              disabled={saving || deleting}
              style={[styles.deleteButton, { borderColor: theme.colors.error }]}
              textColor={theme.colors.error}
            >
              {t('tanks.deleteTank')}
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onDismiss={() => setAlertVisible(false)}
      />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formCard: {
    marginBottom: 16,
  },
  actionsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginBottom: 12,
  },
  deleteButton: {
    marginBottom: 8,
  },
  bottomPadding: {
    height: 32,
  },
});
