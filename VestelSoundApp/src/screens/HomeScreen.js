import React, { useState, useRef, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, PanResponder, Modal,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import ProfileIcon from '../components/ProfileIcon';
import WatchModal from './WatchScreen';
import { getColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme, useI18n } from '../context/ThemeContext';

const SPEAKERS = [
  { id: 1, name: 'Vestel Aura Pro',  room: 'Oturma Odası', battery: 78, connected: true,  model: 'AURA Pro 360' },
  { id: 2, name: 'Aura Studio',      room: 'Yatak Odası',  battery: 45, connected: false, model: 'AURA Studio 2' },
  { id: 3, name: 'Aura Go',          room: 'Mutfak',       battery: 92, connected: false, model: 'AURA Go Portable' },
];

function SpeakerCard({ speaker, size = 240 }) {
  const cx = size / 2, cy = size / 2;
  const accent = speaker.connected ? '#C9842A' : '#4A4540';
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={0} y={0} width={size} height={size} fill="#1C1817" rx={size > 100 ? 12 : 8} />
      {[0.88, 0.74, 0.60, 0.46, 0.32].map((r, i) => (
        <Circle key={i} cx={cx} cy={cy} r={r * size / 2}
          stroke="#2C2420" strokeWidth={i === 0 ? 0.5 : 1} fill="none" />
      ))}
      <Circle cx={cx} cy={cy} r={size * 0.27} fill="#252220" />
      <Circle cx={cx} cy={cy} r={size * 0.17} fill="#1A1716" />
      <Circle cx={cx} cy={cy} r={size * 0.09} fill={accent} opacity={0.5} />
      <Circle cx={cx} cy={cy} r={size * 0.055} fill={accent} />
    </Svg>
  );
}

