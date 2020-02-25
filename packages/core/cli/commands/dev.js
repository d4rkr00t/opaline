'use strict';

require('path');
require('fs');
require('util');
require('chokidar');
require('rollup');
require('rollup-plugin-typescript');
require('rimraf');
require('chalk');
require('@opaline/core');
require('read-pkg-up');
var compiler = require('./compiler-b89ed43d.js');
require('@babel/parser');
require('@babel/traverse');
require('doctrine');
require('child_process');

/**
 * Development mode for building opaline based cli tools
 *
 * @usage {cliName} dev
 */
async function dev() {
    let compiler$1 = new compiler.Compiler({ cwd: process.cwd(), mode: "development" });
    return compiler$1.compile({ watch: true });
}

module.exports = dev;
