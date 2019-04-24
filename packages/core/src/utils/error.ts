export class OpalineError extends Error {
  code?: number;

  constructor(message?: string, code: number = 1) {
    super(message);
    this.code = code;
  }
}
