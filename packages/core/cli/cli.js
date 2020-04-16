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

        return command;
      }
    },
    create: {
      commandName: "create",
      meta: {
        title: "Bootstraps new Opaline based CLI tool",
        description: "",
        usage: "opaline create app",
        examples: [],
        shouldPassInputs: true,
        options: {
          debug: {
            title: "Enables verbose logging and stack traces",
            type: "boolean"
          }
        }
      },
      load: () => {
        let command = require("./commands/create");

        if (typeof command !== "function") {
          throw new Error(`Command "create" doesn't export a function...`);
        }

        return command;
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

        return command;
      }
    }
  }
};

cli(process.argv, config);
