import React from 'react';
import { SvgXml } from 'react-native-svg';

// Source: src/assets/Profile.svg — rendered via SvgXml so the stroke
// color can follow the active theme.
const xml = (stroke) => `
<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 26.3C20.7931 26.3 26.2999 20.7931 26.2999 14C26.2999 7.2069 20.7931 1.7 14 1.7C7.20685 1.7 1.69995 7.2069 1.69995 14C1.69995 20.7931 7.20685 26.3 14 26.3Z" stroke="${stroke}" stroke-width="1.4"/>
<path d="M14 14.8C15.8225 14.8 17.3 13.3225 17.3 11.5C17.3 9.67746 15.8225 8.2 14 8.2C12.1774 8.2 10.7 9.67746 10.7 11.5C10.7 13.3225 12.1774 14.8 14 14.8Z" stroke="${stroke}" stroke-width="1.4"/>
<path d="M7.5 22C7.5 19 10.4 16.7 14 16.7C17.6 16.7 20.5 19 20.5 22" stroke="${stroke}" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;

export default function ProfileIcon({ color = '#1C1817', size = 22 }) {
  return <SvgXml xml={xml(color)} width={size} height={size} />;
}
