import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../theme/colors';
import { typography } from '../theme/typography';

function ChevronRight({ C }) {
  return (
    <Svg width={4} height={8} viewBox="0 0 4 8">
      <Path d="M0 0l4 4-4 4" stroke={C.border} strokeWidth={1.5} fill="none" />
    </Svg>
  );
}

export default function SettingsScreen({ navigation }) {
  const { isDark, toggleTheme } = useTheme();
  const C = getColors(isDark);

  const rowStyle = {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 18,
  };
  const labelStyle = { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.primary };
  const valueStyle = { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.secondary };

  function SettingRow({ label, value }) {
    return (
      <TouchableOpacity style={rowStyle}>
        <Text style={labelStyle}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={valueStyle}>{value}</Text>
          <View style={{ marginLeft: 8 }}>
            <ChevronRight C={C} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8,
      }}>
        <TouchableOpacity
          style={{ width: 28, height: 28, backgroundColor: C.white, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <Svg width={7} height={14} viewBox="0 0 7 14">
            <Path d="M7 0L0 7l7 7" stroke={C.primary} strokeWidth={1.5} fill="none" />
          </Svg>
        </TouchableOpacity>
        <Text style={{ ...typography.titleSm, color: C.primary }}>Ayarlar</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={{ backgroundColor: C.white, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', marginRight: 14,
          }}>
            <Svg width={20} height={22} viewBox="0 0 20 22">
              <Circle cx={10} cy={7} r={5} fill={C.cream} />
              <Path d="M1 20c0-5 4-9 9-9s9 4 9 9" stroke={C.cream} strokeWidth={1.5} fill="none" />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: C.primary, marginBottom: 3 }}>Misafir oturumu</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: C.secondary }}>Hesabını bağla</Text>
          </View>
          <ChevronRight C={C} />
        </View>

        <View style={{ height: 24 }} />

        {/* GENEL */}
        <Text style={{ ...typography.labelMd, color: C.secondary, marginBottom: 10 }}>GENEL</Text>
        <View style={{ paddingHorizontal: 2 }}>
          <SettingRow label="Dil" value="Türkçe" />
          <View style={{ height: 1, backgroundColor: C.border }} />
          <SettingRow label="Navigasyon çubuğu" value="Alt" />
        </View>

        <View style={{ height: 24 }} />

        {/* GÖRÜNÜM */}
        <Text style={{ ...typography.labelMd, color: C.secondary, marginBottom: 10 }}>GÖRÜNÜM</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={{
              flex: 1, height: 44, borderRadius: 22, borderWidth: 1,
              borderColor: !isDark ? C.primary : C.border,
              backgroundColor: !isDark ? C.primary : 'transparent',
              justifyContent: 'center', alignItems: 'center',
            }}
            onPress={() => { if (isDark) toggleTheme(); }}
          >
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: !isDark ? C.cream : C.primary }}>
              Açık
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1, height: 44, borderRadius: 22, borderWidth: 1,
              borderColor: isDark ? C.primary : C.border,
              backgroundColor: isDark ? C.primary : 'transparent',
              justifyContent: 'center', alignItems: 'center',
            }}
            onPress={() => { if (!isDark) toggleTheme(); }}
          >
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: isDark ? C.cream : C.primary }}>
              Koyu
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />

        {/* GECE MODU */}
        <Text style={{ ...typography.labelMd, color: C.secondary, marginBottom: 10 }}>GECE MODU</Text>
        <View style={{ paddingHorizontal: 2 }}>
          <SettingRow label="Ses limiti" value="50%" />
          <View style={{ height: 1, backgroundColor: C.border }} />
          <SettingRow label="Saat aralığı" value="22:00 - 08:00" />
        </View>

        <View style={{ flex: 1, minHeight: 40 }} />

        {/* Logout */}
        <TouchableOpacity style={{
          height: 52, borderRadius: 14, borderWidth: 1,
          borderColor: C.border, justifyContent: 'center', alignItems: 'center',
        }}>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#B5562B' }}>
            Oturumu kapat
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
