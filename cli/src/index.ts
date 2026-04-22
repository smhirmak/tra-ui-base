#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import { PLUGINS } from './plugins.js';
import type { PackageManager } from './types.js';

// ─── Sabitler ────────────────────────────────────────────────────────────────
// TODO: GitLab Pages deploy sonrası gerçek URL ile güncelle
// Self-hosted GitLab Pages URL formatı:
//   https://gitlab.sirket.com.tr/<group>/tra-ui-base/r/{name}.json
//   veya subdomain kullanıyorsa:
//   https://<group>.gitlab.sirket.com.tr/tra-ui-base/r/{name}.json
const TRA_REGISTRY_URL = 'https://tra-ui-base.vercel.app/r/{name}.json';
const LOCAL_REGISTRY_URL = 'http://localhost:3030/r/{name}.json';
const MSI_REGISTRY_URL = 'https://msi-ui-kit.vercel.app/r/{name}.json';
const TEMPLATE_REPO = 'https://git.trabilisim.tech/developers/tra-ui-base';

const program = new Command();

program
  .name('tra-ui')
  .description('TRA UI Base CLI — Plugin installer for tra-ui-base projects')
  .version('0.1.0');

// ─── ADD komutu ──────────────────────────────────────────────────────────────
program
  .command('add [plugins...]')
  .description('Plugin ekler. Argümansız çalıştırılırsa interaktif seçim gösterir.')
  .option('--pm <manager>', 'Paket yöneticisi: npm | pnpm | yarn | bun', 'npm')
  .option('--local', 'Lokal registry kullan (http://localhost:3030) — test amaçlı)', false)
  .action(async (pluginNames: string[], options: { pm: PackageManager; local: boolean }) => {
    if (pluginNames.length === 0) {
      await interactiveAdd(options.pm, options.local);
    } else {
      await installPlugins(pluginNames, options.pm, options.local);
    }
  });

// ─── CREATE komutu ──────────────────────────────────────────────────────────
program
  .command('create <project-name>')
  .description('Yeni bir TRA UI Base projesi oluşturur.')
  .action(async (projectName: string) => {
    await createProject(projectName);
  });

// ─── LIST komutu ─────────────────────────────────────────────────────────────
program
  .command('list')
  .description('Kullanılabilir plugin\'leri listeler.')
  .action(() => listPlugins());

// ─── INFO komutu ─────────────────────────────────────────────────────────────
program
  .command('info <plugin>')
  .description('Bir plugin hakkında detaylı bilgi gösterir.')
  .action((pluginName: string) => showPluginInfo(pluginName));

// ─── Interaktif seçim ────────────────────────────────────────────────────────
async function interactiveAdd(pm: PackageManager, local = false): Promise<void> {
  console.log(`\n${chalk.bold.blue('TRA UI')} ${chalk.grey('— Plugin Yükleyici')}\n`);

  const { selected } = await inquirer.prompt<{ selected: string[] }>([
    {
      type: 'checkbox',
      name: 'selected',
      message: 'Yüklemek istediğiniz plugin\'leri seçin:',
      choices: PLUGINS.map((p) => ({
        name: `${chalk.cyan(p.name.padEnd(12))} ${chalk.grey('—')} ${p.description}`,
        value: p.name,
        short: p.title,
      })),
      pageSize: 10,
      validate: (answer: string[]) =>
        answer.length > 0 ? true : 'En az bir plugin seçmelisiniz.',
    },
  ]);

  if (selected.length === 0) {
    console.log(chalk.yellow('\nHiçbir plugin seçilmedi. Çıkılıyor.'));
    return;
  }

  console.log(
    `\n${chalk.green('✔')} ${selected.length} plugin seçildi: ${selected.map((s) => chalk.cyan(s)).join(', ')}\n`,
  );

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Kurulum başlatılsın mı?',
      default: true,
    },
  ]);

  if (!confirm) {
    console.log(chalk.yellow('Kurulum iptal edildi.'));
    return;
  }

  await installPlugins(selected, pm, local);
}

