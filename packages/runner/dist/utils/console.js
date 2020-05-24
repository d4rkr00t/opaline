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
        if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgeGreen = exports.badgeRed = exports.prompt = void 0;
const readline = __importStar(require("readline"));
const chalk_1 = __importDefault(require("chalk"));
function prompt(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(
      chalk_1.default.blue(
        `❯ ${message} ${chalk_1.default.dim("[yes|y|n|no]")}: `
      ),
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
  return chalk_1.default.bgRed.black(` ${text} `);
}
exports.badgeRed = badgeRed;
function badgeGreen(text) {
  return chalk_1.default.bgGreen.black(` ${text} `);
}
exports.badgeGreen = badgeGreen;
