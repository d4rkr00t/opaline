import { OpalineError } from "./utils/error";
import { OpalineConfig } from "./types";
import { printError, printInfo } from "./utils/print";
export { OpalineError, OpalineConfig };
export { printError, printInfo };
export default function opaline(
  rawArgv: typeof process.argv,
  config: OpalineConfig
): Promise<void>;
//# sourceMappingURL=index.d.ts.map
