export interface NestedPrintableOutput extends Array<PrintableOutput> {}
export declare type PrintableOutput =
  | string
  | Array<string | NestedPrintableOutput>;
export declare type Task<Ctx = any, Params = any> = {
  title: string | ((ctx: Ctx, taskParams: Params) => string);
  abort?: (
    sharedCtx: Ctx,
    taskParams: Params,
    taskWrapper: TaskWrapper
  ) => Promise<boolean>;
  skip?: (
    sharedCtx: Ctx,
    taskParams: Params,
    taskWrapper: TaskWrapper
  ) => Promise<boolean>;
  task: (
    sharedCtx: Ctx,
    taskParams: Params,
    taskWrapper: TaskWrapper
  ) => Promise<PrintableOutput | undefined | void>;
};
export declare function indent(text: string, level?: number): string;
export declare class TaskWrapper<C = any, P = any> {
  private _title;
  private params;
  private sharedCtx;
  private task;
  private spinner;
  isAborted: boolean;
  constructor(sharedCtx: C, params: P, task: Task);
  skip(): void;
  abort(): void;
  progress(text: string): void;
  format(
    text: PrintableOutput,
    formatter?: (text: string) => string
  ): PrintableOutput;
  print(text: PrintableOutput, level?: number): void;
  printFormatted(text: PrintableOutput, level?: number): void;
  prompt(text: string): Promise<any>;
  set title(newTitle: string);
  get title(): string;
  run(): Promise<void>;
}
export declare function createCommand<C, P>(
  tasks: Array<Task<C, P>>
): (params: P) => Promise<void>;
//# sourceMappingURL=index.d.ts.map
