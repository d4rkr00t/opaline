#!/usr/bin/env node

let cli = require("@opaline/core").default;
let pkg = require("../package.json");
let config = {
  cliName: "opaline",
  cliVersion: pkg.version,
  cliDescription: pkg.description,
  isSingleCommand: false,
  commands: {
    build: {
      commandName: "build",
      meta: {
        title: "Production build for opaline based cli tool",
        description: "",
        usage: "opaline build",
        examples: [],
        shouldPassInputs: false,
        options: {}
      },
      load: () => require("./commands/build")
    },
    dev: {
      commandName: "dev",
      meta: {
        title: "Development mode for building opaline based cli tools",
        description: "",
        usage: "opaline dev",
        examples: [],
        shouldPassInputs: false,
        options: {}
      },
      load: () => require("./commands/dev")
    }
  }
};

cli(process.argv, config);
