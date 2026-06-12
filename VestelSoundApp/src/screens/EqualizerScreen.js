import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import VerticalSlider from '../components/VerticalSlider';
import ProfileIcon from '../components/ProfileIcon';
import { getColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme, useI18n } from '../context/ThemeContext';

const EQ_BANDS = ['63', '125', '250', '500', '1K', '4K', '16K'];

const PRESETS = [
  { num: '01' },
  { num: '02' },
  { num: '03' },
  { num: '04' },
];

const PRESET_VALUES = {
  '01': [9, 8, 4, 0, -2, 1, 2],    // Bass Boost: big low-end lift
  '02': [-3, -2, 1, 5, 7, 5, 3],   // Vokal: cut bass, boost presence
  '03': [4, 5, 4, 2, 2, 4, 5],     // Akustik: warm & airy
};

export default function EqualizerScreen({ navigation }) {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const [eqValues, setEqValues] = useState(new Array(7).fill(0));
  const [activePreset, setActivePreset] = useState(null);
  const [savedCustom, setSavedCustom] = useState(new Array(7).fill(0));

  const presetName = (num) => t(`eq_${num}`);
  const activePresetName = activePreset ? presetName(activePreset) : t('eq_04');

  const selectPreset = (num) => {
    setActivePreset(num);
    if (num === '04') {
      setEqValues([...savedCustom]);
    } else {
      setEqValues([...PRESET_VALUES[num]]);
    }
  };

  const updateBand = (i, v) => {
    setEqValues(prev => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    setActivePreset('04');
  };

  const save = () => {
    setSavedCustom([...eqValues]);
    setActivePreset('04');
  };

  const reset = () => {
    setEqValues(new Array(7).fill(0));
    setActivePreset(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn}>
            <Svg width={14} height={15} viewBox="0 0 14 15">
              <Path d="M12 2L10 7l5-2-5-2zM2 8l4 4-2 2H2v-2L0 10l2-2z" fill={C.primary} />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <ProfileIcon color={C.primary} size={28} />
          </TouchableOpacity>
        </View>

        {/* Section label */}
        <View style={styles.titleRow}>
          <Text style={styles.sectionLabel}>{t('equalizer')}</Text>
          <Text style={styles.screenTitle}>{activePresetName}</Text>
        </View>

        {/* EQ Sliders */}
        <View style={styles.slidersArea}>
          {EQ_BANDS.map((band, i) => (
            <View key={band} style={styles.bandCol}>
              <VerticalSlider
                value={eqValues[i]}
                onChange={(v) => updateBand(i, v)}
              />
              <Text style={styles.bandLabel}>{band}</Text>
            </View>
          ))}
        </View>

        {/* Center line */}
        <View style={styles.centerLine} />

        {/* Presets */}
        <View style={styles.presetsSection}>
          <Text style={styles.presetsLabel}>{t('presets')}</Text>
          {PRESETS.map((p, i) => (
            <View key={p.num}>
              <TouchableOpacity
                style={styles.presetRow}
                onPress={() => selectPreset(p.num)}
              >
                <View style={styles.presetLeft}>
                  <Text style={styles.presetNum}>{p.num}</Text>
                  <Text style={styles.presetName}>{presetName(p.num)}</Text>
                </View>
                <Svg width={4} height={8} viewBox="0 0 4 8">
                  <Path d="M0 0l4 4-4 4" stroke={activePreset === p.num ? C.primary : C.border} strokeWidth={1.5} fill="none" />
                </Svg>
              </TouchableOpacity>
              {i < PRESETS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Action Buttons — exact Figma: r=22, h=44, w=171 */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnFill} onPress={save}>
            <Text style={styles.btnFillText}>{t('save')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={reset}>
            <Text style={styles.btnOutlineText}>{t('reset')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (C) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconBtn: {
    width: 28, height: 28,
    backgroundColor: C.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBtn: {
    width: 28, height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleRow: { marginBottom: 24 },
  sectionLabel: {
    ...typography.labelMd,
    color: C.secondary,
    marginBottom: 4,
  },
  screenTitle: {
    ...typography.title,
    color: C.primary,
  },

  slidersArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  bandCol: {
    alignItems: 'center',
    gap: 8,
  },
  bandLabel: {
    ...typography.caption,
    color: C.secondary,
    fontSize: 10,
  },

  centerLine: {
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 4,
    marginBottom: 16,
    opacity: 0.6,
  },

  presetsSection: { flex: 1 },
  presetsLabel: {
    ...typography.labelMd,
    color: C.secondary,
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  presetLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  presetNum: {
    ...typography.label,
    color: C.secondary,
    fontSize: 11,
  },
  presetName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: C.primary,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 24,
    paddingTop: 12,
    gap: 12,
  },
  btnFill: {
    flex: 1, height: 44,
    backgroundColor: C.buttonBg,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnFillText: {
    ...typography.btnSm,
    color: C.buttonText,
  },
  btnOutline: {
    flex: 1, height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOutlineText: {
    ...typography.btnSm,
    color: C.primary,
  },
});
