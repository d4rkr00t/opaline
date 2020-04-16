"use strict";

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var path = require("path");
var chalk = _interopDefault(require("chalk"));

//#region Error Messages
function OP001_errorBinIsEmpty() {
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
  ];
}

function OP002_errorNoPackageJson() {
  return [
    chalk.red(`${errorBadge()} OP002: No "package.json" file found`),
    [
      "",
      `Please add one manually or by running:`,
      "",
      ...codeSnippet("λ npm init --yes")
    ]
  ];
}

function OP003_errorNoCommandsFolder(commandsDirPath) {
  return [
    chalk.red(
      `${errorBadge()} OP003: "${commandsDirPath}" folder doesn't exist`
    ),
    [
      "",
      chalk`Please create {yellow "commands"} folder, because this is where {yellow opaline} is expecting to find cli commands to compile.`
    ]
  ];
}

function OP004_errorEmptyCommandsFolder(commandsDirPath) {
  return [
    chalk.red(`${errorBadge()} OP004: Commands folder is empty`),
    ["", chalk`Add files to {yellow "${commandsDirPath}"}.`]
  ];
}

function OP005_errorSrcEqDest(commandsDirPath, commandsOutputPath) {
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
  ];
}

function OP006_errorProjectNameIsRequired() {
  return [
    chalk.red(`${errorBadge()} OP006: A project name is required!`),
    ["", ...codeSnippet([`λ opaline create app`])]
  ];
}

function OP007_errorProjectFolderExists(dir) {
  return [chalk.red(`${errorBadge()} OP007: Folder "${dir}" already exists`)];
}
//#endregion

//#region Success Messages
function MSG_buildSuccess(
  commandsOutputPath,
  projectRootDir,
  binOutputPath,
  output,
  endTime
) {
  let outputPath = commandsOutputPath.replace(projectRootDir + path.sep, "");
  let relativeBinOutputPath = binOutputPath
    .replace(projectRootDir + path.sep, "")
    .split(path.sep);
  let binFileName = relativeBinOutputPath.pop();
  let message = [
    chalk.green(
      `${doneBadge()} in ${(endTime[0] * 1000 + endTime[1] / 1e6).toFixed(
        2
      )}ms!`
    ),
    "",
    chalk`{green Successfully compiled into {blue "${outputPath}"} folder.}`
  ];

  message.push("", chalk.bgMagenta.black(" OUTPUTS "), "");
  message.push(
    `${chalk.grey(
      "– " + relativeBinOutputPath.join(path.sep) + path.sep
    )}${chalk.magenta(binFileName)}`
  );

  for (let bundle of output.output) {
    if (bundle.type === "chunk" && bundle.isEntry) {
      message.push(
        `${chalk.grey("– " + outputPath + path.sep)}${chalk.magenta(
          bundle.fileName
        )}`
      );
    }
  }

  return message;
}

function MSG_watchStarted(commands, relativePathToCommands) {
  return [
    chalk`{green ${greenBadge(
      "DEV MODE"
    )} Watching commands {grey [+all of their dependencies]}}`,
    "",
    ...commands.map(
      command =>
        `${chalk.grey("– " + relativePathToCommands)}${chalk.magenta(command)}`
    ),
    ""
  ];
}

function MSG_watchUpdated(commands, relativePathToCommands) {
  return [
    "",
    blueBadge("UPDATED"),
    "",
    ...commands.map(
      command =>
        `${chalk.grey("– " + relativePathToCommands)}${chalk.magenta(command)}`
    ),
    ""
  ];
}
//#endregion

//#region Message helpers
function codeSnippet(code) {
  return [].concat(code).map(line => chalk.dim(line));
}

function greenBadge(label) {
  return chalk.bgGreen.black(` ${label} `);
}

function blueBadge(label) {
  return chalk.bgBlue.black(` ${label} `);
}

function redBadge(label) {
  return chalk.bgRed.black(` ${label} `);
}

function doneBadge() {
  return greenBadge("DONE");
}

function errorBadge() {
  return redBadge("ERROR");
}
//#endregion

exports.MSG_buildSuccess = MSG_buildSuccess;
exports.MSG_watchStarted = MSG_watchStarted;
exports.MSG_watchUpdated = MSG_watchUpdated;
exports.OP001_errorBinIsEmpty = OP001_errorBinIsEmpty;
exports.OP002_errorNoPackageJson = OP002_errorNoPackageJson;
exports.OP003_errorNoCommandsFolder = OP003_errorNoCommandsFolder;
exports.OP004_errorEmptyCommandsFolder = OP004_errorEmptyCommandsFolder;
exports.OP005_errorSrcEqDest = OP005_errorSrcEqDest;
exports.OP006_errorProjectNameIsRequired = OP006_errorProjectNameIsRequired;
exports.OP007_errorProjectFolderExists = OP007_errorProjectFolderExists;
