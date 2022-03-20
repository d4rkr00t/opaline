"use strict";

var path = require("path");
var fs = require("fs");
var util = require("util");
var chokidar = require("chokidar");
var rollup = require("rollup");
var sucrase = require("@rollup/plugin-sucrase");
var resolve = require("@rollup/plugin-node-resolve");
var rimraf = require("rimraf");
var core = require("@opaline/core");
var readPkgUp = require("read-pkg-up");
var messages = require("./messages-6fb0911a.js");
var parser = require("@babel/parser");
var traverse = require("@babel/traverse");
var commentParser = require("comment-parser");
var cp = require("child_process");

function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { default: e };
}

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
var fs__namespace = /*#__PURE__*/ _interopNamespace(fs);
var chokidar__namespace = /*#__PURE__*/ _interopNamespace(chokidar);
var rollup__namespace = /*#__PURE__*/ _interopNamespace(rollup);
var sucrase__default = /*#__PURE__*/ _interopDefaultLegacy(sucrase);
var resolve__default = /*#__PURE__*/ _interopDefaultLegacy(resolve);
var rimraf__default = /*#__PURE__*/ _interopDefaultLegacy(rimraf);
var readPkgUp__default = /*#__PURE__*/ _interopDefaultLegacy(readPkgUp);
var parser__namespace = /*#__PURE__*/ _interopNamespace(parser);
var traverse__default = /*#__PURE__*/ _interopDefaultLegacy(traverse);
var commentParser__default = /*#__PURE__*/ _interopDefaultLegacy(commentParser);
var cp__namespace = /*#__PURE__*/ _interopNamespace(cp);

async function readPackageJson(cwd) {
  let pkgJson = await readPkgUp__default["default"]({ cwd, normalize: true });
  if (!pkgJson) {
    throw core.OpalineError.fromArray(messages.OP002_errorNoPackageJson());
  }
  return pkgJson;
}

async function getProjectInfo(cwd) {
  let pkgJson = await readPackageJson(cwd);
  let projectRootDir = path__namespace.dirname(pkgJson.path);

  if (!pkgJson.packageJson.bin) {
    throw core.OpalineError.fromArray(messages.OP001_errorBinIsEmpty());
  }

  let cliName =
    typeof pkgJson.packageJson.bin === "string"
      ? pkgJson.packageJson.name
      : Object.keys(pkgJson.packageJson.bin)[0];
  let binOutputPath = path__namespace.join(
    projectRootDir,
    typeof pkgJson.packageJson.bin === "string"
      ? pkgJson.packageJson.bin
      : pkgJson.packageJson.bin[cliName]
  );
  let commandsOutputPath = path__namespace.join(
    path__namespace.dirname(binOutputPath),
    "commands"
  );
  let commandsDirPath = path__namespace.join(
    projectRootDir,
    (pkgJson["@opaline"] && pkgJson["@opaline"].root) || "./commands"
  );

  if (commandsOutputPath === commandsDirPath) {
    throw core.OpalineError.fromArray(
      messages.OP005_errorSrcEqDest(commandsDirPath, commandsOutputPath)
    );
  }

  return {
    pkgJson,
    projectRootDir,
    cliName,
    binOutputPath,
    commandsOutputPath,
    commandsDirPath,
  };
}

let readFile = util.promisify(fs__namespace.readFile);

async function parseCommands(project, commands) {
  return await Promise.all(
    commands.map((command) => parseSingleCommand(project, command))
  );
}

async function parseSingleCommand(project, command) {
  let [commandName] = command.split(".");
  let commandPath = path__namespace.join(project.commandsDirPath, command);
  let commandFileContent = await readFile(commandPath, "utf8");
  let meta = getMetaFromJSDoc({
    jsdocComment: getCommandJSDoc(commandFileContent),
    cliName: project.cliName,
    commandPath,
  });
  return {
    commandName,
    meta,
  };
}

