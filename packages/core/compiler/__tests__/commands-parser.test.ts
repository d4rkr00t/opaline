import test from "ava";
import * as path from "path";
import { parseCommands } from "../commands-parser";
import { ProjectInfo } from "../project-info";

test("parseCommands should be able to parse jsdoc from a command file", async t => {
  let project = {
    commandsDirPath: path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "examples",
      "singlecli",
      "commands"
    ),
    cliName: "example"
  } as ProjectInfo;
  let commands = ["index.js"];
  let parsedCommands = await parseCommands(project, commands);
  t.snapshot(parsedCommands);
});

test("parseCommands should be able to parse jsdoc from multiple files file", async t => {
  let project = {
    commandsDirPath: path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "examples",
      "multicli",
      "commands"
    ),
    cliName: "example"
  } as ProjectInfo;
  let commands = ["index.js", "hello-world.js", "runner.js"];
  let parsedCommands = await parseCommands(project, commands);
  t.snapshot(parsedCommands);
});