function WatchIcon({ color }) {
  return (
    <Svg width={13} height={18} viewBox="0 0 13 18">
      {/* top strap */}
      <Rect x={3} y={0.5} width={7} height={4} rx={1.5} stroke={color} strokeWidth={1.25} fill="none" />
      {/* bottom strap */}
      <Rect x={3} y={13.5} width={7} height={4} rx={1.5} stroke={color} strokeWidth={1.25} fill="none" />
      {/* watch body */}
      <Rect x={0.5} y={4} width={12} height={10} rx={3} stroke={color} strokeWidth={1.25} fill="none" />
      {/* clock hands */}
      <Path d="M6.5 7v2.2l1.5 1" stroke={color} strokeWidth={1.1} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function BellIcon({ color }) {
  return (
    <Svg width={16} height={17} viewBox="0 0 16 17">
      <Path
        d="M8 1.2c-2.4 0-4 1.9-4 4.3 0 3.4-1.2 4.5-1.6 4.9-.2.2-.3.5-.2.8.1.3.4.5.7.5h10.2c.3 0 .6-.2.7-.5.1-.3 0-.6-.2-.8-.4-.4-1.6-1.5-1.6-4.9 0-2.4-1.6-4.3-4-4.3z"
        stroke={color}
        strokeWidth={1.3}
        fill="none"
        strokeLinejoin="round"
      />
      <Path d="M6.5 14c.3.7 1 1.1 1.5 1.1s1.2-.4 1.5-1.1" stroke={color} strokeWidth={1.3} fill="none" strokeLinecap="round" />
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


export default function HomeScreen({ navigation }) {
  const { isDark, showNotifications } = useTheme();
  const { t } = useI18n();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const [showWatch, setShowWatch] = useState(false);
  const [volume, setVolume] = useState(75);
  const [currentSpeaker, setCurrentSpeaker] = useState(0);
  const [showSpeakerDetail, setShowSpeakerDetail] = useState(false);

  const speaker = SPEAKERS[currentSpeaker];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={showNotifications}>
            <BellIcon color={C.primary} />
          </TouchableOpacity>
          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowWatch(true)}>
              <WatchIcon color={C.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Settings')}>
              <ProfileIcon color={C.primary} size={28} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Speaker Info */}
        <View style={styles.speakerInfo}>
          <Text style={styles.connectedLabel}>{speaker.connected ? t('connected') : 'BAĞLI DEĞİL'}</Text>
          <Text style={styles.speakerName}>{speaker.name}</Text>
        </View>

        {/* Speaker Card Carousel */}
        <View style={styles.albumRow}>
          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={() => setCurrentSpeaker(i => Math.max(0, i - 1))}
          >
            <Svg width={6} height={12} viewBox="0 0 6 12">
              <Path d="M6 0L0 6l6 6" stroke={C.primary} strokeWidth={1.5} fill="none" />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.albumArt}
            onPress={() => setShowSpeakerDetail(true)}
            activeOpacity={0.9}
          >
            <SpeakerCard speaker={speaker} size={240} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={() => setCurrentSpeaker(i => Math.min(SPEAKERS.length - 1, i + 1))}
          >
            <Svg width={6} height={12} viewBox="0 0 6 12">
              <Path d="M0 0l6 6-6 6" stroke={C.primary} strokeWidth={1.5} fill="none" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Speaker Detail Info */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{speaker.name}</Text>
          <Text style={styles.songArtist}>{speaker.room}</Text>
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
                strokeDasharray={`${(speaker.battery / 100) * 126} 126`}
              />
            </Svg>
            <View style={styles.batteryValueRow}>
              <Text style={styles.knobValue}>{Math.round(speaker.battery)}</Text>
              <Text style={styles.knobUnit}>%</Text>
            </View>
            <Text style={styles.batteryLabel}>{t('battery_level')}</Text>
          </View>

          <View style={styles.volumeSliderRow}>
            <VolumeSlider value={volume} onChange={setVolume} />
          </View>
        </View>

      </ScrollView>

      {/* Speaker Detail Panel */}
      <Modal
        visible={showSpeakerDetail}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSpeakerDetail(false)}
      >
        <View style={panel.overlay}>
          <View style={panel.sheet}>
            <View style={panel.handle} />

            <View style={panel.header}>
              <Text style={panel.headerTitle}>HOPARLÖR BİLGİSİ</Text>
              <TouchableOpacity
                onPress={() => setShowSpeakerDetail(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            </View>

            {/* Speaker art + name/model */}
            <View style={panel.trackRow}>
              <View style={panel.artWrapper}>
                <SpeakerCard speaker={speaker} size={64} />
              </View>
              <View style={panel.trackMeta}>
                <Text style={panel.trackTitle} numberOfLines={1}>{speaker.name}</Text>
                <Text style={panel.trackArtist}>{speaker.model}</Text>
              </View>
              <View style={[panel.statusDot, { backgroundColor: speaker.connected ? '#3A9E3A' : '#666' }]} />
            </View>

            {/* Info rows */}
            <View style={panel.infoBlock}>
              <View style={panel.infoRow}>
                <Text style={panel.infoLabel}>KONUM</Text>
                <Text style={panel.infoValue}>{speaker.room}</Text>
              </View>
              <View style={panel.infoRow}>
                <Text style={panel.infoLabel}>DURUM</Text>
                <Text style={[panel.infoValue, { color: speaker.connected ? '#3A9E3A' : 'rgba(255,255,255,0.4)' }]}>
                  {speaker.connected ? 'Bağlı' : 'Bağlı Değil'}
                </Text>
              </View>
              <View style={panel.infoRow}>
                <Text style={panel.infoLabel}>PİL</Text>
                <Text style={panel.infoValue}>{speaker.battery}%</Text>
              </View>
            </View>

            {/* Battery bar */}
            <View style={panel.batteryBar}>
              <View style={[panel.batteryFill, { width: `${speaker.battery}%`, backgroundColor: speaker.battery > 20 ? '#3A9E3A' : '#E05252' }]} />
            </View>

            {/* Volume */}
            <View style={{ marginTop: 24 }}>
              <VolumeSlider value={volume} onChange={setVolume} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Smartwatch bezel modal */}
      <WatchModal visible={showWatch} onClose={() => setShowWatch(false)} />
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
  topBarRight: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
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
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  infoBlock: { marginBottom: 16 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  infoLabel: { ...typography.label, color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  infoValue: { ...typography.body, color: '#FFFFFF', fontSize: 14 },
  batteryBar: {
    height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden',
  },
  batteryFill: { height: 4, borderRadius: 2 },
});
