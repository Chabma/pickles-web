var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
  };
(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define([
      "require",
      "exports",
      "./RangeValue",
      "./RecursivePartial",
      "./ShapeData",
      "./ShapeDrawerFunctions",
      "./SingleOrMultiple",
      "./PathOptions",
    ], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  __exportStar(require("./RangeValue"), exports);
  __exportStar(require("./RecursivePartial"), exports);
  __exportStar(require("./ShapeData"), exports);
  __exportStar(require("./ShapeDrawerFunctions"), exports);
  __exportStar(require("./SingleOrMultiple"), exports);
  __exportStar(require("./PathOptions"), exports);
});
