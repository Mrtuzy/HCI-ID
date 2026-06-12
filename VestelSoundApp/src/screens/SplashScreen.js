import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function SplashScreen({ navigation }) {
  const { isDark } = useTheme();
  const C = getColors(isDark);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 40 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ ...typography.display, color: C.primary, marginBottom: 8 }}>VESTEL</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, letterSpacing: 4.2, color: C.secondary }}>
            AURA
          </Text>
        </View>
        <View style={{ alignItems: 'center', gap: 16 }}>
          <TouchableOpacity
            style={{ width: '100%', height: 56, backgroundColor: C.buttonBg, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.85}
          >
            <Text style={{ ...typography.btnPrimary, color: C.buttonText }}>Başla</Text>
          </TouchableOpacity>
          <Text style={{ ...typography.caption, color: C.secondary }}>Sürüm 1.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
