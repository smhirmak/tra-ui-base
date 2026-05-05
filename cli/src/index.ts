#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import { PLUGINS } from "./plugins.js";
import type { PackageManager } from "./types.js";

// ─── Constants ───────────────────────────────────────────────────────────────
// TODO: Update with the actual URL after GitLab Pages deployment
// Self-hosted GitLab Pages URL format:
//   https://gitlab.yourcompany.com/<group>/tra-ui-base/r/{name}.json
//   or if using subdomain:
//   https://<group>.gitlab.yourcompany.com/tra-ui-base/r/{name}.json
const TRA_REGISTRY_URL = "https://tra-ui-base.vercel.app/r/{name}.json";
const LOCAL_REGISTRY_URL = "http://localhost:3030/r/{name}.json";
const TRA_KIT_REGISTRY_URL = "https://ui.trabilisim.tech/r/{name}.json";
const TEMPLATE_REPO = "https://github.com/smhirmak/tra-ui-base.git";
// const TEMPLATE_REPO = 'https://git.trabilisim.tech/developers/tra-ui-base.git';
const TEMPLATE_BRANCH = "develop";

const program = new Command();

program
  .name("tra-ui")
  .description("TRA UI Base CLI — Plugin installer for tra-ui-base projects")
  .version("0.1.0");

// ─── ADD komutu ──────────────────────────────────────────────────────────────
program
  .command("add [plugins...]")
  .description("Adds plugins. Runs interactive selection if no arguments are provided.")
  .option("--pm <manager>", "Package manager: npm | pnpm | yarn | bun", "npm")
  .option("--local", "Use local registry (http://localhost:3030) — for testing only", false)
  .action(async (pluginNames: string[], options: { pm: PackageManager; local: boolean }) => {
    if (pluginNames.length === 0) {
      await interactiveAdd(options.pm, options.local);
    } else {
      await installPlugins(pluginNames, options.pm, options.local);
    }
  });

// ─── CREATE komutu ──────────────────────────────────────────────────────────
program
  .command("create [project-name]")
  .description("Creates a new TRA UI Base project.")
  .action(async (projectName?: string) => {
    let name = projectName;
    if (!name) {
      const { inputName } = await inquirer.prompt<{ inputName: string }>([
        {
          type: "input",
          name: "inputName",
          message: "Project name:",
          validate: (v: string) => v.trim().length > 0 || "Project name is required.",
        },
      ]);
      name = inputName.trim();
    }
    await createProject(name);
  });

// ─── LIST komutu ─────────────────────────────────────────────────────────────
program
  .command("list")
  .description("Lists available plugins.")
  .action(() => listPlugins());

// ─── INFO komutu ─────────────────────────────────────────────────────────────
program
  .command("info <plugin>")
  .description("Shows detailed information about a plugin.")
  .action((pluginName: string) => showPluginInfo(pluginName));

// ─── Interaktif seçim ────────────────────────────────────────────────────────
async function interactiveAdd(pm: PackageManager, local = false): Promise<void> {
  console.log(`\n${chalk.bold.blue("TRA UI")} ${chalk.grey("— Plugin Installer")}\n`);

  const { selected } = await inquirer.prompt<{ selected: string[] }>([
    {
      type: "checkbox",
      name: "selected",
      message: "Select plugins to install:",
      choices: PLUGINS.map((p) => ({
        name: `${chalk.cyan(p.name.padEnd(12))} ${chalk.grey("—")} ${p.description}`,
        value: p.name,
        short: p.title,
      })),
      pageSize: 10,
      validate: (answer: string[]) =>
        answer.length > 0 ? true : "Please select at least one plugin.",
    },
  ]);

  if (selected.length === 0) {
    console.log(chalk.yellow("\nNo plugins selected. Exiting."));
    return;
  }

  console.log(
    `\n${chalk.green("✔")} ${selected.length} plugin(s) selected: ${selected.map((s) => chalk.cyan(s)).join(", ")}\n`
  );

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: "confirm",
      name: "confirm",
      message: "Start installation?",
      default: true,
    },
  ]);

  if (!confirm) {
    console.log(chalk.yellow("Installation cancelled."));
    return;
  }

  await installPlugins(selected, pm, local);
}

