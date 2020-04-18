"use strict";

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var React = require("react");
var React__default = _interopDefault(React);
var ink = require("ink");
var PQueue = _interopDefault(require("p-queue"));
var delay = _interopDefault(require("delay"));
var ms = _interopDefault(require("ms"));

const _jsxFileName =
  "/Users/ssysoev/Development/opaline/examples/ink/jest-components/summary.tsx";
function Summary({ isFinished, passed, failed, time }) {
  return React__default.createElement(
    ink.Box,
    {
      flexDirection: "column",
      marginTop: 1,
      __self: this,
      __source: { fileName: _jsxFileName, lineNumber: 6 }
    },
    React__default.createElement(
      ink.Box,
      { __self: this, __source: { fileName: _jsxFileName, lineNumber: 7 } },
      React__default.createElement(
        ink.Box,
        {
          width: 14,
          __self: this,
          __source: { fileName: _jsxFileName, lineNumber: 8 }
        },
        React__default.createElement(
          ink.Color,
          {
            bold: true,
            __self: this,
            __source: { fileName: _jsxFileName, lineNumber: 9 }
          },
          "Test Suites:"
        )
      ),
      failed > 0 &&
        React__default.createElement(
          ink.Color,
          {
            bold: true,
            red: true,
            __self: this,
            __source: { fileName: _jsxFileName, lineNumber: 12 }
          },
          failed,
          " failed,",
          " "
        ),
      passed > 0 &&
        React__default.createElement(
          ink.Color,
          {
            bold: true,
            green: true,
            __self: this,
            __source: { fileName: _jsxFileName, lineNumber: 17 }
          },
          passed,
          " passed,",
          " "
        ),
      passed + failed,
      " total"
    ),

    React__default.createElement(
      ink.Box,
      { __self: this, __source: { fileName: _jsxFileName, lineNumber: 24 } },
      React__default.createElement(
        ink.Box,
        {
          width: 14,
          __self: this,
          __source: { fileName: _jsxFileName, lineNumber: 25 }
        },
        React__default.createElement(
          ink.Color,
          {
            bold: true,
            __self: this,
            __source: { fileName: _jsxFileName, lineNumber: 26 }
          },
          "Time:"
        )
      ),

      time
    ),

    isFinished &&
      React__default.createElement(
        ink.Box,
        { __self: this, __source: { fileName: _jsxFileName, lineNumber: 33 } },
        React__default.createElement(
          ink.Color,
          {
            dim: true,
            __self: this,
            __source: { fileName: _jsxFileName, lineNumber: 34 }
          },
          "Ran all test suites."
        )
      )
  );
}

const _jsxFileName$1 =
  "/Users/ssysoev/Development/opaline/examples/ink/jest-components/test.tsx";
let getBackgroundForStatus = status => {
  if (status === "runs") {
    return {
      bgYellow: true,
      black: true
    };
  }

  if (status === "pass") {
    return {
      bgGreen: true,
      black: true
    };
  }

  if (status === "fail") {
    return {
      bgRed: true,
      black: true
    };
  }
};

function Test({ status, path }) {
  return React__default.createElement(
    ink.Box,
    { __self: this, __source: { fileName: _jsxFileName$1, lineNumber: 29 } },
    React__default.createElement(
      ink.Color,
      {
        ...getBackgroundForStatus(status),
        __self: this,
        __source: { fileName: _jsxFileName$1, lineNumber: 30 }
      },
      ` ${status.toUpperCase()} `
    ),

    React__default.createElement(
      ink.Box,
      {
        marginLeft: 1,
        __self: this,
        __source: { fileName: _jsxFileName$1, lineNumber: 34 }
      },
      React__default.createElement(
        ink.Color,
        {
          dim: true,
          __self: this,
          __source: { fileName: _jsxFileName$1, lineNumber: 35 }
        },
        path.split("/")[0],
        "/"
      ),

      React__default.createElement(
        ink.Color,
        {
          bold: true,
          white: true,
          __self: this,
          __source: { fileName: _jsxFileName$1, lineNumber: 37 }
        },
        path.split("/")[1]
      )
    )
  );
}

const _jsxFileName$2 =
  "/Users/ssysoev/Development/opaline/examples/ink/commands/jest.tsx";
let paths = [
  "tests/login.js",
  "tests/signup.js",
  "tests/forgot-password.js",
  "tests/reset-password.js",
  "tests/view-profile.js",
  "tests/edit-profile.js",
  "tests/delete-profile.js",
  "tests/posts.js",
  "tests/post.js",
  "tests/comments.js"
];

class Jest extends React__default.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: Date.now(),
      completedTests: [],
      runningTests: []
    };
  }

  render() {
    const { startTime, completedTests, runningTests } = this.state;

    return React__default.createElement(
      ink.Box,
      {
        flexDirection: "column",
        __self: this,
        __source: { fileName: _jsxFileName$2, lineNumber: 37 }
      },
      React__default.createElement(
        ink.Static,
        {
          __self: this,
          __source: { fileName: _jsxFileName$2, lineNumber: 38 }
        },
        completedTests.map(test =>
          React__default.createElement(Test, {
            key: test.path,
            status: test.status,
            path: test.path,
            __self: this,
            __source: { fileName: _jsxFileName$2, lineNumber: 40 }
          })
        )
      ),

      runningTests.length > 0 &&
        React__default.createElement(
          ink.Box,
          {
            flexDirection: "column",
            marginTop: 1,
            __self: this,
            __source: { fileName: _jsxFileName$2, lineNumber: 45 }
          },
          runningTests.map(test =>
            React__default.createElement(Test, {
              key: test.path,
              status: test.status,
              path: test.path,
              __self: this,
              __source: { fileName: _jsxFileName$2, lineNumber: 47 }
            })
          )
        ),

      React__default.createElement(Summary, {
        isFinished: runningTests.length === 0,
        passed: completedTests.filter(test => test.status === "pass").length,
        failed: completedTests.filter(test => test.status === "fail").length,
        time: ms(Date.now() - startTime),
        __self: this,
        __source: { fileName: _jsxFileName$2, lineNumber: 52 }
      })
    );
  }

  componentDidMount() {
    const queue = new PQueue({ concurrency: 4 });

    paths.forEach(path => {
      queue.add(this.runTest.bind(this, path));
    });
  }

  async runTest(path) {
    this.setState(previousState => ({
      runningTests: [
        ...previousState.runningTests,
        {
          status: "runs",
          path
        }
      ]
    }));

    await delay(1000 * Math.random());

    this.setState(previousState => ({
      runningTests: previousState.runningTests.filter(
        test => test.path !== path
      ),
      completedTests: [
        ...previousState.completedTests,
        {
          status: Math.random() < 0.5 ? "pass" : "fail",
          path
        }
      ]
    }));
  }
}

function jest() {
  ink.render(
    React__default.createElement(Jest, {
      __self: this,
      __source: { fileName: _jsxFileName$2, lineNumber: 99 }
    })
  );
}

module.exports = jest;
