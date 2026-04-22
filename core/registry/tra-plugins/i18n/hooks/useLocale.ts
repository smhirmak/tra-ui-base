import { useLocaleContext } from '@/contexts/locale/LocaleContext';
import { AVAILABLE_LANGUAGES } from '@/lib/i18n';

export function useLocale() {
  const { locale, setLocale } = useLocaleContext();
  return { locale, setLocale, availableLanguages: AVAILABLE_LANGUAGES };
}