// ─── Plugin kurulum motoru ────────────────────────────────────────────────────
async function installPlugins(
  names: string[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _pm: PackageManager,
  local = false
): Promise<void> {
  const cwd = process.cwd();

  // Validate
  const invalid = names.filter((n) => !PLUGINS.find((p) => p.name === n));
  if (invalid.length > 0) {
    console.log(chalk.red(`\n✗ Unknown plugin(s): ${invalid.join(", ")}`));
    console.log(`  See available plugins: ${chalk.yellowBright("npx tra-ui list")}\n`);
    process.exit(1);
  }

  const plugins = names.map((n) => PLUGINS.find((p) => p.name === n)!);
  console.log(
    `\n${chalk.bold("Plugins to install:")} ${plugins.map((p) => chalk.cyan(p.name)).join(", ")}\n`
  );

  // 1. Check components.json and ensure @tra-base + @tra-kit registries are present
  const traRegistryUrl = local ? LOCAL_REGISTRY_URL : TRA_REGISTRY_URL;
  if (local) {
    console.log(chalk.yellow("  ⚠ Using local registry: http://localhost:3030\n"));
  }
  const registryOk = await ensureRegistries(cwd, traRegistryUrl);
  if (!registryOk) return;

  // 2. shadcn add @tra-base/plugin-xxx ... — all in one call
  //    @tra-kit components in registryDependencies are pulled automatically by shadcn
  const shadcnTargets = names.map((n) => `@tra-base/plugin-${n}`);

  const spinner = ora("Installing plugins...").start();

  try {
    await execa("npx", ["shadcn@latest", "add", ...shadcnTargets, "-o", "-s"], {
      stdio: "pipe",
      cwd,
    });
    spinner.succeed(chalk.green("Plugins installed"));
  } catch (err: any) {
    spinner.fail(chalk.red("Plugin installation failed"));
    console.log(chalk.red(`\n✗ Installation error: ${String(err.stderr || err.message)}`));
    return;
  }

  // 3. Post-install messages
  for (const plugin of plugins) {
    if (plugin.postInstall.length > 0) {
      plugin.postInstall.forEach((line: string) => {
        if (line.startsWith("  ")) {
          console.log(chalk.grey(line));
        } else if (line.startsWith("📌") || line.startsWith("📦")) {
          console.log(chalk.yellowBright(line));
        } else {
          console.log(line);
        }
      });
    }
  }

  console.log(`\n${chalk.green("✔ All plugins installed successfully!")}\n`);
}

// ─── Registry yönetimi ────────────────────────────────────────────────────────
async function ensureRegistries(cwd: string, traUrl = TRA_REGISTRY_URL): Promise<boolean> {
  const componentJsonPath = path.join(cwd, "components.json");

  if (!(await fs.pathExists(componentJsonPath))) {
    console.log(chalk.red("\n✗ components.json not found."));
    console.log("  Please initialize TRA UI Kit first:");
    console.log(chalk.yellowBright("  npx tra-ui-cli init\n"));
    return false;
  }

  const json = (await fs.readJson(componentJsonPath)) as Record<string, unknown> & {
    registries?: Record<string, string>;
  };

  let changed = false;

  if (!json.registries) json.registries = {};

  // @tra-base — source for plugins
  if (!json.registries["@tra-base"] || json.registries["@tra-base"] !== traUrl) {
    json.registries["@tra-base"] = traUrl;
    changed = true;
  }

  // @tra-kit — pulled automatically via registryDependencies for forms/table plugins
  if (!json.registries["@tra-kit"]) {
    json.registries["@tra-kit"] = TRA_KIT_REGISTRY_URL;
    changed = true;
  }

  if (changed) {
    await fs.writeJson(componentJsonPath, json, { spaces: 2 });
    const spinner = ora("").succeed(
      chalk.grey("components.json updated (@tra-base and @tra-kit registries added)\n")
    );
    void spinner;
  }

  return true;
}

// ─── Create ──────────────────────────────────────────────────────────────────
async function createProject(projectName: string): Promise<void> {
  const targetDir = path.resolve(process.cwd(), projectName);

  if (await fs.pathExists(targetDir)) {
    console.log(chalk.red(`\n✗ Directory "${projectName}" already exists.\n`));
    process.exit(1);
  }

  console.log(`\n${chalk.bold.blue("TRA UI")} ${chalk.grey("— New Project")}\n`);
  console.log(`${chalk.grey("Project:")} ${chalk.cyan(projectName)}`);
  console.log(`${chalk.grey("Source:")}  ${TEMPLATE_REPO} (${TEMPLATE_BRANCH})\n`);

  const spinner = ora("Downloading template...").start();

  try {
    // git clone --depth 1, fetch only template/ folder
    await execa(
      "git",
      [
        "clone",
        "--depth",
        "1",
        "--filter=blob:none",
        "--sparse",
        "--branch",
        TEMPLATE_BRANCH,
        TEMPLATE_REPO,
        projectName,
      ],
      { cwd: process.cwd() }
    );

    // Fetch only the template/ folder via sparse-checkout
    await execa("git", ["sparse-checkout", "set", "template"], {
      cwd: targetDir,
    });

    // Move template/ contents to project root
    const templateDir = path.join(targetDir, "template");
    const files = await fs.readdir(templateDir);
    for (const file of files) {
      await fs.move(path.join(templateDir, file), path.join(targetDir, file), {
        overwrite: true,
      });
    }
    await fs.remove(templateDir);
    await fs.remove(path.join(targetDir, ".git"));

    spinner.succeed(chalk.green("Template downloaded!"));

    // 1. npm install
    console.log(`\n${chalk.bold("1/2")} ${chalk.grey("Installing dependencies...")}`);
    try {
      await execa("npm", ["install"], { stdio: "inherit", cwd: targetDir });
      console.log(chalk.green("✔ npm install completed"));
    } catch {
      console.log(
        chalk.yellow(
          "⚠ npm install failed — run manually: code -r " + projectName + " && npm install"
        )
      );
    }

    // 2. TRA UI Kit init — no spinner, run directly with stdio: inherit
    console.log(`\n${chalk.bold("2/2")} ${chalk.grey("Setting up TRA UI Kit...")}`);
    let traUiKitInstalled = false;
    try {
      await execa("npx", ["tra-ui-cli", "init", "-y"], {
        stdio: "inherit",
        cwd: targetDir,
      });
      console.log(chalk.green("✔ TRA UI Kit installed"));
      traUiKitInstalled = true;
    } catch {
      console.log(chalk.yellow("⚠ TRA UI Kit setup failed — run manually: npx tra-ui-cli init"));
    }
    if (traUiKitInstalled) {
      try {
        await execa("npx", ["tra-ui-cli", "add", "theme-mode-toggle"], {
          stdio: "inherit",
          cwd: targetDir,
        });
        console.log(chalk.green("✔ Theme Mode Toggle Component added"));
      } catch {
        console.log(
          chalk.yellow(
            "⚠ Theme Mode Toggle setup failed — run manually: npx tra-ui-cli add theme-mode-toggle"
          )
        );
      }
    }
  } catch (err: any) {
    spinner.fail(chalk.red("Failed to download template."));
    console.log(chalk.grey(`  Error: ${String(err.message)}`));
    console.log(chalk.grey("  Is git accessible? Check your network connection."));
    await fs.remove(targetDir).catch(() => {});
    process.exit(1);
  }

  console.log(`\n${chalk.green("✔")} ${chalk.bold(projectName)} is ready!\n`);
  console.log(`${chalk.bold("Next steps:")}`);
  // Ask user before opening the project in VS Code
  try {
    const { openNow } = await inquirer.prompt<{ openNow: boolean }>([
      {
        type: "confirm",
        name: "openNow",
        message: "Open project in VS Code now?",
        default: true,
      },
    ]);

    if (openNow) {
      try {
        await execa("code", ["-r", targetDir]);
        console.log(chalk.green(`  Opened ${projectName} in VS Code`));
      } catch {
        console.log(chalk.yellow("  ⚠ Failed to open VS Code — run manually:"));
        console.log(`  ${chalk.cyan(`code -r ${projectName}`)}`);
      }
    } else {
      console.log(`  ${chalk.cyan(`code -r ${projectName}`)}`);
    }
  } catch {
    // If inquirer fails for any reason, fallback to printing the command
    console.log(`  ${chalk.cyan(`code -r ${projectName}`)}`);
  }
  console.log(`  ${chalk.cyan("npx @tra-bilisim/tra-ui add")}   ${chalk.grey("# Add plugins")}`);
  console.log();
}

// ─── List ─────────────────────────────────────────────────────────────────────
function listPlugins(): void {
  console.log(`\n${chalk.bold.blue("TRA UI")} ${chalk.grey("— Available Plugins")}\n`);

  for (const p of PLUGINS) {
    console.log(`  ${chalk.cyan(p.name.padEnd(12))} ${chalk.grey("—")} ${p.description}`);
  }

  console.log("\n" + chalk.grey("Usage:"));
  console.log(
    `  ${chalk.yellowBright("npx tra-ui add")}            ${chalk.grey("→ interactive selection")}`
  );
  console.log(
    `  ${chalk.yellowBright("npx tra-ui add i18n")}       ${chalk.grey("→ single plugin")}`
  );
  console.log(
    `  ${chalk.yellowBright("npx tra-ui add i18n axios")} ${chalk.grey("→ multiple plugins")}`
  );
  console.log(
    `  ${chalk.yellowBright("npx tra-ui info i18n")}      ${chalk.grey("→ plugin details")}\n`
  );
}

// ─── Info ─────────────────────────────────────────────────────────────────────
function showPluginInfo(name: string): void {
  const plugin = PLUGINS.find((p) => p.name === name);

  if (!plugin) {
    console.log(chalk.red(`\n✗ Plugin "${name}" not found.`));
    console.log(`  Available plugins: ${PLUGINS.map((p) => chalk.cyan(p.name)).join(", ")}\n`);
    process.exit(1);
  }

  console.log(`\n${chalk.bold.blue(plugin.title)}\n`);
  console.log(`${chalk.grey("Description:")}  ${plugin.description}\n`);
  console.log(`${chalk.grey("shadcn name:")} ${chalk.cyan(`@tra-base/plugin-${plugin.name}`)}\n`);

  if (plugin.packages.length > 0) {
    console.log(chalk.grey("npm dependencies:"));
    plugin.packages.forEach((p: string) => console.log(`  ${chalk.yellowBright(p)}`));
  }

  if (plugin.registryDependencies.length > 0) {
    console.log(
      `\n${chalk.grey("TRA UI Kit bileşenleri (registryDependencies — otomatik yüklenir):")}`
    );
    plugin.registryDependencies.forEach((d: string) => console.log(`  ${chalk.magenta(d)}`));
  }

  if (plugin.postInstall.length > 0) {
    console.log(`\n${chalk.grey("Kurulum sonrası:")}`);
    plugin.postInstall
      .filter((l: string) => l.trim())
      .forEach((l: string) => console.log(chalk.grey(`  ${l.trim()}`)));
  }

  console.log("");
}

program.parse();
