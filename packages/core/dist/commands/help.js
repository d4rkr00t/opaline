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
const chalk_1 = __importDefault(require("chalk"));
const print_1 = require("../utils/print");
const commands_1 = require("../utils/commands");
let helpFlag = ["--help", "Prints help."];
let versionFlag = ["--version, -v", "Prints version."];
let printListWithFmt = (list) => print_1.printList(list, s => chalk_1.default.yellow(s));
/**
 * Help command handler
 */
function helpCommand(args) {
    if (args.isSingle) {
        print_1.print(singleCommandCliHelp(args));
    }
    else if (args.commandName !== "index") {
        print_1.print(subCommandHelp(args));
    }
    else {
        print_1.print(multiCommandCliHelp(args));
    }
}
exports.helpCommand = helpCommand;
/**
 * Generates overview help for a multi-command cli
 */
function multiCommandCliHelp(args) {
    let { commands, packageJson, commandsDirPath, cliName } = args;
    let defaultOptions = [];
    if (commands_1.findCommand(commands, "index")) {
        let defaultCommand = require(path.resolve(path.join(commandsDirPath, "index")));
        defaultOptions = formatOptions(defaultCommand.options || {});
    }
    return [
        `${packageJson.name} [${packageJson.version}]`,
        "",
        packageJson.description,
        "",
        chalk_1.default.green("Options"),
        printListWithFmt([...defaultOptions, helpFlag, versionFlag]),
        "",
        chalk_1.default.green("Commands"),
        createSubCommandsHelp(args),
        "",
        chalk_1.default.dim(`Run '${cliName} COMMAND --help' for more information on specific commands.`)
    ];
}
exports.multiCommandCliHelp = multiCommandCliHelp;
function createSubCommandsHelp({ commands, commandsDirPath }) {
    return printListWithFmt(commands
        .filter(c => !c.startsWith("index."))
        .reduce((acc, commandName) => {
        let name = commandName.split(".")[0];
        let command = require(path.resolve(path.join(commandsDirPath, commandName)));
        acc.push([
            name,
            command.help && command.help.description
                ? command.help.description()
                : "No description."
        ]);
        return acc;
    }, []));
}
/**
 * Generates help for a subcommand of a mutli-command cli
 */
function subCommandHelp(args) {
    let { packageJson, commandsDirPath, commandName, cliName } = args;
    let command = require(path.resolve(path.join(commandsDirPath, commandName)));
    let example = [];
    if (command.help && command.help.example) {
        example = [
            "",
            chalk_1.default.green("Examples"),
            [command.help.example({ name: cliName })]
        ];
    }
    return [
        `${packageJson.name} [${packageJson.version}]`,
        "",
        `${commandName} – ${command.help && command.help.description
            ? command.help.description()
            : "No description."}`,
        "",
        chalk_1.default.green("Options"),
        printListWithFmt([...formatOptions(command.options || {}), helpFlag]),
        ...example
    ];
}
exports.subCommandHelp = subCommandHelp;
/**
 * Generates help for a single command cli
 */
function singleCommandCliHelp(args) {
    let { packageJson, commandsDirPath, commandName } = args;
    let command = require(path.resolve(path.join(commandsDirPath, commandName)));
    return [
        `${packageJson.name} [${packageJson.version}]`,
        "",
        packageJson.description +
            " " +
            (command.help && command.help.description
                ? command.help.description()
                : ""),
        "",
        chalk_1.default.green("Options"),
        [
            ...printListWithFmt([
                ...formatOptions(command.options || {}),
                versionFlag,
                helpFlag
            ])
        ]
    ];
}
exports.singleCommandCliHelp = singleCommandCliHelp;
/**
 * Formats command options using following structure:
 *   --flag, -f   Description [type] [default: value]
 */
function formatOptions(options) {
    return Object.keys(options).reduce((acc, name) => {
        let opt = options[name];
        let title = `--${name}${opt.alias ? ", -" + opt.alias : ""}`;
        let desc = [opt.description || "No description."];
        if (opt.type)
            desc.push(chalk_1.default.dim("[" + opt.type + "]"));
        if (opt.default)
            desc.push(chalk_1.default.dim("[default: " + opt.default + "]"));
        acc.push([title, desc.join(" ")]);
        return acc;
    }, []);
}
exports.formatOptions = formatOptions;
