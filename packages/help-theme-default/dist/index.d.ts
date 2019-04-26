/**
 * Default formatter for help output
 */
export default function helpFormatter(help: HelpData | HelpSubCommandData): any;
export declare type HelpData = {
  cliName: string;
  cliVersion: string;
  description?: string;
  usage?: string;
  commands?: Array<HelpCommandData>;
  options?: Array<HelpOptionData>;
  examples?: Array<HelpExampleData>;
};
export declare type HelpSubCommandData = {
  cliName: string;
  cliVersion: string;
  commandName: string;
  description?: string;
  usage?: string;
  options?: Array<HelpOptionData>;
  examples?: Array<HelpExampleData>;
};
export declare type HelpCommandData = {
  name: string;
  title: string;
  input?: string;
};
export declare type HelpOptionData = {
  name: string;
  title?: string;
  alias?: string;
  type?: string;
  default?: string | boolean | number;
};
export declare type HelpExampleData = {
  example: string;
  description?: string;
};
//# sourceMappingURL=index.d.ts.map
