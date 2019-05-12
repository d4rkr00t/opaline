#!/usr/bin/env node

let cli = require("@opaline/core").default;
let pkg = require("../package.json");
let config = {
  cliName: "multicli",
  cliVersion: pkg.version,
  cliDescription: pkg.description,
  isSingleCommand: false,
  commands: {
    "hello-world": {
      commandName: "hello-world",
      meta: {
        title: "Prints inputs and flags",
        description: "",
        usage: "$ multicli hello-world --name john",
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
      load: () => require("./commands/hello-world").default
    },
    index: {
      commandName: "index",
      meta: {
        title: "Prints inputs and flags",
        description: "",
        usage: "$ multicli --name john",
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
    },
    runner: {
      commandName: "runner",
      meta: {
        title: "No description",
        description: "",
        usage: "",
        examples: [],
        shouldPassInputs: false,
        options: {}
      },
      load: () => require("./commands/runner").default
    }
  }
};

cli(process.argv, config);
