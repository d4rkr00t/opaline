# @opaline/core

## 0.5.5

### Patch Changes

- b4d74e1: fix extra } in some of the commands output
- Updated dependencies [b4d74e1]
  - @opaline/help-theme-default@0.0.4

## 0.5.4

### Patch Changes

- d605fd2: update dependencies of @opaline/runner
- 370c233: update dev dependencies
- a8d005c: devDependencies property doesn't exist when assigning dependencies
- 3aa636a: update dependnecies
- a8d005c: devDependencies property doesn't exist when assigning dependencies
- 8874c76: update @opaline/help-theme-default dependencies
- Updated dependencies [d605fd2]
- Updated dependencies [370c233]
- Updated dependencies [8874c76]
  - @opaline/runner@0.1.2
  - @opaline/help-theme-default@0.0.3

## 0.5.3

### Patch Changes

- Updated dependencies [95b6984]
  - @opaline/help-theme-default@0.0.2
  - @opaline/runner@0.1.1

## 0.5.2

### Patch Changes

- 035dd14: Fix various issues and update documentation

## 0.5.1

### Patch Changes

- b55ca0a: fix: annoying warning from rollup

## 0.5.0

### Minor Changes

- fb4c301: feat: prefer index.js title + description from JSDoc over package.json#description
- 4880fc7: add lint-staged, prettier, pre-commit and tsc typecheck to generated with create project
- 666ecde: warn when \$inputs type is wrong

## 0.4.0

### Minor Changes

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

## 0.3.0

### Minor Changes

- d8bf2ef: allow nesting folders inside commands

## 0.2.0

### Minor Changes

- 2d28626: support jsx, enables using tools like Ink

## 0.1.0

### Minor Changes

- fc63463: release: @opaline/core and @opaline/runner

### Patch Changes

- Updated dependencies [fc63463]
  - @opaline/runner@0.1.0
