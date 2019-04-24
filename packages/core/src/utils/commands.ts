import * as path from "path";

export function findCommand(commands: Array<string>, commandName: string) {
  return commands.find(c => c.startsWith(`${commandName}.`));
}

export function requireCommand(
  commandsDirPath: string,
  commandName: string
): CommandModule {
  let commandPath = path.resolve(path.join(commandsDirPath, commandName));
  let command = require(commandPath);

  if (command.default) {
    let newCommand = command.default as CommandModule;
    newCommand.options = command.default.options || command.options;
    newCommand.help = command.default.help || command.help;
    return newCommand;
  }

  return command as CommandModule;
}

export type CommandOptions = {
  description?: string;
  type?: string;
  alias?: string;
  default?: string | boolean | number;
};
export type CommandInputs = Array<string>;
export type CommandFlags = Record<string, string | number | boolean>;
export type CommandModule = {
  (inputs: CommandInputs, flags: CommandFlags): Promise<any>;
  options?: Record<string, CommandOptions>;
  help?: {
    description?: () => string;
    example?: (args: { name: string }) => string;
  };
};
