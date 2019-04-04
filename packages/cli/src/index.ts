import * as path from "path";
import minimist from "minimist";

export default async function CLI(rawArgv: typeof process.argv, dir: string) {
  let { _: rawInputs, ...flags } = minimist(rawArgv.slice(2));
  let commandsDirPath = path.join(dir, "commands");
  let [commandName, ...inputs] = rawInputs;
  let commandPath = path.resolve(path.join(commandsDirPath, commandName));

  let command;

  try {
    command = require(commandPath);
  } catch (error) {
    console.log("HEEEEELP!");
  }

  return await command(inputs, flags);
}
