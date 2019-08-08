// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function(modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === "function" && parcelRequire;
  var nodeRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === "function" && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === "string") {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = "MODULE_NOT_FOUND";
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {}
    ];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === "function" && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})(
  {
    "../commands-common/project-info.ts": [
      function(require, module, exports) {
        "use strict";

        var __awaiter =
          (this && this.__awaiter) ||
          function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))(function(resolve, reject) {
              function fulfilled(value) {
                try {
                  step(generator.next(value));
                } catch (e) {
                  reject(e);
                }
              }

              function rejected(value) {
                try {
                  step(generator["throw"](value));
                } catch (e) {
                  reject(e);
                }
              }

              function step(result) {
                result.done
                  ? resolve(result.value)
                  : new P(function(resolve) {
                      resolve(result.value);
                    }).then(fulfilled, rejected);
              }

              step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
              );
            });
          };

        var __generator =
          (this && this.__generator) ||
          function(thisArg, body) {
            var _ = {
                label: 0,
                sent: function() {
                  if (t[0] & 1) throw t[1];
                  return t[1];
                },
                trys: [],
                ops: []
              },
              f,
              y,
              t,
              g;
            return (
              (g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2)
              }),
              typeof Symbol === "function" &&
                (g[Symbol.iterator] = function() {
                  return this;
                }),
              g
            );

            function verb(n) {
              return function(v) {
                return step([n, v]);
              };
            }

            function step(op) {
              if (f) throw new TypeError("Generator is already executing.");

              while (_)
                try {
                  if (
                    ((f = 1),
                    y &&
                      (t =
                        op[0] & 2
                          ? y["return"]
                          : op[0]
                          ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                          : y.next) &&
                      !(t = t.call(y, op[1])).done)
                  )
                    return t;
                  if (((y = 0), t)) op = [op[0] & 2, t.value];

                  switch (op[0]) {
                    case 0:
                    case 1:
                      t = op;
                      break;

                    case 4:
                      _.label++;
                      return {
                        value: op[1],
                        done: false
                      };

                    case 5:
                      _.label++;
                      y = op[1];
                      op = [0];
                      continue;

                    case 7:
                      op = _.ops.pop();

                      _.trys.pop();

                      continue;

                    default:
                      if (
                        !((t = _.trys),
                        (t = t.length > 0 && t[t.length - 1])) &&
                        (op[0] === 6 || op[0] === 2)
                      ) {
                        _ = 0;
                        continue;
                      }

                      if (
                        op[0] === 3 &&
                        (!t || (op[1] > t[0] && op[1] < t[3]))
                      ) {
                        _.label = op[1];
                        break;
                      }

                      if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                      }

                      if (t && _.label < t[2]) {
                        _.label = t[2];

                        _.ops.push(op);

                        break;
                      }

                      if (t[2]) _.ops.pop();

                      _.trys.pop();

                      continue;
                  }

                  op = body.call(thisArg, _);
                } catch (e) {
                  op = [6, e];
                  y = 0;
                } finally {
                  f = t = 0;
                }

              if (op[0] & 5) throw op[1];
              return {
                value: op[0] ? op[1] : void 0,
                done: true
              };
            }
          };

        var __importStar =
          (this && this.__importStar) ||
          function(mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null)
              for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
            result["default"] = mod;
            return result;
          };

        var __importDefault =
          (this && this.__importDefault) ||
          function(mod) {
            return mod && mod.__esModule
              ? mod
              : {
                  default: mod
                };
          };

        exports.__esModule = true;

        var path = __importStar(require("path"));

        var read_pkg_up_1 = __importDefault(require("read-pkg-up"));

        var core_1 = require("@opaline/core");

        function readPackageJson(cwd) {
          return __awaiter(this, void 0, void 0, function() {
            var pkgJson;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    /*yield*/
                    read_pkg_up_1["default"]({
                      cwd: cwd,
                      normalize: true
                    })
                  ];

                case 1:
                  pkgJson = _a.sent();

                  if (!pkgJson) {
                    throw new core_1.OpalineError();
                  }

                  return [
                    2,
                    /*return*/
                    pkgJson
                  ];
              }
            });
          });
        }

        exports.readPackageJson = readPackageJson;

        function getProjectInfo(cwd) {
          return __awaiter(this, void 0, Promise, function() {
            var pkgJson,
              projectRootDir,
              cliName,
              binOutputPath,
              commandsOutputPath,
              commandsDirPath;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    /*yield*/
                    readPackageJson(cwd)
                  ];

                case 1:
                  pkgJson = _a.sent();
                  projectRootDir = path.dirname(pkgJson.path);
                  cliName =
                    typeof pkgJson.package.bin === "string"
                      ? pkgJson.package.name
                      : Object.keys(pkgJson.package.bin)[0];
                  binOutputPath = path.join(
                    projectRootDir,
                    typeof pkgJson.package.bin === "string"
                      ? pkgJson.package.bin
                      : pkgJson.package.bin[cliName]
                  );
                  commandsOutputPath = path.join(
                    path.dirname(binOutputPath),
                    "commands"
                  );
                  commandsDirPath = path.join(
                    projectRootDir,
                    (pkgJson["@opaline"] && pkgJson["@opaline"].root) ||
                      "./commands"
                  );
                  return [
                    2,
                    /*return*/
                    {
                      pkgJson: pkgJson,
                      projectRootDir: projectRootDir,
                      cliName: cliName,
                      binOutputPath: binOutputPath,
                      commandsOutputPath: commandsOutputPath,
                      commandsDirPath: commandsDirPath
                    }
                  ];
              }
            });
          });
        }

        exports.getProjectInfo = getProjectInfo;
      },
      {}
    ],
    "../commands-common/commands-parser.ts": [
      function(require, module, exports) {
        "use strict";

        var __awaiter =
          (this && this.__awaiter) ||
          function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))(function(resolve, reject) {
              function fulfilled(value) {
                try {
                  step(generator.next(value));
                } catch (e) {
                  reject(e);
                }
              }

              function rejected(value) {
                try {
                  step(generator["throw"](value));
                } catch (e) {
                  reject(e);
                }
              }

              function step(result) {
                result.done
                  ? resolve(result.value)
                  : new P(function(resolve) {
                      resolve(result.value);
                    }).then(fulfilled, rejected);
              }

              step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
              );
            });
          };

        var __generator =
          (this && this.__generator) ||
          function(thisArg, body) {
            var _ = {
                label: 0,
                sent: function() {
                  if (t[0] & 1) throw t[1];
                  return t[1];
                },
                trys: [],
                ops: []
              },
              f,
              y,
              t,
              g;
            return (
              (g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2)
              }),
              typeof Symbol === "function" &&
                (g[Symbol.iterator] = function() {
                  return this;
                }),
              g
            );

            function verb(n) {
              return function(v) {
                return step([n, v]);
              };
            }

            function step(op) {
              if (f) throw new TypeError("Generator is already executing.");

              while (_)
                try {
                  if (
                    ((f = 1),
                    y &&
                      (t =
                        op[0] & 2
                          ? y["return"]
                          : op[0]
                          ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                          : y.next) &&
                      !(t = t.call(y, op[1])).done)
                  )
                    return t;
                  if (((y = 0), t)) op = [op[0] & 2, t.value];

                  switch (op[0]) {
                    case 0:
                    case 1:
                      t = op;
                      break;

                    case 4:
                      _.label++;
                      return {
                        value: op[1],
                        done: false
                      };

                    case 5:
                      _.label++;
                      y = op[1];
                      op = [0];
                      continue;

                    case 7:
                      op = _.ops.pop();

                      _.trys.pop();

                      continue;

                    default:
                      if (
                        !((t = _.trys),
                        (t = t.length > 0 && t[t.length - 1])) &&
                        (op[0] === 6 || op[0] === 2)
                      ) {
                        _ = 0;
                        continue;
                      }

                      if (
                        op[0] === 3 &&
                        (!t || (op[1] > t[0] && op[1] < t[3]))
                      ) {
                        _.label = op[1];
                        break;
                      }

                      if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                      }

                      if (t && _.label < t[2]) {
                        _.label = t[2];

                        _.ops.push(op);

                        break;
                      }

                      if (t[2]) _.ops.pop();

                      _.trys.pop();

                      continue;
                  }

                  op = body.call(thisArg, _);
                } catch (e) {
                  op = [6, e];
                  y = 0;
                } finally {
                  f = t = 0;
                }

              if (op[0] & 5) throw op[1];
              return {
                value: op[0] ? op[1] : void 0,
                done: true
              };
            }
          };

        var __importStar =
          (this && this.__importStar) ||
          function(mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null)
              for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
            result["default"] = mod;
            return result;
          };

        var __importDefault =
          (this && this.__importDefault) ||
          function(mod) {
            return mod && mod.__esModule
              ? mod
              : {
                  default: mod
                };
          };

        exports.__esModule = true;

        var path = __importStar(require("path"));

        var fs = __importStar(require("fs"));

        var util_1 = require("util");

        var parser = __importStar(require("@babel/parser"));

        var traverse_1 = __importDefault(require("@babel/traverse"));

        var doctrine = __importStar(require("doctrine"));

        var readFile = util_1.promisify(fs.readFile);

        function parseCommands(project, commands) {
          return __awaiter(this, void 0, Promise, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    /*yield*/
                    Promise.all(
                      commands.map(function(command) {
                        return parseCommand(project, command);
                      })
                    )
                  ];

                case 1:
                  return [
                    2,
                    /*return*/
                    _a.sent()
                  ];
              }
            });
          });
        }

        exports.parseCommands = parseCommands;

        function parseCommand(project, command) {
          return __awaiter(this, void 0, Promise, function() {
            var commandName, commandPath, commandFileContent, meta;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  commandName = command.split(".")[0];
                  commandPath = path.join(project.commandsDirPath, command);
                  return [
                    4,
                    /*yield*/
                    readFile(commandPath, "utf8")
                  ];

                case 1:
                  commandFileContent = _a.sent();
                  meta = getMetaFromJSDoc({
                    jsdocComment: getCommandJSDoc(commandFileContent),
                    cliName: project.cliName
                  });
                  return [
                    2,
                    /*return*/
                    {
                      commandName: commandName,
                      meta: meta
                    }
                  ];
              }
            });
          });
        }

        function getCommandJSDoc(content) {
          var ast = parser.parse(content, {
            sourceType: "module",
            // TODO: support flow and ts
            plugins: ["typescript"]
          });
          var comment;
          traverse_1["default"](ast, {
            ExportDefaultDeclaration: function(path) {
              comment =
                "/*" +
                (path.node.leadingComments || [
                  {
                    value: ""
                  }
                ])[0].value +
                "\n*/";
            }
          });
          return comment;
        }

        function getMetaFromJSDoc(_a) {
          var jsdocComment = _a.jsdocComment,
            cliName = _a.cliName;
          var jsdoc = jsdocComment
            ? doctrine.parse(jsdocComment, {
                unwrap: true,
                sloppy: true
              })
            : {
                description: "",
                tags: []
              };

          var _b = jsdoc.description.split("\n\n"),
            title = _b[0],
            description = _b.slice(1);

          return {
            title: title || "No description",
            description: description.join("\n\n"),
            usage: (
              jsdoc.tags.find(function(tag) {
                return tag.title === "usage";
              }) || {
                description: ""
              }
            ).description.replace("{cliName}", cliName),
            examples: jsdoc.tags
              .filter(function(tag) {
                return tag.title === "example";
              })
              .map(function(tag) {
                return tag.description.replace("{cliName}", cliName);
              }),
            shouldPassInputs: !!jsdoc.tags.find(function(tag) {
              return tag.title === "param" && tag.name === "$inputs";
            }),
            options: jsdoc.tags.reduce(function(acc, tag) {
              if (tag.title !== "param" || tag.name === "$inputs") return acc;
              acc[tag.name] = {
                title: tag.description,
                type: tag.type.name || tag.type.expression.name,
                // TODO: aliases
                // TODO: process default properly
                default: tag["default"]
              };
              return acc;
            }, {})
          };
        }
      },
      {}
    ],
    "../commands-common/entry-generator.ts": [
      function(require, module, exports) {
        "use strict";

        var __importStar =
          (this && this.__importStar) ||
          function(mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null)
              for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
            result["default"] = mod;
            return result;
          };

        exports.__esModule = true;

        var path = __importStar(require("path"));

        function createEntryPoint(_a) {
          var project = _a.project,
            commandsData = _a.commandsData;
          var pkgJsonRelativePath = path.relative(
            path.dirname(project.binOutputPath),
            project.pkgJson.path
          );
          return (
            '#!/usr/bin/env node\n\nlet cli = require("@opaline/core").default;\nlet pkg = require("' +
            pkgJsonRelativePath +
            '");\nlet config = {\n  cliName: "' +
            project.cliName +
            '",\n  cliVersion: pkg.version,\n  cliDescription: pkg.description,\n  isSingleCommand: ' +
            (commandsData.length === 1 ? "true" : "false") +
            ",\n  commands: {\n    " +
            commandsData
              .map(function(command) {
                return (
                  '"' +
                  command.commandName +
                  '": {\n      commandName: "' +
                  command.commandName +
                  '",\n      meta: ' +
                  JSON.stringify(command.meta) +
                  ',\n      load: () => require("' +
                  getRelativeCommandPath(
                    project.binOutputPath,
                    command.commandName
                  ) +
                  '").default\n    }'
                );
              })
              .join(", ") +
            "\n  }\n};\n\ncli(process.argv, config);\n"
          );
        }

        exports.createEntryPoint = createEntryPoint;

        function getRelativeCommandPath(binOutputPath, commandName) {
          return (
            "." +
            path.sep +
            path.relative(
              binOutputPath,
              path.join(binOutputPath, "commands", commandName)
            )
          );
        }
      },
      {}
    ],
    "../commands-common/link.ts": [
      function(require, module, exports) {
        "use strict";

        var __awaiter =
          (this && this.__awaiter) ||
          function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))(function(resolve, reject) {
              function fulfilled(value) {
                try {
                  step(generator.next(value));
                } catch (e) {
                  reject(e);
                }
              }

              function rejected(value) {
                try {
                  step(generator["throw"](value));
                } catch (e) {
                  reject(e);
                }
              }

              function step(result) {
                result.done
                  ? resolve(result.value)
                  : new P(function(resolve) {
                      resolve(result.value);
                    }).then(fulfilled, rejected);
              }

              step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
              );
            });
          };

        var __generator =
          (this && this.__generator) ||
          function(thisArg, body) {
            var _ = {
                label: 0,
                sent: function() {
                  if (t[0] & 1) throw t[1];
                  return t[1];
                },
                trys: [],
                ops: []
              },
              f,
              y,
              t,
              g;
            return (
              (g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2)
              }),
              typeof Symbol === "function" &&
                (g[Symbol.iterator] = function() {
                  return this;
                }),
              g
            );

            function verb(n) {
              return function(v) {
                return step([n, v]);
              };
            }

            function step(op) {
              if (f) throw new TypeError("Generator is already executing.");

              while (_)
                try {
                  if (
                    ((f = 1),
                    y &&
                      (t =
                        op[0] & 2
                          ? y["return"]
                          : op[0]
                          ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                          : y.next) &&
                      !(t = t.call(y, op[1])).done)
                  )
                    return t;
                  if (((y = 0), t)) op = [op[0] & 2, t.value];

                  switch (op[0]) {
                    case 0:
                    case 1:
                      t = op;
                      break;

                    case 4:
                      _.label++;
                      return {
                        value: op[1],
                        done: false
                      };

                    case 5:
                      _.label++;
                      y = op[1];
                      op = [0];
                      continue;

                    case 7:
                      op = _.ops.pop();

                      _.trys.pop();

                      continue;

                    default:
                      if (
                        !((t = _.trys),
                        (t = t.length > 0 && t[t.length - 1])) &&
                        (op[0] === 6 || op[0] === 2)
                      ) {
                        _ = 0;
                        continue;
                      }

                      if (
                        op[0] === 3 &&
                        (!t || (op[1] > t[0] && op[1] < t[3]))
                      ) {
                        _.label = op[1];
                        break;
                      }

                      if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                      }

                      if (t && _.label < t[2]) {
                        _.label = t[2];

                        _.ops.push(op);

                        break;
                      }

                      if (t[2]) _.ops.pop();

                      _.trys.pop();

                      continue;
                  }

                  op = body.call(thisArg, _);
                } catch (e) {
                  op = [6, e];
                  y = 0;
                } finally {
                  f = t = 0;
                }

              if (op[0] & 5) throw op[1];
              return {
                value: op[0] ? op[1] : void 0,
                done: true
              };
            }
          };

        var __importStar =
          (this && this.__importStar) ||
          function(mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null)
              for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
            result["default"] = mod;
            return result;
          };

        exports.__esModule = true;

        var cp = __importStar(require("child_process"));

        var util_1 = require("util");

        var exec = util_1.promisify(cp.exec);

        function link() {
          return __awaiter(this, void 0, void 0, function() {
            var bin, e_1;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  bin = "npm";
                  _a.label = 1;

                case 1:
                  _a.trys.push([1, 3, , 4]);

                  return [
                    4,
                    /*yield*/
                    exec("yarn --version")
                  ];

                case 2:
                  _a.sent();

                  bin = "yarn";
                  return [
                    3,
                    /*break*/
                    4
                  ];

                case 3:
                  e_1 = _a.sent();
                  return [
                    3,
                    /*break*/
                    4
                  ];

                case 4:
                  return [
                    4,
                    /*yield*/
                    exec(bin + " link")
                  ];

                case 5:
                  return [
                    2,
                    /*return*/
                    _a.sent()
                  ];
              }
            });
          });
        }

        exports.link = link;
      },
      {}
    ],
    "../commands-common/compiler.ts": [
      function(require, module, exports) {
        "use strict";

        var __awaiter =
          (this && this.__awaiter) ||
          function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))(function(resolve, reject) {
              function fulfilled(value) {
                try {
                  step(generator.next(value));
                } catch (e) {
                  reject(e);
                }
              }

              function rejected(value) {
                try {
                  step(generator["throw"](value));
                } catch (e) {
                  reject(e);
                }
              }

              function step(result) {
                result.done
                  ? resolve(result.value)
                  : new P(function(resolve) {
                      resolve(result.value);
                    }).then(fulfilled, rejected);
              }

              step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
              );
            });
          };

        var __generator =
          (this && this.__generator) ||
          function(thisArg, body) {
            var _ = {
                label: 0,
                sent: function() {
                  if (t[0] & 1) throw t[1];
                  return t[1];
                },
                trys: [],
                ops: []
              },
              f,
              y,
              t,
              g;
            return (
              (g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2)
              }),
              typeof Symbol === "function" &&
                (g[Symbol.iterator] = function() {
                  return this;
                }),
              g
            );

            function verb(n) {
              return function(v) {
                return step([n, v]);
              };
            }

            function step(op) {
              if (f) throw new TypeError("Generator is already executing.");

              while (_)
                try {
                  if (
                    ((f = 1),
                    y &&
                      (t =
                        op[0] & 2
                          ? y["return"]
                          : op[0]
                          ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                          : y.next) &&
                      !(t = t.call(y, op[1])).done)
                  )
                    return t;
                  if (((y = 0), t)) op = [op[0] & 2, t.value];

                  switch (op[0]) {
                    case 0:
                    case 1:
                      t = op;
                      break;

                    case 4:
                      _.label++;
                      return {
                        value: op[1],
                        done: false
                      };

                    case 5:
                      _.label++;
                      y = op[1];
                      op = [0];
                      continue;

                    case 7:
                      op = _.ops.pop();

                      _.trys.pop();

                      continue;

                    default:
                      if (
                        !((t = _.trys),
                        (t = t.length > 0 && t[t.length - 1])) &&
                        (op[0] === 6 || op[0] === 2)
                      ) {
                        _ = 0;
                        continue;
                      }

                      if (
                        op[0] === 3 &&
                        (!t || (op[1] > t[0] && op[1] < t[3]))
                      ) {
                        _.label = op[1];
                        break;
                      }

                      if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                      }

                      if (t && _.label < t[2]) {
                        _.label = t[2];

                        _.ops.push(op);

                        break;
                      }

                      if (t[2]) _.ops.pop();

                      _.trys.pop();

                      continue;
                  }

                  op = body.call(thisArg, _);
                } catch (e) {
                  op = [6, e];
                  y = 0;
                } finally {
                  f = t = 0;
                }

              if (op[0] & 5) throw op[1];
              return {
                value: op[0] ? op[1] : void 0,
                done: true
              };
            }
          };

        var __importStar =
          (this && this.__importStar) ||
          function(mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null)
              for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
            result["default"] = mod;
            return result;
          };

        var __importDefault =
          (this && this.__importDefault) ||
          function(mod) {
            return mod && mod.__esModule
              ? mod
              : {
                  default: mod
                };
          };

        exports.__esModule = true;

        var path = __importStar(require("path"));

        var fs = __importStar(require("fs"));

        var util_1 = require("util");

        var parcel_bundler_1 = __importDefault(require("parcel-bundler"));

        var chokidar_1 = __importDefault(require("chokidar"));

        var core_1 = require("@opaline/core");

        var project_info_1 = require("./project-info");

        var commands_parser_1 = require("./commands-parser");

        var entry_generator_1 = require("./entry-generator");

        var link_1 = require("./link");

        var readdir = util_1.promisify(fs.readdir);
        var writeFile = util_1.promisify(fs.writeFile);
        var chmod = util_1.promisify(fs.chmod);

        var Compiler =
          /** @class */
          (function() {
            function Compiler(_a) {
              var _this = this;

              var cwd = _a.cwd,
                _b = _a.mode,
                mode = _b === void 0 ? "development" : _b;

              this.onBundled = function() {
                return __awaiter(_this, void 0, void 0, function() {
                  var commandsData, entryPoint;
                  return __generator(this, function(_a) {
                    switch (_a.label) {
                      case 0:
                        return [
                          4,
                          /*yield*/
                          commands_parser_1.parseCommands(
                            this.project,
                            this.commands
                          )
                        ];

                      case 1:
                        commandsData = _a.sent();
                        entryPoint = entry_generator_1.createEntryPoint({
                          project: this.project,
                          commandsData: commandsData
                        });
                        return [
                          4,
                          /*yield*/
                          writeFile(
                            this.project.binOutputPath,
                            entryPoint,
                            "utf8"
                          )
                        ];

                      case 2:
                        _a.sent();

                        return [
                          4,
                          /*yield*/
                          chmod(this.project.binOutputPath, "755")
                        ];

                      case 3:
                        _a.sent();

                        if (!(this.mode === "development"))
                          return [
                            3,
                            /*break*/
                            5
                          ];
                        return [
                          4,
                          /*yield*/
                          link_1.link()
                        ];

                      case 4:
                        _a.sent();

                        _a.label = 5;

                      case 5:
                        return [
                          2
                          /*return*/
                        ];
                    }
                  });
                });
              };

              this.cwd = cwd;
              this.mode = mode;
            }

            Compiler.prototype.init = function(watch) {
              return __awaiter(this, void 0, void 0, function() {
                var _a, _b;

                return __generator(this, function(_c) {
                  switch (_c.label) {
                    case 0:
                      _a = this;
                      return [
                        4,
                        /*yield*/
                        project_info_1.getProjectInfo(this.cwd)
                      ];

                    case 1:
                      _a.project = _c.sent();
                      _b = this;
                      return [
                        4,
                        /*yield*/
                        this.getCommands()
                      ];

                    case 2:
                      _b.commands = _c.sent();
                      this.bundlerConfig = this.createBundlerConfig(watch);
                      return [
                        2
                        /*return*/
                      ];
                  }
                });
              });
            };

            Compiler.prototype.refresh = function() {
              return __awaiter(this, void 0, void 0, function() {
                var _a;

                return __generator(this, function(_b) {
                  switch (_b.label) {
                    case 0:
                      _a = this;
                      return [
                        4,
                        /*yield*/
                        this.getCommands()
                      ];

                    case 1:
                      _a.commands = _b.sent();
                      return [
                        2
                        /*return*/
                      ];
                  }
                });
              });
            };

            Compiler.prototype.createBundlerConfig = function(watch) {
              return {
                outDir: this.project.commandsOutputPath,
                watch: watch,
                cache: true,
                cacheDir: ".cache",
                minify: this.mode === "development" ? false : true,
                target: "node",
                bundleNodeModules: false,
                sourceMaps: false
              };
            };

            Compiler.prototype.getCommands = function() {
              return __awaiter(this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                  switch (_a.label) {
                    case 0:
                      return [
                        4,
                        /*yield*/
                        readdir(this.project.commandsDirPath)
                      ];

                    case 1:
                      return [
                        2,
                        /*return*/
                        _a.sent().filter(function(file) {
                          return (
                            !file.endsWith(".d.ts") &&
                            !file.endsWith(".map") &&
                            !file.startsWith("_")
                          );
                        })
                      ];
                  }
                });
              });
            };

            Compiler.prototype.getEntryPoints = function(commands) {
              var _this = this;

              return commands.map(function(c) {
                return path.join(_this.project.commandsDirPath, c);
              });
            };

            Compiler.prototype.createBundler = function() {
              if (!this.bundlerConfig) {
                return;
              }

              this.bundler = new parcel_bundler_1["default"](
                this.getEntryPoints(this.commands),
                this.bundlerConfig
              );
              this.bundler.on("bundled", this.onBundled);
              return this.bundler;
            };

            Compiler.prototype.updateBundler = function() {
              return __awaiter(this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                  switch (_a.label) {
                    case 0:
                      if (!this.bundler)
                        return [
                          3,
                          /*break*/
                          2
                        ]; // TODO: why?

                      return [
                        4,
                        /*yield*/
                        this.bundler.stop()
                      ];

                    case 1:
                      // TODO: why?
                      _a.sent();

                      this.bundler.off("bundled", this.onBundled);
                      _a.label = 2;

                    case 2:
                      return [
                        4,
                        /*yield*/
                        this.refresh()
                      ];

                    case 3:
                      _a.sent();

                      return [
                        4,
                        /*yield*/
                        this.createBundler()
                      ];

                    case 4:
                      return [
                        2,
                        /*return*/
                        _a.sent().bundle()
                      ];
                  }
                });
              });
            };

            Compiler.prototype.compile = function(_a) {
              var watch = _a.watch;
              return __awaiter(this, void 0, void 0, function() {
                var watcher;

                var _this = this;

                return __generator(this, function(_b) {
                  switch (_b.label) {
                    case 0:
                      return [
                        4,
                        /*yield*/
                        this.init(watch)
                      ];

                    case 1:
                      _b.sent();

                      return [
                        4,
                        /*yield*/
                        this.createBundler().bundle()
                      ];

                    case 2:
                      _b.sent();

                      if (watch) {
                        watcher = chokidar_1["default"].watch(
                          this.project.commandsDirPath,
                          {
                            ignoreInitial: true
                          }
                        );
                        watcher
                          .on("add", function(file) {
                            core_1.printInfo(
                              "New command has been added: " + file
                            );
                            console.log();

                            _this.updateBundler();
                          })
                          .on("unlink", function(file) {
                            core_1.printInfo(
                              "Command has been deleted: " + file
                            );
                            console.log();

                            _this.updateBundler();
                          });
                      }

                      return [
                        2
                        /*return*/
                      ];
                  }
                });
              });
            };

            return Compiler;
          })();

        exports.Compiler = Compiler;
      },
      {
        "./project-info": "../commands-common/project-info.ts",
        "./commands-parser": "../commands-common/commands-parser.ts",
        "./entry-generator": "../commands-common/entry-generator.ts",
        "./link": "../commands-common/link.ts"
      }
    ],
    "build.ts": [
      function(require, module, exports) {
        "use strict";

        var __awaiter =
          (this && this.__awaiter) ||
          function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))(function(resolve, reject) {
              function fulfilled(value) {
                try {
                  step(generator.next(value));
                } catch (e) {
                  reject(e);
                }
              }

              function rejected(value) {
                try {
                  step(generator["throw"](value));
                } catch (e) {
                  reject(e);
                }
              }

              function step(result) {
                result.done
                  ? resolve(result.value)
                  : new P(function(resolve) {
                      resolve(result.value);
                    }).then(fulfilled, rejected);
              }

              step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
              );
            });
          };

        var __generator =
          (this && this.__generator) ||
          function(thisArg, body) {
            var _ = {
                label: 0,
                sent: function() {
                  if (t[0] & 1) throw t[1];
                  return t[1];
                },
                trys: [],
                ops: []
              },
              f,
              y,
              t,
              g;
            return (
              (g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2)
              }),
              typeof Symbol === "function" &&
                (g[Symbol.iterator] = function() {
                  return this;
                }),
              g
            );

            function verb(n) {
              return function(v) {
                return step([n, v]);
              };
            }

            function step(op) {
              if (f) throw new TypeError("Generator is already executing.");

              while (_)
                try {
                  if (
                    ((f = 1),
                    y &&
                      (t =
                        op[0] & 2
                          ? y["return"]
                          : op[0]
                          ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                          : y.next) &&
                      !(t = t.call(y, op[1])).done)
                  )
                    return t;
                  if (((y = 0), t)) op = [op[0] & 2, t.value];

                  switch (op[0]) {
                    case 0:
                    case 1:
                      t = op;
                      break;

                    case 4:
                      _.label++;
                      return {
                        value: op[1],
                        done: false
                      };

                    case 5:
                      _.label++;
                      y = op[1];
                      op = [0];
                      continue;

                    case 7:
                      op = _.ops.pop();

                      _.trys.pop();

                      continue;

                    default:
                      if (
                        !((t = _.trys),
                        (t = t.length > 0 && t[t.length - 1])) &&
                        (op[0] === 6 || op[0] === 2)
                      ) {
                        _ = 0;
                        continue;
                      }

                      if (
                        op[0] === 3 &&
                        (!t || (op[1] > t[0] && op[1] < t[3]))
                      ) {
                        _.label = op[1];
                        break;
                      }

                      if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                      }

                      if (t && _.label < t[2]) {
                        _.label = t[2];

                        _.ops.push(op);

                        break;
                      }

                      if (t[2]) _.ops.pop();

                      _.trys.pop();

                      continue;
                  }

                  op = body.call(thisArg, _);
                } catch (e) {
                  op = [6, e];
                  y = 0;
                } finally {
                  f = t = 0;
                }

              if (op[0] & 5) throw op[1];
              return {
                value: op[0] ? op[1] : void 0,
                done: true
              };
            }
          };

        exports.__esModule = true;

        var compiler_1 = require("../commands-common/compiler");
        /**
         * Production build for opaline based cli tool
         *
         * @usage {cliName} build
         */

        function build() {
          return __awaiter(this, void 0, void 0, function() {
            var compiler;
            return __generator(this, function(_a) {
              compiler = new compiler_1.Compiler({
                cwd: process.cwd(),
                mode: "production"
              });
              return [
                2,
                /*return*/
                compiler.compile({
                  watch: false
                })
              ];
            });
          });
        }

        exports["default"] = build;
      },
      { "../commands-common/compiler": "../commands-common/compiler.ts" }
    ]
  },
  {},
  ["build.ts"],
  null
);
