"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colorette_1 = require("colorette");
/**
 * Default formatter for help output
 */
function helpFormatter(help) {
  if (isSubCommandHelp(help)) {
    return formatSubCommandHelpData(help);
  }
  return formatHelpData(help);
}
exports.default = helpFormatter;
function formatSubCommandHelpData(help) {
  let output = [];
  if (help.title) {
    output.push("", help.title);
  }
  if (help.usage) {
    output.push("", colorette_1.bold("USAGE"), [help.usage]);
  }
  if (help.options && help.options.length) {
    output.push(
      "",
      colorette_1.bold("OPTIONS"),
      formatList(help.options.map(formatOption)).map(
        (opt) => `${opt[0]}     ${opt[1]}`
      )
    );
  }
  if (help.description) {
    output.push("", colorette_1.bold("DESCRIPTION"), [
      capFirst(help.description),
    ]);
  }
  if (help.examples && help.examples.length) {
    output.push("", colorette_1.bold("EXAMPLES"), help.examples);
  }
  return output;
}
function formatHelpData(help) {
  let output = [];
  if (help.cliDescription) {
    output.push("", help.cliDescription);
  }
  output.push("", colorette_1.bold("VERSION"), [
    `${help.cliName}/${help.cliVersion}`,
  ]);
  if (help.usage) {
    output.push("", colorette_1.bold("USAGE"), [help.usage]);
  }
  if (help.commands && help.commands.length) {
    output.push(
      "",
      colorette_1.bold("COMMANDS"),
      formatList(
        help.commands.map((c) => [c.name, capFirst(c.title || "")])
      ).map((c) => `${c[0]}     ${c[1]}`),
      "",
      join(
        [
          colorette_1.yellow("> NOTE:"),
          colorette_1.dim(
            `To view the usage information for a specific command, run '${help.cliName} [COMMAND] --help'`
          ),
        ],
        " "
      )
    );
  }
  if (help.options && help.options.length) {
    output.push(
      "",
      colorette_1.bold("OPTIONS"),
      formatList(help.options.map(formatOption)).map(
        (opt) => `${opt[0]}     ${opt[1]}`
      )
    );
  }
  if (help.examples && help.examples.length) {
    output.push("", colorette_1.bold("EXAMPLES"), help.examples);
  }
  return output;
}
/**
 * Check whether given help data correspond to main help or sub command help
 */
function isSubCommandHelp(help) {
  return Boolean(help && help.commandName);
}
/**
 * Formats a list of [string, string] in a way that first string length is equal accross the array
 */
function formatList(list) {
  let minLength = Math.max(...list.map((l) => l[0].length));
  return list.map((line) => [line[0].padEnd(minLength, " "), line[1]]);
}
/**
 * Formats CLI options in following structure suitable for formatList:
 *   ["-alias, --nameTitle", "Option title [type] [default: value]"]
 */
function formatOption(option) {
  return [
    join([option.alias ? `-${option.alias}` : "", `--${option.name}`]),
    join(
      [
        capFirst(option.title || ""),
        option.type ? colorette_1.dim(`[${option.type}]`) : "",
        option.default ? colorette_1.dim(`[default: ${option.default}]`) : "",
      ],
      " "
    ),
  ];
}
/**
 * Capitalize first letter of a string
 */
function capFirst(str) {
  if (!str.length) return str;
  let arr = str.split("");
  arr[0] = arr[0].toUpperCase();
  return arr.join("");
}
/**
 * Join array of string filtering out falsy values
 */
function join(arr, sep = ", ") {
  return arr.filter(Boolean).join(sep);
}
