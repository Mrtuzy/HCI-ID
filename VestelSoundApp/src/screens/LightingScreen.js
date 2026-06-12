import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, PanResponder,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ColorWheel, { hslToHex } from '../components/ColorWheel';
import ProfileIcon from '../components/ProfileIcon';
import { getColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';

const MODES = ['Adaptive', 'Pulse', 'Rainbow', 'Static', 'Breathe'];

// Saved values for each named preset
const PRESET_DATA = {
  '02': { colorAngle: 30,  mode: 'Breathe', brightness: 25, speed: 15 }, // Gece lambası
  '03': { colorAngle: 300, mode: 'Rainbow', brightness: 95, speed: 85 }, // Parti modu
};

const PRESETS = [
  { num: '01', name: 'New preset' },
  { num: '02', name: 'Gece lambası' },
  { num: '03', name: 'Parti modu' },
];

const TRACK_W = 280;
const DEFAULTS = { colorAngle: 30, mode: 'Adaptive', brightness: 70, speed: 40 };

function HSlider({ label, value: controlledValue = 50, onChange }) {
  const { isDark } = useTheme();
  const C = getColors(isDark);
  const [value, setValue] = useState(controlledValue);
  const currV = useRef(controlledValue);
  const startV = useRef(controlledValue);

  useEffect(() => {
    if (Math.abs(controlledValue - currV.current) > 0.01) {
      currV.current = controlledValue;
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { startV.current = currV.current; },
    onPanResponderMove: (_, g) => {
      const next = Math.max(0, Math.min(100, startV.current + (g.dx / TRACK_W) * 100));
      currV.current = next;
      setValue(next);
      onChange && onChange(next);
    },
  })).current;

  return (
    <View style={hs.row}>
      <Text style={[hs.label, { color: C.secondary }]}>{label}</Text>
      <View style={hs.trackWrapper} {...pan.panHandlers}>
        <View style={[hs.track, { backgroundColor: C.border }]} />
        <View style={[hs.fill, { backgroundColor: C.primary, width: `${value}%` }]} />
        <View style={[hs.thumb, { backgroundColor: C.primary, left: `${value}%` }]} />
      </View>
    </View>
  );
}

const hs = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  label: { ...typography.label, width: 90 },
  trackWrapper: { flex: 1, height: 16, justifyContent: 'center', position: 'relative' },
  track: { position: 'absolute', left: 0, right: 0, height: 3, borderRadius: 2 },
  fill: { position: 'absolute', left: 0, height: 3, borderRadius: 2 },
  thumb: { position: 'absolute', width: 16, height: 16, borderRadius: 8, marginLeft: -8, top: 0 },
});

