import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens (to be created)
import OnboardingScreen from '../screens/OnboardingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FamilyTreeScreen from '../screens/FamilyTreeScreen';
import NumerologyScreen from '../screens/NumerologyScreen';
import AddFamilyMemberScreen from '../screens/AddFamilyMemberScreen';
import FamilyMemberDetailScreen from '../screens/FamilyMemberDetailScreen';

// Import context
import { useAppContext } from '../services/AppContext';

// Define navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  AddFamilyMember: { relativeType: string; selectedNodeId?: string | number };
  FamilyMemberDetail: { nodeId: string | number };
};

export type MainTabParamList = {
  FamilyTree: undefined;
  Profile: undefined;
  Numerology: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'FamilyTree') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Numerology') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else {
            iconName = 'help-circle';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8b5cf6', // Purple color
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#1f2937', // Dark background
        },
        headerTintColor: '#fff', // White text
        tabBarStyle: {
          backgroundColor: '#1f2937', // Dark background
        },
      })}
    >
      <Tab.Screen 
        name="FamilyTree" 
        component={FamilyTreeScreen} 
        options={{ title: 'Family Tree' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }} 
      />
      <Tab.Screen 
        name="Numerology" 
        component={NumerologyScreen} 
        options={{ title: 'Numerology' }} 
      />
    </Tab.Navigator>
  );
};

// Root navigator
const AppNavigator = () => {
  const { userInfo, isLoading } = useAppContext();

  // Skip onboarding if user data exists
  const initialRouteName = userInfo ? 'Main' : 'Onboarding';

  if (isLoading) {
    // Return a loading screen if data is still loading
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRouteName}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1f2937', // Dark background
          },
          headerTintColor: '#fff', // White text
          cardStyle: { backgroundColor: '#111827' }, // Dark background for screens
        }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AddFamilyMember" 
          component={AddFamilyMemberScreen} 
          options={{ title: 'Add Family Member' }}
        />
        <Stack.Screen 
          name="FamilyMemberDetail" 
          component={FamilyMemberDetailScreen} 
          options={{ title: 'Family Member Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
