import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { HomeStackNavigator } from './HomeStackNavigator';
import UserListScreen from '@/Screens/Main/USER_MODEL/UserListScreen/UserListScreen';
import MapScreen from '@/Screens/Main/USER_MODEL/mapScreen/mapScreen';
import UserProfileScreen from '@/Screens/Main/ProfileScreen/UserProfileScreen';
import { Home, Pill, MessageSquare, MapPin, User } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'HomeTab') return <Home size={size} color={color} />;
          if (route.name === 'Chat') return <MessageSquare size={size} color={color} />;
          if (route.name === 'Nearby') return <MapPin size={size} color={color} />;
          if (route.name === 'Profile') return <User size={size} color={color} />;
          return null;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator} 
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen name="Chat" component={UserListScreen} />
      <Tab.Screen name="Nearby" component={MapScreen} />
      <Tab.Screen name="Profile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
