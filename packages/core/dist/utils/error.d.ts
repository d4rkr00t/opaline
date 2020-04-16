export declare class OpalineError extends Error {
  code?: number;
  hint?: string | readonly string[];
  constructor(
    message?: string,
    hint?: string | readonly string[],
    code?: number
  );
  static fromArray(
    data:
      | readonly [string]
      | readonly [string, string | readonly string[]]
      | readonly [string, string | readonly string[], number]
  ): OpalineError;
}
//# sourceMappingURL=error.d.ts.map
