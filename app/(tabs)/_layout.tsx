import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';

// Modern Tab Bar Icon Component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
  focused?: boolean;
}) {
  return (
    <MaterialCommunityIcons
      size={22}
      style={{
        marginBottom: 2,
        opacity: props.focused ? 1 : 0.7,
        alignSelf: 'center',
        textAlign: 'center',
      }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const { session, loading } = useAuth();
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  // Show loading screen while checking authentication
  if (loading) {
    return null; // You can replace this with a loading component
  }

  // If user is not authenticated, redirect to login
  if (!session) {
    return <Redirect href='/(auth)/login' />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          position: 'absolute',
          bottom: 40,
          left: 20,
          right: 20,
          backgroundColor: isDark ? 'rgba(28, 27, 31, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderRadius: 25,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          paddingHorizontal: 5,
          elevation: 20,
          shadowColor: isDark ? '#FFFFFF' : '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        },
        tabBarBackground: () => (
          <BlurView
            intensity={isDark ? 80 : 100}
            tint={isDark ? 'dark' : 'light'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              borderRadius: 25,
              overflow: 'hidden',
            }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: 0,
          textAlign: 'center',
          width: '100%',
          alignSelf: 'center',
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        // Add slide animation
        tabBarItemStyle: {
          borderRadius: 20,
          marginHorizontal: 2,
          paddingVertical: 8,
          paddingHorizontal: 4,
          justifyContent: 'center',
          alignItems: 'center',
          height: 70,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        },
        tabBarButton: props => {
          const isSelected = props.accessibilityState?.selected;
          return (
            <TouchableOpacity
              onPress={props.onPress}
              style={[
                props.style,
                {
                  backgroundColor: isSelected
                    ? isDark
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'rgba(0, 0, 0, 0.08)'
                    : 'transparent',
                  borderRadius: 20,
                  borderWidth: isSelected ? 1 : 0,
                  borderColor: isSelected
                    ? isDark
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 0, 0, 0.1)'
                    : 'transparent',
                  margin: 2,
                  // iOS liquid glass effect
                  shadowColor: isSelected ? (isDark ? '#FFFFFF' : '#000000') : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.1 : 0,
                  shadowRadius: 8,
                  elevation: isSelected ? 2 : 0,
                },
              ]}
            >
              {props.children}
            </TouchableOpacity>
          );
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: t('navigation.dashboard'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='view-dashboard' color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='tanks'
        options={{
          title: t('navigation.myTanks'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='fishbowl' color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='fish'
        options={{
          title: t('navigation.fish'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='fish' color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='monitoring'
        options={{
          title: t('navigation.monitor'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='chart-line' color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: t('navigation.profile'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='account' color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
