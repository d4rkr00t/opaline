/**
 * Prints inputs and flags
 *
 * @usage $ {cliName} hello-world --name john
 *
 * @param {string} $inputs
 * @param {string} [name="john"] Some important flag
 * @short name=n
 *
 * @example $ {cliName} hello-world --name john
 */
export default function helloWorld($inputs, name) {
  console.log({ $inputs, name });
}
