import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useI18n } from '../context/ThemeContext';

// Icons sourced from src/assets/Moon.svg and src/assets/Bluetooth.svg.
const moonXml = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22 18C20.3461 18.3834 18.6219 18.3394 16.9897 17.8722C15.3575 17.405 13.8711 16.5299 12.6706 15.3294C11.4701 14.1289 10.595 12.6426 10.1278 11.0104C9.66059 9.37817 9.61661 7.65389 10 6C8.26191 6.40293 6.66326 7.26355 5.36989 8.4926C4.07651 9.72164 3.13551 11.2743 2.6445 12.9896C2.15348 14.7049 2.13033 16.5204 2.57745 18.2477C3.02457 19.9749 3.92567 21.5511 5.18729 22.8127C6.44891 24.0743 8.0251 24.9754 9.75237 25.4226C11.4796 25.8697 13.2951 25.8465 15.0104 25.3555C16.7257 24.8645 18.2784 23.9235 19.5074 22.6301C20.7365 21.3368 21.5971 19.7381 22 18Z" stroke="#F2EDE4" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`;

const bluetoothXml = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 11L21 21M21 11L11 21M16 6V26" stroke="#F2EDE4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function NotifIcon({ icon }) {
  const xml = icon === 'moon' ? moonXml : bluetoothXml;
  return <SvgXml xml={xml} width={26} height={26} />;
}

function NotificationCard({ item, onDismiss }) {
  useEffect(() => {
    const id = setTimeout(() => onDismiss(item.id), 4500);
    return () => clearTimeout(id);
  }, [item.id, onDismiss]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onDismiss(item.id)}
      style={styles.card}
    >
      <View style={styles.iconWrap}>
        <NotifIcon icon={item.icon} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.sub} numberOfLines={1}>{item.sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationOverlay() {
  const { notifications, dismissNotification } = useI18n();

  if (!notifications.length) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {notifications.map((n) => (
        <NotificationCard key={n.id} item={n} onDismiss={dismissNotification} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 56,
    paddingHorizontal: 16,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161412',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textBlock: { flex: 1 },
  title: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#F2EDE4',
    marginBottom: 3,
  },
  sub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    color: '#9A8F82',
  },
});
