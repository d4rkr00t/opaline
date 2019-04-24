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
const fs_1 = require("fs");
const chalk_1 = __importDefault(require("chalk"));
const print_1 = require("../utils/print");
function helpCommand({ commandsDirPath, packageJson }) {
    let commands = fs_1.readdirSync(commandsDirPath);
    commands.sort((a, b) => {
        if (a.startsWith("index.")) {
            return -1;
        }
        if (b.startsWith("index.")) {
            return 1;
        }
        return 0;
    });
    let output = [
        `${packageJson.name} [${packageJson.version}]`,
        "",
        packageJson.description,
        "",
        chalk_1.default.green("Options"),
        [
            `${chalk_1.default.yellow("-v, --version")}   Prints version.`,
            `${chalk_1.default.yellow("--help")}          Prints help.`
        ],
        "",
        chalk_1.default.green("Commands"),
        createCommandsHelp({ commands, commandsDirPath, packageJson })
    ];
    print_1.print(output);
}
exports.helpCommand = helpCommand;
function createCommandsHelp({ commands, commandsDirPath, packageJson }) {
    return print_1.printList(commands.reduce((acc, commandName) => {
        let name = commandName.startsWith("index.")
            ? "[default]"
            : commandName.split(".")[0];
        let command = require(path.resolve(path.join(commandsDirPath, commandName)));
        acc.push([
            name,
            command.help ? command.help.description() : "No description"
        ]);
        return acc;
    }, []), s => chalk_1.default.yellow(s), 16);
}
exports.createCommandsHelp = createCommandsHelp;
