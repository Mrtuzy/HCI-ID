import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, PanResponder,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// AI Mode icon (wand)
function AIIcon() {
  return (
    <Svg width={14} height={15} viewBox="0 0 14 15">
      <Path d="M12 2L10 7l5-2-5-2zM2 8l4 4-2 2H2v-2L0 10l2-2z" fill={colors.primary} />
    </Svg>
  );
}

// Profile icon
function ProfileIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Circle cx={11} cy={8} r={4} fill={colors.primary} />
      <Path d="M3 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={colors.primary} strokeWidth={1.5} fill="none" />
    </Svg>
  );
}

// Volume slider
function VolumeSlider({ value, onChange }) {
  const TRACK_W = 246;
  const startValue = useRef(value);
  const currentValue = useRef(value);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { startValue.current = currentValue.current; },
    onPanResponderMove: (_, g) => {
      const delta = (g.dx / TRACK_W) * 100;
      const next = Math.max(0, Math.min(100, startValue.current + delta));
      currentValue.current = next;
      onChange(next);
    },
  })).current;

  const pct = value;
  return (
    <View style={vol.row}>
      <Svg width={14} height={12} viewBox="0 0 14 12" style={{ marginRight: 12 }}>
        <Path d="M0 4h4l4-4v12l-4-4H0V4z" fill={colors.secondary} />
      </Svg>
      <View style={vol.trackWrapper}>
        <View style={vol.track} />
        <View style={[vol.fill, { width: `${pct}%` }]} />
        <View style={[vol.thumb, { left: `${pct}%` }]} {...pan.panHandlers} />
      </View>
      <Svg width={18} height={14} viewBox="0 0 18 14" style={{ marginLeft: 12 }}>
        <Path d="M0 4h4l4-4v14l-4-4H0V4z" fill={colors.secondary} />
        <Path d="M12 2c2.2 1.4 3 4 2 6.5" stroke={colors.secondary} strokeWidth={1.5} fill="none" />
        <Path d="M14 0c3 2 4 6 2 10" stroke={colors.secondary} strokeWidth={1.5} fill="none" />
      </Svg>
    </View>
  );
}

const vol = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  trackWrapper: {
    flex: 1, height: 20, justifyContent: 'center', position: 'relative',
  },
  track: {
    position: 'absolute', left: 0, right: 0,
    height: 3, backgroundColor: colors.border, borderRadius: 1.5,
  },
  fill: {
    position: 'absolute', left: 0,
    height: 3, backgroundColor: colors.primary, borderRadius: 1.5,
  },
  thumb: {
    position: 'absolute',
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.primary,
    marginLeft: -7, top: 3,
  },
});

export default function HomeScreen({ navigation }) {
  const [volume, setVolume] = useState(75);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn}>
            <AIIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <ProfileIcon />
          </TouchableOpacity>
        </View>

        {/* Speaker Info */}
        <View style={styles.speakerInfo}>
          <Text style={styles.connectedLabel}>CONNECTED</Text>
          <Text style={styles.speakerName}>Vestel Aura Speaker</Text>
        </View>

        {/* Album Art Row */}
        <View style={styles.albumRow}>
          <TouchableOpacity style={styles.arrowBtn}>
            <Svg width={6} height={12} viewBox="0 0 6 12">
              <Path d="M6 0L0 6l6 6" stroke={colors.primary} strokeWidth={1.5} fill="none" />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.albumArt}
            onPress={() => navigation.navigate('NowPlaying')}
            activeOpacity={0.9}
          >
            <Svg width={80} height={80} viewBox="0 0 80 80" opacity={0.12}>
              <Circle cx={40} cy={40} r={38} stroke={colors.primary} strokeWidth={2} fill="none" />
              <Circle cx={40} cy={40} r={24} stroke={colors.primary} strokeWidth={2} fill="none" />
              <Circle cx={40} cy={40} r={8} fill={colors.primary} />
              <Path d="M34 28v24l20-12-20-12z" fill={colors.primary} />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity style={styles.arrowBtn}>
            <Svg width={6} height={12} viewBox="0 0 6 12">
              <Path d="M0 0l6 6-6 6" stroke={colors.primary} strokeWidth={1.5} fill="none" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Volume Block */}
        <View style={styles.volumeBlock}>
          {/* Volume Knob Card */}
          <View style={styles.volumeKnob}>
            <Svg width={100} height={60} viewBox="0 0 100 60">
              {/* Semicircle arc background */}
              <Path
                d="M10 55 A40 40 0 0 1 90 55"
                stroke={colors.border}
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
              />
              {/* Semicircle arc filled */}
              <Path
                d="M10 55 A40 40 0 0 1 90 55"
                stroke={colors.primary}
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(volume / 100) * 126} 126`}
              />
            </Svg>
            <View style={styles.knobTextContainer}>
              <Text style={styles.knobValue}>{Math.round(volume)}</Text>
              <Text style={styles.knobUnit}>%</Text>
            </View>
            <Text style={styles.batteryLabel}>Battery Level</Text>
          </View>

          {/* Volume Slider */}
          <View style={styles.volumeSliderRow}>
            <VolumeSlider value={volume} onChange={setVolume} />
          </View>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBtn: {
    width: 28, height: 28,
    backgroundColor: colors.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  speakerInfo: { marginBottom: 24 },
  connectedLabel: {
    ...typography.labelMd,
    color: colors.secondary,
    marginBottom: 4,
  },
  speakerName: {
    ...typography.title,
    color: colors.primary,
  },

  albumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  arrowBtn: {
    width: 20, height: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumArt: {
    width: 240, height: 240,
    backgroundColor: colors.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  volumeBlock: {
    alignItems: 'center',
    gap: 20,
  },
  volumeKnob: {
    width: 140,
    height: 80,
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    position: 'relative',
  },
  knobTextContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'baseline',
    top: 22,
  },
  knobValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 20,
    color: colors.primary,
  },
  knobUnit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: colors.secondary,
    marginLeft: 2,
  },
  batteryLabel: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: 4,
    position: 'absolute',
    bottom: 8,
  },
  volumeSliderRow: {
    width: '100%',
    paddingHorizontal: 4,
  },
});
