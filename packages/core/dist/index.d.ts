export default function cli(rawArgv: typeof process.argv, dir: string, packageJson: {
    name: string;
    version: string;
    description: string;
    bin: Record<string, string>;
}): Promise<void>;
//# sourceMappingURL=index.d.ts.map