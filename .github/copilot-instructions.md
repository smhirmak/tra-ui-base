# TRA UI Base — Copilot Instructions

Bu dosya GitHub Copilot'un proje bağlamını her oturumda otomatik okuması için hazırlanmıştır.

---

## Proje Amacı

`tra-ui-base`, TRA Bilişim bünyesindeki React projelerinin standart başlangıç noktasıdır.  
İki katmanlı bir yapı sunar:

1. **`template/`** — `degit` ile kopyalanan yeni proje iskeleti
2. **Plugin sistemi** — `npx tra-ui add` komutu ile projeye sonradan eklenebilen bağımsız yapılar

---

## Repo Yapısı

```
tra-ui-base/
├── template/                  # degit ile kopyalanan proje iskeleti
│   ├── src/
│   │   ├── contexts/theme/    # ThemeProvider (tra-ui-kit dark/light)
│   │   ├── lib/utils.ts       # cn() yardımcısı
│   │   ├── routes/            # TanStack Router (file-based)
│   │   │   ├── __root.tsx
│   │   │   └── index.tsx
│   │   ├── routeTree.gen.ts   # TanStack Router otomatik üretilen dosya
│   │   ├── main.tsx
│   │   └── styles.css         # Tailwind CSS v4 direktifleri
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .eslintrc.json         # airbnb config
│   ├── .env.example
│   └── package.json           # Vite + TS + TanStack Router/Query + Tailwind
│
├── core/                      # shadcn registry sunucusu
│   ├── registry.json          # 5 plugin tanımı (shadcn build input)
│   ├── package.json           # "registry:build": "shadcn build"
│   ├── vite.config.ts
│   ├── public/r/              # BUILD ÇIKTISI — deploy edilir
│   │   ├── plugin-i18n.json
│   │   ├── plugin-http.json
│   │   ├── plugin-signalr.json
│   │   ├── plugin-table.json
│   │   ├── plugin-forms.json
│   │   └── registry.json
│   └── registry/tra-plugins/  # shadcn'ın okuduğu kaynak dosyalar
│       ├── i18n/              # lib/, contexts/, hooks/, messages/, project.inlang/
│       ├── http/              # lib/, contexts/auth/, hooks/, services/
│       ├── signalr/           # lib/, contexts/messageHub/, hooks/
│       ├── table/             # components/, hooks/, types/
│       └── forms/             # components/formik/, constants/
│
└── cli/                       # tra-ui CLI (npm paketi: tra-ui)
    ├── src/
    │   ├── index.ts           # Commander.js: add | list | info komutları
    │   ├── plugins.ts         # Plugin metadata (list/info/postInstall mesajları)
    │   └── types.ts           # Plugin arayüzü
    ├── dist/                  # BUILD ÇIKTISI
    └── package.json           # bin: "tra-ui"
```

---

## Teknoloji Stack'i

### Template (Yeni Proje Tabanı)

| Katman        | Teknoloji                                  |
| ------------- | ------------------------------------------ |
| Build         | Vite 6 + TypeScript 5                      |
| Router        | TanStack Router v1 (file-based) + DevTools |
| Data Fetching | TanStack Query v5 + DevTools               |
| UI Kit        | TRA UI Kit (`npx tra-ui-cli init`)         |
| CSS           | Tailwind CSS v4                            |
| Linting       | ESLint (airbnb config)                     |

### Opsiyonel Plugin'ler

| Plugin    | Teknoloji                             | CLI Adı                               |
| --------- | ------------------------------------- | ------------------------------------- |
| i18n      | Paraglide (inlang) — compile-time     | `npx @tra-bilisim/tra-ui add i18n`    |
| HTTP      | Axios + interceptors + AuthContext    | `npx @tra-bilisim/tra-ui add http`    |
| Real-time | Microsoft SignalR + React hooks       | `npx @tra-bilisim/tra-ui add signalr` |
| Tablo     | TanStack Table v8 wrapper             | `npx @tra-bilisim/tra-ui add table`   |
| Form      | Formik + Yup + TRA UI Kit bileşenleri | `npx @tra-bilisim/tra-ui add forms`   |

---

## Plugin Sistemi Nasıl Çalışır?

Plugin'ler **shadcn registry** üzerinden dağıtılır — npm paketi değil, kaynak kodu kopyalama yöntemidir.

```
registry.json  →  npm run registry:build  →  public/r/plugin-xxx.json
                                              (Vercel'e deploy edilir)
```

CLI, `shadcn add @tra-base/plugin-xxx` komutunu çağırır. shadcn:

- Dosyaları `target` path'lerine kopyalar (var olanla merge eder, ezmez)
- `dependencies` içindeki npm paketlerini otomatik kurar
- `registryDependencies` içindeki TRA UI Kit bileşenlerini otomatik çeker

### Registry URL'leri (components.json)

```json
{
  "registries": {
    "@tra-base": "https://tra-ui-base.vercel.app/r/{name}.json",
    "@tra-kit": "https://ui.trabilisim.tech/r/{name}.json"
  }
}
```

---

## CLI Komutları

```bash
npx @tra-bilisim/tra-ui add              # interaktif checkbox ile çoklu seçim
npx @tra-bilisim/tra-ui add i18n         # tek plugin
npx @tra-bilisim/tra-ui add i18n http    # birden fazla
npx @tra-bilisim/tra-ui list             # mevcut plugin'leri listele
npx @tra-bilisim/tra-ui info http        # plugin detayı
```

---

## Geliştirme Notları

### Plugin dosyası değiştirmek

1. `core/registry/tra-plugins/<plugin>/` altında düzenle
2. `cd core && npm run registry:build` çalıştır → `public/r/` güncellenir
3. Deploy → değişiklik canlıya alınır

### Yeni plugin eklemek

1. `core/registry/tra-plugins/<yeni-plugin>/` klasörü oluştur ve dosyaları yaz
2. `core/registry.json`'a yeni item ekle
3. `cli/src/plugins.ts`'e metadata ekle
4. `cd core && npm run registry:build`
5. `cd cli && npm run build`

### CLI build

```bash
cd cli && npm run build    # → dist/index.js
```

### Registry build

```bash
cd core && npm run registry:build   # → public/r/*.json
```

---

## Önemli Kurallar

- `core/public/r/` klasörü **build çıktısıdır**, elle düzenleme yapma — her zaman `registry:build` ile üret
- `plugins/` klasörü **silinmiştir** — canonical kaynak `core/registry/tra-plugins/`
- Template içindeki `components.json` **`npx tra-ui-cli init`** tarafından eklenir, template'e dahil değildir
- Plugin'ler projeye kopyalandıktan sonra projede yaşar — `tra-ui-base`'e bağımlılık yoktur
