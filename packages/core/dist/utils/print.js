"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function indent(text, level = 1) {
  return `${"".padStart(level * 2, " ")}${text}`;
}
exports.indent = indent;
function print(text, level = 1) {
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
