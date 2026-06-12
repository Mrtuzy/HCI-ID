import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  Dimensions, ScrollView, FlatList,
} from 'react-native';
import Svg, { Path, Circle, Rect, G, Ellipse } from 'react-native-svg';

const { width: SW } = Dimensions.get('window');

// Figma watch color tokens
const C = {
  bg: '#000000',
  text: '#F2EDE4',
  dim: '#8C857A',
  amber: '#F5A64D',
  divider: '#383630',
  white: '#FFFFFF',
  darkCard: '#1A1716',
};

const tf = (size, w = '400', color = C.text) => ({
  fontFamily: w === '500' ? 'Inter_500Medium' : 'Inter_400Regular',
  fontSize: size,
  color,
});

// ─── Shared: top time bar ──────────────────────────────────────
function TimeBar({ time = '9:41' }) {
  return (
    <View style={s.timeBar}>
      <Text style={[tf(16, '500', C.amber)]}>{time}</Text>
    </View>
  );
}

// ─── W1: Connected ────────────────────────────────────────────
function W1Connected({ onSwipe }) {
  const [volume, setVolume] = useState(60);
  const TRACK = SW - 140;

  return (
    <View style={s.screen}>
      <TimeBar />

      {/* AURA header */}
      <View style={s.auraRow}>
        <Text style={[tf(18, '500'), { letterSpacing: 5.4 }]}>AURA</Text>
        <Text style={[tf(10, '400', C.dim), { letterSpacing: 1.5, marginTop: 2 }]}>Connected</Text>
      </View>

      {/* Mode visual */}
      <View style={s.modeBlock}>
        <View style={s.modeCircle}>
          <Svg width={100} height={100} viewBox="0 0 100 100">
            <Circle cx={50} cy={50} r={48} stroke={C.dim} strokeWidth={1} fill="none" />
            <Circle cx={50} cy={50} r={36} stroke={C.dim} strokeWidth={0.5} fill="none" />
            <Circle cx={50} cy={50} r={8} fill={C.bg} />
            {/* Sun rays */}
            {[0,45,90,135,180,225,270,315].map(deg => {
              const rad = deg * Math.PI / 180;
              const x1 = 50 + 14 * Math.cos(rad), y1 = 50 + 14 * Math.sin(rad);
              const x2 = 50 + 22 * Math.cos(rad), y2 = 50 + 22 * Math.sin(rad);
              return <Path key={deg} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={C.white} strokeWidth={1.5} />;
            })}
          </Svg>
        </View>
        <View style={{ marginLeft: 20 }}>
          <Text style={tf(22, '500')}>Sunset</Text>
          <Text style={[tf(11, '400', C.dim), { marginTop: 3 }]}>Warm &amp; Calm</Text>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      {/* Volume bar — Figma: 282px track, fill at volume% */}
      <View style={s.volRow}>
        <View style={s.volIconWrap}>
          <Svg width={14} height={21} viewBox="0 0 14 21">
            <Path d="M0 6h4l7-6v21l-7-6H0z" fill={C.text} />
          </Svg>
        </View>
        <View style={s.volTrack}>
          <View style={[s.volFill, { width: `${volume}%` }]} />
        </View>
        <Text style={[tf(12, '400', C.dim), { marginLeft: 8 }]}>{volume}%</Text>
      </View>

      {/* Vol touch zones */}
      <View style={s.volZones}>
        <TouchableOpacity
          style={s.volZone}
          onPress={() => setVolume(v => Math.max(0, v - 10))}
        >
          <Text style={[tf(11, '400', C.dim)]}>− Vol</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.volZone}
          onPress={() => setVolume(v => Math.min(100, v + 10))}
        >
          <Text style={[tf(11, '400', C.dim)]}>Vol +</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── W2: Mode Selector ────────────────────────────────────────
const MODES = [
  { name: 'Relax',   icon: 'sun'    },
  { name: 'Morning', icon: 'dawn'   },
  { name: 'Sleep',   icon: 'moon'   },
  { name: 'Ocean',   icon: 'wave'   },
  { name: 'Party',   icon: 'star'   },
  { name: 'Focus',   icon: 'target' },
];

function ModeIcon({ icon, size = 22, color = C.bg }) {
  const c = color;
  if (icon === 'sun') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={4} fill={c} />
      {[0,60,120,180,240,300].map(d => {
        const r = d * Math.PI / 180;
        return <Path key={d} d={`M${12+7*Math.cos(r)} ${12+7*Math.sin(r)} L${12+10*Math.cos(r)} ${12+10*Math.sin(r)}`} stroke={c} strokeWidth={1.5} strokeLinecap="round" />;
      })}
    </Svg>
  );
  if (icon === 'moon') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3a9 9 0 1 0 9 9c-5 0-9-4-9-9z" fill={c} />
    </Svg>
  );
  if (icon === 'wave') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M2 12 Q6 8 10 12 Q14 16 18 12 Q22 8 24 12" stroke={c} strokeWidth={2} fill="none" />
      <Path d="M2 16 Q6 12 10 16 Q14 20 18 16 Q22 12 24 16" stroke={c} strokeWidth={2} fill="none" />
    </Svg>
  );
  if (icon === 'star') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" fill={c} />
    </Svg>
  );
  if (icon === 'target') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9} stroke={c} strokeWidth={2} fill="none" />
      <Circle cx={12} cy={12} r={5} stroke={c} strokeWidth={2} fill="none" />
      <Circle cx={12} cy={12} r={2} fill={c} />
    </Svg>
  );
  // dawn
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 16 Q12 6 20 16" stroke={c} strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M2 18h20" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M12 4v3M5 7l2 2M19 7l-2 2" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function W2Mode() {
  const [active, setActive] = useState(0);
  const R = (SW - 80) / 2;
  const ICON_R = R * 0.72;

  return (
    <View style={s.screen}>
      <TimeBar />
      <View style={s.wheelContainer}>
        {/* Outer white circle */}
        <Svg width={R * 2 + 40} height={R * 2 + 40} style={{ position: 'absolute' }}>
          <Circle cx={R + 20} cy={R + 20} r={R} fill={C.white} />
          {/* Inner cream circle */}
          <Circle cx={R + 20} cy={R + 20} r={R * 0.32} fill={C.text} />
        </Svg>

        {/* Mode icons arranged in a circle */}
        {MODES.map((mode, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180);
          const x = R + 20 + ICON_R * Math.cos(angle);
          const y = R + 20 + ICON_R * Math.sin(angle);
          const isActive = i === active;
          return (
            <TouchableOpacity
              key={mode.name}
              style={[s.modeItem, {
                position: 'absolute',
                left: x - 22,
                top: y - 22,
                width: 44, height: 44,
                borderRadius: 22,
                backgroundColor: isActive ? C.bg : 'transparent',
                justifyContent: 'center', alignItems: 'center',
              }]}
              onPress={() => setActive(i)}
            >
              <ModeIcon icon={mode.icon} size={20} color={isActive ? C.white : C.bg} />
            </TouchableOpacity>
          );
        })}

        {/* Center text */}
        <View style={[s.wheelCenter, { width: R * 2 + 40, height: R * 2 + 40 }]}>
          <Text style={[tf(14, '400', C.bg)]}>{MODES[active].name}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── W3: Lighting ─────────────────────────────────────────────
