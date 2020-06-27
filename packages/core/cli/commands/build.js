"use strict";

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
require("chalk");
require("./messages-885f5fb4.js");
var compiler = require("./compiler-44652981.js");
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
