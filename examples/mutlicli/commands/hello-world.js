module.exports = function helloWorld(inputs, flags) {
  console.log({ inputs, flags });
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
  title: () => "prints inputs and flags",
  description: () => "prints inputs and flags",
  examples: ({ cliName }) => [
    { example: `$ ${cliName} hello-world --some --random --flags` }
  ]
};
