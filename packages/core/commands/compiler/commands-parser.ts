import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as doctrine from "doctrine";
import { ProjectInfo } from "./project-info";
import { OpalineCommandMeta } from "../../src/types";

let readFile = promisify(fs.readFile);

export async function parseCommands(
  project: ProjectInfo,
  commands: Array<string>
): Promise<Array<CommandData>> {
  return await Promise.all(
    commands.map(command => parseSingleCommand(project, command))
  );
}

async function parseSingleCommand(
  project: ProjectInfo,
  command: string
): Promise<CommandData> {
  let [commandName] = command.split(".");
  let commandPath = path.join(project.commandsDirPath, command);
  let commandFileContent = await readFile(commandPath, "utf8");
  let meta = getMetaFromJSDoc({
    jsdocComment: getCommandJSDoc(commandFileContent),
    cliName: project.cliName
  });
  return {
    commandName,
    meta
  };
}

function getCommandJSDoc(content: string) {
  let ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["typescript", "jsx"]
  });
  let comment;
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      comment =
        "/*" + (path.node.leadingComments || [{ value: "" }])[0].value + "\n*/";
    }
  });
  return comment;
}

function getMetaFromJSDoc({
  jsdocComment,
  cliName
}: {
  jsdocComment: string;
  cliName: string;
}): OpalineCommandMeta {
  let jsdoc = jsdocComment
    ? doctrine.parse(jsdocComment, { unwrap: true, sloppy: true })
    : { description: "", tags: [] };
  let [title, ...description] = jsdoc.description.split("\n\n");

  return {
    title: title || "No description",
    description: description.join("\n\n"),

    usage: (
      jsdoc.tags.find(tag => tag.title === "usage") || { description: "" }
    ).description.replace("{cliName}", cliName),

    examples: jsdoc.tags
      .filter(tag => tag.title === "example")
      .map(tag => tag.description.replace("{cliName}", cliName)),

    shouldPassInputs: !!jsdoc.tags.find(
      tag => tag.title === "param" && tag.name === "$inputs"
    ),

    options: jsdoc.tags.reduce((acc, tag) => {
      if (tag.title !== "param" || tag.name === "$inputs") return acc;
      let type = (tag.type as any).name || (tag.type as any).expression.name;
      let defaultValue = (tag as any).default;
      acc[tag.name] = {
        title: tag.description,
        type,
        default:
          defaultValue && type === "number"
            ? parseInt(defaultValue)
            : defaultValue
      };
      return acc;
    }, {})
  };
}

export type CommandData = {
  commandName: string;
  meta: OpalineCommandMeta;
};