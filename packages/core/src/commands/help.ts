import chalk from "chalk";
import { print, printList, PrintableOutput } from "../utils/print";
import { findCommand, CommandOptions, requireCommand } from "../utils/commands";

type CommandArgs = {
  cliName: string;
  commandName: string;
  commands: Array<string>;
  commandsDirPath: string;
  packageJson: { name: string; version: string; description: string };
  isSingle: boolean;
};
let helpFlag: [string, string] = ["--help", "Prints help."];
let versionFlag: [string, string] = ["--version, -v", "Prints version."];
let printListWithFmt = (list: Array<[string, string]>) =>
  printList(list, s => chalk.yellow(s));

/**
 * Help command handler
 */
export function helpCommand(args: CommandArgs) {
  if (args.isSingle) {
    print(singleCommandCliHelp(args));
  } else if (args.commandName !== "index") {
    print(subCommandHelp(args));
  } else {
    print(multiCommandCliHelp(args));
  }
}

/**
 * Generates overview help for a multi-command cli
 */
export function multiCommandCliHelp(args: CommandArgs): PrintableOutput {
  let { commands, packageJson, commandsDirPath, cliName } = args;

  let defaultOptions: Array<[string, string]> = [];
  if (findCommand(commands, "index")) {
    let defaultCommand = requireCommand(commandsDirPath, "index");
    defaultOptions = formatOptions(defaultCommand.options || {});
  }

  return [
    `${packageJson.name} [${packageJson.version}]`,
    "",
    packageJson.description,
    "",
    chalk.green("Options"),
    printListWithFmt([...defaultOptions, helpFlag, versionFlag]),
    "",
    chalk.green("Commands"),
    createSubCommandsHelp(args),
    "",
    chalk.dim(
      `Run '${cliName} COMMAND --help' for more information on specific commands.`
    )
  ];
}

function createSubCommandsHelp({ commands, commandsDirPath }: CommandArgs) {
  return printListWithFmt(
    commands
      .filter(c => !c.startsWith("index."))
      .reduce<Array<[string, string]>>((acc, commandName) => {
        let name = commandName.split(".")[0];
        let command = requireCommand(commandsDirPath, commandName);
        acc.push([
          name,
          command.help && command.help.description
            ? command.help.description()
            : "No description."
        ]);
        return acc;
      }, [])
  );
}

/**
 * Generates help for a subcommand of a mutli-command cli
 */
export function subCommandHelp(args: CommandArgs): PrintableOutput {
  let { packageJson, commandsDirPath, commandName, cliName } = args;
  let command = requireCommand(commandsDirPath, commandName);

  let example: PrintableOutput = [];
  if (command.help && command.help.example) {
    example = [
      "",
      chalk.green("Examples"),
      [command.help.example({ name: cliName })]
    ];
  }

  return [
    `${packageJson.name} [${packageJson.version}]`,
    "",
    `${commandName} – ${
      command.help && command.help.description
        ? command.help.description()
        : "No description."
    }`,
    "",
    chalk.green("Options"),
    printListWithFmt([...formatOptions(command.options || {}), helpFlag]),
    ...example
  ];
}

/**
 * Generates help for a single command cli
 */
export function singleCommandCliHelp(args: CommandArgs): PrintableOutput {
  let { packageJson, commandsDirPath, commandName, cliName } = args;
  let command = requireCommand(commandsDirPath, commandName);

  let example: PrintableOutput = [];
  if (command.help && command.help.example) {
    example = [
      chalk.green("Usage"),
      [command.help.example({ name: cliName })],
      ""
    ];
  }

  return [
    `${packageJson.name} [${packageJson.version}]`,
    "",
    // TODO: Description can be empty
    packageJson.description +
      " " +
      (command.help && command.help.description
        ? command.help.description()
        : ""),
    "",
    ...example,
    chalk.green("Options"),
    [
      ...printListWithFmt([
        ...formatOptions(command.options || {}),
        versionFlag,
        helpFlag
      ])
    ]
  ];
}

/**
 * Formats command options using following structure:
 *   --flag, -f   Description [type] [default: value]
 */
export function formatOptions(options: any): Array<[string, string]> {
  return Object.keys(options).reduce<Array<[string, string]>>((acc, name) => {
    let opt = options[name] as CommandOptions;
    let title = `--${name}${opt.alias ? ", -" + opt.alias : ""}`;
    let desc = [opt.description || "No description."];

    if (opt.type) desc.push(chalk.dim("[" + opt.type + "]"));
    if (opt.default !== undefined) {
      // TODO: add quotes around strings
      desc.push(chalk.dim("[default: " + String(opt.default) + "]"));
    }
    acc.push([title, desc.join(" ")]);

    return acc;
  }, []);
}
