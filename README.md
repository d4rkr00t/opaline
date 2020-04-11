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
npm init -y
npm install --save @opaline/core
```

Add build and watch scripts to `package.json`:

```json
"scripts": {
  "build": "opaline build",
  "dev": "opaline dev"
},
```

Add `bin` to `package.json`, opaline will use this to generate an entry point for a CLI tool:

```json
"bin": {
  "mycli": "./cli/cli.js"
},
```

Create first command:

```js
// ./commands/index.js

export default function command() {
  console.log("hello world!");
}
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
 * @param {string} param1 some parameter for a CLI
 * @param {string} [param2=20] some parameter for a CLI with a default value
 */
export default function command($input, param1, param2) {
  console.log("hello world!");
}
```

Issues:

```
Empty project:

[ERROR] TypeError: Cannot convert undefined or null to object
  TypeError: Cannot convert undefined or null to object
      at Function.keys (<anonymous>)
      at getProjectInfo (/Users/ssysoev/Development/review-tools/node_modules/@opaline/core/cli/commands/compiler-d0bafe78.js:35:16)
      at async Compiler.init (/Users/ssysoev/Development/review-tools/node_modules/@opaline/core/cli/commands/compiler-d0bafe78.js:228:20)
      at async Compiler.compile (/Users/ssysoev/Development/review-tools/node_modules/@opaline/core/cli/commands/compiler-d0bafe78.js:286:5)
      at async run (/Users/ssysoev/Development/review-tools/node_modules/@opaline/core/dist/index.js:126:5)
      at async opaline (/Users/ssysoev/Development/review-tools/node_modules/@opaline/core/dist/index.js:69:12)

```
