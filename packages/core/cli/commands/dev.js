"use strict";

var compiler = require("./compiler-3f1f656b.js");
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
require("./messages-b3261a51.js");
require("colorette");
require("@babel/parser");
require("@babel/traverse");
require("comment-parser");
require("child_process");

/**
 * Development mode for building opaline based cli tools
 *
 * @usage {cliName} dev
 */
async function dev() {
  let compiler$1 = new compiler.Compiler({
    cwd: process.cwd(),
    mode: "development",
  });
  return compiler$1.compile({ watch: true });
}

module.exports = dev;
