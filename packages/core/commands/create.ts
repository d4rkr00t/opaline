import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { prompt } from "enquirer";
import chalk from "chalk";
import mkdirp from "mkdirp";
import { OpalineError } from "@opaline/core";
import { createCommand, Task } from "@opaline/runner";
import {
  OP006_errorProjectNameIsRequired,
  OP007_errorProjectFolderExists
} from "./compiler/messages";

let writeFile = promisify(fs.writeFile);
let pexec = promisify(exec);

/**
 * Bootstraps new Opaline based CLI tool
 *
 * @usage {cliName} create app
 * @param {string[]} $inputs Name of a CLI tool
 */
export default async function create([name] = []) {
  if (!name) {
    throw OpalineError.fromArray(OP006_errorProjectNameIsRequired());
  }

  return await createCommand([
    initialize,
    createMainFolder,
    npmInit,
    updatePackageJson,
    bootstrapFiles
  ])({ name });
}

let exist = async (file: string) => {
  try {
    await promisify(fs.access)(file, fs.constants.F_OK);
    return false;
  } catch (e) {
    return true;
  }
};

let initialize: Task<TaskCtx, TaskParams> = {
  title: "Initialzing generator...",
  async task(ctx, { name }, runner) {
    let dir = path.join(process.cwd(), name);
    if (!(await exist(dir))) {
      throw OpalineError.fromArray(OP007_errorProjectFolderExists(dir));
    }

    runner.stopAndClearSpinner();

    let responses;
    try {
      responses = await prompt([
        {
          type: "input",
          name: "bin",
          message: "Name of a bin file for the cli:",
          hint: "> name --params",
          initial: name
        },
        {
          type: "confirm",
          name: "ists",
          message: "Use TypeScript?:",
          initial: true
        }
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
  }
};

let createMainFolder: Task<TaskCtx, TaskParams> = {
  title: "Creating folders...",
  async task(ctx) {
    await mkdirp(ctx.dir);
    await mkdirp(ctx.commandsDir);
  }
};

let npmInit: Task<TaskCtx, TaskParams> = {
  title: "Initializng npm package...",
  async task(ctx) {
    await pexec(`cd ${ctx.dir} && npm init --yes`);
  }
};

let updatePackageJson: Task<TaskCtx, TaskParams> = {
  title: "Adding dependencies and scripts...",
  async task(ctx) {
    let pkgJsonPath = path.join(ctx.dir, "package.json");
    let pkgJson = require(pkgJsonPath);

    pkgJson.bin = {
      [ctx.bin]: path.join(".", "dist", "cli.js")
    };

    pkgJson.scripts.build = "opaline build";
    pkgJson.scripts.dev = "opaline dev";

    pkgJson.dependencies = {
      "@opaline/core": "*"
    };

    if (ctx.isTS) {
      pkgJson.devDependencies = {
        typescript: "*"
      };
    }

    await writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2), "utf8");
  }
};

let bootstrapFiles: Task<TaskCtx, TaskParams> = {
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
      chalk`– {yellow cd ${ctx.name}}`,
      chalk`– {yellow npm install {dim or} yarn install}`,
      chalk`– {yellow npm run dev {dim or} yarn dev {dim # to start developing your CLI!}}`,
      ""
    ];
  }
};

type TaskParams = {
  name: string;
};

type TaskCtx = {
  dir: string;
  commandsDir: string;
  name: string;
  bin: string;
  isTS: boolean;
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
