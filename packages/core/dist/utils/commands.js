"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
function findCommand(commands, commandName) {
    return commands.find(c => c.startsWith(`${commandName}.`));
}
exports.findCommand = findCommand;
function requireCommand(commandsDirPath, commandName) {
    let commandPath = path.resolve(path.join(commandsDirPath, commandName));
    let command = require(commandPath);
    if (command.default) {
        let newCommand = command.default;
        newCommand.options = command.default.options || command.options;
        newCommand.help = command.default.help || command.help;
        return newCommand;
    }
    return command;
}
exports.requireCommand = requireCommand;
