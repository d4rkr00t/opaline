"use strict";

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var React = require("react");
var React__default = _interopDefault(React);
var ink = require("ink");

const _jsxFileName =
  "/Users/ssysoev/Development/opaline/examples/ink/commands/counter.tsx";
class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      i: 0
    };
  }

  render() {
    return React__default.createElement(
      ink.Color,
      {
        green: true,
        __self: this,
        __source: { fileName: _jsxFileName, lineNumber: 15 }
      },
      this.state.i,
      " tests passed"
    );
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        i: this.state.i + 1
      });
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
}

function opalink() {
  ink.render(
    React__default.createElement(Counter, {
      __self: this,
      __source: { fileName: _jsxFileName, lineNumber: 32 }
    })
  );
}

module.exports = opalink;
