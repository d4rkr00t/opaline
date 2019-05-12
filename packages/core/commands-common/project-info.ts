import * as path from "path";
import readPkgUp from "read-pkg-up";
import { OpalineError } from "@opaline/core";

export async function readPackageJson(cwd: string) {
  let pkgJson = await readPkgUp({ cwd, normalize: true });
  if (!pkgJson) {
    throw new OpalineError();
  }

  return pkgJson;
}

export async function getProjectInfo(cwd: string): Promise<ProjectInfo> {
  let pkgJson = await readPackageJson(cwd);
  let projectRootDir = path.dirname(pkgJson.path);
  let cliName =
    typeof pkgJson.package.bin === "string"
      ? pkgJson.package.name
      : Object.keys(pkgJson.package.bin!)[0];
  let binOutputPath = path.join(
    projectRootDir,
    typeof pkgJson.package.bin === "string"
      ? pkgJson.package.bin
      : pkgJson.package.bin![cliName]
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

export type ProjectInfo = {
  pkgJson: {
    path: string;
    package: Package;
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
