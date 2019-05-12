import { HelpExampleData } from "@opaline/help-theme-default";
export declare type CommandOptions = {
  title?: string;
  type?: string;
  alias?: string;
  default?: string | boolean | number;
};
export declare type CommandInputs = Array<string>;
export declare type CommandFlags = Record<string, string | number | boolean>;
export declare type CommandModule = {
  (inputs: CommandInputs, flags: CommandFlags): Promise<any>;
  options?: Record<string, CommandOptions>;
  help?: {
    usage?: (args: { cliName: string }) => string;
    title?: (args: { cliName: string }) => string;
    description?: (args: { cliName: string }) => string;
    examples?: (args: { cliName: string }) => Array<HelpExampleData>;
  };
};
//# sourceMappingURL=commands.d.ts.map
