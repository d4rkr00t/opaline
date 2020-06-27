#!/usr/bin/env node

let cli = require("@opaline/core").default;
let pkg = require("../package.json");
let config = {
  cliName: "not-found-cli",
  cliVersion: pkg.version,
  cliDescription: "No description" || pkg.description,
  isSingleCommand: false,
  commands: {
    "404": {
      commandName: "404",
      meta: {
        title: "No description",
        description: "",
        usage: " ",
        examples: [],
        shouldPassInputs: false,
        shouldPassEverything: true,
        options: {},
      },
      load: () => {
        let command = require("./commands/404");

        if (typeof command !== "function") {
          throw new Error(`Command "404" doesn't export a function...`);
        }

        return command;
      },
    },
    index: {
      commandName: "index",
      meta: {
        title: "No description",
        description: "",
        usage: " ",
        examples: [],
        shouldPassInputs: false,
        shouldPassEverything: true,
        options: {},
      },
      load: () => {
        let command = require("./commands/index");

        if (typeof command !== "function") {
          throw new Error(`Command "index" doesn't export a function...`);
        }

        return command;
      },
    },
  },
};

cli(process.argv, config);
