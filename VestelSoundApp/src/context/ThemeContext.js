import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../i18n/translations';

const AppContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState('tr');
  // Where the Home tab sits in the bottom bar: 'center' | 'left' | 'right'
  const [navHomePosition, setNavHomePosition] = useState('center');
  const [notifications, setNotifications] = useState([]);

  const toggleTheme = () => setIsDark((d) => !d);

  const t = useCallback(
    (key) => {
      const dict = translations[lang] || translations.tr;
      return dict[key] ?? translations.tr[key] ?? key;
    },
    [lang]
  );

  // Pop the two demo notifications (rebuilt so they follow the current language).
  const showNotifications = useCallback(() => {
    const dict = translations[lang] || translations.tr;
    const base = Date.now();
    setNotifications([
      {
        id: `${base}-night`,
        icon: 'moon',
        title: dict.notif_night_title,
        sub: dict.notif_night_sub,
      },
      {
        id: `${base}-speaker`,
        icon: 'bluetooth',
        title: dict.notif_speaker_title,
        sub: dict.notif_speaker_sub,
      },
    ]);
  }, [lang]);

  const dismissNotification = useCallback((id) => {
    setNotifications((list) => list.filter((n) => n.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        isDark,
        toggleTheme,
        lang,
        setLang,
        t,
        navHomePosition,
        setNavHomePosition,
        notifications,
        showNotifications,
        dismissNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useTheme = () => useContext(AppContext);
export const useI18n = () => useContext(AppContext);
export const useSettings = () => useContext(AppContext);
