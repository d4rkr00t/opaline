"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findCommand(commands, commandName) {
    return commands.find(c => c.startsWith(`${commandName}.`));
}
exports.findCommand = findCommand;
