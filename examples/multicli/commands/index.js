/**
 * Prints inputs and flags
 *
 * @usage $ {cliName} --name john
 *
 * @param {string[]} $inputs
 * @param {string} [name="john"] Some important flag
 * @alias name:n
 *
 * @example $ {cliName} --name john
 */
export default function MainCommand($inputs, name) {
  console.log("input is", $inputs);
  console.log("name is:", name);
}
