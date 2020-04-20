# @opaline/core

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
