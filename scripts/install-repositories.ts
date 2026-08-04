import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { repositories, type Repository } from "../repositories.ts";

const DEFAULT_TARGET_DIR = ".";

function run(command: string, args: string[], cwd: string): boolean {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  return result.status === 0;
}

function isGitRepo(dir: string): boolean {
  return existsSync(join(dir, ".git"));
}

async function installRepository(repo: Repository, baseDir: string): Promise<boolean> {
  const targetPath = resolve(baseDir, repo.path);

  if (existsSync(targetPath)) {
    if (!isGitRepo(targetPath)) {
      console.warn(`[skip] ${repo.name}: папка "${targetPath}" уже существует и не является git-репозиторием`);
      return false;
    }
    console.log(`[update] ${repo.name}: обновление в "${targetPath}"`);
    return run("git", ["pull"], targetPath);
  }

  await mkdir(resolve(targetPath, ".."), { recursive: true });

  console.log(`[clone] ${repo.name}: клонирование ${repo.url} -> "${targetPath}"`);
  const cloneArgs = ["clone", repo.url, targetPath];
  if (repo.branch) {
    cloneArgs.push("--branch", repo.branch);
  }
  if (!run("git", cloneArgs, baseDir)) {
    return false;
  }

  return true;
}

async function main() {
  const targetDir = resolve(process.argv[2] ?? DEFAULT_TARGET_DIR);
  await mkdir(targetDir, { recursive: true });

  console.log(`Установка ${repositories.length} репозитори${repositories.length === 1 ? "я" : "ев"} в "${targetDir}"\n`);

  let failed = 0;
  for (const repo of repositories) {
    const ok = await installRepository(repo, targetDir);
    if (!ok) failed += 1;
  }

  console.log(
    `\nГотово: ${repositories.length - failed}/${repositories.length} успешно${failed ? `, ${failed} с ошибками` : ""}.`,
  );

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main();
