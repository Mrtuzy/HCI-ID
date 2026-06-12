import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { View, ActivityIndicator, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import AppNavigator from './src/navigation/AppNavigator';
import NotificationOverlay from './src/components/NotificationOverlay';
import { colors } from './src/theme/colors';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

function Root() {
  const { isDark } = useTheme();

  // Immersive: hide the Android system navigation bar (soft keys)
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        {/* Hide the top status bar (clock / notifications) inside the app */}
        <StatusBar hidden />
        <AppNavigator />
      </NavigationContainer>
      {/* Floating in-app notifications, rendered above every screen */}
      <NotificationOverlay />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}
