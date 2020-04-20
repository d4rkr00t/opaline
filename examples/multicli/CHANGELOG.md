# multicli

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
