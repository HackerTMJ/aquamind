import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, TextInput, Button, useTheme, HelperText, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { waterParameterService } from '@/lib/database';

interface WaterParameterFormProps {
  tankId: string;
  userId: string;
  onSubmit: (success: boolean) => void;
  initialParameter?: string; // pre-select parameter type
}

const PARAMETER_OPTIONS = [
  { value: 'ph', label: 'pH', unit: '', icon: '⚗️' },
  { value: 'temperature', label: 'Temp', unit: '°C', icon: '🌡️' },
  { value: 'ammonia', label: 'NH₃', unit: 'ppm', icon: '☠️' },
  { value: 'nitrite', label: 'NO₂', unit: 'ppm', icon: '⚠️' },
  { value: 'nitrate', label: 'NO₃', unit: 'ppm', icon: '📊' },
  { value: 'oxygen', label: 'O₂', unit: 'mg/L', icon: '💨' },
  { value: 'hardness', label: 'GH', unit: 'dGH', icon: '🪨' },
  { value: 'alkalinity', label: 'KH', unit: 'dKH', icon: '⚖️' },
];

export default function WaterParameterForm({
  tankId,
  userId,
  onSubmit,
  initialParameter,
}: WaterParameterFormProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [selectedParameter, setSelectedParameter] = useState(initialParameter || 'ph');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ value?: string }>({});

  const selectedParameterInfo = PARAMETER_OPTIONS.find(p => p.value === selectedParameter);
  const parameterRange = waterParameterService.getParameterRange(selectedParameter);

  const validateValue = (inputValue: string): string | undefined => {
    const numValue = parseFloat(inputValue);

    if (!inputValue.trim()) {
      return t('waterParameters.valueRequired');
    }

    if (isNaN(numValue)) {
      return t('waterParameters.valueInvalid');
    }

    if (parameterRange) {
      if (numValue < parameterRange.min || numValue > parameterRange.max) {
        return t('waterParameters.valueOutOfRange', {
          min: parameterRange.min,
          max: parameterRange.max,
          unit: parameterRange.unit,
        });
      }
    }

    return undefined;
  };

  const getValueStatus = (inputValue: string): 'good' | 'warning' | 'danger' | 'neutral' => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || !parameterRange) return 'neutral';

    if (numValue < parameterRange.min || numValue > parameterRange.max) {
      return 'danger';
    }

    if (numValue < parameterRange.optimal.min || numValue > parameterRange.optimal.max) {
      return 'warning';
    }

    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return theme.colors.primary;
      case 'warning':
        return theme.colors.tertiary;
      case 'danger':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const valueError = validateValue(value);

    if (valueError) {
      setErrors({ value: valueError });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await waterParameterService.createParameter({
        tankId,
        parameterType: selectedParameter,
        value: parseFloat(value),
        unit: selectedParameterInfo?.unit || '',
        testedDate: new Date(),
        notes: notes.trim(),
        userId,
      });

      onSubmit(true);
    } catch (error) {
      console.error('Error saving water parameter:', error);
      onSubmit(false);
    } finally {
      setLoading(false);
    }
  };

  const status = getValueStatus(value);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.card}>
        <Card.Content>
          <Text
            variant='titleMedium'
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            {t('waterParameters.selectParameter')}
          </Text>

          <View style={styles.parameterGrid}>
            {PARAMETER_OPTIONS.map(param => (
              <Chip
                key={param.value}
                selected={selectedParameter === param.value}
                onPress={() => setSelectedParameter(param.value)}
                style={[
                  styles.parameterChip,
                  selectedParameter === param.value && {
                    backgroundColor: theme.colors.primaryContainer,
                  },
                ]}
                textStyle={{
                  color:
                    selectedParameter === param.value
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSurface,
                }}
              >
                {param.icon} {param.label}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text
            variant='titleMedium'
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            {t('waterParameters.enterValue')}
          </Text>

          <View style={styles.valueInputContainer}>
            <TextInput
              label={`${selectedParameterInfo?.label} ${t('waterParameters.value')}`}
              value={value}
              onChangeText={text => {
                setValue(text);
                setErrors({ ...errors, value: undefined });
              }}
              keyboardType='numeric'
              mode='outlined'
              style={styles.valueInput}
              error={!!errors.value}
              right={
                selectedParameterInfo?.unit ? (
                  <TextInput.Affix text={selectedParameterInfo.unit} />
                ) : undefined
              }
            />

            {value && !errors.value && (
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(status) }]}>
                <Text style={[styles.statusText, { color: theme.colors.onPrimary }]}>
                  {status === 'good' && '✓ Good'}
                  {status === 'warning' && '⚠ Warning'}
                  {status === 'danger' && '⚠ Danger'}
                </Text>
              </View>
            )}
          </View>

          {errors.value && (
            <HelperText type='error' visible={!!errors.value}>
              {errors.value}
            </HelperText>
          )}

          {parameterRange && (
            <View style={styles.rangeInfo}>
              <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                {t('waterParameters.safeRange')}: {parameterRange.min} - {parameterRange.max}{' '}
                {parameterRange.unit}
              </Text>
              <Text variant='bodySmall' style={{ color: theme.colors.primary }}>
                {t('waterParameters.optimalRange')}: {parameterRange.optimal.min} -{' '}
                {parameterRange.optimal.max} {parameterRange.unit}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text
            variant='titleMedium'
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            {t('waterParameters.notes')} ({t('common.optional')})
          </Text>

          <TextInput
            label={t('waterParameters.notesPlaceholder')}
            value={notes}
            onChangeText={setNotes}
            mode='outlined'
            multiline
            numberOfLines={3}
            style={styles.notesInput}
          />
        </Card.Content>
      </Card>

      <View style={styles.submitContainer}>
        <Button
          mode='contained'
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || !value.trim()}
          style={styles.submitButton}
        >
          {t('waterParameters.saveTest')}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  parameterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  parameterChip: {
    marginBottom: 8,
  },
  valueInputContainer: {
    position: 'relative',
  },
  valueInput: {
    marginBottom: 8,
  },
  statusIndicator: {
    position: 'absolute',
    right: 12,
    top: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  rangeInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  notesInput: {
    marginBottom: 8,
  },
  submitContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  submitButton: {
    marginHorizontal: 16,
  },
});
