// Main App Navigator
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import CustomTabBar from './CustomTabBar';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';

// Home Tab Screens
import DashboardScreen from '../screens/home/DashboardScreen';
import LaboursScreen from '../screens/home/LaboursScreen';

// Leads Screen
import LeadRecordsScreen from '../screens/leads/LeadRecordsScreen';

// Harvest Screens
import HarvestOrdersScreen from '../screens/harvest/HarvestOrdersScreen';
import HarvestScannerScreen from '../screens/harvest/HarvestScannerScreen';

import { colors, typography } from '../utils/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Tab Stack
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Labours" component={LaboursScreen} />
    </Stack.Navigator>
  );
};

// Leads Tab Stack
const LeadsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LeadRecords" component={LeadRecordsScreen} />
    </Stack.Navigator>
  );
};

// Harvest Tab Stack
const HarvestStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="HarvestOrders"
        component={HarvestOrdersScreen}
        options={{
          title: 'Harvest',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.surface,
          headerTitleStyle: { ...typography.h3, fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="HarvestScanner"
        component={HarvestScannerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Main Bottom Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName="HomeTab"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="LeadsTab" component={LeadsStack} />
      <Tab.Screen name="HomeTab" component={HomeStack} />
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
