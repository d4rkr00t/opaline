"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const minimist_1 = __importDefault(require("minimist"));
async function CLI(rawArgv, dir) {
    let { _: rawInputs, ...flags } = minimist_1.default(rawArgv.slice(2));
    let commandsDirPath = path.join(dir, "commands");
    let [commandName, ...inputs] = rawInputs;
    let commandPath = path.resolve(path.join(commandsDirPath, commandName));
    let command;
    try {
        command = require(commandPath);
    }
    catch (error) {
        console.log("HEEEEELP!");
    }
    return await command(inputs, flags);
}
exports.default = CLI;
