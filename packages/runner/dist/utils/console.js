"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgeGreen = exports.badgeRed = exports.prompt = void 0;
const readline = __importStar(require("readline"));
const colorette_1 = require("colorette");
function prompt(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(
      colorette_1.blue(`❯ ${message} ${colorette_1.dim("[yes|y|n|no]")}: `),
      (answer) => {
        rl.close();
        if (answer === "y" || answer === "yes") {
          return resolve(true);
        }
        return resolve(false);
      }
    );
  });
}
exports.prompt = prompt;
function badgeRed(text) {
  return colorette_1.bgRed(colorette_1.black(` ${text} `));
}
exports.badgeRed = badgeRed;
function badgeGreen(text) {
  return colorette_1.bgGreen(colorette_1.black(` ${text} `));
}
exports.badgeGreen = badgeGreen;
