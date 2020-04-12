import test from "ava";
import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";
import rimraf from "rimraf";
import { Compiler } from "./compiler";

let rm = promisify(rimraf) as typeof rimraf;
let readdir = promisify(fs.readdir);

test("should compile simple project", async t => {
  let cwd = path.join(__dirname, "__fixtures__", "simple");
  let dist = path.join(cwd, "dist");
  let commands = path.join(dist, "commands");

  // Clean up old bundles
  await rm(dist);

  let compiler = new Compiler({ cwd, mode: "production" });
  await compiler.compile({ watch: false });

  // await new Promise(resolve => setTimeout(resolve, 3000));

  let distFolder = await readdir(dist);
  console.log(distFolder);
  let commandsFolder = await readdir(commands);
  console.log(commandsFolder);

  t.snapshot(distFolder);
  t.snapshot(commandsFolder);
});
