import * as path from "path";
import {
  bgBlue,
  bgGreen,
  bgMagenta,
  bgRed,
  bgYellow,
  black,
  blue,
  dim,
  gray,
  green,
  magenta,
  red,
  yellow,
} from "colorette";
import { RollupOutput } from "rollup";

//#region Error Messages
export function OP001_errorBinIsEmpty() {
  return [
    red(`${errorBadge()} OP001: Bin field is empty in "package.json"`),
    [
      "",
      `Please add ${yellow('"bin"')} field to ${yellow(
        '"package.json"'
      )}, example:`,
      "",
      ...codeSnippet(['"bin": {', '  "mycli": "./cli/cli.js"', "}"]),
      "",
      `Choose any path and name for ${yellow(
        '"cli.js"'
      )}, don't need to create this file,`,
      `${yellow("opaline")} will generate it for you at provided path.`,
    ],
  ] as const;
}

export function OP002_errorNoPackageJson() {
  return [
    red(`${errorBadge()} OP002: No "package.json" file found`),
    [
      "",
      `Please add one manually or by running:`,
      "",
      ...codeSnippet("λ npm init --yes"),
    ],
  ] as const;
}

export function OP003_errorNoCommandsFolder(commandsDirPath: string) {
  return [
    red(`${errorBadge()} OP003: "${commandsDirPath}" folder doesn't exist`),
    [
      "",
      `Please create ${yellow(
        '"commands"'
      )} folder, because this is where ${yellow(
        "opaline"
      )} is expecting to find cli commands to compile.`,
    ],
  ] as const;
}

export function OP004_errorEmptyCommandsFolder(commandsDirPath: string) {
  return [
    red(`${errorBadge()} OP004: Commands folder is empty`),
    ["", `Add files to ${yellow(`"${commandsDirPath}"`)}.`],
  ] as const;
}

export function OP005_errorSrcEqDest(
  commandsDirPath: string,
  commandsOutputPath: string
) {
  return [
    red(`${errorBadge()} OP005: Source and output folder are the same`),
    [
      "",
      dim("– Source: " + commandsDirPath),
      dim("– Output: " + commandsOutputPath),
      "",
      `Please update ${yellow('"bin"')} field in ${yellow(
        '"package.json"'
      )} to have a nested output folder:`,
      "",
      ...codeSnippet([
        '"bin": {',
        '  "mycli": "./my-output-folder/cli.js"',
        "}",
      ]),
    ],
  ] as const;
}

export function OP006_errorProjectNameIsRequired() {
  return [
    red(`${errorBadge()} OP006: A project name is required!`),
    ["", ...codeSnippet([`λ opaline create app`])],
  ] as const;
}

export function OP007_errorProjectFolderExists(dir: string) {
  return [
    red(`${errorBadge()} OP007: Folder "${dir}" already exists`),
  ] as const;
}
//#endregion

//#region Warning Messages
export function OP008_warningInputsNotArrayOrString(
  type: string,
  applications: Array<string>,
  commandPath: string
) {
  let printType = applications.length ? applications.join(" | ") : type;
  return [
    yellow(
      `${warningBadge()} OP008: Type of $inputs must be "string | Array<string>", got: "${printType}" instead`
    ),
    "",
    dim(`– File: ${commandPath}`),
  ];
}
//#endregion

//#region Success Messages
export function MSG_buildSuccess(
  commandsOutputPath: string,
  projectRootDir: string,
  binOutputPath: string,
  output: RollupOutput,
  endTime: [number, number]
) {
  let outputPath = commandsOutputPath.replace(projectRootDir + path.sep, "");
  let relativeBinOutputPath = binOutputPath
    .replace(projectRootDir + path.sep, "")
    .split(path.sep);
  let binFileName = relativeBinOutputPath.pop();
  let message = [
    green(
      `${doneBadge()} in ${(endTime[0] * 1000 + endTime[1] / 1e6).toFixed(
        2
      )}ms!`
    ),
    "",
    `${green("Successfully compiled into")} ${blue(`"${outputPath}"`)} ${green(
      "folder."
    )}`,
  ];

  message.push("", bgMagenta(black(" OUTPUTS ")), "");
  message.push(
    `${gray("– " + relativeBinOutputPath.join(path.sep) + path.sep)}${magenta(
      binFileName
    )}`
  );

  for (let bundle of output.output) {
    if (bundle.type === "chunk" && bundle.isEntry) {
      message.push(
        `${gray("– " + outputPath + path.sep)}${magenta(bundle.fileName)}`
      );
    }
  }
  message.push("");

  return message;
}

export function MSG_watchStarted(
  commands: string[],
  relativePathToCommands: string
) {
  return [
    `${green(`${greenBadge("DEV MODE")} Watching commands`)} ${gray(
      "[+all of their dependencies]"
    )}`,
    "",
    ...commands.map(
      (command) => `${gray("– " + relativePathToCommands)}${magenta(command)}`
    ),
    "",
  ];
}

export function MSG_watchUpdated(
  commands: string[],
  relativePathToCommands: string
) {
  return [
    "",
    blueBadge("UPDATED"),
    "",
    ...commands.map(
      (command) => `${gray("– " + relativePathToCommands)}${magenta(command)}`
    ),
    "",
  ];
}
//#endregion

//#region Message helpers
export function codeSnippet(code: string | string[]) {
  return ([] as string[]).concat(code).map((line) => dim(line));
}

export function greenBadge(label: string): string {
  return bgGreen(black(` ${label} `));
}

export function yellowBadge(label: string): string {
  return bgYellow(black(` ${label} `));
}

export function blueBadge(label: string): string {
  return bgBlue(black(` ${label} `));
}

export function redBadge(label: string): string {
  return bgRed(black(` ${label} `));
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
  return dim("---------");
}
//#endregion
