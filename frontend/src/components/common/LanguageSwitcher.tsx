import { useLanguageStore, type Language } from '@/stores/languageStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'uk', label: 'Українська' },
    { value: 'ru', label: 'Русский' },
  ];

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
