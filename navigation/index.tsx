import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LittleLemonHeader from '../components/LittleLemonHeader';
import LittleLemonFooter from '../components/LittleLemonFooter';
import HomeScreen from '../screens/Home';
import OnboardingScreen from '../screens/Onboarding';
import ProfileScreen from '../screens/Profile';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Context } from '../App';

const Stack = createStackNavigator();
// Define types for the props (optional but recommended)
interface RootStackProps {
  isLoggedIn: boolean;
}

export default function RootStack({ isLoggedIn }: RootStackProps) {
  const { userData, setUserData } = React.useContext(Context);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? "Home" : "Onboarding"}
        screenOptions={{
          headerTitleContainerStyle: { ...styles.headerTitleContainer },
          headerStyle: { ...styles.headerContainer },
          headerTitleStyle: styles.headerText,
          headerTintColor: darkerGreen,
          headerTitle: 'Little Lemon',  // This preserves the back button
          headerBackTitle: 'Back',  // Forces "Back" text
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
      <View style={styles.footerContainer}>
        {/* <LittleLemonFooter /> */}
      </View>
    </NavigationContainer>
  );
}

const cream = '#ebe8df'
const green = '#4A5E57'
const darkerGreen = '#384742'
const lightGrey = '#c2bebe'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  footerContainer: {
    backgroundColor: '#333333'
  },
  headerTitleContainer: {
    margin: 10
  },
  headerContainer: {
    height: 130,
    backgroundColor: cream,
  },
  headerText: {
    padding: 10,
    fontSize: 24,
    fontFamily: 'MarkaziText-Regular',
    color: darkerGreen,
    textAlign: 'center',
  },
});
