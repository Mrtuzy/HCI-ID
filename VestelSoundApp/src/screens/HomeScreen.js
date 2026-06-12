import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, PanResponder, Modal,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import ProfileIcon from '../components/ProfileIcon';
import { getColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';

const SONGS = [
  {
    id: 1, title: 'Midnight Waves', artist: 'Luna Echo',
    duration: '3:42', durationSecs: 222,
    bgColor: '#2C1810', accentColor: '#B5562B',
  },
  {
    id: 2, title: 'Golden Hour', artist: 'Solar Drift',
    duration: '4:15', durationSecs: 255,
    bgColor: '#1A130A', accentColor: '#C9A86C',
  },
  {
    id: 3, title: 'Neon Pulse', artist: 'Circuit Mind',
    duration: '3:28', durationSecs: 208,
    bgColor: '#0A1520', accentColor: '#4A90D9',
  },
  {
    id: 4, title: 'Desert Rain', artist: 'Mirage Sound',
    duration: '5:01', durationSecs: 301,
    bgColor: '#12100A', accentColor: '#8B7355',
  },
];

function fmt(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function AlbumArt({ song, size = 240 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={0} y={0} width={size} height={size} fill={song.bgColor} rx={size > 100 ? 12 : 8} />
      <Circle cx={cx} cy={cy} r={r * 0.76} fill={song.accentColor} opacity={0.1} />
      <Circle cx={cx} cy={cy} r={r * 0.58} fill={song.accentColor} opacity={0.18} />
      <Circle cx={cx} cy={cy} r={r * 0.4} fill={song.accentColor} opacity={0.28} />
      <Circle cx={cx} cy={cy} r={r * 0.46} stroke={song.accentColor} strokeWidth={0.7} fill="none" opacity={0.2} />
      <Circle cx={cx} cy={cy} r={r * 0.34} stroke={song.accentColor} strokeWidth={0.7} fill="none" opacity={0.35} />
      <Circle cx={cx} cy={cy} r={r * 0.22} fill={song.accentColor} opacity={0.65} />
      <Circle cx={cx} cy={cy} r={r * 0.08} fill={song.accentColor} />
    </Svg>
  );
}

function AIIcon({ color }) {
  return (
    <Svg width={14} height={15} viewBox="0 0 14 15">
      <Path d="M12 2L10 7l5-2-5-2zM2 8l4 4-2 2H2v-2L0 10l2-2z" fill={color} />
    </Svg>
  );
}

function VolumeSlider({ value, onChange }) {
  const { isDark } = useTheme();
  const C = getColors(isDark);
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

  currentValue.current = value;
  return (
    <View style={vol.row}>
      <Svg width={14} height={12} viewBox="0 0 14 12" style={{ marginRight: 12 }}>
        <Path d="M0 4h4l4-4v12l-4-4H0V4z" fill={C.secondary} />
      </Svg>
      <View style={vol.trackWrapper}>
        <View style={[vol.track, { backgroundColor: C.border }]} />
        <View style={[vol.fill, { backgroundColor: C.primary, width: `${value}%` }]} />
        <View style={[vol.thumb, { backgroundColor: C.primary, left: `${value}%` }]} {...pan.panHandlers} />
      </View>
      <Svg width={18} height={14} viewBox="0 0 18 14" style={{ marginLeft: 12 }}>
        <Path d="M0 4h4l4-4v14l-4-4H0V4z" fill={C.secondary} />
        <Path d="M12 2c2.2 1.4 3 4 2 6.5" stroke={C.secondary} strokeWidth={1.5} fill="none" />
        <Path d="M14 0c3 2 4 6 2 10" stroke={C.secondary} strokeWidth={1.5} fill="none" />
      </Svg>
    </View>
  );
}

const vol = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  trackWrapper: { flex: 1, height: 20, justifyContent: 'center', position: 'relative' },
  track: { position: 'absolute', left: 0, right: 0, height: 3, borderRadius: 1.5 },
  fill: { position: 'absolute', left: 0, height: 3, borderRadius: 1.5 },
  thumb: { position: 'absolute', width: 14, height: 14, borderRadius: 7, marginLeft: -7, top: 3 },
});

