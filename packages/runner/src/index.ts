import ora from "ora";
import { dim, yellow } from "colorette";
import { prompt } from "./utils/console";

export interface NestedPrintableOutput extends Array<PrintableOutput> {}
export type PrintableOutput = string | Array<string | NestedPrintableOutput>;

export type Task<Ctx = any, Params = any> = {
  title: string | ((ctx: Ctx, taskParams: Params) => string);
  abort?: (
    sharedCtx: Ctx,
    taskParams: Params,
    taskWrapper: TaskWrapper
  ) => Promise<boolean>;
  skip?: (
    sharedCtx: Ctx,
    taskParams: Params,
    taskWrapper: TaskWrapper
  ) => Promise<boolean>;
  task: (
    sharedCtx: Ctx,
    taskParams: Params,
    taskWrapper: TaskWrapper
  ) => Promise<PrintableOutput | undefined | void>;
};

export function indent(text: string, level: number = 1) {
  return `${("" as any).padStart(level * 2, " ")}${text}`;
}

export class TaskWrapper<C = any, P = any> {
  private _title: string;
  private params: P;
  private sharedCtx: C;
  private task: Task;
  private spinner: ora.Ora;
  private debug: boolean;

  isAborted = false;

  constructor(sharedCtx: C, params: P, task: Task, debug = false) {
    this.params = params;
    this.sharedCtx = sharedCtx;
    this.task = task;
    this.debug = debug;
    this._title =
      typeof task.title === "string"
        ? task.title
        : task.title(this.sharedCtx, params);
    this.spinner = ora(this._title);
  }

  skip() {
    this.spinner.info(dim(`[skip] ${this.title}`));
  }

  abort() {
    this.isAborted = true;
  }

  progress(text: string) {
    this.spinner.text = `${this.title} ${dim("[" + text + "]")}`;
  }

  stopAndClearSpinner() {
    this.spinner.stop();
  }

  format(
    text: PrintableOutput,
    formatter: (text: string) => string = (item) => dim(`→ ${item}`)
  ): PrintableOutput {
    if (Array.isArray(text)) {
      return text.map((item) => {
        if (Array.isArray(item)) {
          return this.format(item, formatter);
        } else {
          return formatter(item);
        }
      }) as PrintableOutput;
    } else {
      return [formatter(text)];
    }
  }

  print(text: PrintableOutput, level: number = 1) {
    let shouldRestartSpinner = false;

    if (this.spinner.isSpinning) {
      shouldRestartSpinner = true;
      this.spinner.stop();
    }

    if (Array.isArray(text)) {
      text.forEach((item) => {
        if (Array.isArray(item)) {
          this.print(item, level + 1);
        } else {
          console.log(indent(item, level));
        }
      });
    } else {
      console.log(indent(text, level));
    }

    if (shouldRestartSpinner) {
      this.spinner.start();
    }
  }

  printFormatted(text: PrintableOutput, level: number = 1) {
    this.print(this.format(text), level);
  }

  prompt(text: string) {
    this.spinner.stop();
    return prompt(text).then((result: any) => {
      this.spinner.start();
      return result;
    });
  }

  set title(newTitle: string) {
    this.spinner.text = newTitle;
    this._title = newTitle;
  }

  get title() {
    return this._title;
  }

  async run() {
    if (
      this.task.skip &&
      (await this.task.skip(this.sharedCtx, this.params, this))
    ) {
      this.skip();
      return;
    }

    if (
      this.task.abort &&
      (await this.task.abort(this.sharedCtx, this.params, this))
    ) {
      this.abort();
      this.spinner.text = yellow(`[exit] ${this.title}`);
      this.spinner.warn();
      return;
    }

    this.spinner.start();

    try {
      const taskResult = await this.task.task(
        this.sharedCtx,
        this.params,
        this
      );

      if (this.isAborted) {
        this.spinner.text = yellow(`[exit] ${this.title}`);
        this.spinner.warn();
      } else {
        this.spinner.text = this.title;
        this.spinner.succeed();
      }

      if (taskResult) {
        this.print(taskResult);
      }
    } catch (e) {
      this.spinner.stop();
      if (this.debug) {
        console.log(e.stack);
      }
      throw e;
    }
  }
}

export function createCommand<C, P>(tasks: Array<Task<C, P>>, debug = false) {
  return async function run(params: P) {
    const sharedCtx: any = {};
    const startTime = Date.now();

    for (const task of tasks) {
      const wrappedTask = new TaskWrapper<C, P>(sharedCtx, params, task, debug);
      await wrappedTask.run();

      if (wrappedTask.isAborted) {
        return;
      }
    }

    const timing = (Date.now() - startTime) / 1000;
    const rounded = Math.round(timing * 100) / 100;

    console.log(`🏁 Done in ${rounded}s.`);
  };
}
