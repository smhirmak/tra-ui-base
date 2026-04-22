export interface Plugin {
  /** CLI adı — `npx tra-ui add <name>` */
  name: string;
  title: string;
  description: string;
  /** npm bağımlılıkları — registry.json'dan kopyalanmış, bilgi amaçlı */
  packages: string[];
  /** registryDependencies — shadcn otomatik çeker */
  registryDependencies: string[];
  postInstall: string[];
}

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