function getCommandJSDoc(content) {
  let ast = parser__namespace.parse(content, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
  let comment;
  traverse__default["default"](ast, {
    ExportDefaultDeclaration(path) {
      comment =
        "/*" + (path.node.leadingComments || [{ value: "" }])[0].value + "\n*/";
    },
    AssignmentExpression(path) {
      if (
        path.node.left.type !== "MemberExpression" ||
        path.node.left.property.name !== "exports" ||
        !path.node.left.object.hasOwnProperty("name") ||
        path.node.left.object.name !== "module" ||
        (path.node.right.type !== "FunctionExpression" &&
          path.node.right.type !== "ArrowFunctionExpression")
      ) {
        return;
      }
      comment =
        "/*" +
        (path.parent.leadingComments || [{ value: "" }])[0].value +
        "\n*/";
    },
  });
  return comment;
}

function getMetaFromJSDoc({ jsdocComment, cliName, commandPath }) {
  let jsdoc = jsdocComment
    ? commentParser__default["default"](jsdocComment)[0] || {
        description: "",
        tags: [],
      }
    : { description: "", tags: [] };
  let [title, ...description] = jsdoc.description.split("\n\n");
  let aliases = jsdoc.tags
    .filter((tag) => tag.tag === "short")
    .map((alias) => alias.name)
    .reduce((acc, alias) => {
      let [full, short] = alias.split("=");
      acc[full.trim()] = short.trim();
      return acc;
    }, {});
  let usage = jsdoc.tags.find((tag) => tag.tag === "usage") || {
    name: "",
    description: "",
  };

  return {
    title: title || "No description",
    description: description.join("\n\n"),

    usage: [
      usage.type === "cliName" ? cliName : "",
      usage.name,
      usage.description.replace("{cliName}", cliName),
    ]
      .filter(Boolean)
      .join(" "),

    examples: jsdoc.tags
      .filter((tag) => tag.tag === "example")
      .map((tag) =>
        [tag.name, tag.description.replace("{cliName}", cliName)].join(" ")
      ),

    shouldPassInputs: !!jsdoc.tags.find(
      (tag) => tag.tag === "param" && tag.name === "$inputs"
    ),

    options: jsdoc.tags.reduce((acc, tag) => {
      if (tag.name === "$inputs") {
        verify$InputsType(tag, commandPath);
      }
      if (tag.tag !== "param" || tag.name === "$inputs") return acc;
      let type = getTypeFromJSDocTag(tag);
      let defaultValue = tag.default;

      acc[tag.name] = {
        title: tag.description,
        type,
        alias: aliases[tag.name],
        default:
          defaultValue && type === "number"
            ? parseInt(defaultValue)
            : defaultValue
            ? JSON.parse(defaultValue)
            : defaultValue,
      };
      return acc;
    }, {}),
  };
}

function getTypeFromJSDocTag(tag) {
  return tag.type;
}

function verify$InputsType(tag, commandPath) {
  let type = getTypeFromJSDocTag(tag);
  let notStringApplications = [tag.type].filter(
    (type) =>
      !["string", "string[]", "array<string>"].includes(type.toLowerCase())
  );

  if (!notStringApplications.length) {
    return true;
  }

  core.print(
    messages.OP008_warningInputsNotArrayOrString(
      type,
      notStringApplications,
      commandPath
    )
  );

  return false;
}

function createEntryPoint({ project, commandsData }) {
  let pkgJsonRelativePath = path__namespace.relative(
    path__namespace.dirname(project.binOutputPath),
    project.pkgJson.path
  );
  let mainCommand = commandsData.find(
    (command) => command.commandName === "index"
  );
  let description = mainCommand
    ? mainCommand.meta.title +
      (mainCommand.meta.description
        ? "\n\n" + mainCommand.meta.description
        : "")
    : "";

  return `#!/usr/bin/env node

let cli = require("@opaline/core").default;
let pkg = require("${pkgJsonRelativePath}");
let config = {
  cliName: "${project.cliName}",
  cliVersion: pkg.version,
  cliDescription: ${JSON.stringify(description)} || pkg.description,
  isSingleCommand: ${commandsData.length === 1 ? "true" : "false"},
  commands: {
    ${commandsData
      .map(
        (command) => `"${command.commandName}": {
      commandName: "${command.commandName}",
      meta: ${JSON.stringify(command.meta)},
      load: () => {
        let command = require("${getRelativeCommandPath(
          project.binOutputPath,
          command.commandName
        )}");

        if (typeof command !== "function") {
          throw new Error(\`Command "${
            command.commandName
          }" doesn't export a function...\`)
        }

        return command;
      }
    }`
      )
      .join(", ")}
  }
};

cli(process.argv, config);
`;
}

function getRelativeCommandPath(binOutputPath, commandName) {
  return (
    "." +
    path__namespace.sep +
    path__namespace.relative(
      binOutputPath,
      path__namespace.join(binOutputPath, "commands", commandName)
    )
  );
}

let _exec = util.promisify(cp__namespace.exec);

async function link(exec = _exec) {
  let bin = "npm";
  try {
    await exec("yarn --version");
    bin = "yarn";
  } catch (e) {}
  return await exec(`${bin} link`);
}

let readdir = util.promisify(fs__namespace.readdir);
let writeFile = util.promisify(fs__namespace.writeFile);
let chmod = util.promisify(fs__namespace.chmod);
let rm = util.promisify(rimraf__default["default"]);

class Compiler {
  constructor({ cwd, mode = "development" }) {
    Compiler.prototype.__init.call(this);
    this.cwd = cwd;
    this.mode = mode;
  }

  async init(watch) {
    this.project = await getProjectInfo(this.cwd);
    this.commands = await this.getCommands();

    if (!this.commands.length) {
      throw core.OpalineError.fromArray(
        messages.OP004_errorEmptyCommandsFolder(this.project.commandsDirPath)
      );
    }
  }

  async updateCommands() {
    this.commands = await this.getCommands();
  }

  createBundlerConfig() {
    return {
      input: this.getEntryPoints(this.commands),
      output: {
        dir: this.project.commandsOutputPath,
        format: "cjs",
        exports: "auto",
      },
      external: (id) =>
        !id.startsWith("\0") && !id.startsWith(".") && !id.startsWith("/"),
      onwarn: (warning) => {
        if (warning.code !== "EMPTY_BUNDLE") {
          core.printWarning(warning.message);
        }
      },
      plugins: [
        resolve__default["default"]({
          extensions: [".js", ".ts", ".tsx"],
        }),
        sucrase__default["default"]({
          exclude: ["node_modules/**"],
          transforms: ["typescript", "jsx"],
        }),
      ],
    };
  }

  async getCommands() {
    try {
      return (
        await readdir(this.project.commandsDirPath, { withFileTypes: true })
      )
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name)
        .filter(
          (file) =>
            !file.endsWith(".d.ts") &&
            !file.endsWith(".map") &&
            !file.startsWith("_") &&
            !file.startsWith(".")
        );
    } catch (e) {
      throw core.OpalineError.fromArray(
        messages.OP003_errorNoCommandsFolder(this.project.commandsDirPath)
      );
    }
  }

  getEntryPoints(commands) {
    return commands.map((c) =>
      path__namespace.join(this.project.commandsDirPath, c)
    );
  }

  __init() {
    this.onBundled = async () => {
      let commandsData = await parseCommands(this.project, this.commands);
      let entryPoint = createEntryPoint({
        project: this.project,
        commandsData,
      });
      await writeFile(this.project.binOutputPath, entryPoint, "utf8");
      await chmod(this.project.binOutputPath, "755");
      if (this.mode === "development") {
        await link();
      }
    };
  }

  async compile({ watch }) {
    await this.init(watch);

    if (watch) {
      await this.watch();
    } else {
      await this.build();
    }
  }

  async build() {
    let startTime = process.hrtime();
    let config = this.createBundlerConfig();
    let bundle = await rollup__namespace.rollup(config);

    try {
      // Clean up old bundles
      await rm(this.project.commandsOutputPath);

      // write the bundle to disk
      let output = await bundle.write(config.output);
      let endTime = process.hrtime(startTime);

      await this.onBundled();

      core.print(
        messages.MSG_buildSuccess(
          this.project.commandsOutputPath,
          this.project.projectRootDir,
          this.project.binOutputPath,
          output,
          endTime
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  async watch() {
    this.createWatchBundler();

    // Watch other FS changes that rollup watcher is not able to pick up.
    // E.g. creating/removing new entry points.
    let watcher = chokidar__namespace.watch(this.project.commandsDirPath, {
      ignoreInitial: true,
    });
    watcher
      .on("add", async (file) => {
        await this.updateCommands();
        this.createWatchBundler();
      })
      .on("unlink", async (file) => {
        await this.updateCommands();
        this.createWatchBundler();
      });
  }

  async createWatchBundler() {
    let relativePathToCommands =
      this.project.commandsDirPath.replace(
        this.project.projectRootDir + path__namespace.sep,
        ""
      ) + path__namespace.sep;

    if (this.watcher) {
      this.watcher.close();
      core.print(
        messages.MSG_watchUpdated(this.commands, relativePathToCommands)
      );
    } else {
      core.print(
        messages.MSG_watchStarted(this.commands, relativePathToCommands)
      );
    }

    this.watcher = rollup__namespace.watch([this.createBundlerConfig()]);
    this.watcher.on("event", (event) => {
      if (event.code === "BUNDLE_END") {
        this.onBundled();
      }
    });
  }
}

exports.Compiler = Compiler;
