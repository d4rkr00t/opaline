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
        examples: ["$ multicli hello-world --name john"],
        shouldPassInputs: true,
        options: {
          name: {
            title: "Some important flag",
            type: "string",
            alias: "n",
            default: '"john"'
          }
        }
      },
      load: () => {
        let command = require("./commands/hello-world");

        if (typeof command !== "function") {
          throw new Error(`Command "hello-world" doesn't export a function...`);
        }

        return command;
      }
    },
    index: {
      commandName: "index",
      meta: {
        title: "Prints inputs and flags",
        description: "",
        usage: "$ multicli --name john",
        examples: ["$ multicli --name john"],
        shouldPassInputs: true,
        options: {
          name: {
            title: "Some important flag",
            type: "string",
            default: '"john"'
          },
          age: {
            title: "Some important flag",
            type: "number",
            alias: "a",
            default: 20
          }
        }
      },
      load: () => {
        let command = require("./commands/index");

        if (typeof command !== "function") {
          throw new Error(`Command "index" doesn't export a function...`);
        }

        return command;
      }
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
      load: () => {
        let command = require("./commands/runner");

        if (typeof command !== "function") {
          throw new Error(`Command "runner" doesn't export a function...`);
        }

        return command;
      }
    }
  }
};

cli(process.argv, config);
