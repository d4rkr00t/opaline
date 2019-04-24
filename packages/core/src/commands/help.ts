import * as path from "path";
import { readdirSync } from "fs";
import chalk from "chalk";
import { print, printList } from "../utils/print";

export function helpCommand({
  commandsDirPath,
  packageJson
}: {
  commandsDirPath: string;
  packageJson: { name: string; version: string; description: string };
}) {
  let commands = readdirSync(commandsDirPath);
  commands.sort((a, b) => {
    if (a.startsWith("index.")) {
      return -1;
    }
    if (b.startsWith("index.")) {
      return 1;
    }
    return 0;
  });

  let output = [
    `${packageJson.name} [${packageJson.version}]`,
    "",
    packageJson.description,
    "",
    chalk.green("Options"),
    [
      `${chalk.yellow("-v, --version")}   Prints version.`,
      `${chalk.yellow("--help")}          Prints help.`
    ],
    "",
    chalk.green("Commands"),
    createCommandsHelp({ commands, commandsDirPath, packageJson })
  ];
  print(output);
}

export function createCommandsHelp({
  commands,
  commandsDirPath,
  packageJson
}: {
  commands: Array<string>;
  commandsDirPath: string;
  packageJson: { name: string; version: string; description: string };
}) {
  return printList(
    commands.reduce<Array<[string, string]>>((acc, commandName) => {
      let name = commandName.startsWith("index.")
        ? "[default]"
        : commandName.split(".")[0];
      let command = require(path.resolve(
        path.join(commandsDirPath, commandName)
      ));
      acc.push([
        name,
        command.help ? command.help.description() : "No description"
      ]);
      return acc;
    }, []),
    s => chalk.yellow(s),
    16
  );
}
