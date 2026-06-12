import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, PanResponder,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const DARK = {
  bg: '#0A0A0A',
  card: '#1E1B18',
  text: '#F2EDE4',
  dim: '#8C857A',
};

const TOTAL_SEC = 180;

function formatTime(pct) {
  const sec = Math.floor(pct * TOTAL_SEC);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

function ProgressBar({ progress, onChange }) {
  const trackW = useRef(0);
  const startP = useRef(progress);
  const currP = useRef(progress);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      if (trackW.current > 0) {
        const tap = Math.max(0, Math.min(1, e.nativeEvent.locationX / trackW.current));
        currP.current = tap;
        startP.current = tap;
        onChange(tap);
      } else {
        startP.current = currP.current;
      }
    },
    onPanResponderMove: (_, g) => {
      if (!trackW.current) return;
      const next = Math.max(0, Math.min(1, startP.current + g.dx / trackW.current));
      currP.current = next;
      onChange(next);
    },
  })).current;

  return (
    <View style={s.progressSection}>
      <View
        style={s.progressTrack}
        onLayout={e => { trackW.current = e.nativeEvent.layout.width; }}
        {...pan.panHandlers}
      >
        <View style={s.progressBg} />
        <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
        <View style={[s.progressThumb, { left: `${progress * 100}%` }]} />
      </View>
      <View style={s.timeRow}>
        <Text style={s.timeText}>{formatTime(progress)}</Text>
        <Text style={s.timeText}>3:00</Text>
      </View>
    </View>
  );
}

