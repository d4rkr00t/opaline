import * as cp from "child_process";
import { promisify } from "util";

let _exec = promisify(cp.exec);

export async function link(exec = _exec) {
  let bin = "npm";
  try {
    await exec("yarn --version");
    bin = "yarn";
  } catch (e) {}
  return await exec(`${bin} link`);
}
