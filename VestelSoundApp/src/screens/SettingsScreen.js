import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

function ChevronRight() {
  return (
    <Svg width={4} height={8} viewBox="0 0 4 8">
      <Path d="M0 0l4 4-4 4" stroke={colors.border} strokeWidth={1.5} fill="none" />
    </Svg>
  );
}

function SettingRow({ label, value }) {
  return (
    <TouchableOpacity style={row.container}>
      <Text style={row.label}>{label}</Text>
      <View style={row.right}>
        <Text style={row.value}>{value}</Text>
        <View style={{ marginLeft: 8 }}>
          <ChevronRight />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const row = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  label: { fontFamily: 'Inter_400Regular', fontSize: 15, color: colors.primary },
  right: { flexDirection: 'row', alignItems: 'center' },
  value: { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.secondary },
});

export default function SettingsScreen({ navigation }) {
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Svg width={7} height={14} viewBox="0 0 7 14">
            <Path d="M7 0L0 7l7 7" stroke={colors.primary} strokeWidth={1.5} fill="none" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Svg width={20} height={22} viewBox="0 0 20 22">
              <Circle cx={10} cy={7} r={5} fill={colors.cream} />
              <Path d="M1 20c0-5 4-9 9-9s9 4 9 9" stroke={colors.cream} strokeWidth={1.5} fill="none" />
            </Svg>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Misafir oturumu</Text>
            <Text style={styles.profileSub}>Hesabını bağla</Text>
          </View>
          <ChevronRight />
        </View>

        <View style={styles.spacer} />

        {/* GENEL */}
        <Text style={styles.sectionLabel}>GENEL</Text>
        <View style={styles.sectionBlock}>
          <SettingRow label="Dil" value="Türkçe" />
          <View style={styles.divider} />
          <SettingRow label="Navigasyon çubuğu" value="Alt" />
        </View>

        <View style={styles.spacer} />

        {/* GÖRÜNÜM */}
        <Text style={styles.sectionLabel}>GÖRÜNÜM</Text>
        <View style={styles.themeToggle}>
          <TouchableOpacity
            style={[styles.themeBtn, theme === 'light' && styles.themeBtnActive]}
            onPress={() => setTheme('light')}
          >
            <Text style={[styles.themeBtnText, theme === 'light' && styles.themeBtnTextActive]}>
              Açık
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeBtn, theme === 'dark' && styles.themeBtnActive]}
            onPress={() => setTheme('dark')}
          >
            <Text style={[styles.themeBtnText, theme === 'dark' && styles.themeBtnTextActive]}>
              Koyu
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        {/* GECE MODU */}
        <Text style={styles.sectionLabel}>GECE MODU</Text>
        <View style={styles.sectionBlock}>
          <SettingRow label="Ses limiti" value="50%" />
          <View style={styles.divider} />
          <SettingRow label="Saat aralığı" value="22:00 - 08:00" />
        </View>

        <View style={{ flex: 1, minHeight: 40 }} />

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.logoutText}>Oturumu kapat</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 28, height: 28,
    backgroundColor: colors.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.titleSm,
    color: colors.primary,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },

  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileInfo: { flex: 1 },
  profileName: { fontFamily: 'Inter_500Medium', fontSize: 15, color: colors.primary, marginBottom: 3 },
  profileSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.secondary },

  spacer: { height: 24 },

  sectionLabel: {
    ...typography.labelMd,
    color: colors.secondary,
    marginBottom: 10,
  },

  sectionBlock: {
    paddingHorizontal: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 0,
  },

  themeToggle: {
    flexDirection: 'row',
    gap: 12,
  },
  themeBtn: {
    flex: 1, height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeBtnActive: {
    backgroundColor: colors.buttonBg,
    borderColor: colors.buttonBg,
  },
  themeBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.primary,
  },
  themeBtnTextActive: {
    color: colors.buttonText,
  },

  logoutBtn: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.coral,
  },
});
