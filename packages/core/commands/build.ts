import { Compiler } from "../commands-common/compiler";

/**
 * Production build for opaline based cli tool
 *
 * @usage {cliName} build
 */
export default async function build() {
  let compiler = new Compiler({ cwd: process.cwd(), mode: "production" });
  return compiler.compile({ watch: false });
}
