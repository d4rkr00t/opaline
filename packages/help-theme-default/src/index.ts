import chalk from "chalk";

/**
 * Default formatter for help output
 */
export default function helpFormatter(help: HelpData | HelpSubCommandData) {
  if (isSubCommandHelp(help)) {
    return formatSubCommandHelpData(help);
  }
  return formatHelpData(help);
}

function formatSubCommandHelpData(help: HelpSubCommandData) {
  let output: any = [];

  if (help.usage) {
    output.push("", chalk.bold("USAGE"), [help.usage]);
  }

  if (help.options && help.options.length) {
    output.push(
      "",
      chalk.bold("OPTIONS"),
      formatList(help.options.map(formatOption)).map(
        opt => `${opt[0]}     ${opt[1]}`
      )
    );
  }

  if (help.description) {
    output.push("", chalk.bold("DESCRIPTION"), [capFirst(help.description)]);
  }

  if (help.examples && help.examples.length) {
    output.push(
      "",
      chalk.bold("EXAMPLES"),
      ...help.examples.map(formatExample)
    );
  }

  return output;
}

function formatHelpData(help: HelpData) {
  let output: any = [];

  if (help.description) {
    output.push("", help.description);
  }

  output.push("", chalk.bold("VERSION"), [
    `${help.cliName}/${help.cliVersion}`
  ]);

  if (help.usage) {
    output.push("", chalk.bold("USAGE"), [help.usage]);
  }

  if (help.commands && help.commands.length) {
    output.push(
      "",
      chalk.bold("COMMANDS"),
      formatList(help.commands.map(c => [c.name, capFirst(c.title || "")])).map(
        c => `${c[0]}     ${c[1]}`
      ),
      "",
      join(
        [
          chalk.yellow("> NOTE:"),
          chalk.dim(
            `To view the usage information for a specific command, run '${
              help.cliName
            } [COMMAND] --help'`
          )
        ],
        " "
      )
    );
  }

  if (help.options && help.options.length) {
    output.push(
      "",
      chalk.bold("OPTIONS"),
      formatList(help.options.map(formatOption)).map(
        opt => `${opt[0]}     ${opt[1]}`
      )
    );
  }

  if (help.examples && help.examples.length) {
    output.push(
      "",
      chalk.bold("EXAMPLES"),
      ...help.examples.map(formatExample)
    );
  }

  return output;
}

/**
 * Check whether given help data correspond to main help or sub command help
 */
function isSubCommandHelp(help: any): help is HelpSubCommandData {
  return !!help.commandName;
}

/**
 * Formats a list of [string, string] in a way that first string length is equal accross the array
 */
function formatList(list: Array<[string, string]>): Array<[string, string]> {
  let minLength = Math.max(...list.map(l => l[0].length));
  return list.map(line => [line[0].padEnd(minLength, " "), line[1]]);
}

/**
 * Formats CLI options in following structure suitable for formatList:
 *   ["-alias, --nameTitle", "Option title [type] [default: value]"]
 */
function formatOption(option: HelpOptionData): [string, string] {
  return [
    join([option.alias ? `-${option.alias}` : "", `--${option.name}`]),
    join(
      [
        capFirst(option.title || ""),
        option.type ? chalk.dim(`[${option.type}]`) : "",
        option.default ? chalk.dim(`[default: ${option.default}]`) : ""
      ],
      " "
    )
  ];
}

/**
 * Formats examples data: [example, description]
 */
function formatExample(example: HelpExampleData) {
  return [
    example.example,
    example.description ? chalk.dim(example.description) : ""
  ].filter(Boolean);
}

/**
 * Capitalize first letter of a string
 */
function capFirst(str: string): string {
  if (!str.length) return str;
  let arr = str.split("");
  arr[0] = arr[0].toUpperCase();
  return arr.join("");
}

/**
 * Join array of string filtering out falsy values
 */
function join(arr: Array<string>, sep: string = ", ") {
  return arr.filter(Boolean).join(sep);
}

export type HelpData = {
  cliName: string;
  cliVersion: string;
  description?: string;
  usage?: string;
  commands?: Array<HelpCommandData>;
  options?: Array<HelpOptionData>;
  examples?: Array<HelpExampleData>;
};

export type HelpSubCommandData = {
  cliName: string;
  cliVersion: string;
  commandName: string;
  description?: string;
  usage?: string;
  options?: Array<HelpOptionData>;
  examples?: Array<HelpExampleData>;
};

export type HelpCommandData = {
  name: string;
  title: string;
  input?: string;
};

export type HelpOptionData = {
  name: string;
  title?: string;
  alias?: string;
  type?: string;
  default?: string | boolean | number;
};

export type HelpExampleData = {
  example: string;
  description?: string;
};
