import { createContext, useContext } from 'react';
import type { AvailableLanguageTag } from '@/lib/i18n';

export interface LocaleContextValue {
  locale: AvailableLanguageTag;
  setLocale: (lang: AvailableLanguageTag) => void;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocaleContext() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocaleContext must be used within LocaleProvider');
  return ctx;
}
