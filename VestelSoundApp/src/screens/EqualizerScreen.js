import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import VerticalSlider from '../components/VerticalSlider';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const EQ_BANDS = ['63', '125', '250', '500', '1K', '4K', '16K'];
const INITIAL_EQ = [4, 2, 0, -2, 3, 5, 2];

const PRESETS = [
  { num: '01', name: 'Bass Boost' },
  { num: '02', name: 'Vokal' },
  { num: '03', name: 'Akustik' },
  { num: '04', name: 'Custom' },
];

export default function EqualizerScreen({ navigation }) {
  const [eqValues, setEqValues] = useState([...INITIAL_EQ]);
  const [activePreset, setActivePreset] = useState(null);

  const updateBand = (i, v) => {
    const next = [...eqValues];
    next[i] = v;
    setEqValues(next);
  };

  const reset = () => setEqValues(new Array(7).fill(0));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn}>
            <Svg width={14} height={15} viewBox="0 0 14 15">
              <Path d="M12 2L10 7l5-2-5-2zM2 8l4 4-2 2H2v-2L0 10l2-2z" fill={colors.primary} />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <Svg width={22} height={22} viewBox="0 0 22 22">
              <Path d="M11 2a6 6 0 110 12A6 6 0 0111 2z" fill={colors.primary} />
              <Path d="M3 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={colors.primary} strokeWidth={1.5} fill="none" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Section label */}
        <View style={styles.titleRow}>
          <Text style={styles.sectionLabel}>EQUALIZER</Text>
          <Text style={styles.screenTitle}>Custom</Text>
        </View>

        {/* EQ Sliders */}
        <View style={styles.slidersArea}>
          {EQ_BANDS.map((band, i) => (
            <View key={band} style={styles.bandCol}>
              <VerticalSlider
                initialValue={INITIAL_EQ[i]}
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
          <Text style={styles.presetsLabel}>PRESETLER</Text>
          {PRESETS.map((p, i) => (
            <View key={p.num}>
              <TouchableOpacity
                style={styles.presetRow}
                onPress={() => setActivePreset(p.num)}
              >
                <View style={styles.presetLeft}>
                  <Text style={styles.presetNum}>{p.num}</Text>
                  <Text style={styles.presetName}>{p.name}</Text>
                </View>
                <Svg width={4} height={8} viewBox="0 0 4 8">
                  <Path d="M0 0l4 4-4 4" stroke={activePreset === p.num ? colors.primary : colors.border} strokeWidth={1.5} fill="none" />
                </Svg>
              </TouchableOpacity>
              {i < PRESETS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Action Buttons — exact Figma: r=22, h=44, w=171 */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnFill} onPress={() => {}}>
            <Text style={styles.btnFillText}>Kaydet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={reset}>
            <Text style={styles.btnOutlineText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconBtn: {
    width: 28, height: 28,
    backgroundColor: colors.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleRow: { marginBottom: 24 },
  sectionLabel: {
    ...typography.labelMd,
    color: colors.secondary,
    marginBottom: 4,
  },
  screenTitle: {
    ...typography.title,
    color: colors.primary,
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
    color: colors.secondary,
    fontSize: 10,
  },

  centerLine: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 4,
    marginBottom: 16,
    opacity: 0.6,
  },

  presetsSection: { flex: 1 },
  presetsLabel: {
    ...typography.labelMd,
    color: colors.secondary,
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
    color: colors.secondary,
    fontSize: 11,
  },
  presetName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 24,
    paddingTop: 12,
    gap: 12,
  },
  btnFill: {
    width: 171, height: 44,
    backgroundColor: colors.buttonBg,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnFillText: {
    ...typography.btnSm,
    color: colors.buttonText,
  },
  btnOutline: {
    width: 171, height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOutlineText: {
    ...typography.btnSm,
    color: colors.primary,
  },
});
