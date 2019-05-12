import { HelpOptionData } from "@opaline/help-theme-default";
import { PrintableOutput } from "../utils/print";
import { OpalineConfig } from "../types";
/**
 * Help command handler
 */
export declare function helpCommand(args: HelpCommandArgs): void;
/**
 * Generates overview help for a multi-command cli
 */
export declare function multiCommandCliHelp(args: HelpCommandArgs): PrintableOutput;
/**
 * Generates help for a subcommand of a mutli-command cli
 */
export declare function subCommandHelp(args: HelpCommandArgs): PrintableOutput;
/**
 * Generates help for a single command cli
 */
export declare function singleCommandCliHelp(args: HelpCommandArgs): PrintableOutput;
declare type HelpCommandArgs = {
    helpFormatter: any;
    config: OpalineConfig;
    commandName: string;
};
export declare function formatOptions(options: any): Array<HelpOptionData>;
export {};
//# sourceMappingURL=help.d.ts.map