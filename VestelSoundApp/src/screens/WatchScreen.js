import React, { useState, useRef, createContext, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  ScrollView, FlatList, PanResponder,
} from 'react-native';
import Svg, { Path, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// ─── Watch display & bezel dimensions ────────────────────────────────────────
const WATCH_W = 242;
const WATCH_H = 320;
const BEZ_H   = 21;
const BEZ_VT  = 34;
const BEZ_VB  = 30;
const BEZEL_W = WATCH_W + BEZ_H * 2;
const BEZEL_H = WATCH_H + BEZ_VT + BEZ_VB;

// ─── Theme-aware watch colours ────────────────────────────────────────────────
function getWC(isDark) {
  return {
    bg:      isDark ? '#000000' : '#F2EDE4',
    card:    isDark ? '#1A1716' : '#FFFFFF',
    cardBg:  isDark ? '#0E0C0B' : '#EDE8DF',
    text:    isDark ? '#F2EDE4' : '#1C1817',
    dim:     isDark ? '#8C857A' : '#6E665C',
    amber:   '#C9842A',
    amberBg: isDark ? '#3D2008' : '#E8C97A',
    divider: isDark ? '#383630' : '#C9C0AF',
    white:   isDark ? '#1A1716' : '#FFFFFF',
    green:   '#3A9E3A',
    iconBg:  isDark ? '#252018' : '#D5CFC5',
  };
}

// ─── Internal watch context (avoids prop-drilling colours into every screen) ──
const WatchCtx = createContext({});

const tf = (size, w = '400', color = '#F2EDE4') => ({
  fontFamily: w === '500' ? 'Inter_500Medium' : 'Inter_400Regular',
  fontSize: size,
  color,
});

// ─── Shared time bar ──────────────────────────────────────────────────────────
function TimeBar() {
  return (
    <View style={s.timeBar}>
      <Text style={tf(13, '500', '#C9842A')}>9:41</Text>
    </View>
  );
}

// ─── Sub-screen shared header ─────────────────────────────────────────────────
function SubHeader({ title = 'AURA', subtitle = 'Bluetooth Connected' }) {
  const { wC, closeSub } = useContext(WatchCtx);
  return (
    <View style={[s.subHeader, { borderBottomColor: wC.divider }]}>
      <TouchableOpacity style={s.backBtnSm} onPress={closeSub}>
        <Svg width={6} height={10} viewBox="0 0 6 10">
          <Path d="M5 1L1 5l4 4" stroke={wC.text} strokeWidth={1.4} fill="none"
            strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={[tf(15, '500', wC.text), { letterSpacing: 3 }]}>{title}</Text>
        <Text style={[tf(9, '400', wC.dim), { marginTop: 1 }]}>{subtitle}</Text>
      </View>
      <View style={{ width: 28 }} />
    </View>
  );
}

// ─── Bluetooth sub-screen ─────────────────────────────────────────────────────
function BluetoothScreen() {
  const { wC } = useContext(WatchCtx);
  const [isConn, setIsConn] = useState(true);
  const [others, setOthers] = useState([
    { name: 'MacBook Pro',  sub: 'Apple Computer', connected: false },
    { name: 'iPad Pro',     sub: 'Apple Tablet',   connected: false },
    { name: 'AURA Studio',  sub: 'Vestel Speaker', connected: false },
  ]);

  const connect = (i) =>
    setOthers(prev => prev.map((d, idx) => idx === i ? { ...d, connected: true } : d));

  return (
    <View style={[s.subScreen, { backgroundColor: wC.bg }]}>
      <SubHeader />
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12 }}>

        <Text style={[tf(8, '500', wC.dim), { letterSpacing: 1.5, marginBottom: 8 }]}>
          CONNECTED DEVICE
        </Text>

        <View style={[s.btCard, { backgroundColor: wC.card }]}>
          <View style={[s.greenDot, { backgroundColor: wC.green }]} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={tf(14, '500', wC.text)}>AURA Pro</Text>
            <Text style={[tf(10, '400', wC.dim), { marginTop: 1 }]}>iPhone 16 Pro Max</Text>
            {isConn && <Text style={[tf(10, '400', wC.green), { marginTop: 2 }]}>Connected</Text>}
          </View>
          {isConn && (
            <TouchableOpacity onPress={() => setIsConn(false)}>
              <Text style={tf(11, '500', wC.amber)}>Disconnect</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 14 }} />

        <Text style={[tf(8, '500', wC.dim), { letterSpacing: 1.5, marginBottom: 8 }]}>
          OTHER DEVICES
        </Text>

        <View style={[s.btList, { backgroundColor: wC.card }]}>
          {others.map((d, i) => (
            <View key={d.name}>
              <View style={s.btRow}>
                <View style={[s.grayDot,
                  { backgroundColor: d.connected ? wC.green : wC.dim, opacity: d.connected ? 1 : 0.6 }]} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={tf(13, '500', wC.text)}>{d.name}</Text>
                  <Text style={[tf(9, '400', wC.dim), { marginTop: 1 }]}>{d.sub}</Text>
                </View>
                <TouchableOpacity onPress={() => connect(i)}>
                  <Text style={tf(11, '500', d.connected ? wC.dim : wC.amber)}>
                    {d.connected ? 'Connected' : 'Connect'}
                  </Text>
                </TouchableOpacity>
              </View>
              {i < others.length - 1 &&
                <View style={[s.btDivider, { backgroundColor: wC.divider }]} />}
            </View>
          ))}
        </View>

        <View style={s.searchRow}>
          <View style={[s.searchDot, { backgroundColor: wC.dim }]} />
          <Text style={[tf(10, '400', wC.dim), { marginLeft: 6 }]}>Searching for devices...</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Mode icons ───────────────────────────────────────────────────────────────
function WatchModeIcon({ icon, size = 14, color = '#6E665C' }) {
  if (icon === 'sun') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={4} fill={color} />
      {[0,60,120,180,240,300].map(d => {
        const r = d * Math.PI / 180;
        return <Path key={d}
          d={`M${12+7*Math.cos(r)} ${12+7*Math.sin(r)} L${12+10*Math.cos(r)} ${12+10*Math.sin(r)}`}
          stroke={color} strokeWidth={1.5} strokeLinecap="round" />;
      })}
    </Svg>
  );
  if (icon === 'moon') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3a9 9 0 1 0 9 9c-5 0-9-4-9-9z" fill={color} />
    </Svg>
  );
  if (icon === 'wave') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M2 12 Q6 8 10 12 Q14 16 18 12 Q22 8 24 12" stroke={color} strokeWidth={2} fill="none" />
      <Path d="M2 16 Q6 12 10 16 Q14 20 18 16 Q22 12 24 16" stroke={color} strokeWidth={2} fill="none" />
    </Svg>
  );
  if (icon === 'target') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} fill="none" />
      <Circle cx={12} cy={12} r={5} stroke={color} strokeWidth={2} fill="none" />
      <Circle cx={12} cy={12} r={2} fill={color} />
    </Svg>
  );
  if (icon === 'sunset') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={13} r={4} fill={color} />
      <Path d="M3 17 Q12 8 21 17" stroke={color} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Path d="M1 20h22" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
  // dawn (default)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 16 Q12 6 20 16" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M2 18h20" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M12 4v3M5 7l2 2M19 7l-2 2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

