import * as path from "path";
import readPkgUp from "read-pkg-up";
import chalk from "chalk";
import { OpalineError } from "@opaline/core";
import {
  OP001_errorBinIsEmpty,
  OP002_errorNoPackageJson,
  OP005_errorSrcEqDest
} from "../compiler/messages";

export async function readPackageJson(cwd: string) {
  let pkgJson = await readPkgUp({ cwd, normalize: true });
  if (!pkgJson) {
    throw OpalineError.fromArray(OP002_errorNoPackageJson());
  }
  return pkgJson;
}

export async function getProjectInfo(cwd: string): Promise<ProjectInfo> {
  let pkgJson = await readPackageJson(cwd);
  let projectRootDir = path.dirname(pkgJson.path);

  if (!pkgJson.packageJson.bin) {
    throw OpalineError.fromArray(OP001_errorBinIsEmpty());
  }

  let cliName =
    typeof pkgJson.packageJson.bin === "string"
      ? pkgJson.packageJson.name
      : Object.keys(pkgJson.packageJson.bin)[0];
  let binOutputPath = path.join(
    projectRootDir,
    typeof pkgJson.packageJson.bin === "string"
      ? pkgJson.packageJson.bin
      : pkgJson.packageJson.bin![cliName]
  );
  let commandsOutputPath = path.join(path.dirname(binOutputPath), "commands");
  let commandsDirPath = path.join(
    projectRootDir,
    (pkgJson["@opaline"] && pkgJson["@opaline"].root) || "./commands"
  );

  if (commandsOutputPath === commandsDirPath) {
    throw OpalineError.fromArray(
      OP005_errorSrcEqDest(commandsDirPath, commandsOutputPath)
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

export type ProjectInfo = {
  pkgJson: {
    path: string;
    packageJson: Package;
  };
  cliName: string;
  binOutputPath: string;
  projectRootDir: string;
  commandsOutputPath: string;
  commandsDirPath: string;
};

export type Package = {
  [k: string]: any;
  name: string;
  version: string;
  files?: string[];
  bin?: { [k: string]: string };
  man?: string[];
  keywords?: string[];
  author?: Person;
  maintainers?: Person[];
  contributors?: Person[];
  bundleDependencies?: { [name: string]: string };
  dependencies?: { [name: string]: string };
  devDependencies?: { [name: string]: string };
  optionalDependencies?: { [name: string]: string };
  description?: string;
  engines?: { [type: string]: string };
  license?: string;
  repository?: { type: string; url: string };
  bugs?: { url: string; email?: string } | { url?: string; email: string };
  homepage?: string;
  scripts?: { [k: string]: string };
  readme: string;
  _id: string;
};

export type Person = {
  name?: string;
  email?: string;
  url?: string;
};
