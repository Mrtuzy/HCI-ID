import React, { useRef, useState, useEffect } from 'react';
import { View, PanResponder } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const SEGMENTS = 120;

export const hslToHex = (h, s, l) => {
  h = ((h % 360) + 360) % 360;
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  const hex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
};

const polar = (cx, cy, r, deg) => {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const arc = (cx, cy, outerR, innerR, start, end) => {
  const os = polar(cx, cy, outerR, start);
  const oe = polar(cx, cy, outerR, end);
  const is = polar(cx, cy, innerR, start);
  const ie = polar(cx, cy, innerR, end);
  return `M ${os.x} ${os.y} A ${outerR} ${outerR} 0 0 1 ${oe.x} ${oe.y} L ${ie.x} ${ie.y} A ${innerR} ${innerR} 0 0 0 ${is.x} ${is.y} Z`;
};

export default function ColorWheel({ size = 220, innerRatio = 0.5, onColorSelect, angle: controlledAngle }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * innerRatio;

  const initialAngle = controlledAngle ?? 30;
  const [indicatorAngle, setIndicatorAngle] = useState(initialAngle);
  const currentAngle = useRef(initialAngle);
  const segAngle = 360 / SEGMENTS;

  // Sync indicator when parent changes the controlled angle (preset switch)
  useEffect(() => {
    if (controlledAngle !== undefined && Math.abs(controlledAngle - currentAngle.current) > 0.01) {
      currentAngle.current = controlledAngle;
      setIndicatorAngle(controlledAngle);
    }
  }, [controlledAngle]);

  const handleTouch = (lx, ly) => {
    const dx = lx - cx;
    const dy = ly - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < innerR || dist > outerR + 10) return;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    currentAngle.current = angle;
    setIndicatorAngle(angle);
    onColorSelect && onColorSelect(hslToHex(angle, 90, 55), angle);
  };

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY),
    onPanResponderMove: (e) => handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY),
  })).current;

  const midR = (outerR + innerR) / 2;
  const indPos = polar(cx, cy, midR, indicatorAngle);

  return (
    <View style={{ width: size, height: size }} {...pan.panHandlers}>
      <Svg width={size} height={size}>
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <Path
            key={i}
            d={arc(cx, cy, outerR, innerR, i * segAngle, (i + 1) * segAngle)}
            fill={hslToHex(i * segAngle, 90, 55)}
          />
        ))}
        <Circle
          cx={indPos.x} cy={indPos.y} r={9}
          fill="white" stroke="#1C1817" strokeWidth={2}
        />
      </Svg>
    </View>
  );
}
