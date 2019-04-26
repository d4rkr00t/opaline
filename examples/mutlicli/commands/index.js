module.exports = function MainCommand(inputs, flags) {
  console.log("name is:", flags.name);
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
  usage: ({ cliName }) => `$ ${cliName} [COMMAND] [--options]`,
  description: () => "Prints inputs and flags.",
  examples: ({ cliName }) => [
    {
      example: `$ ${cliName} --name john`,
      description: "Print a name"
    }
  ]
};
