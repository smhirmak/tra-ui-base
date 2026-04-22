/**
 * i18n — Paraglide kurulumu
 *
 * Bu dosya `npx tra-ui add i18n` tarafından projenize kopyalanır.
 *
 * Sonraki adım: vite.config.ts'e Paraglide plugin'ini ekleyin:
 *   import { paraglide } from "@inlang/paraglide-vite"
 *   paraglide({ project: "./project.inlang", outdir: "./src/paraglide" })
 */
import * as m from '@/paraglide/messages';

export type AvailableLanguageTag = 'tr' | 'en';

export const AVAILABLE_LANGUAGES: { value: AvailableLanguageTag; label: string }[] = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
];

/** Mevcut dil etiketini döner */
export function getCurrentLanguage(): AvailableLanguageTag {
  return (localStorage.getItem('tra-ui-lang') as AvailableLanguageTag) ?? 'tr';
}

/** Dili değiştirir ve sayfayı yeniler */
export function setLanguage(lang: AvailableLanguageTag) {
  localStorage.setItem('tra-ui-lang', lang);
  window.location.reload();
}

/** Paraglide mesaj fonksiyonlarına doğrudan erişim */
export { m };
