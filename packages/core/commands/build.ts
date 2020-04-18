import { Compiler } from "./compiler/compiler";

/**
 * Production build for opaline based cli tool
 *
 * @usage {cliName} build
 */
export default async function build() {
  let compiler = new Compiler({ cwd: process.cwd(), mode: "production" });
  return await compiler.compile({ watch: false });
}
