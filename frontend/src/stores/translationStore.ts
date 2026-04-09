import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TranslationOverrides {
  [lang: string]: { [key: string]: string };
}

interface TranslationStore {
  overrides: TranslationOverrides;
  setOverride: (lang: string, key: string, value: string) => void;
  clearOverride: (lang: string, key: string) => void;
}

export const useTranslationStore = create<TranslationStore>()(
  persist(
    (set) => ({
      overrides: {},
      setOverride: (lang, key, value) =>
        set((state) => {
          const langOverrides = state.overrides[lang] || {};
          return {
            overrides: {
              ...state.overrides,
              [lang]: {
                ...langOverrides,
                [key]: value,
              },
            },
          };
        }),
      clearOverride: (lang, key) =>
        set((state) => {
          const langOverrides = { ...(state.overrides[lang] || {}) };
          delete langOverrides[key];
          return {
            overrides: {
              ...state.overrides,
              [lang]: langOverrides,
            },
          };
        }),
    }),
    {
      name: 'translation-overrides',
    }
  )
);
