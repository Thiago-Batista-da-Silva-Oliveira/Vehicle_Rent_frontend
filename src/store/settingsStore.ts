import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AccentColor, ColorMode } from '../styles/theme';

interface SettingsState {
  colorMode: ColorMode;
  accentColor: AccentColor;
  setColorMode: (mode: ColorMode) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleColorMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      colorMode: 'light',
      accentColor: 'blue',
      setColorMode: (mode) => set({ colorMode: mode }),
      setAccentColor: (color) => set({ accentColor: color }),
      toggleColorMode: () =>
        set((state) => ({ colorMode: state.colorMode === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'vehicle-rentx-settings',
    }
  )
);

export default useSettingsStore;