import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { getColors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';

// Exact Figma specs: 20x180 component, 2px track, 16px thumb ellipse
const TRACK_H = 180;
const THUMB_SIZE = 16;
const CONTAINER_W = 20;

export default function VerticalSlider({ min = -12, max = 12, initialValue = 0, value: controlledValue, onChange }) {
  const { isDark } = useTheme();
  const C = getColors(isDark);
  const [value, setValue] = useState(initialValue);
  const currentValue = useRef(initialValue);
  const startValue = useRef(initialValue);

  // Sync visual position when parent changes the controlled value (preset switch)
  useEffect(() => {
    if (controlledValue !== undefined && controlledValue !== currentValue.current) {
      setValue(controlledValue);
      currentValue.current = controlledValue;
    }
  }, [controlledValue]);

  const clamp = (v) => Math.max(min, Math.min(max, v));

  // Import PanResponder inside to avoid issues
  const { PanResponder } = require('react-native');

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startValue.current = currentValue.current;
      },
      onPanResponderMove: (_, g) => {
        const delta = -(g.dy / (TRACK_H - THUMB_SIZE)) * (max - min);
        const next = clamp(startValue.current + delta);
        currentValue.current = next;
        setValue(next);
        onChange && onChange(next);
      },
    })
  ).current;

  // thumbTop: 0 = max, TRACK_H - THUMB_SIZE = min
  const thumbTop = ((max - value) / (max - min)) * (TRACK_H - THUMB_SIZE);

  // Fill height (from thumb down to bottom)
  const fillH = TRACK_H - thumbTop - THUMB_SIZE;

  return (
    <View style={styles.container} {...pan.panHandlers}>
      {/* Track */}
      <View style={[styles.trackBg, { backgroundColor: C.border }]} />
      {/* Fill (below thumb) */}
      <View style={[styles.fill, { backgroundColor: C.primary, height: Math.max(0, fillH), top: thumbTop + THUMB_SIZE }]} />
      {/* Thumb */}
      <View style={[styles.thumb, { backgroundColor: C.primary, top: thumbTop }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_W,
    height: TRACK_H,
    alignItems: 'center',
    position: 'relative',
  },
  trackBg: {
    position: 'absolute',
    width: 2,
    height: TRACK_H,
    borderRadius: 1,
    left: (CONTAINER_W - 2) / 2,
  },
  fill: {
    position: 'absolute',
    width: 2,
    borderRadius: 1,
    left: (CONTAINER_W - 2) / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    left: (CONTAINER_W - THUMB_SIZE) / 2,
  },
});
