import test from "ava";
import * as path from "path";
import { getProjectInfo } from "../project-info";

test("getProjectInfo: should throw an error, when there no 'bin' in package.json", async t => {
  let cwd = path.join(__dirname, "__fixtures__", "empty-bin");
  await t.throwsAsync(async () => getProjectInfo(cwd));
});

test("getProjectInfo: should throw an error, when src === dist", async t => {
  let cwd = path.join(__dirname, "__fixtures__", "src-eq-dist");
  await t.throwsAsync(async () => getProjectInfo(cwd));
});
