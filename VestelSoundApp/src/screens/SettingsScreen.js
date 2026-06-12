import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { getColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';

function ChevronRight({ color }) {
  return (
    <Svg width={4} height={8} viewBox="0 0 4 8">
      <Path d="M0 0l4 4-4 4" stroke={color} strokeWidth={1.5} fill="none" />
    </Svg>
  );
}

function SettingRow({ label, value, C, onPress }) {
  return (
    <TouchableOpacity style={row.container} onPress={onPress} activeOpacity={0.6}>
      <Text style={[row.label, { color: C.primary }]}>{label}</Text>
      <View style={row.right}>
        <Text style={[row.value, { color: C.secondary }]}>{value}</Text>
        <View style={{ marginLeft: 8 }}>
          <ChevronRight color={C.border} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Tapping a row advances to the next option in its list.
const cycle = (list, current) => list[(list.indexOf(current) + 1) % list.length];

const DIL_OPTIONS = ['Türkçe', 'English', 'Deutsch'];
const NAV_OPTIONS = ['Alt', 'Üst'];
const SES_OPTIONS = ['50%', '60%', '70%', '80%', '90%', '100%'];
const SAAT_OPTIONS = ['22:00 - 08:00', '23:00 - 07:00', '00:00 - 06:00', 'Kapalı'];

const row = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  label: { fontFamily: 'Inter_400Regular', fontSize: 15 },
  right: { flexDirection: 'row', alignItems: 'center' },
  value: { fontFamily: 'Inter_400Regular', fontSize: 14 },
});

export default function SettingsScreen({ navigation }) {
  const { isDark, toggleTheme } = useTheme();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);
  const theme = isDark ? 'dark' : 'light';

  const setTheme = (next) => {
    if (next !== theme) toggleTheme();
  };

  const [dil, setDil] = useState('Türkçe');
  const [navBar, setNavBar] = useState('Alt');
  const [sesLimiti, setSesLimiti] = useState('50%');
  const [saatAraligi, setSaatAraligi] = useState('22:00 - 08:00');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Svg width={7} height={14} viewBox="0 0 7 14">
            <Path d="M7 0L0 7l7 7" stroke={C.primary} strokeWidth={1.5} fill="none" />
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
              <Circle cx={10} cy={7} r={5} fill={C.cream} />
              <Path d="M1 20c0-5 4-9 9-9s9 4 9 9" stroke={C.cream} strokeWidth={1.5} fill="none" />
            </Svg>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Misafir oturumu</Text>
            <Text style={styles.profileSub}>Hesabını bağla</Text>
          </View>
          <ChevronRight color={C.border} />
        </View>

        <View style={styles.spacer} />

        {/* GENEL */}
        <Text style={styles.sectionLabel}>GENEL</Text>
        <View style={styles.sectionBlock}>
          <SettingRow
            label="Dil"
            value={dil}
            C={C}
            onPress={() => setDil(d => cycle(DIL_OPTIONS, d))}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Navigasyon çubuğu"
            value={navBar}
            C={C}
            onPress={() => setNavBar(n => cycle(NAV_OPTIONS, n))}
          />
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
          <SettingRow
            label="Ses limiti"
            value={sesLimiti}
            C={C}
            onPress={() => setSesLimiti(s => cycle(SES_OPTIONS, s))}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Saat aralığı"
            value={saatAraligi}
            C={C}
            onPress={() => setSaatAraligi(s => cycle(SAAT_OPTIONS, s))}
          />
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

const makeStyles = (C) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },

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
    backgroundColor: C.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.titleSm,
    color: C.primary,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },

  profileCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileInfo: { flex: 1 },
  profileName: { fontFamily: 'Inter_500Medium', fontSize: 15, color: C.primary, marginBottom: 3 },
  profileSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.secondary },

  spacer: { height: 24 },

  sectionLabel: {
    ...typography.labelMd,
    color: C.secondary,
    marginBottom: 10,
  },

  sectionBlock: {
    paddingHorizontal: 2,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
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
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeBtnActive: {
    backgroundColor: C.buttonBg,
    borderColor: C.buttonBg,
  },
  themeBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: C.primary,
  },
  themeBtnTextActive: {
    color: C.buttonText,
  },

  logoutBtn: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: C.coral,
  },
});
