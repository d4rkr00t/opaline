import * as path from "path";
import { ProjectInfo } from "./project-info";
import { CommandData } from "./commands-parser";

export function createEntryPoint({
  project,
  commandsData
}: {
  project: ProjectInfo;
  commandsData: Array<CommandData>;
}) {
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
      )}").default
    }`
      )
      .join(", ")}
  }
};

cli(process.argv, config);
`;
}

function getRelativeCommandPath(binOutputPath: string, commandName: string) {
  return (
    "." +
    path.sep +
    path.relative(
      binOutputPath,
      path.join(binOutputPath, "commands", commandName)
    )
  );
}
