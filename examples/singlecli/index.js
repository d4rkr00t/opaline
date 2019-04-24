#!/usr/bin/env node

const cli = require("@opaline/core").default;
const package = require("./package.json");
cli(process.argv, __dirname, package, {
  /* options */
});
