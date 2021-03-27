"use strict";

var path = require("path");
var chalk = require("chalk");

function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { default: e };
}

var chalk__default = /*#__PURE__*/ _interopDefaultLegacy(chalk);

//#region Error Messages
function OP001_errorBinIsEmpty() {
  return [
    chalk__default["default"].red(
      `${errorBadge()} OP001: Bin field is empty in "package.json"`
    ),
    [
      "",
      chalk__default[
        "default"
      ]`Please add {yellow "bin"} field to {yellow "package.json"}, example:`,
      "",
      ...codeSnippet(['"bin": {', '  "mycli": "./cli/cli.js"', "}"]),
      "",
      chalk__default[
        "default"
      ]`Choose any path and name for {yellow "cli.js"}, don't need to create this file,`,
      chalk__default[
        "default"
      ]`{yellow opaline} will generate it for you at provided path.`,
    ],
  ];
}

function OP002_errorNoPackageJson() {
  return [
    chalk__default["default"].red(
      `${errorBadge()} OP002: No "package.json" file found`
    ),
    [
      "",
      `Please add one manually or by running:`,
      "",
      ...codeSnippet("λ npm init --yes"),
    ],
  ];
}

function OP003_errorNoCommandsFolder(commandsDirPath) {
  return [
    chalk__default["default"].red(
      `${errorBadge()} OP003: "${commandsDirPath}" folder doesn't exist`
    ),
    [
      "",
      chalk__default[
        "default"
      ]`Please create {yellow "commands"} folder, because this is where {yellow opaline} is expecting to find cli commands to compile.`,
    ],
  ];
}

function OP004_errorEmptyCommandsFolder(commandsDirPath) {
  return [
    chalk__default["default"].red(
      `${errorBadge()} OP004: Commands folder is empty`
    ),
    [
      "",
      chalk__default["default"]`Add files to {yellow "${commandsDirPath}"}.`,
    ],
  ];
}

function OP005_errorSrcEqDest(commandsDirPath, commandsOutputPath) {
  return [
    chalk__default["default"].red(
      `${errorBadge()} OP005: Source and output folder are the same`
    ),
    [
      "",
      chalk__default["default"].dim("– Source: " + commandsDirPath),
      chalk__default["default"].dim("– Output: " + commandsOutputPath),
      "",
      chalk__default[
        "default"
      ]`Please update {yellow "bin"} field in {yellow "package.json"} to have a nested output folder:`,
      "",
      ...codeSnippet([
        '"bin": {',
        '  "mycli": "./my-output-folder/cli.js"',
        "}",
      ]),
    ],
  ];
}

function OP006_errorProjectNameIsRequired() {
  return [
    chalk__default["default"].red(
      `${errorBadge()} OP006: A project name is required!`
    ),
    ["", ...codeSnippet([`λ opaline create app`])],
  ];
}

function OP007_errorProjectFolderExists(dir) {
  return [
    chalk__default["default"].red(
      `${errorBadge()} OP007: Folder "${dir}" already exists`
    ),
  ];
}
//#endregion

//#region Warning Messages
function OP008_warningInputsNotArrayOrString(type, applications, commandPath) {
  let printType = applications.length ? applications.join(" | ") : type;
  return [
    chalk__default["default"].yellow(
      `${warningBadge()} OP008: Type of $inputs must be "string | Array<string>", got: "${printType}" instead`
    ),
    "",
    chalk__default["default"].dim(`– File: ${commandPath}`),
  ];
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
    chalk__default["default"].green(
      `${doneBadge()} in ${(endTime[0] * 1000 + endTime[1] / 1e6).toFixed(
        2
      )}ms!`
    ),
    "",
    chalk__default[
      "default"
    ]`{green Successfully compiled into {blue "${outputPath}"} folder.}`,
  ];

  message.push("", chalk__default["default"].bgMagenta.black(" OUTPUTS "), "");
  message.push(
    `${chalk__default["default"].grey(
      "– " + relativeBinOutputPath.join(path.sep) + path.sep
    )}${chalk__default["default"].magenta(binFileName)}`
  );

  for (let bundle of output.output) {
    if (bundle.type === "chunk" && bundle.isEntry) {
      message.push(
        `${chalk__default["default"].grey(
          "– " + outputPath + path.sep
        )}${chalk__default["default"].magenta(bundle.fileName)}`
      );
    }
  }
  message.push("");

  return message;
}

function MSG_watchStarted(commands, relativePathToCommands) {
  return [
    chalk__default["default"]`{green ${greenBadge(
      "DEV MODE"
    )} Watching commands {grey [+all of their dependencies]}}`,
    "",
    ...commands.map(
      (command) =>
        `${chalk__default["default"].grey(
          "– " + relativePathToCommands
        )}${chalk__default["default"].magenta(command)}`
    ),
    "",
  ];
}

function MSG_watchUpdated(commands, relativePathToCommands) {
  return [
    "",
    blueBadge("UPDATED"),
    "",
    ...commands.map(
      (command) =>
        `${chalk__default["default"].grey(
          "– " + relativePathToCommands
        )}${chalk__default["default"].magenta(command)}`
    ),
    "",
  ];
}
//#endregion

//#region Message helpers
function codeSnippet(code) {
  return [].concat(code).map((line) => chalk__default["default"].dim(line));
}

function greenBadge(label) {
  return chalk__default["default"].bgGreen.black(` ${label} `);
}

function yellowBadge(label) {
  return chalk__default["default"].bgYellow.black(` ${label} `);
}

function blueBadge(label) {
  return chalk__default["default"].bgBlue.black(` ${label} `);
}

function redBadge(label) {
  return chalk__default["default"].bgRed.black(` ${label} `);
}

function doneBadge() {
  return greenBadge("DONE");
}

function warningBadge() {
  return yellowBadge("WARNING");
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
exports.OP008_warningInputsNotArrayOrString = OP008_warningInputsNotArrayOrString;
