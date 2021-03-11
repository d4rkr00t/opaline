const createCommand = require("@opaline/runner").createCommand;

let task1 = {
  title: "Task 1: doing something...",
  async task() {
    await new Promise((resolve) => setTimeout(resolve, 4000));
  },
};
let task2 = {
  title: "Task 2: doing something else ...",
  async task() {
    await new Promise((resolve) => setTimeout(resolve, 4000));
  },
};

export default async function runnerCommand() {
  await createCommand([task1, task2])();
}
