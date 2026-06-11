import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

function UnderlineInput({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType }) {
  return (
    <View style={input.wrapper}>
      <Text style={input.label}>{label}</Text>
      <View style={input.row}>
        <TextInput
          style={input.field}
          placeholder={placeholder}
          placeholderTextColor={colors.border}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        <View style={input.underline} />
      </View>
    </View>
  );
}

const input = StyleSheet.create({
  wrapper: { marginBottom: 24 },
  label: {
    ...typography.label,
    color: colors.secondary,
    marginBottom: 8,
  },
  row: { position: 'relative' },
  field: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.primary,
    paddingBottom: 10,
    paddingTop: 0,
  },
  underline: {
    height: 1,
    backgroundColor: colors.border,
    borderRadius: 1,
  },
});

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Hoş geldin</Text>
            <Text style={styles.subtitle}>Bağlan veya misafir olarak devam et</Text>
          </View>

          {/* Inputs */}
          <View style={styles.form}>
            <UnderlineInput
              label="E-POSTA"
              placeholder="ad@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <UnderlineInput
              label="ŞİFRE"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace('Main')}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Giriş yap</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          {/* Register */}
          <TouchableOpacity style={styles.registerRow}>
            <Text style={styles.registerText}>Hesap oluştur</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Skip */}
        <TouchableOpacity
          style={styles.skip}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.skipText}>Şimdilik atla</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  titleBlock: {
    marginBottom: 40,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.secondary,
  },
  form: {
    marginBottom: 8,
  },
  button: {
    height: 56,
    backgroundColor: colors.buttonBg,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    ...typography.btnPrimary,
    color: colors.buttonText,
  },
  spacer: { flex: 1, minHeight: 20 },
  registerRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  registerText: {
    ...typography.body,
    fontFamily: 'Inter_500Medium',
    color: colors.primary,
  },
  skip: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.secondary,
  },
});
