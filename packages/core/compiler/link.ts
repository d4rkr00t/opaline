import * as cp from "child_process";
import { promisify } from "util";

let exec = promisify(cp.exec);

export async function link() {
  let bin = "npm";
  try {
    await exec("yarn --version");
    bin = "yarn";
  } catch (e) {}
  return await exec(`${bin} link`);
}
