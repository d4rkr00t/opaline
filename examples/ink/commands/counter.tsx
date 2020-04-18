import React, { Component } from "react";
import { render, Color } from "ink";

class Counter extends Component<any, { i: number }> {
  private timer: any;
  constructor(props) {
    super(props);

    this.state = {
      i: 0
    };
  }

  render() {
    return <Color green>{this.state.i} tests passed</Color>;
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

export default function opalink() {
  render(<Counter />);
}
