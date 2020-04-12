#!/usr/bin/env node

let cli = require("@opaline/core").default;
let pkg = require("../package.json");
let config = {
  cliName: "test-opaline",
  cliVersion: pkg.version,
  cliDescription: pkg.description,
  isSingleCommand: true,
  commands: {
    index: {
      commandName: "index",
      meta: {
        title: "No description",
        description: "",
        usage: "",
        examples: [],
        shouldPassInputs: false,
        options: {}
      },
      load: () => {
        let command = require("./commands/index");

        if (typeof command !== "function") {
          throw new Error(`Command "index" doesn't export a function...`);
        }
      }
    }
  }
};

cli(process.argv, config);