function VolumeBar({ value, onChange }) {
  const trackW = useRef(0);
  const startV = useRef(value);
  const currV = useRef(value);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      if (trackW.current > 0) {
        const tap = Math.max(0, Math.min(100, (e.nativeEvent.locationX / trackW.current) * 100));
        currV.current = tap;
        startV.current = tap;
        onChange(tap);
      } else {
        startV.current = currV.current;
      }
    },
    onPanResponderMove: (_, g) => {
      if (!trackW.current) return;
      const next = Math.max(0, Math.min(100, startV.current + (g.dx / trackW.current) * 100));
      currV.current = next;
      onChange(next);
    },
  })).current;

  return (
    <View style={s.volumeSection}>
      <Svg width={16} height={12} viewBox="0 0 16 12">
        <Path d="M0 4h4l4-4v12l-4-4H0V4z" fill={DARK.dim} />
      </Svg>
      <View
        style={s.volumeTrack}
        onLayout={e => { trackW.current = e.nativeEvent.layout.width; }}
        {...pan.panHandlers}
      >
        <View style={s.volumeBg} />
        <View style={[s.volumeFill, { width: `${value}%` }]} />
        <View style={[s.volumeThumb, { left: `${value}%` }]} />
      </View>
      <Svg width={20} height={14} viewBox="0 0 20 14">
        <Path d="M0 4h4l4-4v14l-4-4H0V4z" fill={DARK.dim} />
        <Path d="M12 2c2.5 1.5 3 4.5 2 7" stroke={DARK.dim} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        <Path d="M15 0c3.5 2.5 4 7 2 11" stroke={DARK.dim} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

export default function NowPlayingScreen({ navigation }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0.35);
  const [volume, setVolume] = useState(60);
  const [clock, setClock] = useState('');
  const progressRef = useRef(0.35);

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setClock(`${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      const next = Math.min(1, progressRef.current + 1 / TOTAL_SEC);
      progressRef.current = next;
      setProgress(next);
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying]);

  const handleProgressChange = (v) => {
    progressRef.current = v;
    setProgress(v);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.closeBtn} onPress={() => navigation.goBack()}>
          <Svg width={14} height={9} viewBox="0 0 14 9">
            <Path d="M1 1.5l6 6 6-6" stroke={DARK.text} strokeWidth={1.8} strokeLinecap="round" fill="none" />
          </Svg>
        </TouchableOpacity>
        <Text style={s.label}>VESTEL MÜZİK</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Clock */}
      <View style={s.clockSection}>
        <Text style={s.clock}>{clock || '00:00'}</Text>
        <View style={s.clockLine} />
      </View>

      {/* Track Info */}
      <View style={s.trackInfo}>
        <View style={s.artwork}>
          <Svg width={26} height={26} viewBox="0 0 26 26">
            <Circle cx={13} cy={13} r={11} stroke={DARK.dim} strokeWidth={1.5} fill="none" />
            <Circle cx={13} cy={13} r={4} fill={DARK.dim} />
            <Path d="M11 8v10l8-5-8-5z" fill={DARK.dim} />
          </Svg>
        </View>
        <View style={s.trackMeta}>
          <Text style={s.trackTitle}>Bluetooth Akışı</Text>
          <Text style={s.trackArtist}>Vestel Home Speaker</Text>
        </View>
        <TouchableOpacity style={s.heartBtn}>
          <Svg width={22} height={20} viewBox="0 0 22 20">
            <Path
              d="M11 18.5C5.5 14.5 1 10.8 1 6.8A5.1 5.1 0 0111 4a5.1 5.1 0 0110 2.8c0 4-4.5 7.7-10 11.7z"
              stroke={DARK.dim} strokeWidth={1.5} fill="none"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <ProgressBar progress={progress} onChange={handleProgressChange} />

      {/* Controls */}
      <View style={s.controls}>
        {/* Shuffle */}
        <TouchableOpacity style={s.ctrlBtn}>
          <Svg width={22} height={16} viewBox="0 0 22 16">
            <Path d="M1 1h4l11 14h4M16 1h4l-6 7" stroke={DARK.dim} strokeWidth={1.5} strokeLinecap="round" fill="none" />
            <Path d="M1 15h4l3-4" stroke={DARK.dim} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          </Svg>
        </TouchableOpacity>

        {/* Prev */}
        <TouchableOpacity style={s.ctrlBtn} onPress={() => { progressRef.current = 0; setProgress(0); }}>
          <Svg width={26} height={22} viewBox="0 0 26 22">
            <Path d="M22 1L8 11l14 10V1z" fill={DARK.text} />
            <Rect x={3} y={1} width={3} height={20} rx={1.5} fill={DARK.text} />
          </Svg>
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity style={s.playBtn} onPress={() => setIsPlaying(p => !p)}>
          <Svg width={30} height={30} viewBox="0 0 30 30">
            {isPlaying ? (
              <>
                <Rect x={8} y={7} width={4.5} height={16} rx={2} fill={DARK.bg} />
                <Rect x={17.5} y={7} width={4.5} height={16} rx={2} fill={DARK.bg} />
              </>
            ) : (
              <Path d="M9 5v20l17-10L9 5z" fill={DARK.bg} />
            )}
          </Svg>
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity style={s.ctrlBtn} onPress={() => { progressRef.current = 0; setProgress(0); }}>
          <Svg width={26} height={22} viewBox="0 0 26 22">
            <Path d="M4 1l14 10L4 21V1z" fill={DARK.text} />
            <Rect x={20} y={1} width={3} height={20} rx={1.5} fill={DARK.text} />
          </Svg>
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity style={s.ctrlBtn}>
          <Svg width={22} height={18} viewBox="0 0 22 18">
            <Path d="M4 4h14a3 3 0 013 3v4a3 3 0 01-3 3H4" stroke={DARK.dim} strokeWidth={1.5} fill="none" strokeLinecap="round" />
            <Path d="M7 1L4 4l3 3" stroke={DARK.dim} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Volume */}
      <VolumeBar value={volume} onChange={setVolume} />

      {/* Bottom row */}
      <View style={s.bottomRow}>
        <TouchableOpacity style={s.ctrlBtn}>
          <Svg width={20} height={20} viewBox="0 0 20 20">
            <Circle cx={16} cy={4} r={3} stroke={DARK.dim} strokeWidth={1.5} fill="none" />
            <Circle cx={16} cy={16} r={3} stroke={DARK.dim} strokeWidth={1.5} fill="none" />
            <Circle cx={4} cy={10} r={3} stroke={DARK.dim} strokeWidth={1.5} fill="none" />
            <Path d="M13.5 5.5l-7.5 3.5M6 11l7.5 3.5" stroke={DARK.dim} strokeWidth={1.2} />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity style={s.ctrlBtn}>
          <Svg width={20} height={18} viewBox="0 0 20 18">
            <Rect x={1} y={1} width={18} height={16} rx={3} stroke={DARK.dim} strokeWidth={1.5} fill="none" />
            <Path d="M5 6h10M5 9h7M5 12h8" stroke={DARK.dim} strokeWidth={1.2} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity style={s.ctrlBtn}>
          <Svg width={20} height={4} viewBox="0 0 20 4">
            <Circle cx={2} cy={2} r={2} fill={DARK.dim} />
            <Circle cx={10} cy={2} r={2} fill={DARK.dim} />
            <Circle cx={18} cy={2} r={2} fill={DARK.dim} />
          </Svg>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DARK.bg, paddingHorizontal: 28 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 8, marginBottom: 4,
  },
  closeBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  label: {
    fontFamily: 'Inter_500Medium', fontSize: 11,
    color: DARK.dim, letterSpacing: 2, textTransform: 'uppercase',
  },
  clockSection: { alignItems: 'center', marginTop: 18, marginBottom: 24 },
  clock: { fontFamily: 'Inter_400Regular', fontSize: 68, color: DARK.text, letterSpacing: -2 },
  clockLine: { width: 40, height: 1, backgroundColor: DARK.dim, marginTop: 10, opacity: 0.4 },
  trackInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  artwork: {
    width: 52, height: 52, borderRadius: 12,
    backgroundColor: DARK.card, justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  trackMeta: { flex: 1 },
  trackTitle: { fontFamily: 'Inter_500Medium', fontSize: 16, color: DARK.text, marginBottom: 3 },
  trackArtist: { fontFamily: 'Inter_400Regular', fontSize: 12, color: DARK.dim },
  heartBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },

  progressSection: { marginBottom: 24 },
  progressTrack: {
    height: 22, justifyContent: 'center', position: 'relative',
  },
  progressBg: {
    position: 'absolute', left: 0, right: 0, height: 3,
    backgroundColor: DARK.card, borderRadius: 2,
  },
  progressFill: {
    position: 'absolute', left: 0, height: 3,
    backgroundColor: DARK.text, borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute', width: 14, height: 14, borderRadius: 7,
    backgroundColor: DARK.text, marginLeft: -7, top: 4,
  },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  timeText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: DARK.dim },

  controls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24,
  },
  ctrlBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  playBtn: {
    width: 66, height: 66, borderRadius: 33,
    backgroundColor: DARK.text, justifyContent: 'center', alignItems: 'center',
  },

  volumeSection: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24,
  },
  volumeTrack: { flex: 1, height: 22, justifyContent: 'center', position: 'relative' },
  volumeBg: {
    position: 'absolute', left: 0, right: 0, height: 3,
    backgroundColor: DARK.card, borderRadius: 2,
  },
  volumeFill: {
    position: 'absolute', left: 0, height: 3,
    backgroundColor: DARK.text, borderRadius: 2, opacity: 0.7,
  },
  volumeThumb: {
    position: 'absolute', width: 14, height: 14, borderRadius: 7,
    backgroundColor: DARK.text, marginLeft: -7, top: 4,
  },

  bottomRow: { flexDirection: 'row', justifyContent: 'space-around' },
});
