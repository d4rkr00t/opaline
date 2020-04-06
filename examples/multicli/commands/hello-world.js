/**
 * Prints inputs and flags
 *
 * @usage $ {cliName} hello-world --name john
 *
 * @param {string} $inputs
 * @param {string} [name="john"] Some important flag
 * @alias name:n
 *
 * @example $ {cliName} hello-world --name john
 */
export default function helloWorld($input, name) {
  console.log({ $input, name });
}