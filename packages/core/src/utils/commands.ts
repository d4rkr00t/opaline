export function findCommand(commands: Array<string>, commandName: string) {
  return commands.find(c => c.startsWith(`${commandName}.`));
}

export type CommandOptions = {
  description?: string;
  type?: string;
  alias?: string;
  default?: string;
};

export type CommandModule = {
  (): any;
  options?: Record<string, CommandOptions>;
  help?: {
    description?: () => string;
    example?: (args: { name: string }) => string;
  };
};
