import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, PanResponder, Modal,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import ColorWheel from '../components/ColorWheel';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const MODES = ['Adaptive', 'Pulse', 'Rainbow', 'Static', 'Breathe'];
const PRESETS = [
  { num: '01', name: 'New preset' },
  { num: '02', name: 'Gece lambası' },
  { num: '03', name: 'Parti modu' },
];

const TRACK_W = 280;

function HSlider({ label, initialValue = 50 }) {
  const [value, setValue] = useState(initialValue);
  const startV = useRef(initialValue);
  const currV = useRef(initialValue);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { startV.current = currV.current; },
    onPanResponderMove: (_, g) => {
      const next = Math.max(0, Math.min(100, startV.current + (g.dx / TRACK_W) * 100));
      currV.current = next;
      setValue(next);
    },
  })).current;

  return (
    <View style={hs.row}>
      <Text style={hs.label}>{label}</Text>
      <View style={hs.trackWrapper} {...pan.panHandlers}>
        <View style={hs.track} />
        <View style={[hs.fill, { width: `${value}%` }]} />
        <View style={[hs.thumb, { left: `${value}%` }]} />
      </View>
    </View>
  );
}

const hs = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  label: {
    ...typography.label,
    color: colors.secondary,
    width: 90,
  },
  trackWrapper: {
    flex: 1, height: 16, justifyContent: 'center', position: 'relative',
  },
  track: {
    position: 'absolute', left: 0, right: 0,
    height: 3, backgroundColor: colors.border, borderRadius: 2,
  },
  fill: {
    position: 'absolute', left: 0,
    height: 3, backgroundColor: colors.primary, borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.primary,
    marginLeft: -8, top: 0,
  },
});

export default function LightingScreen({ navigation }) {
  const [selectedColor, setSelectedColor] = useState('#E86B2A');
  const [selectedMode, setSelectedMode] = useState('Adaptive');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn}>
            <Svg width={14} height={15} viewBox="0 0 14 15">
              <Path d="M12 2L10 7l5-2-5-2z" fill={colors.primary} />
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

        {/* Title */}
        <Text style={styles.title}>LIGHTING</Text>

        {/* Color Wheel — 220x220 with inner circle 110x110 */}
        <View style={styles.wheelContainer}>
          <ColorWheel
            size={220}
            innerRatio={0.5}
            onColorSelect={(color) => setSelectedColor(color)}
          />
          {/* Inner circle overlay — exact Figma: 110x110, cream fill, 18x18 white dot */}
          <View style={[styles.innerCircle, { backgroundColor: colors.cream }]} />
          <View style={[styles.innerDot, { backgroundColor: selectedColor }]} />
        </View>

        {/* MOD Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MOD</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownOpen(!dropdownOpen)}
          >
            <Text style={styles.dropdownText}>{selectedMode}</Text>
            <Svg width={8} height={4} viewBox="0 0 8 4">
              <Path d={dropdownOpen ? "M0 4L4 0l4 4" : "M0 0l4 4 4-4"} stroke={colors.secondary} strokeWidth={1.5} fill="none" />
            </Svg>
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownMenu}>
              {MODES.map((m, i) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.dropdownItem, i < MODES.length - 1 && styles.dropdownItemBorder]}
                  onPress={() => { setSelectedMode(m); setDropdownOpen(false); }}
                >
                  <Text style={styles.dropdownItemText}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Sliders */}
        <View style={styles.section}>
          <HSlider label="PARLAKLIK" initialValue={70} />
          <HSlider label="HIZ" initialValue={40} />
        </View>

        {/* Preset List */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PRESETLER</Text>
          {PRESETS.map((p, i) => (
            <View key={p.num}>
              <TouchableOpacity style={styles.presetRow}>
                <View style={styles.presetLeft}>
                  <Text style={styles.presetNum}>{p.num}</Text>
                  <Text style={styles.presetName}>{p.name}</Text>
                </View>
                <Svg width={4} height={8} viewBox="0 0 4 8">
                  <Path d="M0 0l4 4-4 4" stroke={colors.border} strokeWidth={1.5} fill="none" />
                </Svg>
              </TouchableOpacity>
              {i < PRESETS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnFill}>
            <Text style={styles.btnFillText}>Kaydet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline}>
            <Text style={styles.btnOutlineText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 },

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

  title: {
    ...typography.title,
    color: colors.primary,
    marginBottom: 20,
  },

  wheelContainer: {
    alignSelf: 'center',
    width: 220, height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  innerCircle: {
    position: 'absolute',
    width: 110, height: 110,
    borderRadius: 55,
    pointerEvents: 'none',
  },
  innerDot: {
    position: 'absolute',
    width: 18, height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.white,
  },

  section: { marginBottom: 20 },
  sectionLabel: {
    ...typography.labelMd,
    color: colors.secondary,
    marginBottom: 12,
  },

  dropdown: {
    height: 32,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.primary,
  },
  dropdownMenu: {
    marginTop: 4,
    borderRadius: 4,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  dropdownItem: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.primary,
  },

  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  presetLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  presetNum: { ...typography.label, color: colors.secondary, fontSize: 11 },
  presetName: { fontFamily: 'Inter_400Regular', fontSize: 15, color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  btnFill: {
    flex: 1, height: 44,
    backgroundColor: colors.buttonBg,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnFillText: { ...typography.btnSm, color: colors.buttonText },
  btnOutline: {
    flex: 1, height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOutlineText: { ...typography.btnSm, color: colors.primary },
});
