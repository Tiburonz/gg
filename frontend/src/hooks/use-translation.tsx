import { useLanguageStore } from '@/stores/languageStore';
import { useTranslationStore } from '@/stores/translationStore';
import en from '@/locales/en.json';
import uk from '@/locales/uk.json';
import ru from '@/locales/ru.json';
import { useEditMode } from '@/contexts/EditModeContext';
import { useAuthStore } from '@/stores/authStore';
import { ReactNode } from 'react';
import { EditableText } from '@/components/common/EditableText';

// allow returning ReactNode in case we wrap editable
export type TranslationKey = string;

const translations = {
  en,
  uk,
  ru,
};

export function useTranslation(): { t: (key: TranslationKey, defaultValue?: string) => ReactNode; language: string } {
  const { language } = useLanguageStore();
  const { overrides, setOverride } = useTranslationStore();
  const { isEditMode } = useEditMode();
  const { account } = useAuthStore();

  const isAdmin = account?.role === 'admin' || account?.role === 'moderator';

  const getRaw = (key: TranslationKey, defaultValue: string = key): string => {
    const keys = key.split('.');
    let value: Record<string, unknown> | string | undefined = translations[language as keyof typeof translations];

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }

    let str = typeof value === 'string' ? value : defaultValue;
    // apply override if exists
    const langOverrides = overrides[language] || {};
    if (langOverrides[key]) {
      str = langOverrides[key];
    }

    return str;
  };

  const t = (key: TranslationKey, defaultValue: string = key): ReactNode => {
    const raw = getRaw(key, defaultValue);
    if (isEditMode && isAdmin) {
      return (
        <EditableText
          id={key}
          onSave={(newVal) => setOverride(language, key, newVal)}
        >
          {raw}
        </EditableText>
      );
    }
    return raw;
  };

  return { t, language };
}
