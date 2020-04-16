import chalk from "chalk";

//#region Errors
export function OP001_errorBinIsEmpty() {
  return [
    chalk.red(`${errorBadge()} OP001: Bin field is empty in "package.json"`),
    [
      "",
      chalk`Please add {yellow "bin"} field to {yellow "package.json"}, example:`,
      "",
      ...codeSnippet(['"bin": {', '  "mycli": "./cli/cli.js"', "}"]),
      "",
      chalk`Choose any path and name for {yellow "cli.js"}, don't need to create this file,`,
      chalk`{yellow opaline} will generate it for you at provided path.`
    ]
  ] as const;
}

export function OP002_errorNoPackageJson() {
  return [
    chalk.red(`${errorBadge()} OP002: No "package.json" file found`),
    [
      "",
      `Please add one manually or by running:`,
      "",
      ...codeSnippet("λ npm init --yes")
    ]
  ] as const;
}

export function OP003_errorNoCommandsFolder(commandsDirPath: string) {
  return [
    chalk.red(
      `${errorBadge()} OP003: "${commandsDirPath}" folder doesn't exist`
    ),
    [
      "",
      chalk`Please create {yellow "commands"} folder, because this is where {yellow opaline} is expecting to find cli commands to compile.`
    ]
  ] as const;
}

export function OP004_errorEmptyCommandsFolder(commandsDirPath: string) {
  return [
    chalk.red(`${errorBadge()} OP004: Commands folder is empty`),
    ["", chalk`Add files to {yellow "${commandsDirPath}"}.`]
  ] as const;
}

export function OP005_errorSrcEqDest(
  commandsDirPath: string,
  commandsOutputPath: string
) {
  return [
    chalk.red(`${errorBadge()} OP005: Source and output folder are the same`),
    [
      "",
      chalk.dim("– Source: " + commandsDirPath),
      chalk.dim("– Output: " + commandsOutputPath),
      "",
      chalk`Please update {yellow "bin"} field in {yellow "package.json"} to have a nested output folder:`,
      "",
      ...codeSnippet([
        '"bin": {',
        '  "mycli": "./my-output-folder/cli.js"',
        "}"
      ])
    ]
  ] as const;
}

export function OP006_errorProjectNameIsRequired() {
  return [
    chalk.red(`${errorBadge()} OP006: A project name is required!`),
    ["", ...codeSnippet([`λ opaline create app`])]
  ] as const;
}

export function OP007_errorProjectFolderExists(dir: string) {
  return [
    chalk.red(`${errorBadge()} OP007: Folder "${dir}" already exists`)
  ] as const;
}
//#endregion

//#region Message helpers
export function codeSnippet(code: string | string[]) {
  return ([] as string[]).concat(code).map(line => chalk.dim(line));
}

export function greenBadge(label: string): string {
  return chalk.bgGreen.black(` ${label} `);
}

export function yellowBadge(label: string): string {
  return chalk.bgYellow.black(` ${label} `);
}

export function blueBadge(label: string): string {
  return chalk.bgBlue.black(` ${label} `);
}

export function redBadge(label: string): string {
  return chalk.bgRed.black(` ${label} `);
}

export function doneBadge(): string {
  return greenBadge("DONE");
}

export function warningBadge(): string {
  return yellowBadge("WARNING");
}

export function waitBadge(): string {
  return blueBadge("WAIT");
}

export function errorBadge(): string {
  return redBadge("ERROR");
}

export function separator() {
  return chalk.dim("---------");
}
//#endregion
