"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OpalineError extends Error {
    constructor(message, code = 1) {
        super(message);
        this.code = code;
    }
}
exports.OpalineError = OpalineError;
