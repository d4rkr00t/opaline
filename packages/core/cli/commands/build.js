"use strict";

var compiler = require("./compiler-45579224.js");
require("path");
require("fs");
require("util");
require("chokidar");
require("rollup");
require("@rollup/plugin-sucrase");
require("@rollup/plugin-node-resolve");
require("rimraf");
require("@opaline/core");
require("read-pkg-up");
require("./messages-3b678966.js");
require("chalk");
require("@babel/parser");
require("@babel/traverse");
require("comment-parser");
require("child_process");

/**
 * Production build for opaline based cli tool
 *
 * @usage {cliName} build
 */
async function build() {
  let compiler$1 = new compiler.Compiler({
    cwd: process.cwd(),
    mode: "production",
  });
  return await compiler$1.compile({ watch: false });
}

module.exports = build;
