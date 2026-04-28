import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { devtools } from '@tanstack/devtools-vite';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
// import { paraglideVitePlugin } from "@inlang/paraglide-js";

export default defineConfig({
  plugins: [
    devtools({ eventBusConfig: { port: Number(process.env.VITE_DEVTOOLS_PORT) || 42069 } }),
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    // [i18n] Paraglide plugin buraya eklenir (npx @tra-bilisim/tra-ui add i18n sonrası):
    // paraglideVitePlugin({ project: "./src/project.inlang", outdir: "./src/paraglide" }),
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
