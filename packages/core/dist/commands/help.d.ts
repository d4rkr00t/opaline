import { HelpOptionData } from "@opaline/help-theme-default";
import { PrintableOutput } from "../utils/print";
/**
 * Help command handler
 */
export declare function helpCommand(args: CommandArgs): void;
/**
 * Generates overview help for a multi-command cli
 */
export declare function multiCommandCliHelp(args: CommandArgs): PrintableOutput;
/**
 * Generates help for a subcommand of a mutli-command cli
 */
export declare function subCommandHelp(args: CommandArgs): PrintableOutput;
/**
 * Generates help for a single command cli
 */
export declare function singleCommandCliHelp(
  args: CommandArgs
): PrintableOutput;
declare type CommandArgs = {
  helpFormatter: any;
  cliName: string;
  commandName: string;
  commands: Array<string>;
  commandsDirPath: string;
  packageJson: {
    name: string;
    version: string;
    description: string;
  };
  isSingle: boolean;
};
export declare function formatOptions(options: any): Array<HelpOptionData>;
export {};
//# sourceMappingURL=help.d.ts.map
