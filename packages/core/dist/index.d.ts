import { OpalineError } from "./utils/error";
import { OpalineConfig } from "./types";
import { print, printError, printInfo, printWarning } from "./utils/print";
export { OpalineError, OpalineConfig };
export { print, printError, printInfo, printWarning };
export default function opaline(
  rawArgv: typeof process.argv,
  config: OpalineConfig
): Promise<void>;
//# sourceMappingURL=index.d.ts.map
