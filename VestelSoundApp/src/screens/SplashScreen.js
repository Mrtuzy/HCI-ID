import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Logo Block */}
        <View style={styles.logoBlock}>
          <Text style={styles.logoText}>VESTEL</Text>
          <Text style={styles.logoSub}>AURA</Text>
        </View>

        {/* Bottom CTA */}
        <View style={styles.bottomCta}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Başla</Text>
          </TouchableOpacity>
          <Text style={styles.version}>Sürüm 1.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 40,
  },
  logoBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    ...typography.display,
    color: colors.primary,
    marginBottom: 8,
  },
  logoSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    letterSpacing: 4.2,
    color: colors.secondary,
  },
  bottomCta: {
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: colors.buttonBg,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...typography.btnPrimary,
    color: colors.buttonText,
  },
  version: {
    ...typography.caption,
    color: colors.secondary,
  },
});
