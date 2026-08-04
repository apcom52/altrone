export interface Repository {
  /** Человекочитаемое имя репозитория (используется в логах) */
  name: string;
  /** Git URL репозитория (https или ssh) */
  url: string;
  /** Путь установки, относительный к базовой папке (см. install-repositories.ts) */
  path: string;
  /** Ветка/тег для чекаута после клонирования (необязательно) */
  branch?: string;
}

export const repositories: Repository[] = [
  {
    name: "altrone-ui",
    url: "https://github.com/apcom52/altrone-ui",
    path: "core",
  },
  {
    name: "altrone-mcp",
    url: "https://github.com/apcom52/altrone-mcp",
    path: "mcp",
  },
  {
    name: "altrone-next-docs",
    url: "https://github.com/apcom52/altrone-next-docs",
    path: "docs",
  },
];
