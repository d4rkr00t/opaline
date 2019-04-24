export declare function findCommand(commands: Array<string>, commandName: string): string | undefined;
export declare type CommandOptions = {
    description?: string;
    type?: string;
    alias?: string;
    default?: string;
};
export declare type CommandModule = {
    (): any;
    options?: Record<string, CommandOptions>;
    help?: {
        description?: () => string;
        example?: (args: {
            name: string;
        }) => string;
    };
};
//# sourceMappingURL=commands.d.ts.map