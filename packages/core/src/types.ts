export type OpalineConfig = {
  cliName: string;
  cliVersion: string;
  cliDescription: string;
  isSingleCommand: boolean;
  commands: Record<string, OpalineCommand>;
};

export type OpalineCommand = {
  commandName: string;
  load: () => Function;
  meta: OpalineCommandMeta;
};

export type OpalineCommandMeta = {
  title: string;
  description: string;
  usage: string;
  examples: Array<string>;
  shouldPassInputs: boolean;
  shouldPassRestFlags: boolean;
  options: Record<string, OpalineCommandOptions>;
};

export type OpalineCommandOptions = {
  title?: string;
  type?: string;
  alias?: string;
  default?: string | boolean | number;
};
