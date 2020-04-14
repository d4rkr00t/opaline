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
      load: () => {
        let command = require("./commands/build");

        if (typeof command !== "function") {
          throw new Error(`Command "build" doesn't export a function...`);
        }
      }
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
      load: () => {
        let command = require("./commands/dev");

        if (typeof command !== "function") {
          throw new Error(`Command "dev" doesn't export a function...`);
        }
      }
    }
  }
};

cli(process.argv, config);
