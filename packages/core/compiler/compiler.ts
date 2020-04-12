import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";
import * as chokidar from "chokidar";
import rollup from "rollup";
import sucrase from "@rollup/plugin-sucrase";
import rimraf from "rimraf";
import chalk from "chalk";
import { printWarning, print, OpalineError } from "@opaline/core";
import { getProjectInfo, ProjectInfo } from "./project-info";
import { parseCommands } from "./commands-parser";
import { createEntryPoint } from "./entry-generator";
import { link } from "./link";

let readdir = promisify(fs.readdir);
let writeFile = promisify(fs.writeFile);
let chmod = promisify(fs.chmod);
let rm = promisify(rimraf) as typeof rimraf;

export class Compiler {
  private cwd: string;
  private mode: "development" | "production";
  private project?: ProjectInfo;

  private watcher?: rollup.RollupWatcher;
  private commands?: Array<string>;

  constructor({
    cwd,
    mode = "development"
  }: {
    cwd: string;
    mode: "development" | "production";
  }) {
    this.cwd = cwd;
    this.mode = mode;
  }

  private async init(watch: boolean) {
    this.project = await getProjectInfo(this.cwd);
    this.commands = await this.getCommands();

    if (!this.commands.length) {
      throw new OpalineError("OP004: Commands folder is empty", [
        "",
        `Add a file/files to "${this.project.commandsDirPath}", for example "index.js".`
      ]);
    }
  }

  private async updateCommands() {
    this.commands = await this.getCommands();
  }

  private createBundlerConfig(): rollup.RollupOptions {
    return {
      input: this.getEntryPoints(this.commands),
      output: {
        dir: this.project.commandsOutputPath,
        format: "cjs" as rollup.ModuleFormat
      },
      external: id =>
        !id.startsWith("\0") && !id.startsWith(".") && !id.startsWith("/"),
      onwarn: warning => {
        if (warning.code !== "EMPTY_BUNDLE") {
          printWarning(warning.message);
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

  private async getCommands() {
    try {
      return (await readdir(this.project.commandsDirPath)).filter(
        file =>
          !file.endsWith(".d.ts") &&
          !file.endsWith(".map") &&
          !file.startsWith("_")
      );
    } catch (e) {
      throw new OpalineError(
        `OP003: ${this.project.commandsDirPath} folder doesn't exist`,
        [
          "",
          "Please create 'commands' folder, because this is where opaline is expecting to find cli commands to compile."
        ]
      );
    }
  }

  private getEntryPoints(commands: Array<string>) {
    return commands.map(c => path.join(this.project.commandsDirPath, c));
  }

  private onBundled = async () => {
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

  async compile({ watch }: { watch?: boolean }) {
    await this.init(watch);

    if (watch) {
      await this.watch();
    } else {
      await this.build();
    }
  }

  private async build() {
    let startTime = process.hrtime();
    let config = this.createBundlerConfig();
    let bundle = await rollup.rollup(config);

    try {
      // Clean up old bundles
      await rm(this.project.commandsOutputPath);

      // write the bundle to disk
      let output = await bundle.write(config.output as rollup.OutputOptions);
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

      this.onBundled();

      print(message);
    } catch (error) {
      console.error(error);
    }
  }

  private async watch() {
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

  private async createWatchBundler() {
    let relativePathToCommands =
      this.project.commandsDirPath.replace(
        this.project.projectRootDir + path.sep,
        ""
      ) + path.sep;

    if (this.watcher) {
      this.watcher.close();
      print([
        "",
        `${chalk.blueBright("[updated]")}`,
        "",
        ...this.commands.map(
          c => chalk.grey("– " + relativePathToCommands) + chalk.greenBright(c)
        )
      ]);
    } else {
      print(chalk.green(`🦄 Welcome to Opaline Dev Mode!`));
      print([
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
