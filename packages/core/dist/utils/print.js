"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printInfo =
  exports.printError =
  exports.printWarning =
  exports.print =
  exports.indent =
    void 0;
const colorette_1 = require("colorette");
function indent(text, level = 1) {
  return `${"".padStart(level * 2, " ")}${text}`;
}
exports.indent = indent;
function print(text, level = 0) {
  if (Array.isArray(text)) {
    text.forEach((item) => {
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
  print((0, colorette_1.yellow)("[WARN] ") + text);
}
exports.printWarning = printWarning;
function printError(err, verbose = false) {
  if (typeof err === "string") {
    print(err);
  } else {
    print(
      [(0, colorette_1.red)(`${err.message}`)]
        .concat(err.hint ? err.hint : [])
        .concat(verbose && err.stack ? err.stack.split("\n") : [])
    );
  }
}
exports.printError = printError;
function printInfo(text) {
  print((0, colorette_1.blue)("[INFO] ") + text);
}
exports.printInfo = printInfo;
