import React from "react";
import { Color, Box } from "ink";

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

export default function Test({ status, path }) {
  return (
    <Box>
      <Color {...getBackgroundForStatus(status)}>
        {` ${status.toUpperCase()} `}
      </Color>

      <Box marginLeft={1}>
        <Color dim>{path.split("/")[0]}/</Color>

        <Color bold white>
          {path.split("/")[1]}
        </Color>
      </Box>
    </Box>
  );
}
