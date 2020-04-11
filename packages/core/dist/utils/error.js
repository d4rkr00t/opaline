"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OpalineError extends Error {
  constructor(message, hint, code = 1) {
    super(message);
    this.code = code;
    this.hint = hint;
  }
}
exports.OpalineError = OpalineError;
