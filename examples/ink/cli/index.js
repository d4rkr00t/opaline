#!/usr/bin/env node

let cli = require("@opaline/core").default;
let pkg = require("../package.json");
let config = {
  cliName: "opalink",
  cliVersion: pkg.version,
  cliDescription: pkg.description,
  isSingleCommand: false,
  commands: {
    counter: {
      commandName: "counter",
      meta: {
        title: "No description",
        description: "",
        usage: "",
        examples: [],
        shouldPassInputs: false,
        options: {}
      },
      load: () => {
        let command = require("./commands/counter");

        if (typeof command !== "function") {
          throw new Error(`Command "counter" doesn't export a function...`);
        }

        return command;
      }
    },
    jest: {
      commandName: "jest",
      meta: {
        title: "No description",
        description: "",
        usage: "",
        examples: [],
        shouldPassInputs: false,
        options: {}
      },
      load: () => {
        let command = require("./commands/jest");

        if (typeof command !== "function") {
          throw new Error(`Command "jest" doesn't export a function...`);
        }

        return command;
      }
    },
    useinput: {
      commandName: "useinput",
      meta: {
        title: "No description",
        description: "",
        usage: "",
        examples: [],
        shouldPassInputs: false,
        options: {}
      },
      load: () => {
        let command = require("./commands/useinput");

        if (typeof command !== "function") {
          throw new Error(`Command "useinput" doesn't export a function...`);
        }

        return command;
      }
    }
  }
};

cli(process.argv, config);
