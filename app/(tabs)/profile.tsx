import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Card,
  Text,
  Button,
  List,
  Divider,
  useTheme,
  Modal,
  Portal,
  Avatar,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/lib/contexts/AuthContext';
import { router } from 'expo-router';
import { useCustomAlert } from '@/components/ui/CustomAlert';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();
  const { showAlert, AlertComponent } = useCustomAlert();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleSignOut = async () => {
    showAlert(
      t('profile.signOut'),
      t('profile.signOutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.signOut'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ],
      'warning'
    );
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const getUserStats = () => {
    return {
      tanks: 0,
      fish: 0,
      testsThisWeek: 0,
      daysActive: Math.floor(
        (Date.now() - new Date(user?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24)
      ),
    };
  };

  const stats = getUserStats();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Profile Header Widget */}
        <Card style={[styles.headerCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <LinearGradient
            colors={[theme.colors.primary + '30', theme.colors.primaryContainer]}
            style={styles.gradientCard}
          >
            <Card.Content style={styles.headerContent}>
              <View style={styles.profileRow}>
                <Avatar.Text
                  size={64}
                  label={getInitials(user?.email || 'U')}
                  style={{ backgroundColor: theme.colors.primary }}
                  labelStyle={{ fontSize: 24, fontWeight: 'bold' }}
                />
                <View style={styles.profileInfo}>
                  <Text
                    variant='headlineSmall'
                    style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}
                  >
                    Welcome back!
                  </Text>
                  <Text
                    variant='bodyLarge'
                    style={{ color: theme.colors.onPrimaryContainer, opacity: 0.8 }}
                  >
                    {user?.email}
                  </Text>
                  <Text
                    variant='bodySmall'
                    style={{ color: theme.colors.onPrimaryContainer, opacity: 0.6, marginTop: 4 }}
                  >
                    Member for {stats.daysActive} days
                  </Text>
                </View>
                <IconButton
                  icon='cog'
                  iconColor={theme.colors.onPrimaryContainer}
                  size={24}
                  onPress={() => console.log('Settings')}
                />
              </View>
            </Card.Content>
          </LinearGradient>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Card.Content style={styles.statContent}>
              <Avatar.Icon
                size={36}
                icon='fishbowl'
                style={{ backgroundColor: theme.colors.secondary, marginBottom: 8 }}
              />
              <Text
                variant='headlineMedium'
                style={{ color: theme.colors.onSecondaryContainer, fontWeight: 'bold' }}
              >
                {stats.tanks}
              </Text>
              <Text
                variant='labelMedium'
                style={{ color: theme.colors.onSecondaryContainer, opacity: 0.8 }}
              >
                {t('navigation.myTanks')}
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Card.Content style={styles.statContent}>
              <Avatar.Icon
                size={36}
                icon='fish'
                style={{ backgroundColor: theme.colors.tertiary, marginBottom: 8 }}
              />
              <Text
                variant='headlineMedium'
                style={{ color: theme.colors.onTertiaryContainer, fontWeight: 'bold' }}
              >
                {stats.fish}
              </Text>
              <Text
                variant='labelMedium'
                style={{ color: theme.colors.onTertiaryContainer, opacity: 0.8 }}
              >
                {t('navigation.fish')}
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Content style={styles.statContent}>
              <Avatar.Icon
                size={36}
                icon='test-tube'
                style={{ backgroundColor: theme.colors.primary, marginBottom: 8 }}
              />
              <Text
                variant='headlineMedium'
                style={{ color: theme.colors.onSurfaceVariant, fontWeight: 'bold' }}
              >
                {stats.testsThisWeek}
              </Text>
              <Text
                variant='labelMedium'
                style={{ color: theme.colors.onSurfaceVariant, opacity: 0.8 }}
              >
                Tests this week
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Settings Card */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text
              variant='titleLarge'
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              {t('common.settings')}
            </Text>

            <List.Section style={styles.listSection}>
              <List.Item
                title={t('profile.language')}
                description={t('profile.languageSettings')}
                left={props => (
                  <Avatar.Icon
                    {...props}
                    size={40}
                    icon='translate'
                    style={{ backgroundColor: theme.colors.primaryContainer }}
                  />
                )}
                right={props => <List.Icon {...props} icon='chevron-right' />}
                onPress={() => setLanguageModalVisible(true)}
                style={styles.listItem}
              />
              <Divider style={styles.divider} />

              <List.Item
                title={t('profile.helpSupport')}
                description={t('profile.helpSupportDesc')}
                left={props => (
                  <Avatar.Icon
                    {...props}
                    size={40}
                    icon='help-circle'
                    style={{ backgroundColor: theme.colors.secondaryContainer }}
                  />
                )}
                right={props => <List.Icon {...props} icon='chevron-right' />}
                onPress={() => console.log('Help')}
                style={styles.listItem}
              />
              <Divider style={styles.divider} />

              <List.Item
                title='Notifications'
                description='Manage your notification preferences'
                left={props => (
                  <Avatar.Icon
                    {...props}
                    size={40}
                    icon='bell'
                    style={{ backgroundColor: theme.colors.tertiaryContainer }}
                  />
                )}
                right={props => <List.Icon {...props} icon='chevron-right' />}
                onPress={() => console.log('Notifications')}
                style={styles.listItem}
              />
              <Divider style={styles.divider} />

              <List.Item
                title='Data & Privacy'
                description='Manage your data and privacy settings'
                left={props => (
                  <Avatar.Icon
                    {...props}
                    size={40}
                    icon='shield-account'
                    style={{ backgroundColor: theme.colors.surfaceVariant }}
                  />
                )}
                right={props => <List.Icon {...props} icon='chevron-right' />}
                onPress={() => console.log('Privacy')}
                style={styles.listItem}
              />
              <Divider style={styles.divider} />

              <List.Item
                title={t('profile.about')}
                description={t('profile.aboutDesc')}
                left={props => (
                  <Avatar.Icon
                    {...props}
                    size={40}
                    icon='information'
                    style={{ backgroundColor: theme.colors.primaryContainer }}
                  />
                )}
                right={props => <List.Icon {...props} icon='chevron-right' />}
                onPress={() => console.log('About')}
                style={styles.listItem}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {/* Sign Out Button */}
        <Button
          mode='outlined'
          onPress={handleSignOut}
          style={[styles.signOutButton, { borderColor: theme.colors.error }]}
          textColor={theme.colors.error}
          icon='logout'
        >
          {t('profile.signOut')}
        </Button>

        {/* Language Selection Modal */}
        <Portal>
          <Modal
            visible={languageModalVisible}
            onDismiss={() => setLanguageModalVisible(false)}
            contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
          >
            <Text
              variant='titleLarge'
              style={[styles.modalTitle, { color: theme.colors.onSurface }]}
            >
              {t('profile.languageSettings')}
            </Text>
            <LanguageSelector
              onLanguageChange={() => {
                setLanguageModalVisible(false);
              }}
            />
            <Button
              mode='text'
              onPress={() => setLanguageModalVisible(false)}
              style={styles.modalCloseButton}
            >
              {t('common.close')}
            </Button>
          </Modal>
        </Portal>

        {/* Custom Alert */}
        <AlertComponent />
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
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  signOutButton: {
    marginTop: 16,
  },
  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    minHeight: 300,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  // Widget-style header card
  headerCard: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  gradientCard: {
    borderRadius: 16,
  },
  headerContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  // Settings card
  settingsCard: {
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  listSection: {
    marginTop: 0,
    paddingTop: 0,
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  divider: {
    marginVertical: 4,
  },
});
