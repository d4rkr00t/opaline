"use strict";

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var chalk = _interopDefault(require("chalk"));

//#region Errors
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

//#region Message helpers
function codeSnippet(code) {
  return [].concat(code).map(line => chalk.dim(line));
}

function redBadge(label) {
  return chalk.bgRed.black(` ${label} `);
}

function errorBadge() {
  return redBadge("ERROR");
}
//#endregion

exports.OP001_errorBinIsEmpty = OP001_errorBinIsEmpty;
exports.OP002_errorNoPackageJson = OP002_errorNoPackageJson;
exports.OP003_errorNoCommandsFolder = OP003_errorNoCommandsFolder;
exports.OP004_errorEmptyCommandsFolder = OP004_errorEmptyCommandsFolder;
exports.OP005_errorSrcEqDest = OP005_errorSrcEqDest;
exports.OP006_errorProjectNameIsRequired = OP006_errorProjectNameIsRequired;
exports.OP007_errorProjectFolderExists = OP007_errorProjectFolderExists;
