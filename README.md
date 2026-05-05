# TRA UI Base

TRA Bilişim React projelerinin standart başlangıç altyapısı.  
Yeni proje iskeleti + sonradan eklenebilen modüler plugin sistemi.

---

## Hızlı Başlangıç

### 1. Yeni Proje Oluştur

```bash
npx @tra-bilisim/tra-ui create my-project
code -r my-project
```

> `create` komutu template'i indirir, `npm install` ve `npx tra-ui-cli init` adımlarını otomatik çalıştırır. Proje hazır!

### 2. İstediğin Plugin'leri Ekle

```bash
# İnteraktif seçim (checkbox)
npx @tra-bilisim/tra-ui add

# Doğrudan kurulum
npx @tra-bilisim/tra-ui add i18n
npx @tra-bilisim/tra-ui add i18n http table
```

---

## Template İçeriği

`degit` ile kopyalanan proje şunları içerir:

| Katman        | Teknoloji                                      |
| ------------- | ---------------------------------------------- |
| Build         | Vite 6 + TypeScript 5                          |
| Router        | TanStack Router v1 + DevTools                  |
| Data Fetching | TanStack Query v5 + DevTools                   |
| CSS           | Tailwind CSS v4                                |
| UI Kit        | TRA UI Kit (create sırasında otomatik kurulur) |
| Linting       | ESLint (airbnb config)                         |

```
src/
├── contexts/theme/     # ThemeProvider (dark/light)
├── lib/utils.ts        # cn() yardımcısı
├── routes/             # TanStack Router (file-based)
│   ├── __root.tsx
│   └── index.tsx
├── main.tsx
└── styles.css
```

---

## Plugin'ler

Her plugin `npx tra-ui add <name>` komutu ile projeye eklenir.  
Dosyalar **projeye kopyalanır** — sürüm bağımlılığı yoktur, her proje kendi kopyasını serbestçe özelleştirebilir.

| Plugin      | İçerik                                                                       | Komut                                 |
| ----------- | ---------------------------------------------------------------------------- | ------------------------------------- |
| **i18n**    | Paraglide (inlang) compile-time çeviri, LocaleContext, TR/EN mesaj dosyaları | `npx @tra-bilisim/tra-ui add i18n`    |
| **http**    | Axios instance, token interceptor, 401 refresh, AuthContext, BaseService     | `npx @tra-bilisim/tra-ui add http`    |
| **signalr** | SignalR HubConnection, otomatik reconnect, MessageHubContext, hook'lar       | `npx @tra-bilisim/tra-ui add signalr` |
| **table**   | TanStack Table v8 wrapper, filtreleme, sayfalama, skeleton                   | `npx @tra-bilisim/tra-ui add table`   |
| **forms**   | Formik + Yup, TRA UI Kit'e bağlı form bileşenleri, Validations sabitleri     | `npx @tra-bilisim/tra-ui add forms`   |

### CLI Komutları

```bash
npx @tra-bilisim/tra-ui add              # interaktif checkbox seçimi
npx @tra-bilisim/tra-ui add i18n         # tek plugin
npx @tra-bilisim/tra-ui add i18n http    # birden fazla
npx @tra-bilisim/tra-ui list             # mevcut plugin'leri listele
npx @tra-bilisim/tra-ui info http        # plugin hakkında detay
```

---

## Repo Yapısı

```
tra-ui-base/
├── template/                  # degit ile kopyalanan proje iskeleti
├── core/                      # shadcn registry sunucusu
│   ├── registry.json          # 5 plugin tanımı
│   ├── public/r/              # Build çıktısı — Vercel'e deploy edilir
│   └── registry/tra-plugins/  # Plugin kaynak dosyaları
│       ├── i18n/
│       ├── http/
│       ├── signalr/
│       ├── table/
│       └── forms/
└── cli/                       # tra-ui CLI (npm: tra-ui)
    └── src/
        ├── index.ts           # add | list | info komutları
        ├── plugins.ts         # Plugin metadata
        └── types.ts
```

---

## Plugin Nasıl Çalışır?

Plugin sistemi **shadcn registry** tabanlıdır:

```
core/registry/tra-plugins/  →  npm run registry:build  →  core/public/r/*.json
                                                           (Vercel deploy)
```

`npx tra-ui add forms` çağrıldığında CLI:

1. `components.json`'a `@tra-base` ve `@tra-kit` registry URL'lerini ekler
2. `shadcn add @tra-base/plugin-forms` çalıştırır
3. shadcn dosyaları `target` path'lerine kopyalar (var olan dosyayı **itmez, merge eder**)
4. `formik`, `yup` npm paketlerini kurar
5. `registryDependencies` içindeki TRA UI Kit bileşenlerini (`@tra-kit/text-field` vb.) otomatik çeker

---

## Geliştirme

### Registry Build

```bash
cd core
npm run registry:build    # → public/r/*.json yenilenir
```

### CLI Build

```bash
cd cli
npm run build             # → dist/index.js
```

### Yeni Plugin Ekleme

1. `core/registry/tra-plugins/<plugin-name>/` klasörünü oluştur, dosyaları yaz
2. `core/registry.json`'a yeni item ekle (`name`, `dependencies`, `files`)
3. `cli/src/plugins.ts`'e metadata ekle (`postInstall` mesajları dahil)
4. `cd core && npm run registry:build`
5. `cd cli && npm run build`
6. Deploy → canlıya alınır

---

## Deploy

`core/public/` klasörü Vercel'e statik site olarak deploy edilir.  
Registry URL: `https://tra-ui-base.vercel.app/r/{name}.json`

> Deploy sonrası `cli/src/index.ts` içindeki `TRA_REGISTRY_URL`'nin bu URL ile eşleştiğini kontrol et.

---

## Bağlı Projeler

| Proje                                                  | Açıklama                                      |
| ------------------------------------------------------ | --------------------------------------------- |
| [TRA UI Kit](https://github.com/smhirmak/tra-ui-kit)   | Temel UI bileşen kütüphanesi (shadcn tabanlı) |
| [tra-ui-cli](https://www.npmjs.com/package/tra-ui-cli) | TRA UI Kit CLI — `npx tra-ui-cli init`        |
