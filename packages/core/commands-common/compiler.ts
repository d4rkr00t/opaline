import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";
import Bundler from "parcel-bundler";
import chokidar from "chokidar";
import { getProjectInfo, ProjectInfo } from "./project-info";
import { parseCommands } from "./commands-parser";
import { createEntryPoint } from "./entry-generator";
import { link } from "./link";

let readdir = promisify(fs.readdir);
let writeFile = promisify(fs.writeFile);
let chmod = promisify(fs.chmod);

export class Compiler {
  private cwd: string;
  private mode: "development" | "production";
  private project?: ProjectInfo;

  private bundler?: Bundler;
  private commands?: Array<string>;
  private bundlerConfig?: object; // TODO: better type

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
    this.bundlerConfig = this.createBundlerConfig(watch);
  }

  private async refresh() {
    this.commands = await this.getCommands();
  }

  private createBundlerConfig(watch: boolean) {
    return {
      outDir: this.project.commandsOutputPath,
      watch,
      cache: true,
      cacheDir: ".cache",
      minify: this.mode === "development" ? false : true,
      target: "node" as "node",
      bundleNodeModules: false,
      sourceMaps: false
    };
  }

  private async getCommands() {
    return (await readdir(this.project.commandsDirPath)).filter(
      file =>
        !file.endsWith(".d.ts") &&
        !file.endsWith(".map") &&
        !file.startsWith("_")
    );
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

  private createBundler() {
    if (!this.bundlerConfig) {
      return;
    }

    this.bundler = new Bundler(
      this.getEntryPoints(this.commands),
      this.bundlerConfig
    );

    this.bundler.on("bundled", this.onBundled);

    return this.bundler;
  }

  private async updateBundler() {
    if (this.bundler) {
      // TODO: why?
      await (this.bundler as Bundler & { stop: Function }).stop();
      this.bundler.off("bundled", this.onBundled);
    }

    await this.refresh();

    return (await this.createBundler()).bundle();
  }

  async compile({ watch }: { watch?: boolean }) {
    await this.init(watch);
    await this.createBundler().bundle();

    if (watch) {
      let watcher = chokidar.watch(this.project.commandsDirPath, {
        ignoreInitial: true
      });
      watcher
        .on("add", file => {
          console.log("New command has been added:", file);
          console.log();
          this.updateBundler();
        })
        .on("unlink", file => {
          console.log("Command has been deleted:", file);
          console.log();
          this.updateBundler();
        });
    }
  }
}
