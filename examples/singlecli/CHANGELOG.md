# single-cli

## 1.0.4

### Patch Changes

- fb4c301: feat: prefer index.js title + description from JSDoc over package.json#description
- 4880fc7: add lint-staged, prettier, pre-commit and tsc typecheck to generated with create project
- 666ecde: warn when \$inputs type is wrong
- Updated dependencies [fb4c301]
- Updated dependencies [4880fc7]
- Updated dependencies [666ecde]
  - @opaline/core@0.5.0

## 1.0.3

### Patch Changes

- f321d81: support parsing jsdoc from module.exports
- 6485bc3: support aliases for parameters

  Example:

  ```js
  /**
   * @param {string} name Name
   * @short name=n
   *
   * @param {number} age Age
   * @short age=a
   */
  export default function cli() {}
  ```

- Updated dependencies [f321d81]
- Updated dependencies [6485bc3]
  - @opaline/core@0.4.0

## 1.0.2

### Patch Changes

- d8bf2ef: allow nesting folders inside commands
- Updated dependencies [d8bf2ef]
  - @opaline/core@0.3.0

## 1.0.1

### Patch Changes

- 2d28626: support jsx, enables using tools like Ink
- Updated dependencies [2d28626]
  - @opaline/core@0.2.0
