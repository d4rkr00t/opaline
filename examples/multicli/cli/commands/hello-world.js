"use strict";

/**
 * Prints inputs and flags
 *
 * @usage $ {cliName} hello-world --name john
 *
 * @param {number} $inputs
 * @param {string} [name="john"] Some important flag
 * @short name=n
 *
 * @example $ {cliName} hello-world --name john
 */
function helloWorld($inputs, name) {
  console.log({ $inputs, name });
}

module.exports = helloWorld;
