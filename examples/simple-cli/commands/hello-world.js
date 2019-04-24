module.exports = function helloWorld(inputs, flags) {
  console.log({ inputs, flags });
};

module.exports.options = {
  name: {
    type: "string",
    alias: "n",
    default: "john"
  }
};

module.exports.help = {
  description: () => "prints inputs and flags",
  example: ({ name }) => `${name} hello-world --some --random --flags`
};
