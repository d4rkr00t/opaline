<br/>
<br/>
<div align="center">
  <img src="/assets/opaline.png" alt="opaline" width="340" align="center">
</div>
<br/>
<br/>
<h2 align="center">Opaline – CLI Tools Framework</h2>
<br/>

## Usage

Install opaline:

```sh
npx @opaline/core create app
```

Compile the CLI:

```sh
npm run build
npm run dev # for dev mode with watch and auto linking
```

## Adding help and parameters to a CLI

```js
// ./commands/index.js

/**
 * Use JSDoc comments to define help and parameters for a CLI.
 * {cliName} will be replaced with an actual name of a CLI tool.
 *
 * @usage {cliName} --param1 10 --param2 20
 *
 * @param {string[]} $inputs
 * @param {number}   [param1=20] some parameter for a CLI with a default value
 * @param {string}   param2 some parameter for a CLI
 */
export default function command($inputs, param1, param2) {
  console.log("hello world!");
}
```
