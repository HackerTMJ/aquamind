import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, RadioButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, getAvailableLanguages } from '@/lib/i18n';

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const { t } = useTranslation();
  const currentLanguage = getCurrentLanguage();
  const availableLanguages = getAvailableLanguages();

  const handleLanguageChange = async (language: string) => {
    try {
      await changeLanguage(language);
      onLanguageChange?.(language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'en':
        return t('profile.english');
      case 'zh':
        return t('profile.chinese');
      default:
        return lang;
    }
  };

  return (
    <View style={styles.container}>
      {availableLanguages.map(lang => (
        <List.Item
          key={lang}
          title={getLanguageLabel(lang)}
          onPress={() => handleLanguageChange(lang)}
          left={() => (
            <RadioButton
              value={lang}
              status={currentLanguage === lang ? 'checked' : 'unchecked'}
              onPress={() => handleLanguageChange(lang)}
            />
          )}
          style={styles.languageItem}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 120,
  },
  languageItem: {
    paddingVertical: 8,
    marginVertical: 4,
  },
});
