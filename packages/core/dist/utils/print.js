"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
function indent(text, level = 1) {
  return `${"".padStart(level * 2, " ")}${text}`;
}
exports.indent = indent;
function print(text, level = 0) {
  if (Array.isArray(text)) {
    text.forEach(item => {
      if (Array.isArray(item)) {
        print(item, level + 1);
      } else {
        console.log(indent(item, level));
      }
    });
  } else {
    console.log(indent(text, level));
  }
}
exports.print = print;
function printWarning(text) {
  print(chalk_1.default.yellow("[WARN] ") + text);
}
exports.printWarning = printWarning;
function printError(err, verbose = false) {
  if (typeof err === "string") {
    print(chalk_1.default.red(`[ERROR] `) + err);
  } else {
    print(
      [chalk_1.default.red(`[ERROR] ${err.name}: ${err.message}`)]
        .concat(err.hint ? err.hint : [])
        .concat(verbose && err.stack ? err.stack.split("\n") : [])
    );
  }
}
exports.printError = printError;
function printInfo(text) {
  print(chalk_1.default.blue("[INFO] ") + text);
}
exports.printInfo = printInfo;
