import * as path from "path";
import { readdirSync } from "fs";
import minimist from "minimist";
import buildOptions from "minimist-options";
import { helpCommand } from "./commands/help";
import { isVersion, isHelp } from "./utils/args";
import { findCommand } from "./utils/commands";
import { OpalineError } from "./utils/error";

export { OpalineError };

export default async function cli(
  rawArgv: typeof process.argv,
  dir: string,
  packageJson: {
    name: string;
    version: string;
    description: string;
    bin: Record<string, string>;
  }
) {
  let cliName = packageJson.bin
    ? Object.keys(packageJson.bin)[0]
    : packageJson.name;
  let argv = rawArgv.slice(2);
  let commandName = argv[0];
  let commandsDirPath = path.join(dir, "commands");
  let commands = readdirSync(commandsDirPath);
  let isCommand = !!commandName && !commandName.startsWith("-");
  let hasCommand = findCommand.bind(null, commands);

  // 0. If no commands -> blow up!
  // 1. If --version and command is not passed -> print version
  // 2. If --help
  //   2.1. If command is not passed -> help
  //   2.2. If command is passed and exists -> help
  //   2.3. If command is passed and doesn't exist -> error
  // 3. If command is passed and exists -> run
  // 4. If command doesn't exist and single command cli
  //   4.1. Check if index exists -> run
  //   4.2. If index doesn't exist -> error
  // 5. If command doesn't exist and multi command cli
  //   5.1. If index exists -> run
  //   5.2. If index doesn't exist -> error

  // # 0
  if (!commands.length) {
    return error(`Need to add at least 1 command to ${commandsDirPath}...`);
  }

  // # 1
  else if (isVersion(argv) && !isCommand) {
    return version(packageJson.version);
  }

  // # 2
  else if (isHelp(argv)) {
    if (!isCommand && hasCommand("index")) {
      return help({
        cliName,
        commandName: "index",
        commands,
        commandsDirPath,
        packageJson,
        isSingle: commands.length === 1
      });
    } else if (isCommand && hasCommand(commandName)) {
      return help({
        cliName,
        commandName,
        commands,
        commandsDirPath,
        packageJson,
        isSingle: commands.length === 1
      });
    } else if (isCommand && !hasCommand(commandName)) {
      return error(
        `Command "${commandName}" doesn't exist, help can't be printed for it. Try "${cliName} --help"`
      );
    }
  }

  // # 3
  else if (isCommand && hasCommand(commandName)) {
    return await run({ commandName, commandsDirPath, argv, isCommand });
  }

  // # 4 – single command cli
  else if (commands.length === 1) {
    // # 4.1 | 4.2
    if (hasCommand("index")) {
      return await run({
        commandName: "index",
        commandsDirPath,
        argv,
        isCommand
      });
    } else {
      return error(`Command not found. Try "${cliName} --help"`);
    }
  }

  // # 5 – multi-command cli
  else if (commands.length > 1) {
    // # 5.1 | 5.2
    if (hasCommand("index")) {
      return await run({
        commandName: "index",
        commandsDirPath,
        argv,
        isCommand
      });
    } else {
      return error(`Command not found. Try "${cliName} --help"`);
    }
  }
}

async function run({
  commandsDirPath,
  commandName,
  argv,
  isCommand
}: {
  commandsDirPath: string;
  commandName: string;
  argv: Array<string>;
  isCommand: boolean;
}) {
  let commandPath = path.resolve(path.join(commandsDirPath, commandName));
  let command = require(commandPath);
  let { _: rawInputs, ...flags } = minimist(
    argv,
    buildOptions((command || {}).options || {})
  );
  let inputs = isCommand ? rawInputs.slice(1) : rawInputs;

  try {
    await command(inputs, flags);
    process.exit(0);
  } catch (error) {
    if (error instanceof OpalineError) {
      process.exit(error.code);
    } else {
      process.exit(1);
    }
  }
}

function version(v: string) {
  console.log(v);
  process.exit(0);
}

function error(msg: string) {
  console.error(msg);
  process.exit(1);
}

function help({
  cliName,
  commandName,
  commands,
  commandsDirPath,
  packageJson,
  isSingle
}: {
  cliName: string;
  commandName: string;
  commands: Array<string>;
  commandsDirPath: string;
  packageJson: any;
  isSingle: boolean;
}) {
  helpCommand({
    cliName,
    commandName,
    commands,
    commandsDirPath,
    packageJson,
    isSingle
  });
  process.exit(0);
}

// TODO: logging
