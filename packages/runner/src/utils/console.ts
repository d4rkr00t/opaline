import * as readline from "readline";
import chalk from "chalk";

export function prompt(message: string): Promise<boolean> {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(
      chalk.blue(`❯ ${message} ${chalk.dim("[yes|y|n|no]")}: `),
      answer => {
        rl.close();

        if (answer === "y" || answer === "yes") {
          return resolve(true);
        }

        return resolve(false);
      }
    );
  });
}

export function badgeRed(text: string) {
  return chalk.bgRed.black(` ${text} `);
}

export function badgeGreen(text: string) {
  return chalk.bgGreen.black(` ${text} `);
}
