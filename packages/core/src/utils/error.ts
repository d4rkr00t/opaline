export class OpalineError extends Error {
  code?: number;
  hint?: string | string[];

  constructor(message?: string, hint?: string | string[], code: number = 1) {
    super(message);
    this.code = code;
    this.hint = hint;
  }
}
