import React, { Component } from "react";
import { Static, Box, render } from "ink";
import PQueue from "p-queue";
import delay from "delay";
import ms from "ms";
import Summary from "../jest-components/summary";
import Test from "../jest-components/test";

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

class Jest extends React.Component<any, any> {
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

    return (
      <Box flexDirection="column">
        <Static>
          {completedTests.map(test => (
            <Test key={test.path} status={test.status} path={test.path} />
          ))}
        </Static>

        {runningTests.length > 0 && (
          <Box flexDirection="column" marginTop={1}>
            {runningTests.map(test => (
              <Test key={test.path} status={test.status} path={test.path} />
            ))}
          </Box>
        )}

        <Summary
          isFinished={runningTests.length === 0}
          passed={completedTests.filter(test => test.status === "pass").length}
          failed={completedTests.filter(test => test.status === "fail").length}
          time={ms(Date.now() - startTime)}
        />
      </Box>
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

export default function jest() {
  render(<Jest />);
}
