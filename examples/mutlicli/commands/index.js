module.exports = function MainCommand() {
  console.log("main");
};

module.exports.options = {
  name: {
    description: "Some important flag",
    type: "string",
    alias: "n",
    default: "john"
  }
};

module.exports.help = {
  description: () => "Prints inputs and flags.",
  example: ({ name }) => `$ ${name} --some --random --flags`
};
