import { HelpCommandData, HelpOptionData } from "@opaline/help-theme-default";
import { print, PrintableOutput } from "../utils/print";
import { findCommand, CommandOptions, requireCommand } from "../utils/commands";

/**
 * Help command handler
 */
export function helpCommand(args: CommandArgs) {
  if (args.isSingle) {
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
export function multiCommandCliHelp(args: CommandArgs): PrintableOutput {
  let { commands, packageJson, commandsDirPath, cliName } = args;

  let defaultCommand = findCommand(commands, "index")
    ? requireCommand(commandsDirPath, "index")
    : undefined;

  let options = {
    ...(defaultCommand && defaultCommand.options),
    help: helpFlag,
    version: versionFlag
  };

  function createSubCommandsHelp() {
    return commands
      .filter(c => !c.startsWith("index."))
      .reduce<Array<HelpCommandData>>((acc, commandName) => {
        let name = commandName.split(".")[0];
        let command = requireCommand(commandsDirPath, commandName)!;
        acc.push({
          name,
          title:
            command.help && command.help.title
              ? command.help.title({ cliName })
              : "No description"
        });
        return acc;
      }, []);
  }

  return args.helpFormatter({
    cliName,
    cliVersion: packageJson.version,
    description: packageJson.description,
    commands: createSubCommandsHelp(),
    options: formatOptions(options),
    usage:
      defaultCommand && defaultCommand.help && defaultCommand.help.usage
        ? defaultCommand.help.usage({ cliName })
        : "",
    examples:
      defaultCommand && defaultCommand.help && defaultCommand.help.examples
        ? defaultCommand.help.examples({ cliName })
        : []
  });
}

/**
 * Generates help for a subcommand of a mutli-command cli
 */
export function subCommandHelp(args: CommandArgs): PrintableOutput {
  let { packageJson, commandsDirPath, commandName, cliName } = args;
  let command = requireCommand(commandsDirPath, commandName)!;

  let help = args.helpFormatter({
    commandName,
    cliName,
    cliVersion: packageJson.version,
    description:
      command.help && command.help.description
        ? command.help.description({ cliName })
        : "",
    options: formatOptions(command.options || {}),
    usage:
      command && command.help && command.help.usage
        ? command.help.usage({ cliName })
        : "",
    examples:
      command && command.help && command.help.examples
        ? command.help.examples({ cliName })
        : []
  });

  if (!help.length) {
    return ["", "No help provided for this command!"];
  }

  return help;
}

/**
 * Generates help for a single command cli
 */
export function singleCommandCliHelp(args: CommandArgs): PrintableOutput {
  let { packageJson, commandsDirPath, commandName, cliName } = args;
  let command = requireCommand(commandsDirPath, commandName);

  let options = {
    ...(command && command.options),
    help: helpFlag,
    version: versionFlag
  };

  return args.helpFormatter({
    cliName,
    cliVersion: packageJson.version,
    description: packageJson.description,
    options: formatOptions(options),
    usage:
      command && command.help && command.help.usage
        ? command.help.usage({ cliName })
        : "",
    examples:
      command && command.help && command.help.examples
        ? command.help.examples({ cliName })
        : []
  });
}

type CommandArgs = {
  helpFormatter: any;
  cliName: string;
  commandName: string;
  commands: Array<string>;
  commandsDirPath: string;
  packageJson: { name: string; version: string; description: string };
  isSingle: boolean;
};

let helpFlag = {
  title: "Output usage information"
};

let versionFlag = {
  title: "Output the version number"
};

export function formatOptions(options: any): Array<HelpOptionData> {
  return Object.keys(options).reduce<Array<HelpOptionData>>((acc, name) => {
    let opt = options[name] as CommandOptions;
    acc.push({ name, ...opt });
    return acc;
  }, []);
}
