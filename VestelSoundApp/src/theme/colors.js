export const colors = {
  cream: '#F2EDE4',
  white: '#FFFFFF',
  primary: '#1C1817',
  secondary: '#6E665C',
  border: '#C9C0AF',
  coral: '#B5562B',
  iconInactive: '#A89E8C',
  background: '#F2EDE4',
  text: '#1C1817',
  textSecondary: '#6E665C',
  buttonBg: '#1C1817',
  buttonText: '#F2EDE4',
};

const darkColors = {
  cream: '#1C1817',
  white: '#2A2420',
  primary: '#F2EDE4',
  secondary: '#8A8076',
  border: '#3A332C',
  coral: '#B5562B',
  iconInactive: '#5A5349',
  background: '#1C1817',
  text: '#F2EDE4',
  textSecondary: '#8A8076',
  buttonBg: '#F2EDE4',
  buttonText: '#1C1817',
};

export function getColors(isDark) {
  return isDark ? darkColors : colors;
}