function ProgressSlider({ value, onChange }) {
  const trackWidth = useRef(280);
  const startValue = useRef(value);
  const currentValue = useRef(value);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { startValue.current = currentValue.current; },
    onPanResponderMove: (_, g) => {
      const delta = g.dx / trackWidth.current;
      const next = Math.max(0, Math.min(1, startValue.current + delta));
      currentValue.current = next;
      onChange(next);
    },
  })).current;

  currentValue.current = value;
  return (
    <View
      style={prog.wrapper}
      onLayout={e => { trackWidth.current = e.nativeEvent.layout.width; }}
    >
      <View style={prog.track}>
        <View style={[prog.fill, { width: `${value * 100}%` }]} />
        <View style={[prog.thumb, { left: `${value * 100}%` }]} {...pan.panHandlers} />
      </View>
    </View>
  );
}

const prog = StyleSheet.create({
  wrapper: { width: '100%', paddingVertical: 10 },
  track: { height: 3, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 2, position: 'relative' },
  fill: { height: 3, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 2 },
  thumb: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFFFFF', top: -5.5, marginLeft: -7 },
});

export default function HomeScreen({ navigation }) {
  const { isDark } = useTheme();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const [volume, setVolume] = useState(75);
  const [battery] = useState(78);
  const [currentSong, setCurrentSong] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0=off 1=all 2=one
  const [progress, setProgress] = useState(0);
  const [likedSongs, setLikedSongs] = useState(new Set());

  // Refs so the interval callback always sees current values
  const shuffleRef = useRef(false);
  const repeatRef = useRef(0);
  const songIdxRef = useRef(0);
  useEffect(() => { shuffleRef.current = isShuffle; }, [isShuffle]);
  useEffect(() => { repeatRef.current = repeatMode; }, [repeatMode]);
  useEffect(() => { songIdxRef.current = currentSong; }, [currentSong]);

  const song = SONGS[currentSong];
  const isLiked = likedSongs.has(song.id);

  // Auto-advance progress while playing
  useEffect(() => {
    if (!isPlaying) return;
    const tick = 1 / (song.durationSecs * 2);
    const id = setInterval(() => {
      setProgress(p => {
        if (p + tick >= 1) {
          // Schedule song-end logic outside of state setter
          setTimeout(() => {
            const mode = repeatRef.current;
            const shuffle = shuffleRef.current;
            const idx = songIdxRef.current;
            if (mode === 2) {
              setProgress(0);
            } else {
              const next = shuffle
                ? Math.floor(Math.random() * SONGS.length)
                : (idx + 1) % SONGS.length;
              setCurrentSong(next);
              setProgress(0);
              if (mode === 0 && idx === SONGS.length - 1 && !shuffle) {
                setIsPlaying(false);
              }
            }
          }, 0);
          return 1;
        }
        return p + tick;
      });
    }, 500);
    return () => clearInterval(id);
  }, [isPlaying, currentSong]); // eslint-disable-line react-hooks/exhaustive-deps

  const skipForward = () => {
    const next = shuffleRef.current
      ? Math.floor(Math.random() * SONGS.length)
      : (currentSong + 1) % SONGS.length;
    setCurrentSong(next);
    setProgress(0);
  };

  const skipBackward = () => {
    if (progress > 0.05) {
      setProgress(0);
    } else {
      setCurrentSong((currentSong - 1 + SONGS.length) % SONGS.length);
      setProgress(0);
    }
  };

  const toggleLike = () => {
    setLikedSongs(prev => {
      const next = new Set(prev);
      if (next.has(song.id)) next.delete(song.id);
      else next.add(song.id);
      return next;
    });
  };

  const repeatIconColors = [
    'rgba(255,255,255,0.3)',
    'rgba(255,255,255,0.9)',
    '#B5562B',
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn}><AIIcon color={C.primary} /></TouchableOpacity>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Settings')}>
            <ProfileIcon color={C.primary} size={28} />
          </TouchableOpacity>
        </View>

        {/* Speaker Info */}
        <View style={styles.speakerInfo}>
          <Text style={styles.connectedLabel}>CONNECTED</Text>
          <Text style={styles.speakerName}>Vestel Aura Speaker</Text>
        </View>

        {/* Album Art Row */}
        <View style={styles.albumRow}>
          <TouchableOpacity style={styles.arrowBtn} onPress={skipBackward}>
            <Svg width={6} height={12} viewBox="0 0 6 12">
              <Path d="M6 0L0 6l6 6" stroke={C.primary} strokeWidth={1.5} fill="none" />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.albumArt}
            onPress={() => setShowPlayer(true)}
            activeOpacity={0.9}
          >
            <AlbumArt song={song} size={240} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.arrowBtn} onPress={skipForward}>
            <Svg width={6} height={12} viewBox="0 0 6 12">
              <Path d="M0 0l6 6-6 6" stroke={C.primary} strokeWidth={1.5} fill="none" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Song Info */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{song.title}</Text>
          <Text style={styles.songArtist}>{song.artist}</Text>
        </View>

        {/* Volume Block */}
        <View style={styles.volumeBlock}>
          <View style={styles.batteryCard}>
            <Svg width={100} height={60} viewBox="0 0 100 60">
              <Path
                d="M10 55 A40 40 0 0 1 90 55"
                stroke={C.border}
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M10 55 A40 40 0 0 1 90 55"
                stroke={C.primary}
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(battery / 100) * 126} 126`}
              />
            </Svg>
            <View style={styles.batteryValueRow}>
              <Text style={styles.knobValue}>{Math.round(battery)}</Text>
              <Text style={styles.knobUnit}>%</Text>
            </View>
            <Text style={styles.batteryLabel}>Battery Level</Text>
          </View>

          <View style={styles.volumeSliderRow}>
            <VolumeSlider value={volume} onChange={setVolume} />
          </View>
        </View>

      </ScrollView>

      {/* Player Panel */}
      <Modal
        visible={showPlayer}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPlayer(false)}
      >
        <View style={panel.overlay}>
          <View style={panel.sheet}>
            {/* Drag Handle */}
            <View style={panel.handle} />

            {/* Header */}
            <View style={panel.header}>
              <Text style={panel.headerTitle}>NOW PLAYING</Text>
              <TouchableOpacity
                onPress={() => setShowPlayer(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            </View>

            {/* Track Row: art + meta + like */}
            <View style={panel.trackRow}>
              <View style={panel.artWrapper}>
                <AlbumArt song={song} size={64} />
              </View>
              <View style={panel.trackMeta}>
                <Text style={panel.trackTitle} numberOfLines={1}>{song.title}</Text>
                <Text style={panel.trackArtist}>{song.artist}</Text>
              </View>
              <TouchableOpacity
                onPress={toggleLike}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isLiked ? '#FF4D6D' : 'rgba(255,255,255,0.35)'}
                />
              </TouchableOpacity>
            </View>

            {/* Progress Slider */}
            <View style={panel.progressSection}>
              <ProgressSlider value={progress} onChange={setProgress} />
              <View style={panel.timeRow}>
                <Text style={panel.timeText}>{fmt(progress * song.durationSecs)}</Text>
                <Text style={panel.timeText}>{song.duration}</Text>
              </View>
            </View>

            {/* Playback Controls */}
            <View style={panel.controls}>
              <TouchableOpacity
                style={panel.controlBtn}
                onPress={() => setIsShuffle(s => !s)}
              >
                <Ionicons
                  name="shuffle"
                  size={22}
                  color={isShuffle ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
                />
              </TouchableOpacity>

              <TouchableOpacity style={panel.controlBtn} onPress={skipBackward}>
                <Ionicons name="play-skip-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity style={panel.playBtn} onPress={() => setIsPlaying(p => !p)}>
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={32}
                  color="#1C1817"
                />
              </TouchableOpacity>

              <TouchableOpacity style={panel.controlBtn} onPress={skipForward}>
                <Ionicons name="play-skip-forward" size={28} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={panel.controlBtn}
                onPress={() => setRepeatMode(m => (m + 1) % 3)}
              >
                <View>
                  <Ionicons
                    name={repeatMode === 0 ? 'repeat-outline' : 'repeat'}
                    size={22}
                    color={repeatIconColors[repeatMode]}
                  />
                  {repeatMode === 2 && <Text style={panel.repeatOneLabel}>1</Text>}
                </View>
              </TouchableOpacity>
            </View>

            {/* Queue */}
            <Text style={panel.queueLabel}>QUEUE</Text>
            <ScrollView style={panel.songList} showsVerticalScrollIndicator={false}>
              {SONGS.map((s, i) => (
                <TouchableOpacity
                  key={s.id}
                  style={[panel.songRow, i === currentSong && panel.songRowActive]}
                  onPress={() => { setCurrentSong(i); setProgress(0); }}
                  activeOpacity={0.7}
                >
                  <View style={panel.songArtSmall}>
                    <AlbumArt song={s} size={44} />
                  </View>
                  <View style={panel.songMeta}>
                    <Text
                      style={[panel.songRowTitle, i === currentSong && panel.songRowTitleActive]}
                      numberOfLines={1}
                    >
                      {s.title}
                    </Text>
                    <Text style={panel.songRowArtist}>{s.artist}</Text>
                  </View>
                  <Text style={panel.songRowDuration}>{s.duration}</Text>
                  {likedSongs.has(s.id) && (
                    <Ionicons name="heart" size={12} color="#FF4D6D" style={{ marginLeft: 6 }} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const makeStyles = (C) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  iconBtn: {
    width: 28, height: 28, backgroundColor: C.white,
    borderRadius: 8, justifyContent: 'center', alignItems: 'center',
  },
  profileBtn: {
    width: 28, height: 28,
    justifyContent: 'center', alignItems: 'center',
  },

  speakerInfo: { marginBottom: 24 },
  connectedLabel: { ...typography.labelMd, color: C.secondary, marginBottom: 4 },
  speakerName: { ...typography.title, color: C.primary },

  albumRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16,
  },
  arrowBtn: {
    width: 20, height: 20, backgroundColor: C.white,
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  albumArt: { width: 240, height: 240, borderRadius: 12, overflow: 'hidden' },

  songInfo: { alignItems: 'center', marginBottom: 28 },
  songTitle: { ...typography.titleSm, color: C.primary, marginBottom: 4 },
  songArtist: { ...typography.caption, color: C.secondary },

  volumeBlock: { alignItems: 'center', gap: 20 },
  batteryCard: {
    width: 160, backgroundColor: C.white, borderRadius: 12,
    alignItems: 'center', paddingTop: 12, paddingBottom: 12, paddingHorizontal: 16,
  },
  batteryValueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 6 },
  knobValue: { fontFamily: 'Inter_400Regular', fontSize: 20, color: C.primary },
  knobUnit: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.secondary, marginLeft: 2 },
  batteryLabel: { ...typography.caption, color: C.secondary, marginTop: 4 },
  volumeSliderRow: { width: '100%', paddingHorizontal: 4 },
});

const PANEL_BG = '#1A1512';

const panel = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: PANEL_BG,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingBottom: 36, paddingTop: 12,
  },
  handle: {
    width: 36, height: 4, backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 2, alignSelf: 'center', marginBottom: 18,
  },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  headerTitle: { ...typography.labelMd, color: 'rgba(255,255,255,0.45)', letterSpacing: 2.5 },

  trackRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  artWrapper: { borderRadius: 8, overflow: 'hidden', marginRight: 14 },
  trackMeta: { flex: 1 },
  trackTitle: { ...typography.titleSm, color: '#FFFFFF', marginBottom: 3 },
  trackArtist: { ...typography.caption, color: 'rgba(255,255,255,0.45)' },

  progressSection: { marginBottom: 20 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  timeText: { ...typography.caption, color: 'rgba(255,255,255,0.4)' },

  controls: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 24,
  },
  controlBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  playBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
  },
  repeatOneLabel: {
    position: 'absolute', bottom: -3, right: -3,
    fontSize: 9, fontWeight: '700', color: '#B5562B',
  },

  queueLabel: { ...typography.labelMd, color: 'rgba(255,255,255,0.4)', marginBottom: 10 },
  songList: { maxHeight: 220 },
  songRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, paddingHorizontal: 6, borderRadius: 10, marginBottom: 2,
  },
  songRowActive: { backgroundColor: 'rgba(255,255,255,0.07)' },
  songArtSmall: { borderRadius: 6, overflow: 'hidden', marginRight: 12 },
  songMeta: { flex: 1 },
  songRowTitle: { ...typography.body, color: 'rgba(255,255,255,0.55)', marginBottom: 2 },
  songRowTitleActive: { color: '#FFFFFF', fontFamily: 'Inter_500Medium' },
  songRowArtist: { ...typography.caption, color: 'rgba(255,255,255,0.35)' },
  songRowDuration: { ...typography.caption, color: 'rgba(255,255,255,0.35)' },
});
