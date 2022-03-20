"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = exports.TaskWrapper = exports.indent = void 0;
const ora_1 = __importDefault(require("ora"));
const colorette_1 = require("colorette");
const console_1 = require("./utils/console");
function indent(text, level = 1) {
  return `${"".padStart(level * 2, " ")}${text}`;
}
exports.indent = indent;
class TaskWrapper {
  constructor(sharedCtx, params, task, debug = false) {
    this.isAborted = false;
    this.params = params;
    this.sharedCtx = sharedCtx;
    this.task = task;
    this.debug = debug;
    this._title =
      typeof task.title === "string"
        ? task.title
        : task.title(this.sharedCtx, params);
    this.spinner = (0, ora_1.default)(this._title);
  }
  skip() {
    this.spinner.info((0, colorette_1.dim)(`[skip] ${this.title}`));
  }
  abort() {
    this.isAborted = true;
  }
  progress(text) {
    this.spinner.text = `${this.title} ${(0, colorette_1.dim)(
      "[" + text + "]"
    )}`;
  }
  stopAndClearSpinner() {
    this.spinner.stop();
  }
  format(text, formatter = (item) => (0, colorette_1.dim)(`→ ${item}`)) {
    if (Array.isArray(text)) {
      return text.map((item) => {
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
  printFormatted(text, level = 1) {
    this.print(this.format(text), level);
  }
  prompt(text) {
    this.spinner.stop();
    return (0, console_1.prompt)(text).then((result) => {
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
      this.spinner.text = (0, colorette_1.yellow)(`[exit] ${this.title}`);
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
        this.spinner.text = (0, colorette_1.yellow)(`[exit] ${this.title}`);
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
exports.TaskWrapper = TaskWrapper;
function createCommand(tasks, debug = false) {
  return async function run(params) {
    const sharedCtx = {};
    const startTime = Date.now();
    for (const task of tasks) {
      const wrappedTask = new TaskWrapper(sharedCtx, params, task, debug);
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
