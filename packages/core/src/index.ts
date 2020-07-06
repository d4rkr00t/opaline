import { Options } from "minimist-options";
import defaultHelpFormatter from "@opaline/help-theme-default";
import { helpCommand } from "./handlers/help";
import { isVersion, isHelp } from "./utils/args";
import { OpalineError } from "./utils/error";
import { OpalineConfig } from "./types";
import { print, printError, printInfo, printWarning } from "./utils/print";

export { OpalineError, OpalineConfig };
export { print, printError, printInfo, printWarning };

export default async function opaline(
  rawArgv: typeof process.argv,
  config: OpalineConfig
) {
  let helpFormatter = defaultHelpFormatter;
  let argv = rawArgv.slice(2);
  let commandName = argv[0];
  let isCommand = !!commandName && !commandName.startsWith("-");
  let hasCommand = (name: string) => !!config.commands[name];

  // 0. If no commands -> blow up!
  // 1. If --version and command is not passed -> print version
  // 2. If --help
  //   2.1. If command is not passed -> help
  //   2.2. If command is passed and exists -> help
  //   2.3. If command is passed and doesn't exist -> error
  // 3. If command is passed and exists -> run
  // 4. If command doesn't exist and single command cli
  //   4.1. Check if index exists -> run
  //   4.2. If index doesn't exist -> help
  // 5. If command doesn't exist and multi command cli
  //   5.1. If index exists -> run
  //   5.2. If index doesn't exist -> help

  // # 0
  if (!Object.keys(config.commands).length) {
    return error(`Need to add at least 1 command...`);
  }

  // # 1
  if (isVersion(argv) && !isCommand) {
    return version(config.cliVersion);
  }

  // # 2
  else if (isHelp(argv)) {
    if (!isCommand) {
      return help({
        helpFormatter,
        config,
        commandName: "index",
      });
    } else if (isCommand && hasCommand(commandName)) {
      return help({
        helpFormatter,
        config,
        commandName,
      });
    } else if (isCommand && !hasCommand(commandName)) {
      return error(
        `Command "${commandName}" doesn't exist, help can't be printed for it. Try "${config.cliName} --help"`
      );
    }
  }

  // # 3
  else if (isCommand && hasCommand(commandName)) {
    return await run({
      commandName,
      config,
      argv,
      isCommand,
    });
  }

  // # 4 – single command cli
  else if (config.isSingleCommand) {
    // # 4.1 | 4.2
    if (hasCommand("index")) {
      return await run({
        commandName: "index",
        config,
        argv,
        isCommand,
      });
    } else {
      return help({
        helpFormatter,
        config,
        commandName: "",
      });
    }
  }

  // # 5 – multi-command cli
  else if (!config.isSingleCommand) {
    // # 5.1 | 5.2
    if (hasCommand("index")) {
      return await run({
        commandName: "index",
        config,
        argv,
        isCommand,
      });
    } else {
      return help({
        helpFormatter,
        config,
        commandName: "",
      });
    }
  }
}

async function run({
  config,
  commandName,
  argv,
  isCommand,
}: {
  config: OpalineConfig;
  commandName: string;
  argv: Array<string>;
  isCommand: boolean;
}) {
  let minimist = require("minimist");
  let buildOptions = require("minimist-options");
  let command = config.commands[commandName];
  let { _: rawInputs, ...flags } = minimist(
    argv,
    buildOptions(command.meta.options as Options)
  );
  let inputs =
    isCommand && commandName !== "index" ? rawInputs.slice(1) : rawInputs;
  let commandOptions = command.meta.options || {};
  let args = [];
  let knownArgs = Object.keys(commandOptions).map((opt) => flags[opt]);
  let restArgs = Object.keys(flags || {})
    .filter((opt) => !commandOptions.hasOwnProperty(opt))
    .reduce<Record<string, any>>((acc, flag) => {
      acc[flag] = flags[flag];
      return acc;
    }, {});

  args.push(...knownArgs);
  if (command.meta.shouldPassRestFlags) {
    args.push(restArgs);
  }

  try {
    await command
      .load()
      .apply(null, command.meta.shouldPassInputs ? [inputs, ...args] : args);
  } catch (error) {
    printError(error);

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
  printError(msg);
  process.exit(1);
}

function help({
  helpFormatter,
  config,
  commandName,
}: {
  helpFormatter: any;
  config: OpalineConfig;
  commandName: string;
}) {
  helpCommand({
    helpFormatter,
    config,
    commandName,
  });
  process.exit(0);
}

// TODO: logging
// TODO: command aliases
