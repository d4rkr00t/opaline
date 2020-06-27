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
  //   0.1. If command is private -> error
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
  //   5.1. Check if 404 exists -> run
  //   5.2. If index exists -> run
  //   5.3. If index doesn't exist -> help

  // # 0
  if (!Object.keys(config.commands).length) {
    return error(`Need to add at least 1 command...`);
  }

  // # 0.1
  if (commandName === "404") {
    return error(
      `Command "${commandName}" is private and can't be called directly. Try "${config.cliName} --help"`
    );
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
    // # 5.1 | 5.2 | 5.3
    if (hasCommand("404") && isCommand) {
      return await run({
        commandName: "404",
        config,
        argv,
        isCommand,
      });
    } else if (hasCommand("index")) {
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
    isCommand && commandName !== "index" && commandName !== "404"
      ? rawInputs.slice(1)
      : rawInputs;
  let args = Object.keys(command.meta.options || {}).map((opt) => flags[opt]);

  let finalCommandArgs = [];
  if (command.meta.shouldPassInputs || command.meta.shouldPassEverything) {
    finalCommandArgs.push(inputs);
  }
  finalCommandArgs.push(...args);
  if (command.meta.shouldPassEverything) {
    let unusedFlags = Object.keys(flags || {})
      .filter((flag) => !command.meta.options.hasOwnProperty(flag))
      .reduce<Record<string, any>>((acc, flag) => {
        acc[flag] = flags[flag];
        return acc;
      }, {});
    finalCommandArgs.push(unusedFlags);
  }

  try {
    await command.load().apply(null, finalCommandArgs);
  } catch (error) {
    printError(error);
    console.log(error.stack);

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
