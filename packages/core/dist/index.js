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
const minimist_options_1 = __importDefault(require("minimist-options"));
const help_1 = require("./commands/help");
async function createCLI(rawArgv, dir, packageJson) {
    let argv = rawArgv.slice(2);
    let commandName = argv[0];
    let isCommand = commandName && !commandName.startsWith("-");
    let commandsDirPath = path.join(dir, "commands");
    // If command is passed check if file exists
    // Otherwise load index.js
    let commandPath;
    if (isCommand) {
        commandPath = path.resolve(path.join(commandsDirPath, commandName));
    }
    else {
        commandPath = path.resolve(path.join(commandsDirPath, "index"));
    }
    let command;
    try {
        command = require(commandPath);
    }
    catch (e) { }
    let { _: rawInputs, ...flags } = minimist_1.default(argv, minimist_options_1.default((command || {}).options || {}));
    let inputs = isCommand ? rawInputs.slice(1) : rawInputs;
    // If not a command and --version was passed, print version
    if (!isCommand && (flags.v || flags.version)) {
        console.log(packageJson.version);
        process.exit(0);
    }
    // If not a command and --help was passed, or command wasn't found, print help
    if (!command || (!isCommand && flags.help)) {
        help_1.helpCommand({ commandsDirPath, packageJson });
        process.exit(0);
    }
    // If a command and --help was passed, print command help
    if (command && flags.help) {
        console.log(`${commandName} HEEEEELP!`);
        process.exit(0);
    }
    try {
        await command(inputs, flags);
        process.exit(0);
    }
    catch (error) {
        process.exit(1);
    }
}
exports.default = createCLI;
