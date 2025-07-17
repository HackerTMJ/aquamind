import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, Chip, RadioButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface FeedingLogFormProps {
  tankId: string;
  userId: string;
  onSubmit: (success: boolean) => void;
}

const FOOD_TYPES = [
  { value: 'flakes', label: 'Flakes', icon: '🥣' },
  { value: 'pellets', label: 'Pellets', icon: '🟫' },
  { value: 'frozen', label: 'Frozen', icon: '🧊' },
  { value: 'live', label: 'Live', icon: '🪱' },
  { value: 'vegetables', label: 'Vegetables', icon: '🥬' },
  { value: 'treats', label: 'Treats', icon: '🍪' },
];

const FEEDING_AMOUNTS = [
  { value: 'light', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: 'heavy', label: 'Heavy' },
];

export default function FeedingLogForm({ tankId, userId, onSubmit }: FeedingLogFormProps) {
  const { t } = useTranslation();

  const [selectedFoodType, setSelectedFoodType] = useState('');
  const [amount, setAmount] = useState('normal');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedFoodType) {
      newErrors.foodType = t('feeding.foodTypeRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create feeding log entry
      const feedingLog = {
        id: Date.now().toString(),
        tankId,
        userId,
        foodType: selectedFoodType,
        amount,
        notes: notes.trim() || undefined,
        fedAt: new Date(),
        createdAt: new Date(),
      };

      // In a real app, you'd save this to your database
      console.log('Feeding log:', feedingLog);

      // For now, just simulate success
      // Log feeding to AsyncStorage or send to API
      console.log('Feeding logged:', {
        tankId,
        userId,
        foodType: selectedFoodType,
        amount,
        notes,
        timestamp: new Date().toISOString(),
      });

      onSubmit(true);
    } catch (error) {
      console.error('Error saving feeding log:', error);
      onSubmit(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text variant='titleMedium' style={styles.sectionTitle}>
          {t('feeding.selectFoodType')}
        </Text>

        <View style={styles.chipContainer}>
          {FOOD_TYPES.map(food => (
            <Chip
              key={food.value}
              mode={selectedFoodType === food.value ? 'flat' : 'outlined'}
              selected={selectedFoodType === food.value}
              onPress={() => setSelectedFoodType(food.value)}
              style={styles.chip}
              icon={() => <Text>{food.icon}</Text>}
            >
              {food.label}
            </Chip>
          ))}
        </View>

        {errors.foodType && (
          <HelperText type='error' visible={!!errors.foodType}>
            {errors.foodType}
          </HelperText>
        )}
      </View>

      <View style={styles.section}>
        <Text variant='titleMedium' style={styles.sectionTitle}>
          {t('feeding.amount')}
        </Text>

        <RadioButton.Group onValueChange={setAmount} value={amount}>
          {FEEDING_AMOUNTS.map(amountOption => (
            <View key={amountOption.value} style={styles.radioOption}>
              <RadioButton.Item label={amountOption.label} value={amountOption.value} />
            </View>
          ))}
        </RadioButton.Group>
      </View>

      <View style={styles.section}>
        <Text variant='titleMedium' style={styles.sectionTitle}>
          {t('feeding.notes')} ({t('common.optional')})
        </Text>

        <TextInput
          mode='outlined'
          value={notes}
          onChangeText={setNotes}
          placeholder={t('feeding.notesPlaceholder')}
          multiline
          numberOfLines={3}
          style={styles.notesInput}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode='contained'
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        >
          {t('feeding.logFeeding')}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  radioOption: {
    marginVertical: 4,
  },
  notesInput: {
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  submitButton: {
    paddingVertical: 8,
  },
});
