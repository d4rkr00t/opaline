"use strict";

require("path");
require("fs");
require("util");
require("chokidar");
require("rollup");
require("@rollup/plugin-sucrase");
require("rimraf");
require("chalk");
require("@opaline/core");
require("read-pkg-up");
require("./messages-95ed9aae.js");
var compiler = require("./compiler-fcfb7ed2.js");
require("@babel/parser");
require("@babel/traverse");
require("doctrine");
require("child_process");

/**
 * Development mode for building opaline based cli tools
 *
 * @usage {cliName} dev
 */
async function dev() {
  let compiler$1 = new compiler.Compiler({
    cwd: process.cwd(),
    mode: "development"
  });
  return compiler$1.compile({ watch: true });
}

module.exports = dev;
