"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const print_1 = require("../utils/print");
const commands_1 = require("../utils/commands");
/**
 * Help command handler
 */
function helpCommand(args) {
  if (args.isSingle) {
    print_1.print(singleCommandCliHelp(args));
  } else if (args.commandName !== "index") {
    print_1.print(subCommandHelp(args));
  } else {
    print_1.print(multiCommandCliHelp(args));
  }
}
exports.helpCommand = helpCommand;
/**
 * Generates overview help for a multi-command cli
 */
function multiCommandCliHelp(args) {
  let { commands, packageJson, commandsDirPath, cliName } = args;
  let defaultCommand = commands_1.findCommand(commands, "index")
    ? commands_1.requireCommand(commandsDirPath, "index")
    : undefined;
  let options = {
    ...(defaultCommand && defaultCommand.options),
    help: helpFlag,
    version: versionFlag
  };
  function createSubCommandsHelp() {
    return commands
      .filter(c => !c.startsWith("index."))
      .reduce((acc, commandName) => {
        let name = commandName.split(".")[0];
        let command = commands_1.requireCommand(commandsDirPath, commandName);
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
exports.multiCommandCliHelp = multiCommandCliHelp;
/**
 * Generates help for a subcommand of a mutli-command cli
 */
function subCommandHelp(args) {
  let { packageJson, commandsDirPath, commandName, cliName } = args;
  let command = commands_1.requireCommand(commandsDirPath, commandName);
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
exports.subCommandHelp = subCommandHelp;
/**
 * Generates help for a single command cli
 */
function singleCommandCliHelp(args) {
  let { packageJson, commandsDirPath, commandName, cliName } = args;
  let command = commands_1.requireCommand(commandsDirPath, commandName);
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
exports.singleCommandCliHelp = singleCommandCliHelp;
let helpFlag = {
  title: "Output usage information"
};
let versionFlag = {
  title: "Output the version number"
};
function formatOptions(options) {
  return Object.keys(options).reduce((acc, name) => {
    let opt = options[name];
    acc.push({ name, ...opt });
    return acc;
  }, []);
}
exports.formatOptions = formatOptions;
