"use strict";

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var React = require("react");
var React__default = _interopDefault(React);
var ink = require("ink");

const _jsxFileName =
  "/Users/ssysoev/Development/opaline/examples/ink/commands/useinput.tsx";
const Robot = () => {
  const { exit } = React.useContext(ink.AppContext);
  const [x, setX] = React.useState(1);
  const [y, setY] = React.useState(1);

  ink.useInput((input, key) => {
    if (input === "q") {
      exit();
    }

    if (key.leftArrow) {
      setX(Math.max(1, x - 1));
    }

    if (key.rightArrow) {
      setX(Math.min(20, x + 1));
    }

    if (key.upArrow) {
      setY(Math.max(1, y - 1));
    }

    if (key.downArrow) {
      setY(Math.min(10, y + 1));
    }
  });

  return React__default.createElement(
    ink.Box,
    {
      flexDirection: "column",
      __self: undefined,
      __source: { fileName: _jsxFileName, lineNumber: 32 }
    },
    React__default.createElement(
      ink.Box,
      {
        __self: undefined,
        __source: { fileName: _jsxFileName, lineNumber: 33 }
      },
      "Use arrow keys to move the face. Press “q” to exit."
    ),
    React__default.createElement(
      ink.Box,
      {
        height: 12,
        paddingLeft: x,
        paddingTop: y,
        __self: undefined,
        __source: { fileName: _jsxFileName, lineNumber: 34 }
      },
      "^_^"
    )
  );
};

function robot() {
  ink.render(
    React__default.createElement(Robot, {
      __self: this,
      __source: { fileName: _jsxFileName, lineNumber: 42 }
    })
  );
}

module.exports = robot;
