"use strict";

var fs = require("fs");
var path = require("path");
var cp = require("child_process");
var util = require("util");
var enquirer = require("enquirer");
var colorette = require("colorette");
var mkdirp = require("mkdirp");
var core = require("@opaline/core");
var runner = require("@opaline/runner");
var messages = require("./messages-841eed31.js");

function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { default: e };
}

var mkdirp__default = /*#__PURE__*/ _interopDefaultLegacy(mkdirp);

let writeFile = util.promisify(fs.writeFile);
let pexec = util.promisify(cp.exec);

/**
 * Bootstraps new Opaline based CLI tool
 *
 * @usage {cliName} create app
 * @param {Array<string>} $inputs Name of a CLI tool
 */
async function create([name] = []) {
  if (!name) {
    throw core.OpalineError.fromArray(
      messages.OP006_errorProjectNameIsRequired()
    );
  }

  return await runner.createCommand([
    initialize,
    createMainFolder,
    npmInit,
    updatePackageJson,
    bootstrapFiles,
  ])({ name });
}

let exist = async (file) => {
  try {
    await util.promisify(fs.access)(file, fs.constants.F_OK);
    return false;
  } catch (e) {
    return true;
  }
};

let initialize = {
  title: "Initialzing generator...",
  async task(ctx, { name }, runner) {
    let dir = path.join(process.cwd(), name);
    if (!(await exist(dir))) {
      throw core.OpalineError.fromArray(
        messages.OP007_errorProjectFolderExists(dir)
      );
    }

    runner.stopAndClearSpinner();

    let responses;
    try {
      responses = await enquirer.prompt([
        {
          type: "input",
          name: "bin",
          message: "Name of a bin file for the cli:",
          hint: "> name --params",
          initial: name,
        },
        {
          type: "confirm",
          name: "ists",
          message: "Use TypeScript?:",
          initial: true,
        },
      ]);
    } catch (e) {
      runner.abort();
    }

    // Create context for the following tasks
    ctx.dir = dir;
    ctx.commandsDir = path.join(dir, "commands");
    ctx.name = name;
    ctx.bin = responses.bin;
    ctx.isTS = responses.ists;
  },
};

let createMainFolder = {
  title: "Creating folders...",
  async task(ctx) {
    await mkdirp__default["default"](ctx.dir);
    await mkdirp__default["default"](ctx.commandsDir);
  },
};

let npmInit = {
  title: "Initializng npm package...",
  async task(ctx) {
    await pexec(`cd ${ctx.dir} && npm init --yes`);
  },
};

let updatePackageJson = {
  title: "Adding dependencies and scripts...",
  async task(ctx) {
    let pkgJsonPath = path.join(ctx.dir, "package.json");
    let pkgJson = require(pkgJsonPath);

    pkgJson.bin = {
      [ctx.bin]: path.join(".", "dist", "cli.js"),
    };

    pkgJson.scripts.build = "opaline build";
    pkgJson.scripts.dev = "opaline dev";
    pkgJson.scripts.typecheck = "exit 0";
    pkgJson.scripts["lint:staged"] = "lint-staged";
    pkgJson.scripts["prepare"] = "npm run typecheck";
    pkgJson["pre-commit"] = ["lint:staged"];
    pkgJson["lint-staged"] = {
      "*.{js,ts,tsx}": ["prettier --write", "git add"],
    };

    pkgJson.dependencies = {
      "@opaline/core": "*",
    };

    pkgJson.devDependencies = {
      "lint-staged": "*",
      "pre-commit": "*",
      prettier: "*",
    };

    if (ctx.isTS) {
      pkgJson.scripts.typecheck = "tsc";
      pkgJson.devDependencies["typescript"] = "*";
    }

    await writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2), "utf8");
  },
};

let bootstrapFiles = {
  title: "Bootstrapping files...",
  async task(ctx) {
    // create index.ts or index.js with a hello world command
    await writeFile(
      path.join(ctx.commandsDir, "index." + (ctx.isTS ? "ts" : "js")),
      ctx.isTS ? commandFileTemplateTS : commandFileTemplateJS,
      "utf8"
    );

    // create tsconfig if needed...
    if (ctx.isTS) {
      await writeFile(
        path.join(ctx.dir, "tsconfig.json"),
        tsconfigTemplate,
        "utf8"
      );
    }

    return [
      "",
      "Almost there! Just a few steps left:",
      "",
      `– ${colorette.yellow(`cd ${ctx.name}`)}`,
      `– ${colorette.yellow("npm install")} ${colorette.dim(
        "or"
      )} ${colorette.yellow("yarn install")}`,
      `– ${colorette.yellow("npm run dev")} ${colorette.dim(
        "or"
      )} ${colorette.yellow("yarn dev")} ${colorette.dim(
        "# to start developing your CLI!"
      )}`,
      "",
    ];
  },
};

let commandFileTemplateJS = `/**
 * Use JSDoc comments to define help and parameters for a CLI.
 * {cliName} will be replaced with an actual name of a CLI tool.
 *
 * @usage {cliName} inputs --param1 10 --param2 20
 *
 * @param {string[]} $inputs
 * @param {number}   [param1=20] some parameter for a CLI with a default value
 * @param {string}   param2 some parameter for a CLI
 */
export default async function main($inputs, param1, param2) {
  console.log("Hello World from Opaline!");
  console.log("Inputs: " + $inputs);
  console.log("Param 1: " + param1);
  console.log("Param 2: " + param2);
}`;

let commandFileTemplateTS = `/**
 * Use JSDoc comments to define help and parameters for a CLI.
 * {cliName} will be replaced with an actual name of a CLI tool.
 *
 * @usage {cliName} inputs --param1 10 --param2 20
 *
 * @param {string[]} $inputs
 * @param {number}   [param1=20] some parameter for a CLI with a default value
 * @param {string}   param2 some parameter for a CLI
 */
export default async function main($inputs: string[], param1: number, param2?: string) {
  console.log("Hello World from Opaline!");
  console.log("Inputs: " + $inputs);
  console.log("Param 1: " + param1);
  console.log("Param 2: " + param2);
}`;

let tsconfigTemplate = `{
  "compilerOptions": {
    "target": "es2018" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */,
    "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */,
    "isolatedModules": true, /* Needed for https://github.com/alangpierce/sucrase */
    "strict": true /* Enable all strict type-checking options. */,
    "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,
    "rootDir": "./commands",
    "noEmit": true /* Not needed as opaline takes care of compilation.  */
  },
  "include": ["./commands/**/*.ts"],
}
`;

module.exports = create;
