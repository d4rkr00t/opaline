"use strict";

/**
 * Prints inputs and flags
 *
 * @usage $ {cliName} --name john
 *
 * @param {string[]} $inputs
 * @param {string} rest Rest flags
 * @param {...any} what Rest flags
 * @example $ {cliName} --name john
 */
function MainCommand($inputs, rest, what) {
  console.log("input is:", $inputs);
  console.log("rest are:", rest);
  console.log("what are:", what);
}

module.exports = MainCommand;
