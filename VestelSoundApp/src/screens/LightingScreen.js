import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  SafeAreaView, ScrollView, PanResponder, Alert,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import ColorWheel from '../components/ColorWheel';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../theme/colors';
import { typography } from '../theme/typography';

const MODES = ['Adaptive', 'Pulse', 'Rainbow', 'Static', 'Breathe'];
const PRESETS = [
  { num: '01', name: 'New preset' },
  { num: '02', name: 'Gece lambası' },
  { num: '03', name: 'Parti modu' },
];

function HSlider({ label, initialValue = 50, C }) {
  const [value, setValue] = useState(initialValue);
  const startV = useRef(initialValue);
  const currV = useRef(initialValue);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      startV.current = currV.current;
    },
    onPanResponderMove: (_, g) => {
      const next = Math.max(0, Math.min(100, startV.current + (g.dx / 220) * 100));
      currV.current = next;
      setValue(next);
    },
  })).current;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
      <Text style={{ ...typography.label, color: C.secondary, width: 90 }}>{label}</Text>
      <View style={{ flex: 1, height: 20, justifyContent: 'center', position: 'relative' }}
        {...pan.panHandlers}
      >
        <View style={{ position: 'absolute', left: 0, right: 0, height: 3, backgroundColor: C.border, borderRadius: 2 }} />
        <View style={{ position: 'absolute', left: 0, width: `${value}%`, height: 3, backgroundColor: C.primary, borderRadius: 2 }} />
        <View style={{ position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: C.primary, marginLeft: -8, top: 2, left: `${value}%` }} />
      </View>
    </View>
  );
}

export default function LightingScreen({ navigation }) {
  const { isDark } = useTheme();
  const C = getColors(isDark);
  const [selectedColor, setSelectedColor] = useState('#E86B2A');
  const [selectedMode, setSelectedMode] = useState('Adaptive');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

        {/* Top Bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <TouchableOpacity style={{ width: 28, height: 28, backgroundColor: C.white, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={14} height={15} viewBox="0 0 14 15">
              <Path d="M12 2L10 7l5-2-5-2z" fill={C.primary} />
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

        <Text style={{ ...typography.title, color: C.primary, marginBottom: 20 }}>LIGHTING</Text>

        {/* Color Wheel */}
        <View style={{ alignSelf: 'center', width: 220, height: 220, justifyContent: 'center', alignItems: 'center', marginBottom: 24, position: 'relative' }}>
          <ColorWheel size={220} innerRatio={0.5} onColorSelect={setSelectedColor} />
          <View style={{ position: 'absolute', width: 110, height: 110, borderRadius: 55, backgroundColor: C.cream, pointerEvents: 'none' }} />
          <View style={{ position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: selectedColor, borderWidth: 2, borderColor: C.white }} />
        </View>

        {/* MOD */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ ...typography.labelMd, color: C.secondary, marginBottom: 12 }}>MOD</Text>
          <TouchableOpacity
            style={{ height: 32, borderRadius: 15, borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}
            onPress={() => setDropdownOpen(o => !o)}
          >
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: C.primary }}>{selectedMode}</Text>
            <Svg width={8} height={4} viewBox="0 0 8 4">
              <Path d={dropdownOpen ? "M0 4L4 0l4 4" : "M0 0l4 4 4-4"} stroke={C.secondary} strokeWidth={1.5} fill="none" />
            </Svg>
          </TouchableOpacity>
          {dropdownOpen && (
            <View style={{ marginTop: 4, borderRadius: 4, backgroundColor: C.cream, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
              {MODES.map((m, i) => (
                <TouchableOpacity
                  key={m}
                  style={{ height: 32, justifyContent: 'center', paddingHorizontal: 16, borderBottomWidth: i < MODES.length - 1 ? 1 : 0, borderBottomColor: C.border }}
                  onPress={() => { setSelectedMode(m); setDropdownOpen(false); }}
                >
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: C.primary }}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Sliders */}
        <View style={{ marginBottom: 20 }}>
          <HSlider label="PARLAKLIK" initialValue={70} C={C} />
          <HSlider label="HIZ" initialValue={40} C={C} />
        </View>

        {/* Preset List */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ ...typography.labelMd, color: C.secondary, marginBottom: 12 }}>PRESETLER</Text>
          {PRESETS.map((p, i) => (
            <View key={p.num}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Text style={{ ...typography.label, color: C.secondary, fontSize: 11 }}>{p.num}</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: C.primary }}>{p.name}</Text>
                </View>
                <Svg width={4} height={8} viewBox="0 0 4 8">
                  <Path d="M0 0l4 4-4 4" stroke={C.border} strokeWidth={1.5} fill="none" />
                </Svg>
              </TouchableOpacity>
              {i < PRESETS.length - 1 && <View style={{ height: 1, backgroundColor: C.border }} />}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <TouchableOpacity
            style={{ flex: 1, height: 44, backgroundColor: C.buttonBg, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => Alert.alert('Kaydedildi', 'Aydınlatma ayarları kaydedildi.')}
          >
            <Text style={{ ...typography.btnSm, color: C.buttonText }}>Kaydet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, height: 44, borderRadius: 22, borderWidth: 1, borderColor: C.border, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={{ ...typography.btnSm, color: C.primary }}>Sıfırla</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
