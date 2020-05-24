"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpalineError = void 0;
class OpalineError extends Error {
  constructor(message, hint, code = 1) {
    super(message);
    this.code = code;
    this.hint = hint;
  }
  static fromArray(data) {
    return new OpalineError(data[0], data[1], data[2]);
  }
}
exports.OpalineError = OpalineError;
