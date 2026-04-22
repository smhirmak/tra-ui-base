import type { Plugin } from './types.js';

/**
 * Plugin metadata listesi.
 * Dosya kopyalama işlemi artık shadcn registry üzerinden yapılıyor.
 * Bu dizi; list, info ve post-install mesajları için kullanılır.
 */
export const PLUGINS: Plugin[] = [
  {
    name: 'i18n',
    title: 'Internationalization (Paraglide)',
    description: 'inlang Paraglide ile compile-time i18n. TR/EN dil desteği, LocaleContext, dil seçici hook',
    packages: ['@inlang/paraglide-js', '@inlang/paraglide-vite'],
    registryDependencies: [],
    postInstall: [
      '',
      '📦 i18n (Paraglide) kurulumu tamamlandı!',
      '',
      '📌 Sonraki adımlar:',
      '  1. vite.config.ts dosyasına Paraglide plugin\'ini ekleyin:',
      '     import { paraglide } from "@inlang/paraglide-vite"',
      '     plugins: [ paraglide({ project: "./project.inlang", outdir: "./src/paraglide" }) ]',
      '  2. main.tsx\'e LocaleProvider\'ı sarın',
      '  3. messages/ klasörüne çevirilerinizi ekleyin',
    ],
  },
  {
    name: 'http',
    title: 'HTTP Client (Axios)',
    description: 'Axios instance, token interceptor, 401 refresh, merkezi hata yönetimi, AuthContext ve BaseService',
    packages: ['axios'],
    registryDependencies: [],
    postInstall: [
      '',
      '📦 HTTP Client (Axios) kurulumu tamamlandı!',
      '',
      '📌 Sonraki adımlar:',
      '  1. src/lib/http.ts dosyasında BASE_URL\'i güncelleyin',
      '  2. main.tsx\'e AuthProvider\'ı (AuthContext\'ten) sarın',
      '  3. BaseService\'i extend ederek servislerinizi oluşturun',
    ],
  },
  {
    name: 'signalr',
    title: 'Real-time (SignalR)',
    description: 'SignalR HubConnection yönetimi, otomatik reconnect, MessageHubContext, useSignalR hook\'ları',
    packages: ['@microsoft/signalr'],
    registryDependencies: [],
    postInstall: [
      '',
      '📦 SignalR kurulumu tamamlandı!',
      '',
      '📌 Sonraki adımlar:',
      '  1. src/lib/signalr.ts dosyasında HUB_URL\'i güncelleyin',
      '  2. main.tsx\'e MessageHubProvider\'ı sarın (AuthProvider\'ın içine alın)',
      '  3. useMessageHub hook\'unu component\'lerde kullanın',
    ],
  },
  {
    name: 'table',
    title: 'Data Table (TanStack Table)',
    description: 'TanStack Table wrapper, sıralama, filtreleme, sayfalama, export, skeleton',
    packages: ['@tanstack/react-table'],
    registryDependencies: ['@msi/skeleton', '@msi/input'],
    postInstall: [
      '',
      '📦 Data Table (TanStack Table) kurulumu tamamlandı!',
      '',
      '📌 Kullanım:',
      '  import { CustomTable } from "@/components/custom-table"',
      '  <CustomTable columns={columns} data={data} />',
    ],
  },
  {
    name: 'forms',
    title: 'Form Yönetimi (Formik + Yup)',
    description: 'Formik + Yup entegrasyonu, MSI UI Kit\'e bağlı form component\'leri ve Validations sabitleri',
    packages: ['formik', 'yup'],
    registryDependencies: [
      '@msi/text-field',
      '@msi/select',
      '@msi/checkbox',
      '@msi/date-picker',
      '@msi/radio-buttons',
      '@msi/label',
    ],
    postInstall: [
      '',
      '📦 Form Yönetimi (Formik + Yup) kurulumu tamamlandı!',
      '',
      '📌 Kullanım:',
      '  import { FormikTextField, FormikSelect } from "@/components/formik"',
      '  Validasyon şemaları: src/constants/Validations.ts',
    ],
  },
];
