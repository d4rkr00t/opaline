"use strict";

var path = require("path");
var colorette = require("colorette");

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== "default") {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(
          n,
          k,
          d.get
            ? d
            : {
                enumerable: true,
                get: function () {
                  return e[k];
                },
              }
        );
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/ _interopNamespace(path);

//#region Error Messages
function OP001_errorBinIsEmpty() {
  return [
    colorette.red(
      `${errorBadge()} OP001: Bin field is empty in "package.json"`
    ),
    [
      "",
      `Please add ${colorette.yellow('"bin"')} field to ${colorette.yellow(
        '"package.json"'
      )}, example:`,
      "",
      ...codeSnippet(['"bin": {', '  "mycli": "./cli/cli.js"', "}"]),
      "",
      `Choose any path and name for ${colorette.yellow(
        '"cli.js"'
      )}, don't need to create this file,`,
      `${colorette.yellow(
        "opaline"
      )} will generate it for you at provided path.`,
    ],
  ];
}

function OP002_errorNoPackageJson() {
  return [
    colorette.red(`${errorBadge()} OP002: No "package.json" file found`),
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
    colorette.red(
      `${errorBadge()} OP003: "${commandsDirPath}" folder doesn't exist`
    ),
    [
      "",
      `Please create ${colorette.yellow(
        '"commands"'
      )} folder, because this is where ${colorette.yellow(
        "opaline"
      )} is expecting to find cli commands to compile.`,
    ],
  ];
}

function OP004_errorEmptyCommandsFolder(commandsDirPath) {
  return [
    colorette.red(`${errorBadge()} OP004: Commands folder is empty`),
    ["", `Add files to ${colorette.yellow(`"${commandsDirPath}"`)}.`],
  ];
}

function OP005_errorSrcEqDest(commandsDirPath, commandsOutputPath) {
  return [
    colorette.red(
      `${errorBadge()} OP005: Source and output folder are the same`
    ),
    [
      "",
      colorette.dim("– Source: " + commandsDirPath),
      colorette.dim("– Output: " + commandsOutputPath),
      "",
      `Please update ${colorette.yellow('"bin"')} field in ${colorette.yellow(
        '"package.json"'
      )} to have a nested output folder:`,
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
    colorette.red(`${errorBadge()} OP006: A project name is required!`),
    ["", ...codeSnippet([`λ opaline create app`])],
  ];
}

function OP007_errorProjectFolderExists(dir) {
  return [
    colorette.red(`${errorBadge()} OP007: Folder "${dir}" already exists`),
  ];
}
//#endregion

//#region Warning Messages
function OP008_warningInputsNotArrayOrString(type, applications, commandPath) {
  let printType = applications.length ? applications.join(" | ") : type;
  return [
    colorette.yellow(
      `${warningBadge()} OP008: Type of $inputs must be "string | Array<string>", got: "${printType}" instead`
    ),
    "",
    colorette.dim(`– File: ${commandPath}`),
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
  let outputPath = commandsOutputPath.replace(
    projectRootDir + path__namespace.sep,
    ""
  );
  let relativeBinOutputPath = binOutputPath
    .replace(projectRootDir + path__namespace.sep, "")
    .split(path__namespace.sep);
  let binFileName = relativeBinOutputPath.pop();
  let message = [
    colorette.green(
      `${doneBadge()} in ${(endTime[0] * 1000 + endTime[1] / 1e6).toFixed(
        2
      )}ms!`
    ),
    "",
    `${colorette.green("Successfully compiled into")} ${colorette.blue(
      `"${outputPath}"`
    )} ${colorette.green("folder.")}`,
  ];

  message.push("", colorette.bgMagenta(colorette.black(" OUTPUTS ")), "");
  message.push(
    `${colorette.gray(
      "– " +
        relativeBinOutputPath.join(path__namespace.sep) +
        path__namespace.sep
    )}${colorette.magenta(binFileName)}`
  );

  for (let bundle of output.output) {
    if (bundle.type === "chunk" && bundle.isEntry) {
      message.push(
        `${colorette.gray(
          "– " + outputPath + path__namespace.sep
        )}${colorette.magenta(bundle.fileName)}`
      );
    }
  }
  message.push("");

  return message;
}

function MSG_watchStarted(commands, relativePathToCommands) {
  return [
    `${colorette.green(
      `${greenBadge("DEV MODE")} Watching commands`
    )} ${colorette.gray("[+all of their dependencies]")}`,
    "",
    ...commands.map(
      (command) =>
        `${colorette.gray("– " + relativePathToCommands)}${colorette.magenta(
          command
        )}`
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
        `${colorette.gray("– " + relativePathToCommands)}${colorette.magenta(
          command
        )}`
    ),
    "",
  ];
}
//#endregion

//#region Message helpers
function codeSnippet(code) {
  return [].concat(code).map((line) => colorette.dim(line));
}

function greenBadge(label) {
  return colorette.bgGreen(colorette.black(` ${label} `));
}

function yellowBadge(label) {
  return colorette.bgYellow(colorette.black(` ${label} `));
}

function blueBadge(label) {
  return colorette.bgBlue(colorette.black(` ${label} `));
}

function redBadge(label) {
  return colorette.bgRed(colorette.black(` ${label} `));
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
exports.OP008_warningInputsNotArrayOrString =
  OP008_warningInputsNotArrayOrString;
