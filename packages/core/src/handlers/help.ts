import { HelpCommandData, HelpOptionData } from "@opaline/help-theme-default";
import { print, PrintableOutput } from "../utils/print";
import { OpalineCommandOptions, OpalineConfig } from "../types";

/**
 * Help command handler
 */
export function helpCommand(args: HelpCommandArgs) {
  if (args.config.isSingleCommand) {
    print(singleCommandCliHelp(args));
  } else if (args.commandName && args.commandName !== "index") {
    print(subCommandHelp(args));
  } else {
    print(multiCommandCliHelp(args));
  }
}

/**
 * Generates overview help for a multi-command cli
 */
export function multiCommandCliHelp(args: HelpCommandArgs): PrintableOutput {
  let { config } = args;
  let { commands } = config;

  let defaultCommand = commands["index"];

  let options = {
    ...(defaultCommand && defaultCommand.meta.options),
    help: helpFlag,
    version: versionFlag,
  };

  function createSubCommandsHelp() {
    return Object.keys(commands)
      .filter((c) => c !== "index" && c !== "404")
      .reduce<Array<HelpCommandData>>((acc, commandName) => {
        let command = commands[commandName];
        acc.push({
          name: commandName,
          title: command.meta.title,
        });
        return acc;
      }, []);
  }

  return args.helpFormatter({
    cliName: config.cliName,
    cliVersion: config.cliVersion,
    cliDescription: config.cliDescription,
    commands: createSubCommandsHelp(),
    options: formatOptions(options),
    usage: defaultCommand && (defaultCommand.meta.usage || "").trim(),
    examples: (defaultCommand && defaultCommand.meta.examples) || [],
  });
}

/**
 * Generates help for a subcommand of a mutli-command cli
 */
export function subCommandHelp(args: HelpCommandArgs): PrintableOutput {
  let { commandName, config } = args;
  let command = config.commands[commandName];

  let help = args.helpFormatter({
    commandName,
    cliName: config.cliName,
    cliVersion: config.cliName,
    title: command.meta.title,
    description: command.meta.description,
    options: formatOptions(command.meta.options || {}),
    usage: command.meta.usage,
    examples: command.meta.examples || [],
  });

  if (!help.length) {
    return ["", "No help provided for this command!"];
  }

  return help;
}

/**
 * Generates help for a single command cli
 */
export function singleCommandCliHelp(args: HelpCommandArgs): PrintableOutput {
  let { config, commandName } = args;
  let command = config.commands[commandName];

  let options = {
    ...(command && command.meta.options),
    help: helpFlag,
    version: versionFlag,
  };

  return args.helpFormatter({
    cliName: config.cliName,
    cliVersion: config.cliVersion,
    cliDescription: config.cliDescription,
    options: formatOptions(options),
    usage: command.meta.usage,
    examples: command.meta.examples || [],
  });
}

type HelpCommandArgs = {
  helpFormatter: any;
  config: OpalineConfig;
  commandName: string;
};

let helpFlag = {
  title: "Output usage information",
};

let versionFlag = {
  title: "Output the version number",
};

export function formatOptions(options: any): Array<HelpOptionData> {
  return Object.keys(options).reduce<Array<HelpOptionData>>((acc, name) => {
    let opt = options[name] as OpalineCommandOptions;
    acc.push({ name, ...opt });
    return acc;
  }, []);
}
