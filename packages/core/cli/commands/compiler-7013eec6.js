"use strict";

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var path = require("path");
var fs = require("fs");
var util = require("util");
var chokidar = require("chokidar");
var rollup = require("rollup");
var sucrase = _interopDefault(require("@rollup/plugin-sucrase"));
var resolve = _interopDefault(require("@rollup/plugin-node-resolve"));
var rimraf = _interopDefault(require("rimraf"));
var core = require("@opaline/core");
var readPkgUp = _interopDefault(require("read-pkg-up"));
var messages = require("./messages-1184afb9.js");
var parser = require("@babel/parser");
var traverse = _interopDefault(require("@babel/traverse"));
var doctrine = require("doctrine");
var cp = require("child_process");

async function readPackageJson(cwd) {
  let pkgJson = await readPkgUp({ cwd, normalize: true });
  if (!pkgJson) {
    throw core.OpalineError.fromArray(messages.OP002_errorNoPackageJson());
  }
  return pkgJson;
}

async function getProjectInfo(cwd) {
  let pkgJson = await readPackageJson(cwd);
  let projectRootDir = path.dirname(pkgJson.path);

  if (!pkgJson.packageJson.bin) {
    throw core.OpalineError.fromArray(messages.OP001_errorBinIsEmpty());
  }

  let cliName =
    typeof pkgJson.packageJson.bin === "string"
      ? pkgJson.packageJson.name
      : Object.keys(pkgJson.packageJson.bin)[0];
  let binOutputPath = path.join(
    projectRootDir,
    typeof pkgJson.packageJson.bin === "string"
      ? pkgJson.packageJson.bin
      : pkgJson.packageJson.bin[cliName]
  );
  let commandsOutputPath = path.join(path.dirname(binOutputPath), "commands");
  let commandsDirPath = path.join(
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
    commandsDirPath
  };
}

let readFile = util.promisify(fs.readFile);

async function parseCommands(project, commands) {
  return await Promise.all(
    commands.map(command => parseSingleCommand(project, command))
  );
}

async function parseSingleCommand(project, command) {
  let [commandName] = command.split(".");
  let commandPath = path.join(project.commandsDirPath, command);
  let commandFileContent = await readFile(commandPath, "utf8");
  let meta = getMetaFromJSDoc({
    jsdocComment: getCommandJSDoc(commandFileContent),
    cliName: project.cliName
  });
  return {
    commandName,
    meta
  };
}

function getCommandJSDoc(content) {
  let ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["typescript", "jsx"]
  });
  let comment;
  traverse(ast, {
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
    }
  });
  return comment;
}

function getMetaFromJSDoc({ jsdocComment, cliName }) {
  let jsdoc = jsdocComment
    ? doctrine.parse(jsdocComment, { unwrap: true, sloppy: true })
    : { description: "", tags: [] };
  let [title, ...description] = jsdoc.description.split("\n\n");
  let aliases = jsdoc.tags
    .filter(tag => tag.title === "short")
    .map(alias => alias.description)
    .reduce((acc, alias) => {
      let [full, short] = alias.split("=");
      acc[full.trim()] = short.trim();
      return acc;
    }, {});

  return {
    title: title || "No description",
    description: description.join("\n\n"),

    usage: (
      jsdoc.tags.find(tag => tag.title === "usage") || { description: "" }
    ).description.replace("{cliName}", cliName),

    examples: jsdoc.tags
      .filter(tag => tag.title === "example")
      .map(tag => tag.description.replace("{cliName}", cliName)),

    shouldPassInputs: !!jsdoc.tags.find(
      tag => tag.title === "param" && tag.name === "$inputs"
    ),

    options: jsdoc.tags.reduce((acc, tag) => {
      if (tag.title !== "param" || tag.name === "$inputs") return acc;
      let type = tag.type.name || tag.type.expression.name;
      let defaultValue = tag.default;
      acc[tag.name] = {
        title: tag.description,
        type,
        alias: aliases[tag.name],
        default:
          defaultValue && type === "number"
            ? parseInt(defaultValue)
            : defaultValue
      };
      return acc;
    }, {})
  };
}

function createEntryPoint({ project, commandsData }) {
  let pkgJsonRelativePath = path.relative(
    path.dirname(project.binOutputPath),
    project.pkgJson.path
  );
  console.log(commandsData);
  let mainCommand = commandsData.find(
    command => command.commandName === "index"
  );
  let description = mainCommand ? mainCommand.meta.description : "";

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
        command => `"${command.commandName}": {
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
    path.sep +
    path.relative(
      binOutputPath,
      path.join(binOutputPath, "commands", commandName)
    )
  );
}

let exec = util.promisify(cp.exec);

async function link() {
  let bin = "npm";
  try {
    await exec("yarn --version");
    bin = "yarn";
  } catch (e) {}
  return await exec(`${bin} link`);
}

let readdir = util.promisify(fs.readdir);
let writeFile = util.promisify(fs.writeFile);
let chmod = util.promisify(fs.chmod);
let rm = util.promisify(rimraf);

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
        format: "cjs"
      },
      external: id =>
        !id.startsWith("\0") && !id.startsWith(".") && !id.startsWith("/"),
      onwarn: warning => {
        if (warning.code !== "EMPTY_BUNDLE") {
          core.printWarning(warning.message);
        }
      },
      plugins: [
        resolve({
          extensions: [".js", ".ts", ".tsx"]
        }),
        sucrase({
          exclude: ["node_modules/**"],
          transforms: ["typescript", "jsx"]
        })
      ]
    };
  }

  async getCommands() {
    try {
      return (
        await readdir(this.project.commandsDirPath, { withFileTypes: true })
      )
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name)
        .filter(
          file =>
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
    return commands.map(c => path.join(this.project.commandsDirPath, c));
  }

  __init() {
    this.onBundled = async () => {
      let commandsData = await parseCommands(this.project, this.commands);
      let entryPoint = createEntryPoint({
        project: this.project,
        commandsData
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
    let bundle = await rollup.rollup(config);

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
    let watcher = chokidar.watch(this.project.commandsDirPath, {
      ignoreInitial: true
    });
    watcher
      .on("add", async file => {
        await this.updateCommands();
        this.createWatchBundler();
      })
      .on("unlink", async file => {
        await this.updateCommands();
        this.createWatchBundler();
      });
  }

  async createWatchBundler() {
    let relativePathToCommands =
      this.project.commandsDirPath.replace(
        this.project.projectRootDir + path.sep,
        ""
      ) + path.sep;

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

    this.watcher = rollup.watch([this.createBundlerConfig()]);
    this.watcher.on("event", event => {
      if (event.code === "BUNDLE_END") {
        this.onBundled();
      }
    });
  }
}

exports.Compiler = Compiler;
