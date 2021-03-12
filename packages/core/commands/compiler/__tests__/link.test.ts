import test from "ava";
import { link } from "../link";

test("should link with yarn if yarn is available", async (t) => {
  let exec = async (command) => {
    if (command === "yarn --version") return "yarn";
    return command;
  };

  t.true(((await link(exec as any)) as any) === "yarn link");
});

test("should link with npm if yarn is not available", async (t) => {
  let exec = async (command) => {
    if (command === "yarn --version") {
      throw new Error("NO YARN");
    }
    return command;
  };

  t.true(((await link(exec as any)) as any) === "npm link");
});
