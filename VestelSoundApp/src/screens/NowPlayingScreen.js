import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function NowPlayingScreen({ navigation }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0.35);
  const [currentTime, setCurrentTime] = useState('');
  const progressAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((p) => {
          const next = Math.min(1, p + 0.001);
          progressAnim.setValue(next);
          return next;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-down" size={24} color={colors.darkText} />
      </TouchableOpacity>

      {/* Header Label */}
      <Text style={styles.screenLabel}>Vestel Müzik</Text>

      {/* Big Clock */}
      <View style={styles.clockSection}>
        <Text style={styles.clock}>{currentTime || '00:00'}</Text>
        <View style={styles.clockDeco} />
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <View style={styles.artworkContainer}>
          <View style={styles.artwork}>
            <Ionicons name="musical-note" size={28} color={colors.darkSubText} />
          </View>
        </View>
        <View style={styles.trackMeta}>
          <Text style={styles.trackTitle}>Bluetooth Akışı</Text>
          <Text style={styles.trackArtist}>Vestel Home Speaker</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={22} color={colors.darkSubText} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
          />
          <Animated.View
            style={[
              styles.progressThumb,
              { left: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
          />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>
            {Math.floor(progress * 3 * 60 / 60)}:{String(Math.floor(progress * 3 * 60) % 60).padStart(2, '0')}
          </Text>
          <Text style={styles.timeText}>3:00</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn}>
          <Ionicons name="shuffle-outline" size={20} color={colors.darkSubText} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn}>
          <Ionicons name="play-skip-back" size={26} color={colors.darkText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={30}
            color={colors.darkBg}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn}>
          <Ionicons name="play-skip-forward" size={26} color={colors.darkText} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn}>
          <Ionicons name="repeat-outline" size={20} color={colors.darkSubText} />
        </TouchableOpacity>
      </View>

      {/* Volume */}
      <View style={styles.volumeSection}>
        <Ionicons name="volume-low-outline" size={18} color={colors.darkSubText} />
        <View style={styles.volumeTrack}>
          <View style={styles.volumeFill} />
          <View style={styles.volumeThumb} />
        </View>
        <Ionicons name="volume-high-outline" size={18} color={colors.darkSubText} />
      </View>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={22} color={colors.darkSubText} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="list-outline" size={22} color={colors.darkSubText} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={22} color={colors.darkSubText} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.darkBg,
    paddingHorizontal: 28,
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  screenLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.darkSubText,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  clockSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  clock: {
    fontSize: 72,
    fontWeight: '100',
    color: colors.darkText,
    letterSpacing: -2,
  },
  clockDeco: {
    width: 40,
    height: 1,
    backgroundColor: colors.darkSubText,
    marginTop: 12,
    opacity: 0.4,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  artworkContainer: { marginRight: 14 },
  artwork: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.darkCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackMeta: { flex: 1 },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 3,
  },
  trackArtist: {
    fontSize: 12,
    color: colors.darkSubText,
  },
  progressSection: { marginBottom: 32 },
  progressTrack: {
    height: 3,
    backgroundColor: colors.darkCard,
    borderRadius: 2,
    marginBottom: 10,
    position: 'relative',
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.darkText,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.darkText,
    top: -4.5,
    marginLeft: -6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 11,
    color: colors.darkSubText,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  controlBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.darkText,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  volumeTrack: {
    flex: 1,
    height: 3,
    backgroundColor: colors.darkCard,
    borderRadius: 2,
    position: 'relative',
  },
  volumeFill: {
    width: '60%',
    height: 3,
    backgroundColor: colors.darkText,
    borderRadius: 2,
    opacity: 0.6,
  },
  volumeThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.darkText,
    top: -4.5,
    left: '60%',
    marginLeft: -6,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
