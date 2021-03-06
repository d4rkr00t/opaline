import { OpalineError } from "../utils/error";
export interface NestedPrintableOutput extends Array<PrintableOutput> {}
export declare type PrintableOutput =
  | string
  | Array<string | NestedPrintableOutput>;
export declare function indent(text: string, level?: number): string;
export declare function print(text: PrintableOutput, level?: number): void;
export declare function printWarning(text: string): void;
export declare function printError(
  err: OpalineError | Error | string,
  verbose?: boolean
): void;
export declare function printInfo(text: string): void;
//# sourceMappingURL=print.d.ts.map
