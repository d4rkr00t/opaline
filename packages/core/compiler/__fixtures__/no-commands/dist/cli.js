#!/usr/bin/env node

let cli = require("@opaline/core").default;
let pkg = require("../package.json");
let config = {
  cliName: "test-opaline",
  cliVersion: pkg.version,
  cliDescription: pkg.description,
  isSingleCommand: true,
  commands: {
    "": {
      commandName: "",
      meta: {
        title: "No description",
        description: "",
        usage: "",
        examples: [],
        shouldPassInputs: false,
        options: {}
      },
      load: () => {
        let command = require("./commands");

        if (typeof command !== "function") {
          throw new Error(`Command "" doesn't export a function...`);
        }
      }
    }
  }
};

cli(process.argv, config);
