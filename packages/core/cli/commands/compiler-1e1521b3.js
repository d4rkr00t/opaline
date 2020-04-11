"use strict";

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var path = require("path");
var fs = require("fs");
var util = require("util");
var chokidar = require("chokidar");
var rollup = _interopDefault(require("rollup"));
var sucrase = _interopDefault(require("@rollup/plugin-sucrase"));
var rimraf = _interopDefault(require("rimraf"));
var chalk = _interopDefault(require("chalk"));
var core = require("@opaline/core");
var readPkgUp = _interopDefault(require("read-pkg-up"));
var parser = require("@babel/parser");
var traverse = _interopDefault(require("@babel/traverse"));
var doctrine = require("doctrine");
var cp = require("child_process");

async function readPackageJson(cwd) {
  let pkgJson = await readPkgUp({ cwd, normalize: true });
  if (!pkgJson) {
    throw new core.OpalineError("OP002: No package.json file found");
  }

  return pkgJson;
}

async function getProjectInfo(cwd) {
  let pkgJson = await readPackageJson(cwd);
  let projectRootDir = path.dirname(pkgJson.path);

  if (!pkgJson.packageJson.bin) {
    throw new core.OpalineError("OP001: Bin field is empty in package.json", [
      "",
      "Please add 'bin' field to package.json, example:",
      "",
      '"bin": {',
      '  "mycli": "./cli/cli.js"',
      "}",
      "",
      "Choose any path and name for cli.js, don't need to create this file, opaline will generate it for you."
    ]);
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
    commands.map(command => parseCommand(project, command))
  );
}

async function parseCommand(project, command) {
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
    plugins: ["typescript"]
  });
  let comment;
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      comment =
        "/*" + (path.node.leadingComments || [{ value: "" }])[0].value + "\n*/";
    }
  });
  return comment;
}

function getMetaFromJSDoc({ jsdocComment, cliName }) {
  let jsdoc = jsdocComment
    ? doctrine.parse(jsdocComment, { unwrap: true, sloppy: true })
    : { description: "", tags: [] };
  let [title, ...description] = jsdoc.description.split("\n\n");

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
      acc[tag.name] = {
        title: tag.description,
        type: tag.type.name || tag.type.expression.name,
        default: tag.default
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
  return `#!/usr/bin/env node

let cli = require("@opaline/core").default;
let pkg = require("${pkgJsonRelativePath}");
let config = {
  cliName: "${project.cliName}",
  cliVersion: pkg.version,
  cliDescription: pkg.description,
  isSingleCommand: ${commandsData.length === 1 ? "true" : "false"},
  commands: {
    ${commandsData
      .map(
        command => `"${command.commandName}": {
      commandName: "${command.commandName}",
      meta: ${JSON.stringify(command.meta)},
      load: () => require("${getRelativeCommandPath(
        project.binOutputPath,
        command.commandName
      )}")
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
        sucrase({
          exclude: ["node_modules/**"],
          transforms: ["typescript"]
        })
      ]
    };
  }

  async getCommands() {
    return (await readdir(this.project.commandsDirPath)).filter(
      file =>
        !file.endsWith(".d.ts") &&
        !file.endsWith(".map") &&
        !file.startsWith("_")
    );
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

      let message = [
        chalk.green(
          `🦄 Built in ${(endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2)}ms!`
        ),
        ""
      ];
      let outputPath = this.project.commandsOutputPath.replace(
        this.project.projectRootDir + path.sep,
        ""
      );

      for (let bundle of output.output) {
        if (bundle.type === "chunk" && bundle.isEntry) {
          message.push(
            `${chalk.grey("– " + outputPath + path.sep)}${chalk.greenBright(
              bundle.fileName
            )}`
          );
        }
      }

      core.print(message);
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
      core.print([
        "",
        `${chalk.blueBright("[updated]")}`,
        "",
        ...this.commands.map(
          c => chalk.grey("– " + relativePathToCommands) + chalk.greenBright(c)
        )
      ]);
    } else {
      core.print(chalk.green(`🦄 Welcome to Opaline Dev Mode!`));
      core.print([
        "",
        `Watching commands ${chalk.grey("[+all of their dependencies]")}:`,
        "",
        ...this.commands.map(
          c => chalk.grey("– " + relativePathToCommands) + chalk.greenBright(c)
        )
      ]);
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
