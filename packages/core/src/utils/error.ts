export class OpalineError extends Error {
  code?: number;
  hint?: string | readonly string[];

  constructor(
    message?: string,
    hint?: string | readonly string[],
    code: number = 1
  ) {
    super(message);
    this.code = code;
    this.hint = hint;
  }

  static fromArray(
    data:
      | readonly [string]
      | readonly [string, string | readonly string[]]
      | readonly [string, string | readonly string[], number]
  ) {
    return new OpalineError(data[0], data[1], data[2]);
  }
}
