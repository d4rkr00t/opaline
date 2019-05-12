#!/usr/bin/env node

let cli = require("@opaline/core").default;
let pkg = require("../package.json");
let config = {
  cliName: "singlecli",
  cliVersion: pkg.version,
  cliDescription: pkg.description,
  isSingleCommand: true,
  commands: {
    index: {
      commandName: "index",
      meta: {
        title: "Prints inputs and flags",
        description: "",
        usage: "$ singlecli --name john",
        examples: [],
        shouldPassInputs: true,
        options: {
          name: {
            title: "Some important flag",
            type: "string",
            default: '"john"'
          }
        }
      },
      load: () => require("./commands/index").default
    }
  }
};

cli(process.argv, config);
