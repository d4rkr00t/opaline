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
const minimist_1 = __importDefault(require("minimist"));
const minimist_options_1 = __importDefault(require("minimist-options"));
const help_1 = require("./commands/help");
async function createCLI(rawArgv, dir, packageJson) {
    let argv = rawArgv.slice(2);
    let commandName = argv[0];
    let commandsDirPath = path.join(dir, "commands");
    let commands = fs_1.readdirSync(commandsDirPath);
    let isCommand = commandName && !commandName.startsWith("-");
    let isVersion = argv.find(f => f === "-v") || argv.find(f => f === "--version");
    let isHelp = argv.find(f => f === "--help");
    // 0. If no commands -> blow up! // TODO
    // 1. If --version and command is not passed -> print version
    // 2. If --help
    //   2.1. If command is not passed -> help
    //   2.2. If command is passed and exists -> help
    //   2.3. If command is passed and doesn't exist -> error
    // 3. If command is passed and exists -> run
    // 4. If command doesn't exist and single command cli
    //   4.1. Check if index exists -> run
    //   4.2. If index doesn't exist -> show help
    // 5. If command doesn't exist and multi command cli
    //   5.1. If index exists -> run
    //   5.2. If index doesn't exist -> show help
    let action = "help";
    let payload; // TODO: any
    // # 0
    if (!commands.length) {
        action = "error";
        payload = `Need to add at least 1 command to ${commandsDirPath}...`;
    }
    // # 1
    else if (isVersion && !isCommand) {
        action = "version";
    }
    // # 2
    else if (isHelp) {
        if (!isCommand) {
            action = "help";
        }
        else if (isCommand &&
            commands.find(c => c.startsWith(`${commandName}.`))) {
            payload = commandName;
            action = "help";
        }
        else if (isCommand &&
            !commands.find(c => c.startsWith(`${commandName}.`))) {
            action = "error";
            payload = `Command "${commandName}" doesn't exist, help can't be printed for it. Try cli --help`; // TODO: proper name for cli
        }
    }
    // # 3
    else if (isCommand && commands.find(c => c.startsWith(`${commandName}.`))) {
        action = "run";
        payload = commandName;
    }
    // # 4 – single command cli
    else if (commands.length === 1) {
        // # 4.1 | 4.2
        if (commands.find(c => c.startsWith("index."))) {
            action = "run";
            payload = "index";
        }
        else {
            action = "help";
        }
    }
    // # 5 – multi-command cli
    else if (commands.length > 1) {
        // # 5.1 | 5.2
        if (commands.find(c => c.startsWith("index."))) {
            action = "run";
            payload = "index";
        }
        else {
            action = "help";
        }
    }
    switch (action) {
        case "run":
            let commandPath = path.resolve(path.join(commandsDirPath, payload));
            let command = require(commandPath);
            let { _: rawInputs, ...flags } = minimist_1.default(argv, minimist_options_1.default((command || {}).options || {}));
            let inputs = isCommand ? rawInputs.slice(1) : rawInputs;
            try {
                await command(inputs, flags);
                process.exit(0);
            }
            catch (error) {
                process.exit(1);
            }
            break;
        case "version":
            console.log(packageJson.version);
            process.exit(0);
            break;
        case "error":
            console.error(payload); // TODO: logging
            process.exit(1);
            break;
        case "help":
        default:
            help_1.helpCommand({ commandsDirPath, packageJson });
            process.exit(0);
            break;
    }
}
exports.default = createCLI;
