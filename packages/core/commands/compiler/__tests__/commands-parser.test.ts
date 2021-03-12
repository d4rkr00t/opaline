import test from "ava";
import * as path from "path";
import {
  parseCommands,
  getCommandJSDoc,
  getMetaFromJSDoc,
  verify$InputsType,
} from "../commands-parser";
import { ProjectInfo } from "../project-info";

test("parseCommands should be able to parse jsdoc from a command file", async (t) => {
  let project = {
    commandsDirPath: path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "..",
      "examples",
      "singlecli",
      "commands"
    ),
    cliName: "example",
  } as ProjectInfo;
  let commands = ["index.js"];
  let parsedCommands = await parseCommands(project, commands);
  t.snapshot(parsedCommands);
});

test("parseCommands should be able to parse jsdoc from multiple files file", async (t) => {
  let project = {
    commandsDirPath: path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "..",
      "examples",
      "multicli",
      "commands"
    ),
    cliName: "example",
  } as ProjectInfo;
  let commands = ["index.js", "hello-world.js", "runner.js"];
  let parsedCommands = await parseCommands(project, commands);
  t.snapshot(parsedCommands);
});

test("getMetaFromJSDoc should support aliases", (t) => {
  let source = `
  /**
   * @param {string} name Name
   * @short name=n
   *
   * @param {number} age Age
   * @short age=a
   */
  export default function cli(){}
  `;
  let meta = getMetaFromJSDoc({
    jsdocComment: getCommandJSDoc(source),
    cliName: "cli",
    commandPath: "",
  });
  t.is(meta.options.name.alias, "n");
  t.is(meta.options.age.alias, "a");
});

test("getCommandJSDoc should support module.exports", (t) => {
  let source = `
  /**
   * @param {string} name Name
   * @short name=n
   *
   * @param {number} age Age
   * @short age=a
   */
  module.exports = function cli(){}
  `;
  let jsdoc = getCommandJSDoc(source);
  t.true(!!jsdoc);
});

test("getCommandJSDoc should support export default", (t) => {
  let source = `
  /**
   * @param {string} name Name
   * @short name=n
   *
   * @param {number} age Age
   * @short age=a
   */
  export default function cli(){}
  `;
  let jsdoc = getCommandJSDoc(source);
  t.true(!!jsdoc);
});

test("getCommandJSDoc should support return undefined if non of the supported formats found", (t) => {
  let source = `
  /**
   * @param {string} name Name
   * @short name=n
   *
   * @param {number} age Age
   * @short age=a
   */
  module.whatever = function cli(){}
  `;
  let jsdoc = getCommandJSDoc(source);
  t.true(jsdoc === undefined);
});

test("verify$InputsType should return true if a type is `string`", (t) => {
  t.true(
    verify$InputsType(
      {
        name: "$inputs",
        tag: "param",
        type: "string",
        optional: true,
        description: "",
        line: 0,
        source: "",
      },
      "command.ts"
    )
  );
});

test("verify$InputsType should return true if a type is `string[]`", (t) => {
  t.true(
    verify$InputsType(
      {
        name: "$inputs",
        tag: "param",
        type: "string[]",
        optional: true,
        description: "",
        line: 0,
        source: "",
      },
      "command.ts"
    )
  );
});

test("verify$InputsType should return true if a type is `Array<string>`", (t) => {
  t.true(
    verify$InputsType(
      {
        name: "$inputs",
        tag: "param",
        type: "Array<string>",
        optional: true,
        description: "",
        line: 0,
        source: "",
      },
      "command.ts"
    )
  );
});

test("verify$InputsType should return false if a type is not `string` or `string[]` or `Array<string>`", (t) => {
  t.false(
    verify$InputsType(
      {
        name: "$inputs",
        tag: "param",
        type: "Array<number>",
        optional: true,
        description: "",
        line: 0,
        source: "",
      },
      "command.ts"
    )
  );
});
