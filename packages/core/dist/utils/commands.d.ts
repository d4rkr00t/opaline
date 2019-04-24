export declare function findCommand(commands: Array<string>, commandName: string): string | undefined;
export declare function requireCommand(commandsDirPath: string, commandName: string): CommandModule;
export declare type CommandOptions = {
    description?: string;
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
        description?: () => string;
        example?: (args: {
            name: string;
        }) => string;
    };
};
//# sourceMappingURL=commands.d.ts.map