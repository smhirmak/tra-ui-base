import { useState } from 'react';
import { LocaleContext } from './LocaleContext';
import { getCurrentLanguage, setLanguage } from '@/lib/i18n';
import type { AvailableLanguageTag } from '@/lib/i18n';

interface LocaleProviderProps {
  children: React.ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<AvailableLanguageTag>(getCurrentLanguage);

  const handleSetLocale = (lang: AvailableLanguageTag) => {
    setLocaleState(lang);
    setLanguage(lang);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
