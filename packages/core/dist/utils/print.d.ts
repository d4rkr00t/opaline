export interface NestedPrintableOutput extends Array<PrintableOutput> {}
export declare type PrintableOutput =
  | string
  | Array<string | NestedPrintableOutput>;
export declare function indent(text: string, level?: number): string;
export declare function print(text: PrintableOutput, level?: number): void;
//# sourceMappingURL=print.d.ts.map
