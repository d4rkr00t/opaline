import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as doctrine from "doctrine";
import { ProjectInfo } from "./project-info";
import { print } from "@opaline/core";
import { OpalineCommandMeta } from "../../src/types";
import { OP008_warningInputsNotArrayOrString } from "./messages";

let readFile = promisify(fs.readFile);

export async function parseCommands(
  project: ProjectInfo,
  commands: Array<string>
): Promise<Array<CommandData>> {
  return await Promise.all(
    commands.map(command => parseSingleCommand(project, command))
  );
}

export async function parseSingleCommand(
  project: ProjectInfo,
  command: string
): Promise<CommandData> {
  let [commandName] = command.split(".");
  let commandPath = path.join(project.commandsDirPath, command);
  let commandFileContent = await readFile(commandPath, "utf8");
  let meta = getMetaFromJSDoc({
    jsdocComment: getCommandJSDoc(commandFileContent),
    cliName: project.cliName,
    commandPath
  });
  return {
    commandName,
    meta
  };
}

export function getCommandJSDoc(content: string) {
  let ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["typescript", "jsx"]
  });
  let comment;
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      comment =
        "/*" + (path.node.leadingComments || [{ value: "" }])[0].value + "\n*/";
    },
    AssignmentExpression(path) {
      if (
        path.node.left.type !== "MemberExpression" ||
        path.node.left.property.name !== "exports" ||
        !path.node.left.object.hasOwnProperty("name") ||
        (path.node.left.object as any).name !== "module" ||
        (path.node.right.type !== "FunctionExpression" &&
          path.node.right.type !== "ArrowFunctionExpression")
      ) {
        return;
      }
      comment =
        "/*" +
        (path.parent.leadingComments || [{ value: "" }])[0].value +
        "\n*/";
    }
  });
  return comment;
}

export function getMetaFromJSDoc({
  jsdocComment,
  cliName,
  commandPath
}: {
  jsdocComment: string;
  cliName: string;
  commandPath: string;
}): OpalineCommandMeta {
  let jsdoc = jsdocComment
    ? doctrine.parse(jsdocComment, { unwrap: true, sloppy: true })
    : { description: "", tags: [] };
  let [title, ...description] = jsdoc.description.split("\n\n");
  let aliases = jsdoc.tags
    .filter(tag => tag.title === "short")
    .map(alias => alias.description)
    .reduce((acc, alias) => {
      let [full, short] = alias.split("=");
      acc[full.trim()] = short.trim();
      return acc;
    }, {});

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
      if (tag.name === "$inputs") {
        verify$InputsType(tag, commandPath);
      }
      if (tag.title !== "param" || tag.name === "$inputs") return acc;
      let type = getTypeFromJSDocTag(tag);
      let defaultValue = (tag as any).default;

      acc[tag.name] = {
        title: tag.description,
        type,
        alias: aliases[tag.name],
        default:
          defaultValue && type === "number"
            ? parseInt(defaultValue)
            : defaultValue
      };
      return acc;
    }, {})
  };
}

function getTypeFromJSDocTag(tag: doctrine.Tag) {
  return (tag.type as any).name || (tag.type as any).expression.name;
}

function verify$InputsType(tag: doctrine.Tag, commandPath: string) {
  let type = getTypeFromJSDocTag(tag);
  let notStringApplications = (
    (tag.type && (tag.type as any).applications) ||
    []
  )
    .filter(app => app.name !== "string")
    .map(app => app.name);

  if (
    (type === "string" || type === "Array") &&
    !notStringApplications.length
  ) {
    return;
  }

  print(
    OP008_warningInputsNotArrayOrString(
      type,
      notStringApplications,
      commandPath
    )
  );
}

export type CommandData = {
  commandName: string;
  meta: OpalineCommandMeta;
};
