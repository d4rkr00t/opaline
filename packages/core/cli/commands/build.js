"use strict";

require("path");
require("fs");
require("util");
require("chokidar");
require("rollup");
require("rollup-plugin-typescript");
require("rimraf");
require("chalk");
require("@opaline/core");
require("read-pkg-up");
var compiler = require("./compiler-afaf7cd0.js");
require("@babel/parser");
require("@babel/traverse");
require("doctrine");
require("child_process");

/**
 * Production build for opaline based cli tool
 *
 * @usage {cliName} build
 */
async function build() {
  let compiler$1 = new compiler.Compiler({
    cwd: process.cwd(),
    mode: "production"
  });
  return compiler$1.compile({ watch: false });
}

module.exports = build;
