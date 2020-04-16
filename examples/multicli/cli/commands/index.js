"use strict";

/**
 * Prints inputs and flags
 *
 * @usage $ {cliName} --name john
 *
 * @param {string[]} $inputs
 * @param {string} [name="john"] Some important flag
 * @param {number} [age=20] Some important flag
 * @example $ {cliName} --name john
 */
function MainCommand($inputs, name, age) {
  console.log("input is:", $inputs);
  console.log("name is:", name);
  console.log("age is:", age);
}

module.exports = MainCommand;
