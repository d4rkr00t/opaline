"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.printWarning = exports.printInfo = exports.printError = exports.print = exports.OpalineError = void 0;
const help_theme_default_1 = __importDefault(
  require("@opaline/help-theme-default")
);
const help_1 = require("./handlers/help");
const args_1 = require("./utils/args");
const error_1 = require("./utils/error");
Object.defineProperty(exports, "OpalineError", {
  enumerable: true,
  get: function () {
    return error_1.OpalineError;
  },
});
const print_1 = require("./utils/print");
Object.defineProperty(exports, "print", {
  enumerable: true,
  get: function () {
    return print_1.print;
  },
});
Object.defineProperty(exports, "printError", {
  enumerable: true,
  get: function () {
    return print_1.printError;
  },
});
Object.defineProperty(exports, "printInfo", {
  enumerable: true,
  get: function () {
    return print_1.printInfo;
  },
});
Object.defineProperty(exports, "printWarning", {
  enumerable: true,
  get: function () {
    return print_1.printWarning;
  },
});
async function opaline(rawArgv, config) {
  let helpFormatter = help_theme_default_1.default;
  let argv = rawArgv.slice(2);
  let commandName = argv[0];
  let isCommand = !!commandName && !commandName.startsWith("-");
  let hasCommand = (name) => !!config.commands[name];
  // 0. If no commands -> blow up!
  // 1. If --version and command is not passed -> print version
  // 2. If --help
  //   2.1. If command is not passed -> help
  //   2.2. If command is passed and exists -> help
  //   2.3. If command is passed and doesn't exist -> error
  // 3. If command is passed and exists -> run
  // 4. If command doesn't exist and single command cli
  //   4.1. Check if index exists -> run
  //   4.2. If index doesn't exist -> help
  // 5. If command doesn't exist and multi command cli
  //   5.1. If index exists -> run
  //   5.2. If index doesn't exist -> help
  // # 0
  if (!Object.keys(config.commands).length) {
    return error(`Need to add at least 1 command...`);
  }
  // # 1
  if (args_1.isVersion(argv) && !isCommand) {
    return version(config.cliVersion);
  }
  // # 2
  else if (args_1.isHelp(argv)) {
    if (!isCommand) {
      return help({
        helpFormatter,
        config,
        commandName: "index",
      });
    } else if (isCommand && hasCommand(commandName)) {
      return help({
        helpFormatter,
        config,
        commandName,
      });
    } else if (isCommand && !hasCommand(commandName)) {
      return error(
        `Command "${commandName}" doesn't exist, help can't be printed for it. Try "${config.cliName} --help"`
      );
    }
  }
  // # 3
  else if (isCommand && hasCommand(commandName)) {
    return await run({
      commandName,
      config,
      argv,
      isCommand,
    });
  }
  // # 4 – single command cli
  else if (config.isSingleCommand) {
    // # 4.1 | 4.2
    if (hasCommand("index")) {
      return await run({
        commandName: "index",
        config,
        argv,
        isCommand,
      });
    } else {
      return help({
        helpFormatter,
        config,
        commandName: "",
      });
    }
  }
  // # 5 – multi-command cli
  else if (!config.isSingleCommand) {
    // # 5.1 | 5.2
    if (hasCommand("index")) {
      return await run({
        commandName: "index",
        config,
        argv,
        isCommand,
      });
    } else {
      return help({
        helpFormatter,
        config,
        commandName: "",
      });
    }
  }
}
exports.default = opaline;
async function run({ config, commandName, argv, isCommand }) {
  let minimist = require("minimist");
  let buildOptions = require("minimist-options");
  let command = config.commands[commandName];
  let { _: rawInputs, ...flags } = minimist(
    argv,
    buildOptions(command.meta.options)
  );
  let inputs =
    isCommand && commandName !== "index" ? rawInputs.slice(1) : rawInputs;
  let args = Object.keys(command.meta.options || {}).map((opt) => flags[opt]);
  try {
    await command
      .load()
      .apply(null, command.meta.shouldPassInputs ? [inputs, ...args] : args);
  } catch (error) {
    print_1.printError(error);
    if (error instanceof error_1.OpalineError) {
      process.exit(error.code);
    } else {
      process.exit(1);
    }
  }
}
function version(v) {
  console.log(v);
  process.exit(0);
}
function error(msg) {
  print_1.printError(msg);
  process.exit(1);
}
function help({ helpFormatter, config, commandName }) {
  help_1.helpCommand({
    helpFormatter,
    config,
    commandName,
  });
  process.exit(0);
}
// TODO: logging
// TODO: command aliases
