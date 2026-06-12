import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Rect, Path } from 'react-native-svg';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import EqualizerScreen from '../screens/EqualizerScreen';
import LightingScreen from '../screens/LightingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NowPlayingScreen from '../screens/NowPlayingScreen';
import WatchScreen from '../screens/WatchScreen';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function EQIcon({ color: c }) {
  return (
    <Svg width={22} height={20} viewBox="0 0 22 20">
      <Rect x={0} y={9} width={3} height={11} fill={c} rx={1.5} />
      <Rect x={6} y={4} width={3} height={16} fill={c} rx={1.5} />
      <Rect x={12} y={6} width={3} height={14} fill={c} rx={1.5} />
      <Rect x={18} y={2} width={3} height={18} fill={c} rx={1.5} />
    </Svg>
  );
}

function HomeIcon({ color: c }) {
  return (
    <Svg width={22} height={20} viewBox="0 0 22 20">
      <Path d="M11 2L2 9v10h6v-6h6v6h6V9L11 2z" fill={c} />
    </Svg>
  );
}

function LightIcon({ color: c }) {
  return (
    <Svg width={20} height={22} viewBox="0 0 20 22">
      <Path
        d="M10 1C6.69 1 4 3.69 4 7c0 2.22 1.21 4.15 3 5.19V14a1 1 0 001 1h4a1 1 0 001-1v-1.81C14.79 11.15 16 9.22 16 7c0-3.31-2.69-6-6-6z"
        fill={c}
      />
      <Rect x={7} y={16} width={6} height={1.5} rx={0.75} fill={c} />
      <Rect x={8} y={18.5} width={4} height={1.5} rx={0.75} fill={c} />
    </Svg>
  );
}

function MainTabs() {
  const { isDark } = useTheme();
  const C = getColors(isDark);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: C.cream,
          borderTopWidth: 1,
          borderTopColor: C.border,
          height: 84,
          paddingBottom: 20,
          paddingTop: 16,
        },
        tabBarIcon: ({ focused }) => {
          const c = focused ? C.primary : C.iconInactive;
          if (route.name === 'Home') return <HomeIcon color={c} />;
          if (route.name === 'Equalizer') return <EQIcon color={c} />;
          if (route.name === 'Lighting') return <LightIcon color={c} />;
        },
      })}
    >
      <Tab.Screen name="Equalizer" component={EqualizerScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Lighting" component={LightingScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="NowPlaying"
        component={NowPlayingScreen}
        options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Watch"
        component={WatchScreen}
        options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
