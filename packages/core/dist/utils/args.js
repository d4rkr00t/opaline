"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHelp = exports.isVersion = void 0;
function isVersion(argv) {
  return argv.find((f) => f === "-v") || argv.find((f) => f === "--version");
}
exports.isVersion = isVersion;
function isHelp(argv) {
  return argv.find((f) => f === "--help");
}
exports.isHelp = isHelp;
