import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { getColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme, useI18n } from '../context/ThemeContext';

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

const SES_OPTIONS = ['10%', '20%', '30%', '40%', '50%', '60%'];
const SAAT_OPTIONS = [
  '21.00 - 07.00', '21.00 - 08.00', '22.00 - 07.00',
  '22.00 - 08.00', '23.00 - 07.00', '23.00 - 08.00',
];

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
  const { isDark, toggleTheme, lang, setLang, navHomePosition, setNavHomePosition, user, logoutUser } = useTheme();
  const { t } = useI18n();
  const isGuest = !user;
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);
  const theme = isDark ? 'dark' : 'light';

  const setTheme = (next) => {
    if (next !== theme) toggleTheme();
  };

  const [sesLimiti, setSesLimiti] = useState('50%');
  const [saatAraligi, setSaatAraligi] = useState('22.00 - 08.00');
  const [activeMenu, setActiveMenu] = useState(null); // 'language' | 'nav' | 'volume' | 'time'

  // Display values for the rows
  const langLabel = lang === 'tr' ? t('lang_option_tr') : t('lang_option_en');
  const navLabel = t(
    navHomePosition === 'left' ? 'nav_left' : navHomePosition === 'right' ? 'nav_right' : 'nav_center'
  );

  // Config for the option sub-menu. Selecting an option applies it and closes.
  const MENUS = {
    language: {
      title: t('language'),
      options: [
        { key: 'tr', label: t('lang_option_tr') },
        { key: 'en', label: t('lang_option_en') },
      ],
      current: lang,
      onSelect: (k) => setLang(k),
    },
    nav: {
      title: t('nav_bar'),
      options: [
        { key: 'center', label: t('nav_center') },
        { key: 'left', label: t('nav_left') },
        { key: 'right', label: t('nav_right') },
      ],
      current: navHomePosition,
      onSelect: (k) => setNavHomePosition(k),
    },
    volume: {
      title: t('volume_limit'),
      options: SES_OPTIONS.map((o) => ({ key: o, label: o })),
      current: sesLimiti,
      onSelect: (k) => setSesLimiti(k),
    },
    time: {
      title: t('time_range'),
      options: SAAT_OPTIONS.map((o) => ({ key: o, label: o })),
      current: saatAraligi,
      onSelect: (k) => setSaatAraligi(k),
    },
  };

  const menu = activeMenu ? MENUS[activeMenu] : null;

  const handleSelect = (key) => {
    if (menu) menu.onSelect(key);
    setActiveMenu(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Svg width={7} height={14} viewBox="0 0 7 14">
            <Path d="M7 0L0 7l7 7" stroke={C.primary} strokeWidth={1.5} fill="none" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={isGuest ? 0.7 : 1}
          onPress={isGuest ? () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) : undefined}
        >
          <View style={styles.avatar}>
            <Svg width={20} height={22} viewBox="0 0 20 22">
              <Circle cx={10} cy={7} r={5} fill={C.cream} />
              <Path d="M1 20c0-5 4-9 9-9s9 4 9 9" stroke={C.cream} strokeWidth={1.5} fill="none" />
            </Svg>
          </View>
          <View style={styles.profileInfo}>
            {isGuest ? (
              <>
                <Text style={styles.profileName}>{t('guest_session')}</Text>
                <Text style={styles.profileSub}>{t('connect_account')}</Text>
              </>
            ) : (
              <>
                <Text style={styles.profileName}>{user.name !== user.email ? user.name : user.email}</Text>
                {user.name !== user.email && (
                  <Text style={styles.profileSub}>{user.email}</Text>
                )}
              </>
            )}
          </View>
          <ChevronRight color={C.border} />
        </TouchableOpacity>

        <View style={styles.spacer} />

        {/* GENERAL */}
        <Text style={styles.sectionLabel}>{t('general')}</Text>
        <View style={styles.sectionBlock}>
          <SettingRow
            label={t('language')}
            value={langLabel}
            C={C}
            onPress={() => setActiveMenu('language')}
          />
          <View style={styles.divider} />
          <SettingRow
            label={t('nav_bar')}
            value={navLabel}
            C={C}
            onPress={() => setActiveMenu('nav')}
          />
        </View>

        <View style={styles.spacer} />

        {/* APPEARANCE */}
        <Text style={styles.sectionLabel}>{t('appearance')}</Text>
        <View style={styles.themeToggle}>
          <TouchableOpacity
            style={[styles.themeBtn, theme === 'light' && styles.themeBtnActive]}
            onPress={() => setTheme('light')}
          >
            <Text style={[styles.themeBtnText, theme === 'light' && styles.themeBtnTextActive]}>
              {t('light_theme')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeBtn, theme === 'dark' && styles.themeBtnActive]}
            onPress={() => setTheme('dark')}
          >
            <Text style={[styles.themeBtnText, theme === 'dark' && styles.themeBtnTextActive]}>
              {t('dark_theme')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        {/* NIGHT MODE */}
        <Text style={styles.sectionLabel}>{t('night_mode')}</Text>
        <View style={styles.sectionBlock}>
          <SettingRow
            label={t('volume_limit')}
            value={sesLimiti}
            C={C}
            onPress={() => setActiveMenu('volume')}
          />
          <View style={styles.divider} />
          <SettingRow
            label={t('time_range')}
            value={saatAraligi}
            C={C}
            onPress={() => setActiveMenu('time')}
          />
        </View>

        <View style={{ flex: 1, minHeight: 40 }} />

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => { logoutUser(); navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); }}
        >
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Option sub-menu */}
      <Modal
        visible={!!menu}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveMenu(null)}
      >
        <View style={styles.menuOverlay}>
          <TouchableOpacity
            style={styles.menuBackdrop}
            activeOpacity={1}
            onPress={() => setActiveMenu(null)}
          />
          <SafeAreaView style={styles.menuSheet}>
            <View style={styles.menuHeader}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setActiveMenu(null)}>
                <Svg width={7} height={14} viewBox="0 0 7 14">
                  <Path d="M7 0L0 7l7 7" stroke={C.primary} strokeWidth={1.5} fill="none" />
                </Svg>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{t('settings')}</Text>
              <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.menuContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionLabel}>{menu ? menu.title.toUpperCase() : ''}</Text>
              <View style={styles.menuDividerTop} />
              {menu && menu.options.map((opt) => {
                const selected = opt.key === menu.current;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={styles.menuItem}
                    onPress={() => handleSelect(opt.key)}
                    activeOpacity={0.6}
                  >
                    <Text style={[styles.menuItemText, { color: selected ? C.primary : C.secondary }]}>
                      {opt.label}
                    </Text>
                    {selected && (
                      <Svg width={14} height={11} viewBox="0 0 14 11">
                        <Path d="M1 5.5L5 9.5L13 1.5" stroke={C.primary} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
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

  // Sub-menu
  menuOverlay: { flex: 1 },
  menuBackdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  menuSheet: {
    flex: 1,
    backgroundColor: C.cream,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  menuContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  menuDividerTop: {
    height: 1,
    backgroundColor: C.border,
    marginBottom: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  menuItemText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
});
