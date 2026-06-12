import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  SafeAreaView, ScrollView, PanResponder,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../theme/colors';
import { typography } from '../theme/typography';

function ProfileAvatar({ C }) {
  return (
    <View style={{
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: C.primary,
      justifyContent: 'center', alignItems: 'center',
    }}>
      <Svg width={18} height={19} viewBox="0 0 18 19">
        <Circle cx={9} cy={6} r={4} fill={C.cream} />
        <Path d="M1 18c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={C.cream} strokeWidth={1.5} fill="none" />
      </Svg>
    </View>
  );
}

function WatchIcon({ C }) {
  return (
    <Svg width={16} height={18} viewBox="0 0 16 18">
      <Rect x={3} y={4} width={10} height={10} rx={5} stroke={C.primary} strokeWidth={1.5} fill="none" />
      <Rect x={5} y={0} width={6} height={4} rx={1} stroke={C.primary} strokeWidth={1} fill="none" />
      <Rect x={5} y={14} width={6} height={4} rx={1} stroke={C.primary} strokeWidth={1} fill="none" />
      <Path d="M8 7v2l1.5 1" stroke={C.primary} strokeWidth={1.2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function VolumeSlider({ value, onChange, C }) {
  const TRACK_W = 260;
  const startValue = useRef(value);
  const currentValue = useRef(value);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      startValue.current = currentValue.current;
    },
    onPanResponderMove: (_, g) => {
      const delta = (g.dx / TRACK_W) * 100;
      const next = Math.max(0, Math.min(100, startValue.current + delta));
      currentValue.current = next;
      onChange(next);
    },
  })).current;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Svg width={16} height={14} viewBox="0 0 16 14" style={{ marginRight: 10 }}>
        <Path d="M0 4h4l4-4v14l-4-4H0V4z" fill={C.secondary} />
      </Svg>
      <View style={{ flex: 1, height: 22, justifyContent: 'center', position: 'relative' }}
        {...pan.panHandlers}
      >
        <View style={{ position: 'absolute', left: 0, right: 0, height: 3, backgroundColor: C.border, borderRadius: 1.5 }} />
        <View style={{ position: 'absolute', left: 0, width: `${value}%`, height: 3, backgroundColor: C.primary, borderRadius: 1.5 }} />
        <View style={{
          position: 'absolute', width: 16, height: 16, borderRadius: 8,
          backgroundColor: C.primary, marginLeft: -8, top: 3,
          left: `${value}%`,
        }} />
      </View>
      <Svg width={20} height={14} viewBox="0 0 20 14" style={{ marginLeft: 10 }}>
        <Path d="M0 4h4l4-4v14l-4-4H0V4z" fill={C.secondary} />
        <Path d="M12 2c2.5 1.5 3.5 4.5 2 7.5" stroke={C.secondary} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        <Path d="M15 0c3.5 2.5 4.5 7 2 11" stroke={C.secondary} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

const BATTERY_SEMICIRCLE_LEN = 141.4; // π * 45

export default function HomeScreen({ navigation }) {
  const { isDark } = useTheme();
  const C = getColors(isDark);
  const [volume, setVolume] = useState(75);
  const battery = 80;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} activeOpacity={0.7}>
            <ProfileAvatar C={C} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 32, height: 32, backgroundColor: C.white,
              borderRadius: 10, justifyContent: 'center', alignItems: 'center',
            }}
            onPress={() => navigation.navigate('Watch')}
            activeOpacity={0.7}
          >
            <WatchIcon C={C} />
          </TouchableOpacity>
        </View>

        {/* Speaker Info */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ ...typography.labelMd, color: C.secondary, marginBottom: 4 }}>CONNECTED</Text>
          <Text style={{ ...typography.title, color: C.primary }}>Vestel Aura Speaker</Text>
        </View>

        {/* Album Art Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <TouchableOpacity style={{
            width: 24, height: 24, backgroundColor: C.white,
            borderRadius: 12, justifyContent: 'center', alignItems: 'center',
          }}>
            <Svg width={6} height={12} viewBox="0 0 6 12">
              <Path d="M6 0L0 6l6 6" stroke={C.primary} strokeWidth={1.5} fill="none" />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: 240, height: 240, backgroundColor: C.white, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.navigate('NowPlaying')}
            activeOpacity={0.9}
          >
            <Svg width={90} height={90} viewBox="0 0 90 90" opacity={0.15}>
              <Circle cx={45} cy={45} r={42} stroke={C.primary} strokeWidth={2} fill="none" />
              <Circle cx={45} cy={45} r={26} stroke={C.primary} strokeWidth={2} fill="none" />
              <Circle cx={45} cy={45} r={9} fill={C.primary} />
              <Path d="M38 30v30l24-15-24-15z" fill={C.primary} />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity style={{
            width: 24, height: 24, backgroundColor: C.white,
            borderRadius: 12, justifyContent: 'center', alignItems: 'center',
          }}>
            <Svg width={6} height={12} viewBox="0 0 6 12">
              <Path d="M0 0l6 6-6 6" stroke={C.primary} strokeWidth={1.5} fill="none" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Battery Level Card — half-moon arc */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={{
            width: 170, height: 110, backgroundColor: C.white,
            borderRadius: 18, justifyContent: 'center', alignItems: 'center',
            borderWidth: 1, borderColor: C.border,
          }}>
            {/* Semicircle arc */}
            <Svg width={130} height={75} viewBox="0 0 130 75" style={{ position: 'absolute', top: 8 }}>
              {/* background arc */}
              <Path
                d="M15 68 A50 50 0 0 1 115 68"
                stroke={C.border}
                strokeWidth={8}
                fill="none"
                strokeLinecap="round"
              />
              {/* filled arc = battery % */}
              <Path
                d="M15 68 A50 50 0 0 1 115 68"
                stroke={battery > 20 ? C.primary : '#B5562B'}
                strokeWidth={8}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(battery / 100) * BATTERY_SEMICIRCLE_LEN} ${BATTERY_SEMICIRCLE_LEN}`}
              />
            </Svg>
            {/* value text */}
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 26, color: C.primary }}>{battery}</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: C.secondary, marginLeft: 1 }}>%</Text>
            </View>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: C.secondary, marginTop: 2 }}>
              Battery Level
            </Text>
          </View>
        </View>

        {/* Volume Slider */}
        <View>
          <Text style={{ ...typography.labelMd, color: C.secondary, marginBottom: 12, textAlign: 'center' }}>
            SES SEVİYESİ · {Math.round(volume)}%
          </Text>
          <VolumeSlider value={volume} onChange={setVolume} C={C} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
