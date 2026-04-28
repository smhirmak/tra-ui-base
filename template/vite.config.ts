import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { devtools } from '@tanstack/devtools-vite';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
// import { paraglide } from "@inlang/paraglide-vite"

export default defineConfig({
  plugins: [
    // Devtools portu .env'den okunur (VITE_DEVTOOLS_PORT=42070)
    // Birden fazla proje açıkken çakışmayı önlemek için her proje farklı port kullanmalı
    devtools({ eventBusConfig: { port: Number(process.env.VITE_DEVTOOLS_PORT) || 42069 } }),
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    // [i18n] Paraglide plugin buraya eklenir (npx tra-ui add i18n sonrası):
    // paraglide({ project: "./src/project.inlang", outdir: "./src/paraglide" })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
