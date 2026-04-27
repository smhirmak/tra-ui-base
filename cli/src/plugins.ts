import type { Plugin } from './types.js';

/**
 * Plugin metadata list.
 * File copying is handled via the shadcn registry.
 * This array is used for list, info and post-install messages.
 */
export const PLUGINS: Plugin[] = [
  {
    name: 'i18n',
    title: 'Internationalization (Paraglide)',
    description: 'Compile-time i18n with inlang Paraglide. TR/EN language support, LocaleContext, locale hook',
    packages: ['@inlang/paraglide-js', '@inlang/paraglide-vite'],
    registryDependencies: [],
    postInstall: [
      '',
      '📦 i18n (Paraglide) installed!',
      '',
      '📌 Next steps:',
      '  1. Add the Paraglide plugin to vite.config.ts:',
      '     import { paraglide } from "@inlang/paraglide-vite"',
      '     plugins: [ paraglide({ project: "./project.inlang", outdir: "./src/paraglide" }) ]',
      '  2. Wrap your app with LocaleProvider in main.tsx',
      '  3. Add your translations to the messages/ folder',
    ],
  },
  {
    name: 'http',
    title: 'HTTP Client (Axios)',
    description: 'Axios instance, token interceptor, 401 refresh, centralized error handling, AuthContext and BaseService',
    packages: ['axios'],
    registryDependencies: [],
    postInstall: [
      '',
      '📦 HTTP Client (Axios) installed!',
      '',
      '📌 Next steps:',
      '  1. Update BASE_URL in src/lib/http.ts',
      '  2. Wrap your app with AuthProvider (from AuthContext) in main.tsx',
      '  3. Extend BaseService to create your services',
    ],
  },
  {
    name: 'signalr',
    title: 'Real-time (SignalR)',
    description: 'SignalR HubConnection management, auto-reconnect, MessageHubContext, useSignalR hooks',
    packages: ['@microsoft/signalr'],
    registryDependencies: [],
    postInstall: [
      '',
      '📦 SignalR installed!',
      '',
      '📌 Next steps:',
      '  1. Update HUB_URL in src/lib/signalr.ts',
      '  2. Wrap your app with MessageHubProvider in main.tsx (inside AuthProvider)',
      '  3. Use the useMessageHub hook in your components',
    ],
  },
  {
    name: 'table',
    title: 'Data Table (TanStack Table)',
    description: 'TanStack Table wrapper with sorting, filtering, pagination, export and skeleton support',
    packages: ['@tanstack/react-table'],
    registryDependencies: ['@msi/skeleton', '@msi/input'],
    postInstall: [
      '',
      '📦 Data Table (TanStack Table) installed!',
      '',
      '📌 Usage:',
      '  import { CustomTable } from "@/components/custom-table"',
      '  <CustomTable columns={columns} data={data} />',
    ],
  },
  {
    name: 'forms',
    title: 'Form Management (Formik + Yup)',
    description: 'Formik + Yup integration, MSI UI Kit-bound form components and shared Validations constants',
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
      '📦 Form Management (Formik + Yup) installed!',
      '',
      '📌 Usage:',
      '  import { FormikTextField, FormikSelect } from "@/components/formik"',
      '  Validation schemas: src/constants/Validations.ts',
    ],
  },
];
