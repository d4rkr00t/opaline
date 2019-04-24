import * as path from "path";
import minimist from "minimist";
import buildOptions from "minimist-options";
import { helpCommand } from "./commands/help";

export default async function createCLI(
  rawArgv: typeof process.argv,
  dir: string,
  packageJson: { name: string; version: string; description: string }
) {
  let argv = rawArgv.slice(2);
  let commandName = argv[0];
  let isCommand = commandName && !commandName.startsWith("-");
  let commandsDirPath = path.join(dir, "commands");

  // If command is passed check if file exists
  // Otherwise load index.js

  let commandPath;
  if (isCommand) {
    commandPath = path.resolve(path.join(commandsDirPath, commandName));
  } else {
    commandPath = path.resolve(path.join(commandsDirPath, "index"));
  }

  let command;
  try {
    command = require(commandPath);
  } catch (e) {}

  let { _: rawInputs, ...flags } = minimist(
    argv,
    buildOptions((command || {}).options || {})
  );
  let inputs = isCommand ? rawInputs.slice(1) : rawInputs;

  // If not a command and --version was passed, print version
  if (!isCommand && (flags.v || flags.version)) {
    console.log(packageJson.version);
    process.exit(0);
  }

  // If not a command and --help was passed, or command wasn't found, print help
  if (!command || (!isCommand && flags.help)) {
    helpCommand({ commandsDirPath, packageJson });
    process.exit(0);
  }

  // If a command and --help was passed, print command help
  if (command && flags.help) {
    console.log(`${commandName} HEEEEELP!`);
    process.exit(0);
  }

  try {
    await command(inputs, flags);
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}
