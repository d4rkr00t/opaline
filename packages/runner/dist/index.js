"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
const console_1 = require("./utils/console");
function indent(text, level = 1) {
  return `${"".padStart(level * 2, " ")}${text}`;
}
exports.indent = indent;
class TaskWrapper {
  constructor(sharedCtx, params, task) {
    this.isAborted = false;
    this.params = params;
    this.sharedCtx = sharedCtx;
    this.task = task;
    this._title =
      typeof task.title === "string"
        ? task.title
        : task.title(this.sharedCtx, params);
    this.spinner = ora_1.default(this._title);
  }
  skip() {
    this.spinner.info(chalk_1.default.dim(`[skip] ${this.title}`));
  }
  abort() {
    this.isAborted = true;
  }
  progress(text) {
    this.spinner.text = `${this.title} ${chalk_1.default.dim(
      "[" + text + "]"
    )}`;
  }
  stopAndClearSpinner() {
    this.spinner.stop();
  }
  format(text, formatter = item => chalk_1.default.dim(`→ ${item}`)) {
    if (Array.isArray(text)) {
      return text.map(item => {
        if (Array.isArray(item)) {
          return this.format(item, formatter);
        } else {
          return formatter(item);
        }
      });
    } else {
      return [formatter(text)];
    }
  }
  print(text, level = 1) {
    let shouldRestartSpinner = false;
    if (this.spinner.isSpinning) {
      shouldRestartSpinner = true;
      this.spinner.stop();
    }
    if (Array.isArray(text)) {
      text.forEach(item => {
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
  printFormatted(text, level = 1) {
    this.print(this.format(text), level);
  }
  prompt(text) {
    this.spinner.stop();
    return console_1.prompt(text).then(result => {
      this.spinner.start();
      return result;
    });
  }
  set title(newTitle) {
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
      this.spinner.text = chalk_1.default.yellow(`[exit] ${this.title}`);
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
        this.spinner.text = chalk_1.default.yellow(`[exit] ${this.title}`);
        this.spinner.warn();
      } else {
        this.spinner.text = this.title;
        this.spinner.succeed();
      }
      if (taskResult) {
        this.print(taskResult);
      }
    } catch (e) {
      this.spinner.fail(chalk_1.default.red(`[error] ${e}`));
      console.log(e.stack);
      throw e;
    }
  }
}
exports.TaskWrapper = TaskWrapper;
function createCommand(tasks) {
  return async function run(params) {
    const sharedCtx = {};
    const startTime = Date.now();
    for (const task of tasks) {
      const wrappedTask = new TaskWrapper(sharedCtx, params, task);
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
exports.createCommand = createCommand;
