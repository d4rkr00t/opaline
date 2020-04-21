import * as messages from "../commands/compiler/messages";
import { print } from "../src/utils/print";

let commandsDirPath = "/User/john/cli/commands";
let commandsOutputPath = "/User/john/cli/dist/commands";
let projectRootDir = "/User/john/cli";
let binOutputPath = "/User/john/cli/dist/cli.js";

let errors = [
  messages.OP001_errorBinIsEmpty(),
  messages.OP002_errorNoPackageJson(),
  messages.OP003_errorNoCommandsFolder(commandsDirPath),
  messages.OP004_errorEmptyCommandsFolder(commandsDirPath),
  messages.OP005_errorSrcEqDest(commandsDirPath, commandsDirPath),
  messages.OP006_errorProjectNameIsRequired(),
  messages.OP007_errorProjectFolderExists("cli")
];

let info = [
  messages.MSG_buildSuccess(
    commandsOutputPath,
    projectRootDir,
    binOutputPath,
    {
      output: [
        {
          type: "chunk",
          isEntry: true,
          fileName: "build.js"
        },
        {
          type: "chunk",
          isEntry: true,
          fileName: "create.js"
        },
        {
          type: "chunk",
          isEntry: true,
          fileName: "dev.js"
        }
      ] as any
    },
    [100, 100]
  ),
  messages.MSG_watchStarted(["build.ts", "create.ts", "dev.ts"], "commands/"),
  messages.MSG_watchUpdated(["build.ts", "create.ts", "dev.ts"], "commands/"),
  messages.OP008_warningInputsNotArrayOrString(
    "number",
    [],
    "commands/index.js"
  ),
  messages.OP008_warningInputsNotArrayOrString(
    "Array",
    ["number"],
    "commands/index.js"
  )
];

console.log();
console.log("================");
console.log("===  Errors  ===");
console.log("================");
console.log();
console.log();
printAll(errors);

console.log();
console.log("==================");
console.log("===  Messages  ===");
console.log("==================");
console.log();
console.log();
printAll(info);

function printAll(list: any) {
  list.forEach((item: any) => {
    print(item.flat());
    console.log("\n\n\n\n");
  });
}
