import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import VerticalSlider from '../components/VerticalSlider';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../theme/colors';
import { typography } from '../theme/typography';

const EQ_BANDS = ['63', '125', '250', '500', '1K', '4K', '16K'];
const INITIAL_EQ = [4, 2, 0, -2, 3, 5, 2];

const PRESETS = [
  { num: '01', name: 'Bass Boost' },
  { num: '02', name: 'Vokal' },
  { num: '03', name: 'Akustik' },
  { num: '04', name: 'Custom' },
];

const PRESET_VALUES = {
  '01': [9, 7, 4, 0, -1, 2, 3],
  '02': [-2, 0, 3, 6, 5, 2, 0],
  '03': [3, 5, 3, 1, 2, 3, 2],
  '04': [...INITIAL_EQ],
};

export default function EqualizerScreen({ navigation }) {
  const { isDark } = useTheme();
  const C = getColors(isDark);
  const [eqValues, setEqValues] = useState([...INITIAL_EQ]);
  const [activePreset, setActivePreset] = useState(null);

  const updateBand = (i, v) => {
    const next = [...eqValues];
    next[i] = v;
    setEqValues(next);
  };

  const loadPreset = (num) => {
    setActivePreset(num);
    setEqValues([...PRESET_VALUES[num]]);
  };

  const reset = () => {
    setActivePreset(null);
    setEqValues(new Array(7).fill(0));
  };

  const save = () => {
    Alert.alert('Kaydedildi', `EQ ayarları kaydedildi${activePreset ? ` (${PRESETS.find(p => p.num === activePreset)?.name})` : ''}.`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>

        {/* Top Bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <TouchableOpacity style={{ width: 28, height: 28, backgroundColor: C.white, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={14} height={15} viewBox="0 0 14 15">
              <Path d="M12 2L10 7l5-2-5-2zM2 8l4 4-2 2H2v-2L0 10l2-2z" fill={C.primary} />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 28, height: 28, backgroundColor: C.white, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.navigate('Settings')}
          >
            <Svg width={22} height={22} viewBox="0 0 22 22">
              <Circle cx={11} cy={8} r={4} fill={C.primary} />
              <Path d="M3 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={C.primary} strokeWidth={1.5} fill="none" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ ...typography.labelMd, color: C.secondary, marginBottom: 4 }}>EQUALIZER</Text>
          <Text style={{ ...typography.title, color: C.primary }}>
            {activePreset ? PRESETS.find(p => p.num === activePreset)?.name : 'Custom'}
          </Text>
        </View>

        {/* EQ Sliders */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 8 }}>
          {EQ_BANDS.map((band, i) => (
            <View key={band} style={{ alignItems: 'center', gap: 8 }}>
              <VerticalSlider
                key={`${band}-${activePreset}`}
                initialValue={eqValues[i]}
                onChange={(v) => updateBand(i, v)}
              />
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: C.secondary }}>{band}</Text>
            </View>
          ))}
        </View>

        {/* Center line */}
        <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: 4, marginBottom: 16, opacity: 0.6 }} />

        {/* Presets */}
        <View style={{ flex: 1 }}>
          <Text style={{ ...typography.labelMd, color: C.secondary, marginBottom: 8 }}>PRESETLER</Text>
          {PRESETS.map((p, i) => (
            <View key={p.num}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 }}
                onPress={() => loadPreset(p.num)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Text style={{ ...typography.label, color: C.secondary, fontSize: 11 }}>{p.num}</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: activePreset === p.num ? C.primary : C.textSecondary }}>
                    {p.name}
                  </Text>
                </View>
                <Svg width={4} height={8} viewBox="0 0 4 8">
                  <Path d="M0 0l4 4-4 4" stroke={activePreset === p.num ? C.primary : C.border} strokeWidth={1.5} fill="none" />
                </Svg>
              </TouchableOpacity>
              {i < PRESETS.length - 1 && <View style={{ height: 1, backgroundColor: C.border }} />}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 24, paddingTop: 12, gap: 12 }}>
          <TouchableOpacity
            style={{ width: 171, height: 44, backgroundColor: C.buttonBg, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }}
            onPress={save}
          >
            <Text style={{ ...typography.btnSm, color: C.buttonText }}>Kaydet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 171, height: 44, borderRadius: 22, borderWidth: 1, borderColor: C.border, justifyContent: 'center', alignItems: 'center' }}
            onPress={reset}
          >
            <Text style={{ ...typography.btnSm, color: C.primary }}>Sıfırla</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