export default function LightingScreen({ navigation }) {
  const { isDark } = useTheme();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const [colorAngle, setColorAngle] = useState(DEFAULTS.colorAngle);
  const [selectedColor, setSelectedColor] = useState(hslToHex(DEFAULTS.colorAngle, 90, 55));
  const [selectedMode, setSelectedMode] = useState(DEFAULTS.mode);
  const [brightness, setBrightness] = useState(DEFAULTS.brightness);
  const [speed, setSpeed] = useState(DEFAULTS.speed);
  const [activePreset, setActivePreset] = useState(null);
  const [savedNewPreset, setSavedNewPreset] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeName = PRESETS.find(p => p.num === activePreset)?.name ?? 'Özel';

  const applyState = (data) => {
    setColorAngle(data.colorAngle);
    setSelectedColor(hslToHex(data.colorAngle, 90, 55));
    setSelectedMode(data.mode);
    setBrightness(data.brightness);
    setSpeed(data.speed);
  };

  const selectPreset = (num) => {
    if (num === '01') {
      if (!savedNewPreset) return; // nothing saved yet, do nothing
      applyState(savedNewPreset);
    } else {
      applyState(PRESET_DATA[num]);
    }
    setActivePreset(num);
  };

  const save = () => {
    setSavedNewPreset({ colorAngle, mode: selectedMode, brightness, speed });
    setActivePreset('01');
  };

  const reset = () => {
    applyState(DEFAULTS);
    setActivePreset(null);
  };

  const getPresetDotColor = (num) => {
    if (num === '01') return savedNewPreset ? hslToHex(savedNewPreset.colorAngle, 90, 55) : null;
    return PRESET_DATA[num] ? hslToHex(PRESET_DATA[num].colorAngle, 90, 55) : null;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn}>
            <Svg width={14} height={15} viewBox="0 0 14 15">
              <Path d="M12 2L10 7l5-2-5-2z" fill={C.primary} />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <ProfileIcon color={C.primary} size={28} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.sectionLabel}>LIGHTING</Text>
          <Text style={styles.screenTitle}>{activeName}</Text>
        </View>

        {/* Color Wheel */}
        <View style={styles.wheelContainer}>
          <ColorWheel
            size={220}
            innerRatio={0.5}
            angle={colorAngle}
            onColorSelect={(color, angle) => {
              setSelectedColor(color);
              setColorAngle(angle);
              setActivePreset(null);
            }}
          />
          <View style={[styles.innerCircle, { backgroundColor: C.cream }]} />
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
              <Path
                d={dropdownOpen ? 'M0 4L4 0l4 4' : 'M0 0l4 4 4-4'}
                stroke={C.secondary}
                strokeWidth={1.5}
                fill="none"
              />
            </Svg>
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownMenu}>
              {MODES.map((m, i) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.dropdownItem, i < MODES.length - 1 && styles.dropdownItemBorder]}
                  onPress={() => { setSelectedMode(m); setDropdownOpen(false); setActivePreset(null); }}
                >
                  <Text style={styles.dropdownItemText}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Sliders */}
        <View style={styles.section}>
          <HSlider
            label="PARLAKLIK"
            value={brightness}
            onChange={(v) => { setBrightness(v); setActivePreset(null); }}
          />
          <HSlider
            label="HIZ"
            value={speed}
            onChange={(v) => { setSpeed(v); setActivePreset(null); }}
          />
        </View>

        {/* Preset List */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PRESETLER</Text>
          {PRESETS.map((p, i) => {
            const dotColor = getPresetDotColor(p.num);
            const isActive = activePreset === p.num;
            const isDisabled = p.num === '01' && !savedNewPreset;
            return (
              <View key={p.num}>
                <TouchableOpacity
                  style={[styles.presetRow, isActive && styles.presetRowActive]}
                  onPress={() => selectPreset(p.num)}
                  activeOpacity={isDisabled ? 1 : 0.7}
                >
                  <View style={styles.presetLeft}>
                    {dotColor
                      ? <View style={[styles.presetDot, { backgroundColor: dotColor }]} />
                      : <View style={[styles.presetDot, styles.presetDotEmpty]} />
                    }
                    <Text style={[styles.presetNum, isDisabled && styles.textDim]}>{p.num}</Text>
                    <Text style={[styles.presetName, isDisabled && styles.textDim]}>{p.name}</Text>
                  </View>
                  <Svg width={4} height={8} viewBox="0 0 4 8">
                    <Path
                      d="M0 0l4 4-4 4"
                      stroke={isActive ? C.primary : C.border}
                      strokeWidth={1.5}
                      fill="none"
                    />
                  </Svg>
                </TouchableOpacity>
                {i < PRESETS.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnFill} onPress={save}>
            <Text style={styles.btnFillText}>Kaydet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={reset}>
            <Text style={styles.btnOutlineText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (C) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  iconBtn: {
    width: 28, height: 28, backgroundColor: C.white,
    borderRadius: 8, justifyContent: 'center', alignItems: 'center',
  },
  profileBtn: {
    width: 28, height: 28,
    justifyContent: 'center', alignItems: 'center',
  },

  titleRow: { marginBottom: 20 },
  sectionLabel: { ...typography.labelMd, color: C.secondary, marginBottom: 4 },
  screenTitle: { ...typography.title, color: C.primary },

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
    borderColor: C.white,
  },

  section: { marginBottom: 20 },

  dropdown: {
    height: 32, borderRadius: 15, borderWidth: 1, borderColor: C.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  dropdownText: { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.primary },
  dropdownMenu: {
    marginTop: 4, borderRadius: 4, backgroundColor: C.cream,
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
  },
  dropdownItem: { height: 32, justifyContent: 'center', paddingHorizontal: 16 },
  dropdownItemBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  dropdownItemText: { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.primary },

  presetRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 4, borderRadius: 8,
  },
  presetRowActive: { backgroundColor: C.cardActive },
  presetLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  presetDot: { width: 10, height: 10, borderRadius: 5 },
  presetDotEmpty: { backgroundColor: C.border },
  presetNum: { ...typography.label, color: C.secondary, fontSize: 11 },
  presetName: { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.primary },
  textDim: { opacity: 0.4 },
  divider: { height: 1, backgroundColor: C.border },

  btnRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  btnFill: {
    flex: 1, height: 44, backgroundColor: C.buttonBg,
    borderRadius: 22, justifyContent: 'center', alignItems: 'center',
  },
  btnFillText: { ...typography.btnSm, color: C.buttonText },
  btnOutline: {
    flex: 1, height: 44, borderRadius: 22,
    borderWidth: 1, borderColor: C.border,
    justifyContent: 'center', alignItems: 'center',
  },
  btnOutlineText: { ...typography.btnSm, color: C.primary },
});
