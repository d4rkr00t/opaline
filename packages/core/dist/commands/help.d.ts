export declare function helpCommand({ commandsDirPath, packageJson }: {
    commandsDirPath: string;
    packageJson: {
        name: string;
        version: string;
        description: string;
    };
}): void;
export declare function createCommandsHelp({ commands, commandsDirPath, packageJson }: {
    commands: Array<string>;
    commandsDirPath: string;
    packageJson: {
        name: string;
        version: string;
        description: string;
    };
}): import("../utils/print").PrintableOutput;
//# sourceMappingURL=help.d.ts.map