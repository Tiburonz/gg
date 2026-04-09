import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'uk' | 'ru';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang: Language) => set({ language: lang }),
    }),
    {
      name: 'language-store',
    }
  )
);
