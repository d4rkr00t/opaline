import { Compiler } from "../commands-common/compiler";

/**
 * Development mode for building opaline based cli tools
 *
 * @usage {binName} dev
 */
export default async function dev() {
  let compiler = new Compiler({ cwd: process.cwd(), mode: "development" });
  return compiler.compile({ watch: true });
}
