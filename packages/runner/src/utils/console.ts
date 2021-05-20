import * as readline from "readline";
import { bgGreen, bgRed, black, blue, dim } from "colorette";

export function prompt(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(blue(`❯ ${message} ${dim("[yes|y|n|no]")}: `), (answer) => {
      rl.close();

      if (answer === "y" || answer === "yes") {
        return resolve(true);
      }

      return resolve(false);
    });
  });
}

export function badgeRed(text: string) {
  return bgRed(black(` ${text} `));
}

export function badgeGreen(text: string) {
  return bgGreen(black(` ${text} `));
}
