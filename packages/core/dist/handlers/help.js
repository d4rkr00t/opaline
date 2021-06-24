"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOptions = exports.singleCommandCliHelp = exports.subCommandHelp = exports.multiCommandCliHelp = exports.helpCommand = void 0;
const print_1 = require("../utils/print");
/**
 * Help command handler
 */
function helpCommand(args) {
  if (args.config.isSingleCommand) {
    print_1.print(singleCommandCliHelp(args));
  } else if (args.commandName && args.commandName !== "index") {
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
      .filter((c) => c !== "index")
      .reduce((acc, commandName) => {
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
    usage: defaultCommand && defaultCommand.meta.usage,
    examples: (defaultCommand && defaultCommand.meta.examples) || [],
  });
}
exports.multiCommandCliHelp = multiCommandCliHelp;
/**
 * Generates help for a subcommand of a mutli-command cli
 */
function subCommandHelp(args) {
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
exports.subCommandHelp = subCommandHelp;
/**
 * Generates help for a single command cli
 */
function singleCommandCliHelp(args) {
  let { config, commandName } = args;
  let command = config.commands[commandName];
  let options = {
    ...(command && command.meta.options),
    help: helpFlag,
    version: versionFlag,
  };
  let meta = (command && command.meta) || {};
  return args.helpFormatter({
    cliName: config.cliName,
    cliVersion: config.cliVersion,
    cliDescription: config.cliDescription,
    options: formatOptions(options),
    usage: meta.usage,
    examples: meta.examples || [],
  });
}
exports.singleCommandCliHelp = singleCommandCliHelp;
let helpFlag = {
  title: "Output usage information",
};
let versionFlag = {
  title: "Output the version number",
};
function formatOptions(options) {
  return Object.keys(options).reduce((acc, name) => {
    let opt = options[name];
    acc.push({ name, ...opt });
    return acc;
  }, []);
}
exports.formatOptions = formatOptions;