// ─── Watch presets (mirrored from mobile LightingScreen) ─────────────────────
const WATCH_PRESETS = [
  { key: '01', desc: 'Özel · Kayıtlı',       icon: 'sun'    },
  { key: '02', desc: 'Sakin · Dim · Nefes',   icon: 'moon'   },
  { key: '03', desc: 'Canlı · Gökkuşağı',     icon: 'target' },
  { key: '04', desc: 'Serin · Berrak · Sabit', icon: 'wave'   },
  { key: '05', desc: 'Sıcak · Yumuşak · Loş', icon: 'sunset' },
];

function ModeScreen() {
  const { wC, closeSub } = useContext(WatchCtx);
  const { activeLightPreset, setActiveLightPreset, t } = useTheme();
  return (
    <View style={[s.subScreen, { backgroundColor: wC.bg }]}>
      <SubHeader />
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12 }}>
        <Text style={[tf(8, '500', wC.dim), { letterSpacing: 1.5, marginBottom: 10 }]}>
          PRESET SEÇ
        </Text>
        {WATCH_PRESETS.map((preset) => {
          const active = activeLightPreset === preset.key;
          return (
            <TouchableOpacity
              key={preset.key}
              style={[s.modeCard, {
                backgroundColor: active ? wC.amberBg : wC.card,
                marginBottom: 8,
              }]}
              onPress={() => setActiveLightPreset(preset.key)}
            >
              <View style={[s.modeIconBg, {
                backgroundColor: active ? 'rgba(0,0,0,0.08)' : wC.iconBg,
              }]}>
                <WatchModeIcon icon={preset.icon} size={14} color={active ? wC.amber : wC.dim} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={tf(13, '500', active ? wC.amber : wC.text)}>{t(`light_${preset.key}`)}</Text>
                <Text style={[tf(9, '400', active ? wC.amber : wC.dim),
                  { marginTop: 1, opacity: 0.85 }]}>
                  {preset.desc}
                </Text>
              </View>
              {active && (
                <Svg width={12} height={9} viewBox="0 0 12 9">
                  <Path d="M1 4.5L4.5 8L11 1" stroke={wC.amber} strokeWidth={1.6} fill="none"
                    strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const PRESET_DESCS = {
  '01': 'Özel · Kayıtlı',
  '02': 'Sakin · Dim · Nefes',
  '03': 'Canlı · Gökkuşağı',
};

// ─── W1: Connected ────────────────────────────────────────────────────────────
function W1Connected() {
  const { wC } = useContext(WatchCtx);
  const { activeLightPreset, t } = useTheme();
  const [volume, setVolume] = useState(60);
  const presetName = activeLightPreset ? t(`light_${activeLightPreset}`) : t('custom_label');
  const presetDesc = PRESET_DESCS[activeLightPreset] || 'Özel Ayar';
  const activePresetObj = WATCH_PRESETS.find(p => p.key === activeLightPreset);
  const presetIcon = activePresetObj ? activePresetObj.icon : 'dawn';

  return (
    <View style={[s.screen, { backgroundColor: wC.bg }]}>
      <TimeBar />
      <View style={s.auraRow}>
        <Text style={[tf(15, '500', wC.text), { letterSpacing: 4 }]}>AURA</Text>
        <Text style={[tf(9, '400', wC.dim), { letterSpacing: 1.2, marginTop: 2 }]}>Connected</Text>
      </View>

      <View style={s.modeBlock}>
        <View style={[s.modeCircle, { backgroundColor: wC.text }]}>
          <WatchModeIcon icon={presetIcon} size={36} color={wC.bg} />
        </View>
        <View style={{ marginLeft: 14 }}>
          <Text style={tf(17, '500', wC.text)}>{presetName}</Text>
          <Text style={[tf(10, '400', wC.dim), { marginTop: 2 }]}>{presetDesc}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View style={s.volRow}>
        <View style={[s.volIconWrap, { backgroundColor: wC.white }]}>
          <Svg width={11} height={17} viewBox="0 0 14 21">
            <Path d="M0 6h4l7-6v21l-7-6H0z" fill={wC.text} />
          </Svg>
        </View>
        <View style={[s.volTrack, { backgroundColor: wC.divider }]}>
          <View style={[s.volFill, { backgroundColor: wC.text, width: `${volume}%` }]} />
        </View>
        <Text style={[tf(10, '400', wC.dim), { marginLeft: 6 }]}>{volume}%</Text>
      </View>

      <View style={s.volZones}>
        <TouchableOpacity style={s.volZone} onPress={() => setVolume(v => Math.max(0, v - 10))}>
          <Text style={tf(11, '400', wC.dim)}>− Vol</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.volZone} onPress={() => setVolume(v => Math.min(100, v + 10))}>
          <Text style={tf(11, '400', wC.dim)}>Vol +</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── W2: Mode Selector (circular picker — 3 presets mirroring mobile) ────────
function W2Mode() {
  const { wC } = useContext(WatchCtx);
  const { activeLightPreset, setActiveLightPreset, t } = useTheme();
  const R = (WATCH_W - 80) / 2;
  const ICON_R = R * 0.72;
  const activeIdx = WATCH_PRESETS.findIndex(p => p.key === activeLightPreset);

  return (
    <View style={[s.screen, { backgroundColor: wC.bg, justifyContent: 'center', alignItems: 'center' }]}>
      <View style={{ width: R * 2 + 40, height: R * 2 + 40 }}>
        <Svg width={R * 2 + 40} height={R * 2 + 40} style={{ position: 'absolute' }}>
          <Circle cx={R + 20} cy={R + 20} r={R} fill={wC.text} />
          <Circle cx={R + 20} cy={R + 20} r={R * 0.3} fill={wC.cardBg} />
        </Svg>
        {WATCH_PRESETS.map((preset, i) => {
          const angle = (i * 72 - 90) * (Math.PI / 180);
          const x = R + 20 + ICON_R * Math.cos(angle);
          const y = R + 20 + ICON_R * Math.sin(angle);
          const isActive = i === activeIdx;
          return (
            <TouchableOpacity
              key={preset.key}
              style={{
                position: 'absolute',
                left: x - 19, top: y - 19,
                width: 38, height: 38, borderRadius: 19,
                backgroundColor: isActive ? wC.bg : 'transparent',
                justifyContent: 'center', alignItems: 'center',
              }}
              onPress={() => setActiveLightPreset(preset.key)}
            >
              <WatchModeIcon icon={preset.icon} size={17}
                color={isActive ? wC.text : wC.bg} />
            </TouchableOpacity>
          );
        })}
        <View style={[s.wheelCenter, { width: R * 2 + 40, height: R * 2 + 40 }]}>
          <Text style={tf(12, '400', wC.dim)}>
            {activeLightPreset ? t(`light_${activeLightPreset}`) : t('custom_label')}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── W3: Lighting ─────────────────────────────────────────────────────────────
function W3Lighting() {
  const { wC, openSub } = useContext(WatchCtx);
  const { lightingOn, setLightingOn } = useTheme();
  const [brightness, setBrightness] = useState(70);

  // Arc geometry (content width = WATCH_W - 2*16 = 210)
  const ARC_R = 82;
  const CX    = 105;  // half of 210
  const CY    = ARC_R + 8; // = 90; arc center y in SVG
  const ARC_LEN = Math.PI * ARC_R;
  const SUN_Y   = CY - ARC_R * 0.52; // ≈ 47, inside the arch

  // Thumb position along arc (−π = 0%, 0 = 100%)
  const thumbRad = (-1 + brightness / 100) * Math.PI;
  const thumbX   = CX + ARC_R * Math.cos(thumbRad);
  const thumbY   = CY + ARC_R * Math.sin(thumbRad);
  const fillLen  = (brightness / 100) * ARC_LEN;

  function updateBrightness(lx, ly) {
    const dx = lx - CX;
    const dy = ly - CY;
    let angle = Math.atan2(dy, dx);
    // snap bottom-half touches to nearest arc end
    if (angle > 0) angle = angle > Math.PI / 2 ? -Math.PI : 0;
    setBrightness(Math.round(Math.max(0, Math.min(100, (angle + Math.PI) / Math.PI * 100))));
  }

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant: (e) => updateBrightness(e.nativeEvent.locationX, e.nativeEvent.locationY),
    onPanResponderMove:  (e) => updateBrightness(e.nativeEvent.locationX, e.nativeEvent.locationY),
  })).current;

  return (
    <View style={[s.screen, { backgroundColor: wC.bg }]}>
      <TimeBar />
      <Text style={[tf(14, '500', wC.text), { textAlign: 'center', marginBottom: 14 }]}>
        Lighting
      </Text>

      {/* Arc brightness control */}
      <View {...pan.panHandlers}>
        <Svg width={CX * 2} height={CY + 14}>
          {/* Track */}
          <Path
            d={`M ${CX - ARC_R} ${CY} A ${ARC_R} ${ARC_R} 0 0 1 ${CX + ARC_R} ${CY}`}
            stroke={wC.divider} strokeWidth={5} fill="none" strokeLinecap="round"
          />
          {/* Filled arc (amber) */}
          {brightness > 0 && (
            <Path
              d={`M ${CX - ARC_R} ${CY} A ${ARC_R} ${ARC_R} 0 0 1 ${CX + ARC_R} ${CY}`}
              stroke={wC.amber} strokeWidth={5} fill="none" strokeLinecap="round"
              strokeDasharray={`${fillLen} ${ARC_LEN}`}
            />
          )}
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const r  = (deg * Math.PI) / 180;
            const x1 = CX + 13 * Math.cos(r);
            const y1 = SUN_Y + 13 * Math.sin(r);
            const x2 = CX + 18 * Math.cos(r);
            const y2 = SUN_Y + 18 * Math.sin(r);
            return (
              <Path key={deg} d={`M${x1} ${y1} L${x2} ${y2}`}
                stroke={wC.text} strokeWidth={1.5} strokeLinecap="round" />
            );
          })}
          {/* Sun circle */}
          <Circle cx={CX} cy={SUN_Y} r={9} fill={wC.bg} stroke={wC.text} strokeWidth={1.5} />
          {/* Brightness % text */}
          <SvgText
            x={CX} y={SUN_Y + 36}
            textAnchor="middle"
            fontFamily="Inter_400Regular"
            fontSize={11}
            fill={wC.dim}
          >
            {brightness}%
          </SvgText>
          {/* Draggable thumb */}
          <Circle cx={thumbX} cy={thumbY} r={7} fill={wC.bg} stroke={wC.text} strokeWidth={2} />
        </Svg>
      </View>

      <View style={{ flex: 1 }} />

      {/* Bottom buttons */}
      <View style={[s.lightBtns, { marginBottom: 4 }]}>
        {/* Preset / colour indicator */}
        <TouchableOpacity
          style={[s.lightBtn, { backgroundColor: wC.text }]}
          onPress={() => openSub('mode')}
        >
          <Svg width={22} height={22} viewBox="0 0 22 22">
            <Circle cx={11} cy={11} r={8} fill="none" stroke={wC.bg} strokeWidth={1.5} />
            <Circle cx={11} cy={11} r={3.5} fill={wC.bg} />
          </Svg>
        </TouchableOpacity>
        {/* Power toggle */}
        <TouchableOpacity
          style={[
            s.lightBtn,
            lightingOn
              ? { backgroundColor: wC.amber }
              : { backgroundColor: wC.white, borderWidth: 1.5, borderColor: wC.divider },
          ]}
          onPress={() => setLightingOn(v => !v)}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Path d="M12 3v9"
              stroke={lightingOn ? wC.bg : wC.dim}
              strokeWidth={2.5} strokeLinecap="round" />
            <Path d="M18.36 6.64a9 9 0 1 1-12.72 0"
              stroke={lightingOn ? wC.bg : wC.dim}
              strokeWidth={2} strokeLinecap="round" fill="none" />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── W4: Now Playing ──────────────────────────────────────────────────────────
const W4_SONGS = [
  { title: 'Bahar Geceleri', artist: 'Adamlar'               },
  { title: 'Cambaz',         artist: 'Mor ve Ötesi'          },
  { title: 'Söyle',          artist: 'Ahmet Kaya'            },
  { title: 'Yine Sensiz',    artist: 'Yüzyüzeyken Konuşuruz' },
  { title: 'Lacivert',       artist: 'Ceylan Ertem'          },
];

function W4Playing() {
  const { wC } = useContext(WatchCtx);
  const [songIdx, setSongIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress] = useState(0.6);
  const song = W4_SONGS[songIdx];

  return (
    <View style={[s.screen, { backgroundColor: wC.bg }]}>
      <TimeBar />
      <Text style={[tf(14, '500', wC.text), { marginBottom: 12 }]}>Playing</Text>

      <View style={{ marginBottom: 10 }}>
        <View style={[s.albumArt, { backgroundColor: wC.white }]}>
          <Svg width={36} height={36} viewBox="0 0 40 40">
            <Circle cx={20} cy={20} r={18} stroke={wC.dim} strokeWidth={1} fill="none" />
            <Circle cx={20} cy={20} r={6} fill={wC.bg} />
            <Path d="M16 12v16l14-8-14-8z" fill={wC.dim} />
          </Svg>
        </View>
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={[tf(14, '500', wC.text), { marginBottom: 2 }]} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={tf(10, '400', wC.dim)}>{song.artist}</Text>
      </View>

      <View style={s.controls}>
        <TouchableOpacity style={[s.ctrlBtn, { backgroundColor: wC.white }]}
          onPress={() => setSongIdx(i => Math.max(0, i - 1))}>
          <Svg width={17} height={17} viewBox="0 0 24 24">
            <Path d="M19 5L9 12l10 7V5zM5 5v14" stroke={wC.text}
              strokeWidth={2} strokeLinecap="round" fill="none" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity style={[s.playBtn, { backgroundColor: wC.text }]}
          onPress={() => setPlaying(p => !p)}>
          {playing
            ? <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path d="M6 4h4v16H6zM14 4h4v16h-4z" fill={wC.bg} />
              </Svg>
            : <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path d="M5 3l14 9-14 9V3z" fill={wC.bg} />
              </Svg>
          }
        </TouchableOpacity>
        <TouchableOpacity style={[s.ctrlBtn, { backgroundColor: wC.white }]}
          onPress={() => setSongIdx(i => Math.min(W4_SONGS.length - 1, i + 1))}>
          <Svg width={17} height={17} viewBox="0 0 24 24">
            <Path d="M5 5l10 7-10 7V5zM19 5v14" stroke={wC.text}
              strokeWidth={2} strokeLinecap="round" fill="none" />
          </Svg>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }} />

      <View style={s.volRow}>
        <View style={[s.volIconWrap, { backgroundColor: wC.white }]}>
          <Svg width={11} height={17} viewBox="0 0 14 21">
            <Path d="M0 6h4l7-6v21l-7-6H0z" fill={wC.text} />
          </Svg>
        </View>
        <View style={[s.volTrack, { backgroundColor: wC.divider }]}>
          <View style={[s.volFill, { backgroundColor: wC.text, width: `${progress * 100}%` }]} />
        </View>
        <Text style={[tf(10, '400', wC.dim), { marginLeft: 6 }]}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
    </View>
  );
}

// ─── W5: Status ───────────────────────────────────────────────────────────────
function W5Status() {
  const { wC, openSub } = useContext(WatchCtx);
  const { activeLightPreset, t } = useTheme();

  const rows = [
    {
      label: 'Battery',
      value: '60%',
      sub: null,
      iconPath: 'M17 6h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1M9 2h6v4H9z',
    },
    {
      label: 'Bluetooth',
      value: 'Connected',
      sub: 'bluetooth',
      iconPath: 'M12 2l5 5-5 5 5 5-5 5V2zM7 7l5 5-5 5',
    },
    {
      label: 'Mode',
      value: activeLightPreset ? t(`light_${activeLightPreset}`) : t('custom_label'),
      sub: 'mode',
      iconPath: 'M12 3v1M12 20v1M3 12H2M22 12h-1M5.6 5.6l-.7-.7M19.1 19.1l-.7-.7M5.6 18.4l-.7.7M19.1 4.9l-.7.7M12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7z',
    },
  ];

  return (
    <View style={[s.screen, { backgroundColor: wC.bg }]}>
      <TimeBar />
      <View style={s.auraRow}>
        <Text style={[tf(15, '500', wC.text), { letterSpacing: 4 }]}>AURA</Text>
        <Text style={[tf(9, '400', wC.dim), { letterSpacing: 1.2, marginTop: 2 }]}>Connected</Text>
      </View>
      <View>
        {rows.map((r, i) => (
          <View key={r.label}>
            <TouchableOpacity
              style={s.statusRow}
              onPress={r.sub ? () => openSub(r.sub) : undefined}
              activeOpacity={r.sub ? 0.6 : 1}
            >
              <View style={[s.statusIcon, { backgroundColor: wC.white }]}>
                <Svg width={13} height={13} viewBox="0 0 24 24">
                  <Path d={r.iconPath} fill={wC.text} />
                </Svg>
              </View>
              <View style={s.statusText}>
                <Text style={tf(12, '500', wC.text)}>{r.label}</Text>
                <Text style={[tf(10, '400', wC.dim), { marginTop: 1 }]}>{r.value}</Text>
              </View>
              <Svg width={4} height={7} viewBox="0 0 4 8">
                <Path d="M0 0l4 4-4 4" stroke={wC.dim} strokeWidth={1.5} fill="none" />
              </Svg>
            </TouchableOpacity>
            {i < rows.length - 1 &&
              <View style={[s.statusDivider, { backgroundColor: wC.divider }]} />}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── W6: Playlist ─────────────────────────────────────────────────────────────
const W6_PLAYLIST = [
  { title: 'Bahar Geceleri',      artist: 'Adamlar'               },
  { title: 'Cambaz',              artist: 'Mor ve Ötesi'          },
  { title: 'Beni Sensiz Bırakma', artist: 'Pinhani'               },
  { title: 'Hayat Bayram Olsa',   artist: 'Nilüfer'               },
  { title: 'Söyle',               artist: 'Ahmet Kaya'            },
  { title: 'Mavi',                artist: 'Yüksek Sadakat'        },
  { title: 'Yine Sensiz',         artist: 'Yüzyüzeyken Konuşuruz' },
  { title: 'Lacivert',            artist: 'Ceylan Ertem'          },
];

function W6Playlist() {
  const { wC } = useContext(WatchCtx);
  const [activeIdx, setActiveIdx] = useState(0);
  return (
    <View style={[s.screen, { paddingHorizontal: 0, backgroundColor: wC.bg }]}>
      <View style={{ paddingHorizontal: 16 }}>
        <TimeBar />
        <View style={{ marginBottom: 8 }}>
          <Text style={[tf(8, '400', wC.dim), { letterSpacing: 2 }]}>MÜZİK</Text>
          <Text style={tf(13, '500', wC.text)}>Çalma Listesi</Text>
        </View>
      </View>
      <FlatList
        data={W6_PLAYLIST}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 }}
        renderItem={({ item, index }) => {
          const isActive = index === activeIdx;
          return (
            <TouchableOpacity
              style={[s.songRow, isActive && { backgroundColor: wC.text }]}
              onPress={() => setActiveIdx(index)}
            >
              <View style={[s.albumThumb, { backgroundColor: wC.white }]}>
                <Svg width={18} height={18} viewBox="0 0 20 20">
                  <Circle cx={10} cy={10} r={9} stroke={isActive ? wC.bg : wC.dim}
                    strokeWidth={1} fill="none" />
                  <Circle cx={10} cy={10} r={3} fill={isActive ? wC.bg : wC.dim} />
                </Svg>
              </View>
              <View style={s.songMeta}>
                <Text style={tf(12, isActive ? '500' : '400', isActive ? wC.bg : wC.text)}
                  numberOfLines={1}>{item.title}</Text>
                <Text style={[tf(9, '400', isActive ? wC.bg : wC.dim),
                  { marginTop: 1, opacity: isActive ? 0.65 : 1 }]}
                  numberOfLines={1}>{item.artist}</Text>
              </View>
              {isActive && (
                <Svg width={13} height={13} viewBox="0 0 16 16">
                  <Rect x={0} y={5} width={3} height={9} fill="#C9842A" rx={1} />
                  <Rect x={5} y={2} width={3} height={12} fill="#C9842A" rx={1} />
                  <Rect x={10} y={6} width={3} height={8} fill="#C9842A" rx={1} />
                </Svg>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// ─── Screen list ──────────────────────────────────────────────────────────────
const SCREENS = [
  { key: 'W1', component: W1Connected },
  { key: 'W2', component: W2Mode      },
  { key: 'W3', component: W3Lighting  },
  { key: 'W4', component: W4Playing   },
  { key: 'W5', component: W5Status    },
  { key: 'W6', component: W6Playlist  },
];

// ─── Exported bezel-modal ─────────────────────────────────────────────────────
export default function WatchModal({ visible, onClose }) {
  const { isDark } = useTheme();
  const wC = getWC(isDark);
  const [idx, setIdx] = useState(0);
  const [subScreen, setSubScreen] = useState(null); // null | 'bluetooth' | 'mode'
  const flatRef = useRef(null);

  const openSub = (name) => setSubScreen(name);
  const closeSub = () => setSubScreen(null);

  const goTo = (i) => {
    setIdx(i);
    flatRef.current?.scrollToIndex({ index: i, animated: true });
  };

  const ctxValue = { wC, openSub, closeSub };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={onClose} />

        <View style={s.bezel}>
          <View style={s.crown} />
          <View style={s.homeBtn} />

          <View style={[s.display, { backgroundColor: wC.bg }]}>
            <WatchCtx.Provider value={ctxValue}>
              {subScreen ? (
                subScreen === 'bluetooth' ? <BluetoothScreen /> : <ModeScreen />
              ) : (
                <>
                  <View style={{ flex: 1 }}>
                    <FlatList
                      ref={flatRef}
                      data={SCREENS}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => item.key}
                      getItemLayout={(_, i) => ({ length: WATCH_W, offset: WATCH_W * i, index: i })}
                      onMomentumScrollEnd={(e) => {
                        const i = Math.round(e.nativeEvent.contentOffset.x / WATCH_W);
                        setIdx(i);
                      }}
                      renderItem={({ item }) => {
                        const Comp = item.component;
                        return (
                          <View style={{ width: WATCH_W, flex: 1 }}>
                            <Comp />
                          </View>
                        );
                      }}
                    />
                  </View>

                  <View style={[s.dots, { backgroundColor: wC.bg }]}>
                    {SCREENS.map((_, i) => (
                      <TouchableOpacity key={i} onPress={() => goTo(i)}>
                        <View style={[s.dot,
                          { backgroundColor: wC.divider },
                          idx === i && { backgroundColor: wC.text, width: 12 },
                        ]} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </WatchCtx.Provider>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bezel: {
    width: BEZEL_W,
    height: BEZEL_H,
    backgroundColor: '#0E0C0B',
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#2C2724',
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 24,
    position: 'relative',
  },
  crown: {
    position: 'absolute',
    right: -7,
    top: '33%',
    width: 7,
    height: 28,
    backgroundColor: '#1C1916',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2C2724',
  },
  homeBtn: {
    position: 'absolute',
    bottom: 10,
    width: 28,
    height: 5,
    backgroundColor: '#1C1916',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#2C2724',
  },
  display: {
    width: WATCH_W,
    height: WATCH_H,
    borderRadius: 30,
    overflow: 'hidden',
    flexDirection: 'column',
  },

  // Pagination dots (no tab bar – swipe-only navigation)
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
  },
  dot: { width: 4, height: 4, borderRadius: 2 },

  // Per-screen base
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  timeBar: { marginBottom: 10 },
  auraRow: { marginBottom: 14 },

  // W1
  modeBlock:   { flexDirection: 'row', alignItems: 'center' },
  modeCircle:  { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  volRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  volIconWrap: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  volTrack:    { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  volFill:     { height: 6, borderRadius: 3 },
  volZones:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  volZone:     { flex: 1, height: 36, justifyContent: 'center', alignItems: 'center' },

  // W2
  wheelCenter: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },

  // W3
  brightnessRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 10 },
  bTrack:        { flex: 1, height: 5, borderRadius: 3, overflow: 'hidden' },
  bFill:         { height: 5, borderRadius: 3 },
  lightBtns:     { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  lightBtn:      { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },

  // W4
  albumArt: { width: 60, height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  controls:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 },
  ctrlBtn:   { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  playBtn:   { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },

  // W5
  statusRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 2 },
  statusIcon:    { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  statusText:    { flex: 1 },
  statusDivider: { height: 1, marginLeft: 34 },

  // W6
  songRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 44 },
  albumThumb: { width: 30, height: 30, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  songMeta:   { flex: 1, marginRight: 6 },

  // Sub-screens
  subScreen: { flex: 1 },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backBtnSm: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },

  // Bluetooth
  btCard:    { borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'flex-start' },
  greenDot:  { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  btList:    { borderRadius: 12, paddingHorizontal: 12 },
  btRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 11 },
  grayDot:   { width: 7, height: 7, borderRadius: 3.5 },
  btDivider: { height: 1 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingHorizontal: 4 },
  searchDot: { width: 6, height: 6, borderRadius: 3 },

  // Mode list
  modeCard:   { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 10 },
  modeIconBg: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});