function W3Lighting() {
  const [brightness, setBrightness] = useState(90);
  const [isOn, setIsOn] = useState(true);
  const ARC_W = SW - 80;
  const ARC_R = ARC_W / 2 - 10;
  const CIRC = Math.PI * ARC_R;

  return (
    <View style={s.screen}>
      <TimeBar />
      <Text style={[tf(16, '500'), { marginLeft: 24, marginBottom: 16 }]}>Lighting</Text>

      {/* Arc gauge */}
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Svg width={ARC_W} height={ARC_R + 20}>
          {/* Background arc */}
          <Path
            d={`M 15 ${ARC_R + 5} A ${ARC_R} ${ARC_R} 0 0 1 ${ARC_W - 15} ${ARC_R + 5}`}
            stroke={C.divider}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
          />
          {/* Fill arc */}
          <Path
            d={`M 15 ${ARC_R + 5} A ${ARC_R} ${ARC_R} 0 0 1 ${ARC_W - 15} ${ARC_R + 5}`}
            stroke={C.white}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${(brightness / 100) * CIRC} ${CIRC}`}
          />
          {/* Percentage text */}
          <Svg x={(ARC_W - 50) / 2} y={ARC_R - 20} width={50} height={25}>
            <Svg viewBox={`0 0 50 25`}>
            </Svg>
          </Svg>
        </Svg>
        <Text style={[tf(15, '400'), { marginTop: -8 }]}>{brightness}%</Text>
      </View>

      {/* Brightness control */}
      <View style={s.brightnessRow}>
        <TouchableOpacity onPress={() => setBrightness(b => Math.max(0, b - 10))}>
          <Text style={[tf(22, '400', C.dim)]}>−</Text>
        </TouchableOpacity>
        <View style={s.bTrack}>
          <View style={[s.bFill, { width: `${brightness}%` }]} />
        </View>
        <TouchableOpacity onPress={() => setBrightness(b => Math.min(100, b + 10))}>
          <Text style={[tf(22, '400', C.dim)]}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }} />

      {/* On/Off buttons — Figma: two 70x70 circles */}
      <View style={s.lightBtns}>
        <TouchableOpacity
          style={[s.lightBtn, { backgroundColor: C.darkCard }]}
          onPress={() => setIsOn(false)}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path d="M12 3a9 9 0 0 1 0 18A9 9 0 0 1 12 3z" fill={isOn ? C.dim : C.white} />
            <Path d="M12 7v5l3 3" stroke={C.bg} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.lightBtn, { backgroundColor: isOn ? C.text : C.darkCard }]}
          onPress={() => setIsOn(true)}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path d="M0 12h8M16 12h8M12 0v8M12 16v8" stroke={isOn ? C.bg : C.dim} strokeWidth={2} strokeLinecap="round" />
            <Circle cx={12} cy={12} r={4} fill={isOn ? C.bg : C.dim} />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── W4: Playing ──────────────────────────────────────────────
const SONGS = [
  { title: 'Bahar Geceleri', artist: 'Adamlar' },
  { title: 'Cambaz',         artist: 'Mor ve Ötesi' },
  { title: 'Söyle',          artist: 'Ahmet Kaya' },
  { title: 'Yine Sensiz',    artist: 'Yüzyüzeyken Konuşuruz' },
  { title: 'Lacivert',       artist: 'Ceylan Ertem' },
];

function W4Playing() {
  const [songIdx, setSongIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0.6);
  const song = SONGS[songIdx];

  return (
    <View style={s.screen}>
      <TimeBar />
      <Text style={[tf(16, '500'), { marginLeft: 24, marginBottom: 20 }]}>Playing</Text>

      {/* Album art — 72x72 r=14 */}
      <View style={{ paddingLeft: 24, marginBottom: 14 }}>
        <View style={s.albumArt}>
          <Svg width={40} height={40} viewBox="0 0 40 40">
            <Circle cx={20} cy={20} r={18} stroke={C.dim} strokeWidth={1} fill="none" />
            <Circle cx={20} cy={20} r={6}  fill={C.bg} />
            <Path d="M16 12v16l14-8-14-8z" fill={C.dim} />
          </Svg>
        </View>
      </View>

      {/* Song info */}
      <View style={s.songInfo}>
        <Text style={[tf(17, '500'), { marginBottom: 3 }]} numberOfLines={1}>{song.title}</Text>
        <Text style={tf(12, '400', C.dim)}>{song.artist}</Text>
      </View>

      {/* Controls — Figma: prev, play(80x80 r=40), next */}
      <View style={s.controls}>
        <TouchableOpacity
          style={s.ctrlBtn}
          onPress={() => setSongIdx(i => Math.max(0, i - 1))}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path d="M19 5L9 12l10 7V5zM5 5v14" stroke={C.text} strokeWidth={2} strokeLinecap="round" fill="none" />
          </Svg>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.playBtn}
          onPress={() => setPlaying(p => !p)}
        >
          {playing
            ? <Svg width={22} height={22} viewBox="0 0 24 24">
                <Path d="M6 4h4v16H6zM14 4h4v16h-4z" fill={C.bg} />
              </Svg>
            : <Svg width={22} height={22} viewBox="0 0 24 24">
                <Path d="M5 3l14 9-14 9V3z" fill={C.bg} />
              </Svg>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={s.ctrlBtn}
          onPress={() => setSongIdx(i => Math.min(SONGS.length - 1, i + 1))}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path d="M5 5l10 7-10 7V5zM19 5v14" stroke={C.text} strokeWidth={2} strokeLinecap="round" fill="none" />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Battery bar — Figma: 282px track, fill 60% */}
      <View style={[s.volRow, { marginTop: 16 }]}>
        <View style={s.volIconWrap}>
          <Svg width={14} height={21} viewBox="0 0 14 21">
            <Path d="M0 6h4l7-6v21l-7-6H0z" fill={C.text} />
          </Svg>
        </View>
        <View style={s.volTrack}>
          <View style={[s.volFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={[tf(12, '400', C.dim), { marginLeft: 8 }]}>{Math.round(progress * 100)}%</Text>
      </View>
    </View>
  );
}

// ─── W5: Status ───────────────────────────────────────────────
function StatusRow({ label, value, iconPath }) {
  return (
    <View style={s.statusRow}>
      <View style={s.statusIcon}>
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Path d={iconPath} fill={C.text} />
        </Svg>
      </View>
      <View style={s.statusText}>
        <Text style={tf(13, '500')}>{label}</Text>
        <Text style={[tf(11, '400', C.dim), { marginTop: 1 }]}>{value}</Text>
      </View>
      <Svg width={4} height={8} viewBox="0 0 4 8">
        <Path d="M0 0l4 4-4 4" stroke={C.dim} strokeWidth={1.5} fill="none" />
      </Svg>
    </View>
  );
}

function W5Status() {
  return (
    <View style={s.screen}>
      <TimeBar />
      <View style={s.auraRow}>
        <Text style={[tf(18, '500'), { letterSpacing: 5.4 }]}>AURA</Text>
        <Text style={[tf(10, '400', C.dim), { letterSpacing: 1.5, marginTop: 2 }]}>Connected</Text>
      </View>

      <View style={{ marginTop: 16 }}>
        <StatusRow
          label="Battery"
          value="60%"
          iconPath="M17 6h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1M9 2h6v4H9z"
        />
        <View style={s.statusDivider} />
        <StatusRow
          label="Bluetooth"
          value="Connected"
          iconPath="M12 2l5 5-5 5 5 5-5 5V2zM7 7l5 5-5 5"
        />
        <View style={s.statusDivider} />
        <StatusRow
          label="Mode"
          value="Sunset"
          iconPath="M12 3v1M12 20v1M3 12H2M22 12h-1M5.6 5.6l-.7-.7M19.1 19.1l-.7-.7M5.6 18.4l-.7.7M19.1 4.9l-.7.7M12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7z"
        />
      </View>
    </View>
  );
}

// ─── W6: Playlist ─────────────────────────────────────────────
const PLAYLIST = [
  { title: 'Bahar Geceleri',    artist: 'Adamlar',                active: true  },
  { title: 'Cambaz',            artist: 'Mor ve Ötesi',           active: false },
  { title: 'Beni Sensiz Bırakma', artist: 'Pinhani',             active: false },
  { title: 'Hayat Bayram Olsa', artist: 'Nilüfer',                active: false },
  { title: 'Söyle',             artist: 'Ahmet Kaya',             active: false },
  { title: 'Mavi',              artist: 'Yüksek Sadakat',         active: false },
  { title: 'Yine Sensiz',       artist: 'Yüzyüzeyken Konuşuruz', active: false },
  { title: 'Çocukluk Aşkım',   artist: 'Murat Boz',              active: false },
  { title: 'Lacivert',          artist: 'Ceylan Ertem',           active: false },
  { title: 'Sevda',             artist: 'Şebnem Ferah',           active: false },
  { title: 'Bu Akşam Ölürüm',  artist: 'Kayahan',                active: false },
  { title: 'Yangın',            artist: 'Manga',                  active: false },
  { title: 'Yalnız',            artist: 'Hayko Cepkin',           active: false },
  { title: 'Aşkın Doğsun',     artist: 'Buray',                  active: false },
  { title: 'Bizim Sokaklar',    artist: 'Bülent Ortaçgil',        active: false },
  { title: 'Geceler',           artist: 'Cem Karaca',             active: false },
];

function W6Playlist() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <View style={[s.screen, { paddingHorizontal: 0 }]}>
      <View style={{ paddingHorizontal: 24 }}>
        <TimeBar />
        <View style={{ marginBottom: 8 }}>
          <Text style={[tf(10, '400', C.dim), { letterSpacing: 2.5 }]}>MÜZİK</Text>
          <Text style={tf(16, '500')}>Çalma Listesi</Text>
        </View>
      </View>

      <FlatList
        data={PLAYLIST}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => {
          const isActive = index === activeIdx;
          return (
            <TouchableOpacity
              style={[s.songRow, isActive && s.songRowActive]}
              onPress={() => setActiveIdx(index)}
            >
              {/* Album art — 36x36 r=6 */}
              <View style={s.albumThumb}>
                <Svg width={20} height={20} viewBox="0 0 20 20">
                  <Circle cx={10} cy={10} r={9} stroke={isActive ? C.bg : C.dim} strokeWidth={1} fill="none" />
                  <Circle cx={10} cy={10} r={3} fill={isActive ? C.bg : C.dim} />
                </Svg>
              </View>

              <View style={s.songMeta}>
                <Text
                  style={[tf(14, isActive ? '500' : '400', isActive ? C.bg : C.text)]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text style={[tf(11, '400', isActive ? '#1C1817' : C.dim), { marginTop: 1 }]} numberOfLines={1}>
                  {item.artist}
                </Text>
              </View>

              {/* Active: EQ bars icon in amber */}
              {isActive && (
                <Svg width={16} height={16} viewBox="0 0 16 16">
                  <Rect x={0}  y={5}  width={3} height={11} fill={C.amber} rx={1} />
                  <Rect x={5}  y={2}  width={3} height={14} fill={C.amber} rx={1} />
                  <Rect x={10} y={6}  width={3} height={10} fill={C.amber} rx={1} />
                  <Rect x={15} y={0}  width={3} height={16} fill={C.amber} rx={1} />
                </Svg>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// ─── Main WatchScreen ─────────────────────────────────────────
const SCREENS = [
  { key: 'W1', label: 'Connected', component: W1Connected },
  { key: 'W2', label: 'Mode',      component: W2Mode      },
  { key: 'W3', label: 'Lighting',  component: W3Lighting  },
  { key: 'W4', label: 'Playing',   component: W4Playing   },
  { key: 'W5', label: 'Status',    component: W5Status    },
  { key: 'W6', label: 'Playlist',  component: W6Playlist  },
];

export default function WatchScreen({ navigation }) {
  const [idx, setIdx] = useState(0);
  const flatRef = useRef(null);

  const goTo = (i) => {
    setIdx(i);
    flatRef.current?.scrollToIndex({ index: i, animated: true });
  };

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Back button */}
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Svg width={7} height={12} viewBox="0 0 7 12">
            <Path d="M7 0L0 6l7 6" stroke={C.text} strokeWidth={1.5} fill="none" />
          </Svg>
        </TouchableOpacity>

        {/* Screen tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabRow}
          style={s.tabScroll}
        >
          {SCREENS.map((sc, i) => (
            <TouchableOpacity
              key={sc.key}
              style={[s.tab, idx === i && s.tabActive]}
              onPress={() => goTo(i)}
            >
              <Text style={[s.tabText, idx === i && s.tabTextActive]}>
                {sc.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Watch screens */}
        <FlatList
          ref={flatRef}
          data={SCREENS}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / SW);
            setIdx(i);
          }}
          renderItem={({ item }) => {
            const Comp = item.component;
            return (
              <View style={s.watchFrame}>
                <Comp />
              </View>
            );
          }}
        />

        {/* Pagination dots */}
        <View style={s.dots}>
          {SCREENS.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View style={[s.dot, idx === i && s.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  backBtn: {
    width: 36, height: 36,
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 8,
  },

  tabScroll: { flexGrow: 0, marginBottom: 12 },
  tabRow: { paddingHorizontal: 16, gap: 8 },
  tab: {
    paddingVertical: 6, paddingHorizontal: 14,
    borderRadius: 14, borderWidth: 1, borderColor: C.divider,
  },
  tabActive: { backgroundColor: C.text, borderColor: C.text },
  tabText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.dim },
  tabTextActive: { fontFamily: 'Inter_500Medium', color: C.bg },

  watchFrame: {
    width: SW,
    flex: 1,
    paddingBottom: 16,
  },

  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },

  timeBar: { marginBottom: 16 },

  auraRow: { marginBottom: 24 },

  modeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  modeCircle: {
    width: 100, height: 100,
    backgroundColor: C.white,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  volRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  volIconWrap: {
    width: 28, height: 28,
    backgroundColor: C.white,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  volTrack: {
    flex: 1, height: 8,
    backgroundColor: C.divider,
    borderRadius: 4, overflow: 'hidden',
  },
  volFill: {
    height: 8, backgroundColor: C.text, borderRadius: 4,
  },
  volZones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  volZone: {
    flex: 1, height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // W2
  wheelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // W3
  brightnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  bTrack: {
    flex: 1, height: 6,
    backgroundColor: C.divider,
    borderRadius: 3, overflow: 'hidden',
  },
  bFill: {
    height: 6, backgroundColor: C.text, borderRadius: 3,
  },
  lightBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 8,
  },
  lightBtn: {
    width: 70, height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // W4
  albumArt: {
    width: 72, height: 72,
    borderRadius: 14,
    backgroundColor: C.darkCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: { paddingHorizontal: 24, marginBottom: 20 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  ctrlBtn: {
    width: 52, height: 52,
    backgroundColor: C.white,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  playBtn: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: C.text,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // W5
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 4,
  },
  statusIcon: {
    width: 28, height: 28,
    backgroundColor: C.white,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusText: { flex: 1 },
  statusDivider: {
    height: 1, backgroundColor: C.divider, marginLeft: 40,
  },

  // W6
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 52,
  },
  songRowActive: {
    backgroundColor: C.text,
  },
  albumThumb: {
    width: 36, height: 36,
    borderRadius: 6,
    backgroundColor: C.darkCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  songMeta: { flex: 1, marginRight: 8 },

  // Pagination
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  dot: {
    width: 5, height: 5,
    borderRadius: 2.5,
    backgroundColor: C.divider,
  },
  dotActive: { backgroundColor: C.text, width: 16 },
});
