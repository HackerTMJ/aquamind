import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
      size={26}
      style={{
        marginBottom: -3,
        opacity: props.focused ? 1 : 0.7,
      }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const { session, loading } = useAuth();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

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
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 0.5,
          height: Platform.OS === 'ios' ? 85 + insets.bottom : 65 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 25 : 10),
          paddingTop: 8,
          elevation: 8,
          shadowColor: isDark ? '#FFFFFF' : '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='view-dashboard' color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='tanks'
        options={{
          title: 'My Tanks',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='fishbowl' color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='fish'
        options={{
          title: 'Fish',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='fish' color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='monitoring'
        options={{
          title: 'Monitor',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='chart-line' color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='account' color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
