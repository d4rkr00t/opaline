import { PrintableOutput } from "../utils/print";
declare type CommandArgs = {
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
export declare function singleCommandCliHelp(args: CommandArgs): PrintableOutput;
/**
 * Formats command options using following structure:
 *   --flag, -f   Description [type] [default: value]
 */
export declare function formatOptions(options: any): Array<[string, string]>;
export {};
//# sourceMappingURL=help.d.ts.map