import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../theme/colors';
import { typography } from '../theme/typography';

function UnderlineInput({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, C }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ ...typography.label, color: C.secondary, marginBottom: 8 }}>{label}</Text>
      <TextInput
        style={{ fontFamily: 'Inter_400Regular', fontSize: 16, color: C.primary, paddingBottom: 10 }}
        placeholder={placeholder}
        placeholderTextColor={C.border}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
      <View style={{ height: 1, backgroundColor: C.border, borderRadius: 1 }} />
    </View>
  );
}

export default function LoginScreen({ navigation }) {
  const { isDark } = useTheme();
  const C = getColors(isDark);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginBottom: 40 }}>
            <Text style={{ ...typography.h1, color: C.primary, marginBottom: 8 }}>Hoş geldin</Text>
            <Text style={{ ...typography.body, color: C.secondary }}>Bağlan veya misafir olarak devam et</Text>
          </View>

          <View style={{ marginBottom: 8 }}>
            <UnderlineInput label="E-POSTA" placeholder="ad@gmail.com" value={email} onChangeText={setEmail} keyboardType="email-address" C={C} />
            <UnderlineInput label="ŞİFRE" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry C={C} />
          </View>

          <TouchableOpacity
            style={{ height: 56, backgroundColor: C.buttonBg, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}
            onPress={() => navigation.replace('Main')}
            activeOpacity={0.85}
          >
            <Text style={{ ...typography.btnPrimary, color: C.buttonText }}>Giriş yap</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, minHeight: 20 }} />

          <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 8 }}>
            <Text style={{ ...typography.body, fontFamily: 'Inter_500Medium', color: C.primary }}>Hesap oluştur</Text>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={{ alignItems: 'center', paddingVertical: 16 }}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: C.secondary }}>Şimdilik atla</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
