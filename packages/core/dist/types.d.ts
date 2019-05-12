export declare type OpalineConfig = {
    cliName: string;
    cliVersion: string;
    cliDescription: string;
    isSingleCommand: boolean;
    commands: Record<string, OpalineCommand>;
};
export declare type OpalineCommand = {
    commandName: string;
    load: () => Function;
    meta: OpalineCommandMeta;
};
export declare type OpalineCommandMeta = {
    title: string;
    description: string;
    usage: string;
    examples: Array<string>;
    shouldPassInputs: boolean;
    options: Record<string, OpalineCommandOptions>;
};
export declare type OpalineCommandOptions = {
    title?: string;
    type?: string;
    alias?: string;
    default?: string | boolean | number;
};
//# sourceMappingURL=types.d.ts.map