import { blue, red, yellow } from "colorette";
import { OpalineError } from "../utils/error";

//
//
// TODO: REVISIT THIS WHOLE FILE
//
//

export interface NestedPrintableOutput extends Array<PrintableOutput> {}
export type PrintableOutput = string | Array<string | NestedPrintableOutput>;

export function indent(text: string, level: number = 1) {
  return `${("" as any).padStart(level * 2, " ")}${text}`;
}

export function print(text: PrintableOutput, level: number = 0) {
  if (Array.isArray(text)) {
    text.forEach((item) => {
      if (Array.isArray(item)) {
        print(item, level + 1);
      } else {
        console.log(indent(item, level));
      }
    });
  } else {
    console.log(indent(text, level));
  }
}

export function printWarning(text: string) {
  print(yellow("[WARN] ") + text);
}

export function printError(
  err: OpalineError | Error | string,
  verbose: boolean = false
) {
  if (typeof err === "string") {
    print(err);
  } else {
    print(
      [red(`${err.message}`)]
        .concat((err as OpalineError).hint ? (err as OpalineError).hint! : [])
        .concat(verbose && err.stack ? err.stack.split("\n") : [])
    );
  }
}

export function printInfo(text: string) {
  print(blue("[INFO] ") + text);
}
