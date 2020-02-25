import { Compiler } from "../compiler/compiler";

/**
 * Development mode for building opaline based cli tools
 *
 * @usage {cliName} dev
 */
export default async function dev() {
  let compiler = new Compiler({ cwd: process.cwd(), mode: "development" });
  return compiler.compile({ watch: true });
}
