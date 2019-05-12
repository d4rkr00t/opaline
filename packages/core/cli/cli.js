#!/usr/bin/env node

let cli = require("@opaline/core").default;
let pkg = require("../package.json");
let config = {
  cliName: "opaline",
  cliVersion: pkg.version,
  cliDescription: pkg.description,
  isSingleCommand: false,
  commands: {
    bla: {
      commandName: "bla",
      meta: {
        title: "No description",
        description: "",
        usage: "",
        examples: [],
        shouldPassInputs: false,
        options: {}
      },
      load: () => require("./commands/bla").default
    },
    build: {
      commandName: "build",
      meta: {
        title: "Production build for opaline based cli tool",
        description: "",
        usage: "{binName} build",
        examples: [],
        shouldPassInputs: false,
        options: {}
      },
      load: () => require("./commands/build").default
    },
    dev: {
      commandName: "dev",
      meta: {
        title: "Development mode for building opaline based cli tools",
        description: "",
        usage: "{binName} dev",
        examples: [],
        shouldPassInputs: false,
        options: {}
      },
      load: () => require("./commands/dev").default
    },
    test: {
      commandName: "test",
      meta: {
        title: "No description",
        description: "",
        usage: "",
        examples: [],
        shouldPassInputs: false,
        options: {}
      },
      load: () => require("./commands/test").default
    }
  }
};

cli(process.argv, config);