// ─── Plugin kurulum motoru ────────────────────────────────────────────────────
async function installPlugins(
  names: string[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _pm: PackageManager,
  local = false,
): Promise<void> {
  const cwd = process.cwd();

  // Validate
  const invalid = names.filter((n) => !PLUGINS.find((p) => p.name === n));
  if (invalid.length > 0) {
    console.log(chalk.red(`\n✗ Bilinmeyen plugin: ${invalid.join(', ')}`));
    console.log(`  Mevcut plugin'ler için: ${chalk.yellowBright('npx tra-ui list')}\n`);
    process.exit(1);
  }

  const plugins = names.map((n) => PLUGINS.find((p) => p.name === n)!);
  console.log(
    `\n${chalk.bold('Kurulacak plugin\'ler:')} ${plugins.map((p) => chalk.cyan(p.name)).join(', ')}\n`,
  );

  // 1. components.json var mı? @tra + @msi registry'leri ekli mi?
  const traRegistryUrl = local ? LOCAL_REGISTRY_URL : TRA_REGISTRY_URL;
  if (local) {
    console.log(chalk.yellow('  ⚠ Lokal registry kullanılıyor: http://localhost:3030\n'));
  }
  const registryOk = await ensureRegistries(cwd, traRegistryUrl);
  if (!registryOk) return;

  // 2. shadcn add @tra/plugin-xxx ... — tek çağrıda hepsi
  //    registryDependencies içindeki @msi bileşenleri shadcn tarafından otomatik çekilir.
  const shadcnTargets = names.map((n) => `@tra/plugin-${n}`);

  console.log(chalk.grey(`  → shadcn add ${shadcnTargets.join(' ')}\n`));

  try {
    await execa('npx', ['shadcn@latest', 'add', ...shadcnTargets, '-s'], {
      stdio: 'inherit',
      cwd,
    });
  } catch (err: any) {
    console.log(chalk.red(`\n✗ shadcn add başarısız oldu: ${String(err.message)}`));
    return;
  }

  // 3. Post-install mesajları
  for (const plugin of plugins) {
    if (plugin.postInstall.length > 0) {
      plugin.postInstall.forEach((line: string) => {
        if (line.startsWith('  ')) {
          console.log(chalk.grey(line));
        } else if (line.startsWith('📌') || line.startsWith('📦')) {
          console.log(chalk.yellowBright(line));
        } else {
          console.log(line);
        }
      });
    }
  }

  console.log(`\n${chalk.green('✔ Tüm plugin\'ler başarıyla yüklendi!')}\n`);
}

// ─── Registry yönetimi ────────────────────────────────────────────────────────
async function ensureRegistries(cwd: string, traUrl = TRA_REGISTRY_URL): Promise<boolean> {
  const componentJsonPath = path.join(cwd, 'components.json');

  if (!(await fs.pathExists(componentJsonPath))) {
    console.log(chalk.red('\n✗ components.json bulunamadı.'));
    console.log('  Önce MSI UI Kit\'i başlatın:');
    console.log(chalk.yellowBright('  npx msi-ui-cli init\n'));
    return false;
  }

  const json = (await fs.readJson(componentJsonPath)) as Record<string, unknown> & {
    registries?: Record<string, string>;
  };

  let changed = false;

  if (!json.registries) json.registries = {};

  // @tra — plugin'lerin ana kaynağı
  if (!json.registries['@tra'] || json.registries['@tra'] !== traUrl) {
    json.registries['@tra'] = traUrl;
    changed = true;
  }

  // @msi — forms/table pluginlerinin registryDependencies'i buradan çekilir
  if (!json.registries['@msi']) {
    json.registries['@msi'] = MSI_REGISTRY_URL;
    changed = true;
  }

  if (changed) {
    await fs.writeJson(componentJsonPath, json, { spaces: 2 });
    const spinner = ora('').succeed(
      chalk.grey('components.json güncellendi (@tra ve @msi registry\'leri eklendi)\n'),
    );
    void spinner;
  }

  return true;
}

// ─── Create ──────────────────────────────────────────────────────────────────
async function createProject(projectName: string): Promise<void> {
  const targetDir = path.resolve(process.cwd(), projectName);

  if (await fs.pathExists(targetDir)) {
    console.log(chalk.red(`\n✗ "${projectName}" klasörü zaten mevcut.\n`));
    process.exit(1);
  }

  console.log(`\n${chalk.bold.blue('TRA UI')} ${chalk.grey('— Yeni Proje')}\n`);
  console.log(`${chalk.grey('Proje:')} ${chalk.cyan(projectName)}`);
  console.log(`${chalk.grey('Kaynak:')} ${TEMPLATE_REPO}/template\n`);

  const spinner = ora('Template indiriliyor...').start();

  try {
    // git clone --depth 1 ile template'i çek
    await execa('git', [
      'clone',
      '--depth', '1',
      '--filter=blob:none',
      '--sparse',
      TEMPLATE_REPO,
      projectName,
    ], { cwd: process.cwd() });

    // sparse-checkout ile sadece template/ klasörünü al
    await execa('git', ['sparse-checkout', 'set', 'template'], { cwd: targetDir });

    // template/ içeriğini root'a taşı
    const templateDir = path.join(targetDir, 'template');
    const files = await fs.readdir(templateDir);
    for (const file of files) {
      await fs.move(path.join(templateDir, file), path.join(targetDir, file), { overwrite: true });
    }
    await fs.remove(templateDir);
    await fs.remove(path.join(targetDir, '.git'));

    spinner.succeed(chalk.green('Template indirildi!'));
  } catch (err: any) {
    spinner.fail(chalk.red('Template indirilemedi.'));
    console.log(chalk.grey(`  Hata: ${String(err.message)}`));
    console.log(chalk.grey('  git erişilebilir mi? Ağ bağlantısını kontrol edin.'));
    await fs.remove(targetDir).catch(() => {});
    process.exit(1);
  }

  console.log(`\n${chalk.bold('Sonraki adımlar:')}`);
  console.log(`  ${chalk.cyan(`cd ${projectName}`)}`);
  console.log(`  ${chalk.cyan('npm install')}`);
  console.log(`  ${chalk.cyan('npx msi-ui-cli init')}          ${chalk.grey('# UI Kit kurulumu')}`);
  console.log(`  ${chalk.cyan('npx @tra-bilisim/tra-ui add')}   ${chalk.grey('# Plugin ekle')}`);
  console.log();
}

// ─── List ─────────────────────────────────────────────────────────────────────
function listPlugins(): void {
  console.log(`\n${chalk.bold.blue('TRA UI')} ${chalk.grey('— Mevcut Plugin\'ler')}\n`);

  for (const p of PLUGINS) {
    console.log(`  ${chalk.cyan(p.name.padEnd(12))} ${chalk.grey('—')} ${p.description}`);
  }

  console.log('\n' + chalk.grey('Kullanım:'));
  console.log(
    `  ${chalk.yellowBright('npx tra-ui add')}            ${chalk.grey('→ interaktif seçim')}`,
  );
  console.log(
    `  ${chalk.yellowBright('npx tra-ui add i18n')}       ${chalk.grey('→ sadece i18n')}`,
  );
  console.log(
    `  ${chalk.yellowBright('npx tra-ui add i18n http')}  ${chalk.grey('→ birden fazla')}`,
  );
  console.log(
    `  ${chalk.yellowBright('npx tra-ui info i18n')}      ${chalk.grey('→ detaylı bilgi')}\n`,
  );
}

// ─── Info ─────────────────────────────────────────────────────────────────────
function showPluginInfo(name: string): void {
  const plugin = PLUGINS.find((p) => p.name === name);

  if (!plugin) {
    console.log(chalk.red(`\n✗ "${name}" adında bir plugin bulunamadı.`));
    console.log(
      `  Mevcut plugin'ler: ${PLUGINS.map((p) => chalk.cyan(p.name)).join(', ')}\n`,
    );
    process.exit(1);
  }

  console.log(`\n${chalk.bold.blue(plugin.title)}\n`);
  console.log(`${chalk.grey('Açıklama:')}    ${plugin.description}\n`);
  console.log(
    `${chalk.grey('shadcn adı:')}  ${chalk.cyan(`@tra/plugin-${plugin.name}`)}\n`,
  );

  if (plugin.packages.length > 0) {
    console.log(chalk.grey('npm bağımlılıklar:'));
    plugin.packages.forEach((p: string) => console.log(`  ${chalk.yellowBright(p)}`));
  }

  if (plugin.registryDependencies.length > 0) {
    console.log(`\n${chalk.grey('MSI UI Kit bileşenleri (registryDependencies — otomatik yüklenir):')}`);
    plugin.registryDependencies.forEach((d: string) =>
      console.log(`  ${chalk.magenta(d)}`),
    );
  }

  if (plugin.postInstall.length > 0) {
    console.log(`\n${chalk.grey('Kurulum sonrası:')}`);
    plugin.postInstall
      .filter((l: string) => l.trim())
      .forEach((l: string) => console.log(chalk.grey(`  ${l.trim()}`)));
  }

  console.log('');
}

program.parse();
