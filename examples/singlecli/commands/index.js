module.exports = function MainCommand() {
  console.log("main");
};

module.exports.options = {
  name: {
    title: "Some important flag",
    type: "string",
    alias: "n",
    default: "john"
  }
};

module.exports.help = {
  description: () => "Prints inputs and flags.",
  examples: ({ cliName }) => [
    { example: `$ ${cliName} --some --random --flags` }
  ]
};
